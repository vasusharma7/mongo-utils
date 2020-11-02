import uploadToDatabase from "./upload/upload";

//const mongoURI = "mongodb://localhost:27017";
const mongoURI =
  "mongodb+srv://tester:retset@cluster0.vko0j.mongodb.net/test?retryWrites=true&w=majority";
const database = "Construction";
const type = "csv";
const data = {
  collection1: [{ title: "doc1", field1: "val1" }],
  collection2: [
    { title: "doc2", field1: "val2" },
    { title: "doc3", field1: "val3" },
  ],
  collection3: [],
};

const test = async () => {
  await uploadToDatabase({ dbName: "test", mongoURI, data });
  console.log("uploading successful");
  process.exit(0);
};

test();
