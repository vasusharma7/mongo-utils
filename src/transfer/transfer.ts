import downloadDatabase from "../download/download";
import uploadToDatabase from "../upload/upload";
import { ObjectId as objId } from "mongodb";
interface transferConfig {
  transferFrom: string;
  databaseFrom: string;
  transferTo: string;
  databaseTo: string;
}
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

interface uploadData {
  [key: string]: documents;
}
const transferData = async (params: transferConfig): Promise<void> => {
  const { transferFrom, databaseFrom, transferTo, databaseTo } = params;
  const downloaded: null | uploadData = await downloadDatabase({
    mongoURI: transferFrom,
    database: databaseFrom,
    type: "json",
  });
  if (downloaded) {
    uploadToDatabase({
      dbName: databaseTo,
      mongoURI: transferTo,
      data: downloaded,
    });
  }
};
export default transferData;
