import { MongoClient, Collection, InsertWriteOpResult } from "mongodb";

interface document {
  [key: string]: string | number | boolean | null | document | Array<document>;
}
type documents = Array<document>;
interface uploadData {
  [key: string]: documents;
}
interface uploadConfig {
  dbName: string;
  mongoURI: string;
  data: uploadData;
}

async function uploadToDatabase(params: uploadConfig): Promise<void> {
  const { dbName, mongoURI, data } = params;
  const client: MongoClient = new MongoClient(mongoURI, {
    useUnifiedTopology: true,
  });

  try {
    console.log("connecting....");
    await client.connect();
    console.log("connected.");
    const db = client.db(dbName);
    const promises: Promise<InsertWriteOpResult<any>>[] = [];
    Object.keys(data).forEach(
      async (collectionName: string & keyof uploadData) => {
        if (data[collectionName] == null || data[collectionName].length == 0) {
          console.log(
            collectionName + " has no data to be uploaded. Skipping...",
          );
          return;
        }

        const collection: Collection = db.collection(collectionName);
        promises.push(collection.insertMany(data[collectionName]));
        console.log(collectionName + " uploaded successfully");
      },
    );
    await Promise.all(promises);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
  return;
}
export default uploadToDatabase;