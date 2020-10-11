import process = require("process");
import fs = require("fs");
import { MongoClient } from "mongodb";
import csvConvertor = require("json-2-csv");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const xlsxConvertor = require("json-as-xlsx");

interface document {
  [key: string]: string | number | boolean | null | document | Array<document>;
}
type documents = Array<document>;

interface downloadI {
  mongoURI: string;
  database: string;
  type: string;
}

const preprocessRecords = (records: documents): documents => {
  if (records.length === 0) return [];
  const modifiedRecords: documents = [];
  const keys: Array<string> = Object.keys(records[0]).filter(
    (key: string): boolean => typeof records[0][key] === "object",
  );
  records.forEach((record: document) => {
    keys.forEach((key: string): void => {
      try {
        record[key] = JSON.stringify(record[key]);
      } catch (err) {
        console.log(err.message);
      }
    });
    modifiedRecords.push(record);
  });
  return modifiedRecords;
};
export default async function downloadDatabase(
  params: downloadI,
): Promise<void> {
  const mongoURI: string = params.mongoURI;
  const database: string = params.database;
  const type: string = params.type.toLowerCase();
  const client: MongoClient = new MongoClient(mongoURI, {
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to Mongo Server");

    const db: any = await client.db(database);
    const adminDb = client.db().admin();

    // List all the available databases
    const fetchDbs = await adminDb.listDatabases();
    let exists = false;
    let isEmpty = false;
    for (const dbObject of fetchDbs.databases) {
      if (database == dbObject.name) {
        exists = true;
        isEmpty = dbObject.empty;
        break;
      }
    }
    if (!exists) {
      console.log(`Database ${database} not found`);
      return;
    }
    if (isEmpty) {
      console.log(`Database ${database} is empty`);
      return;
    }

    const collectionsArray: any = await db.listCollections().toArray();
    if (collectionsArray.length === 0) {
      console.log(`No Collections found in database ${database}`);
      return;
    }
    const dbDir: string = process.cwd() + "/" + database + "_" + params.type;
    console.log(`Exporting ${collectionsArray.length} collections as ${type}`);
    collectionsArray.forEach(
      async (obj: any): Promise<void> => {
        const collection: any = db.collection(obj.name);
        let records: documents = await collection.find({}).toArray();
        records = preprocessRecords(records);

        if (!fs.existsSync(dbDir)) {
          fs.mkdirSync(dbDir);
        }
        switch (type) {
          case "csv":
            csvConvertor.json2csv(records, (err: unknown, csv: any): void => {
              if (err) throw err;
              fs.writeFile(`${dbDir}/${obj.name}.csv`, csv, "utf8", function (
                err: any,
              ): void {
                if (err) {
                  console.log(
                    `${obj.name}.csv Some error occured - file either not saved or corrupted file saved.`,
                  );
                } else {
                  // console.log(`${obj.name}.csv Saved Successfully`);
                }
              });
            });
            break;
          case "excel":
            try {
              const columns: Array<Record<string, string>> = [];
              Object.keys(records[0]).map((key: string): void => {
                columns.push({ label: key, value: key });
              });
              const xlsxSettings: Record<string, string | number> = {
                fileName: `${dbDir}/${obj.name}.xlsx`,
              };
              xlsxConvertor(columns, records, xlsxSettings, true);
              // console.log(`${obj.name}.xlsx Saved Successfully`);
            } catch (e) {
              console.error("export error", e);
            }

            break;
          case "json":
            try {
              const file: number = fs.openSync(
                `${dbDir}/${obj.name}.json`,
                "w",
              );
              fs.writeFileSync(file, JSON.stringify(records));
              // console.log(`${obj.name}.json Saved Successfully`);
              fs.close(file, () => {
                //
              });
            } catch (err) {
              console.error("export error", err);
            }
            break;

          default:
            console.log(
              "Invalid Export Format Specified\nSpeifiy one of the three : json | csv| excel ",
            );
            return;
        }
      },
    );
    console.log(
      `Database ${database} exported as ${type} successfully at location : ${dbDir}`,
    );
  } catch (err) {
    console.log(err);
  }
}
