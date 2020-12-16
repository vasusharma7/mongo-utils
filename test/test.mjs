import { transferData, downloadData, uploadToDatabase } from "mongo-utils";

const mongoURI2 = "mongodb://localhost:27017";
const mongoURI1 =
  "mongodb+srv://Vasu:htccg321@cluster0-miow4.mongodb.net/test?retryWrites=true&w=majority";
const database = "test-mongo-utils";
const type = "csv";
const data = {
  collection1: [{ title: "doc1", field1: "val1" }],
  collection2: [
    { title: "doc2", field1: "val2" },
    { title: "doc3", field1: "val3" },
  ],
  collection3: [],
};

const test1 = async () => {
  await uploadToDatabase({ dbName: database, mongoURI: mongoURI1, data: data });
  console.log("uploading successful");
  process.exit(0);
};
const test2 = async () => {
  await downloadData({
    mongoURI: mongoURI1,
    database: database,
    type: "json",
  });
  process.exit(0);
};
const test3 = async () => {
  await transferData({
    transferFrom: mongoURI1,
    databaseFrom: database,
    transferTo: mongoURI2,
    databaseTo: database,
  });
  process.exit(1);
};
test1();
test2();
test3();
