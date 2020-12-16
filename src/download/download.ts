import process = require("process");
import fs = require("fs");
import { MongoClient, Collection, Db, ObjectID as objId } from "mongodb";
import csvConvertor = require("json-2-csv");
import * as utils from "./utils";
import { exec } from "child_process";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const xlsxConvertor = require("json-as-xlsx");

interface document {
  [key: string]:
    | objId
    | string
    | number
    | boolean
    | null
    | document
    | Array<document>;
}
type documents = Array<document>;
interface dataDump {
  [key: string]: documents;
}
interface uploadData {
  [key: string]: documents;
}
interface downloadI {
  mongoURI: string;
  database: string;
  type: "json" | "csv" | "excel";
  // save?: boolean;
}
/**
 * @param {downloadI}
 */
export default async function downloadDatabase(
  params: downloadI,
): Promise<null | uploadData> {
  return new Promise(async (resolve, reject) => {
    const { mongoURI, database, type } = params;

    const client: MongoClient = new MongoClient(mongoURI, {
      useUnifiedTopology: true,
    });

    try {
      console.log("Connecting to Mongo Server......");
      await client.connect();
      await client.db("admin").command({ ping: 1 });
      console.log("Connected successfully to Mongo Server !");

      const db: Db = await client.db(database);
      const adminDb = client.db().admin();

      // List all the available databases
      const fetchDbs = await adminDb.listDatabases();
      let exists = false;
      let isEmpty = false;
      for (const dbObject of fetchDbs.databases) {
        if (database === dbObject.name) {
          exists = true;
          isEmpty = dbObject.empty;
          break;
        }
      }
      if (!exists) {
        console.log(`Database ${database} not found`);
        return null;
      }
      if (isEmpty) {
        console.log(`Database ${database} is empty`);
        return null;
      }

      const collectionsArray = await db.listCollections().toArray();
      if (collectionsArray.length === 0) {
        console.log(`No Collections found in database ${database}`);
        return null;
      }
      let savePath: string;
      if (type === "excel" || type === "csv") {
        savePath = `${process.cwd()}/${database}_${params.type}`;
        if (!fs.existsSync(savePath)) {
          fs.mkdirSync(savePath);
        }
      } else {
        savePath = `${process.cwd()}/${database}.json`;
        fs.openSync(savePath, "w");
      }
      const data: dataDump = {};
      console.log(
        `Exporting ${collectionsArray.length} collections as ${type}`,
      );
      const promises: Array<Promise<void>> = collectionsArray.map(
        async (obj): Promise<void> => {
          return new Promise(async (resolve) => {
            const collection: Collection = db.collection(obj.name);

            let records: documents = await collection.find({}).toArray();
            if (type === "excel" || type === "csv") {
              records = utils.preprocessRecords(records);
            }
            data[obj.name] = records;
            switch (type) {
              case "csv":
                csvConvertor.json2csv(
                  records,
                  (err: Error | undefined, csv: string | undefined): void => {
                    //need to be looked at
                    csv = (csv as string).replace(/undefined/g, "<UNDEFINED>");

                    if (err) throw err;
                    fs.writeFile(
                      `${savePath}/${obj.name}.csv`,
                      csv,
                      "utf8",
                      function (error): void {
                        if (error) {
                          console.log(
                            `${obj.name}.csv Some error occured - file either not saved or corrupted file saved.`,
                          );
                        } else {
                          // console.log(`${obj.name}.csv Saved Successfully`);
                        }
                      },
                    );
                  },
                );
                break;
              case "excel":
                records = utils.preprocessRecords(records);
                try {
                  if (records.length == 0) {
                    console.error(`Collection ${obj.name} is empty`);
                    break;
                  }
                  const columns: Array<Record<string, string>> = [];
                  Object.keys(records[0]).map((key: string): void => {
                    columns.push({ label: key, value: key });
                  });
                  const xlsxSettings: Record<string, string | number> = {
                    fileName: `${savePath}/${obj.name}`,
                  };
                  xlsxConvertor(columns, records, xlsxSettings, true);
                  // console.log(`${obj.name}.xlsx Saved Successfully`);
                } catch (e) {
                  console.error(`export error in ${obj.name}`, e);
                }

                break;
              case "json":
                if (Object.keys(data).length === collectionsArray.length) {
                  (async () => {
                    try {
                      const file: number = fs.openSync(
                        `${process.cwd()}/${database}.json`,
                        "a",
                      );
                      fs.writeFileSync(
                        file,
                        JSON.stringify({ ...data }, null, 2),
                      );
                    } catch (err) {
                      console.error("export error", err);
                    }
                  })();
                }

                break;

              default:
                console.log(
                  "Invalid Export Format Specified\nSpeifiy one of the three : json | csv | excel ",
                );
            }
            resolve();
          });
        },
      );
      Promise.all(promises).then(() => {
        if (type === "json") {
          console.log(
            `Database ${database} exported as ${type} successfully at : ${savePath}`,
          );
        } else {
          console.log(
            `Database ${database} exported as ${type} successfully at : ${savePath}`,
          );
        }
        resolve(data);
        // console.log(data);
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
}
