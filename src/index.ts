import downloadDatabase from "./download/download";

const mongoURI = "mongodb://localhost:27017";
const database = "Construction";
const type = "excel"; //json | csv | 'excel'

downloadDatabase({
  mongoURI,
  database,
  type,
});
