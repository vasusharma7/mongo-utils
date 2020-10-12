import { ObjectID as objId } from "mongodb";

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

export const preprocessRecords = (records: documents): documents => {
  if (records.length === 0) return [];
  const modifiedRecords: documents = [];

  records.forEach((record: document) => {
    delete record["__v"];
    Object.keys(record).forEach((key: string): void => {
      if (key == "_id") {
        record["_id"] = (record["_id"] as objId).toString();
        return;
      }
      if (typeof record[key] === "object")
        try {
          record[key] = JSON.stringify(record[key]);
          //to remove undeinfed values
        } catch (err) {
          console.log(err.message);
        }
    });
    modifiedRecords.push(record);
  });
  return modifiedRecords;
};
