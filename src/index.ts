import process = require("process");
import fs = require("fs");
import { MongoClient } from "mongodb";
import csvConvertor = require("json-2-csv");
const xlsxConvertor = require("json-as-xlsx");
// const { json2excel } = require("js2excel");
// import js2excel = require("js2excel");
interface downloadI {
  mongoURI: string;
  database: string;
  type: string;
}

// const mongoURI: string =
//     "mongodb+srv://rootUser:sds2020root@sss-x10cv.mongodb.net/Construction?retryWrites=true&w=majority";

const preprocessRecords = (
  records: Array<Record<string, any>>,
): Array<Record<string, any>> => {
  if (records.length === 0) return [];
  const modifiedRecords: Array<Record<string, any>> = [];
  const keys: Array<string> = Object.keys(records[0]).filter(
    (key: string): boolean => typeof records[0][key] === "object",
  );
  records.forEach((record: Record<string, any>) => {
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
async function downloadDatabase(params: downloadI): Promise<void> {
  const mongoURI: string = params.mongoURI;
  const database: string = params.database;
  // const username: null | string = null;
  // const password: null | string = null;
  const client = new MongoClient(mongoURI, { useUnifiedTopology: true });
  //if !client
  // db.admin().listDatabases((err: any, res: any) => console.log(res.databases))
  try {
    console.log("Connecting.......");
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to server");

    const db: any = await client.db(database);
    const collectionsArray: any = await db.listCollections().toArray();
    const dbDir: string = process.cwd() + "/" + database + "_" + params.type;
    collectionsArray.forEach(
      async (obj: any): Promise<void> => {
        const collection: any = db.collection(obj.name);
        let records: Array<Record<string, unknown>> = await collection
          .find({})
          .toArray();
        records = preprocessRecords(records);

        if (!fs.existsSync(dbDir)) {
          fs.mkdirSync(dbDir);
        }
        switch (params.type) {
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
                  console.log(`${obj.name}.csv Saved Successfully`);
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
              console.log(`${obj.name}.xlsx Saved Successfully`);
            } catch (e) {
              console.error("export error", e);
            }
            break;
          default:
            console.log("Invalid Export Format Specified");
            return;
        }
      },
    );
  } finally {
    // await client.close();
  }
}
// const mongoURI: string =
//   "mongodb+srv://rootUser:sds2020root@sss-x10cv.mongodb.net/Construction?retryWrites=true&w=majority";
const mongoURI = "mongodb://localhost:27017"
const database = "Construction"
const type = "csv"
downloadDatabase({
  mongoURI,
  database,
  type,
});
