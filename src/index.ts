import transferData from "./transfer/transfer";

const mongoURI = "mongodb://localhost:27017";
const databaseFrom = "Construction";
const databaseTo = "Construction_Copy";

transferData({
  databaseFrom: databaseFrom,
  databaseTo: databaseTo,
  transferFrom: mongoURI,
  transferTo: mongoURI,
});
