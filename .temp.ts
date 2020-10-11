import { MongoClient, Collection } from "mongodb";

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
    const dbName: string = params.dbName;
    const mongoURI: string = params.mongoURI;
    const data: uploadData = params.data;
    const client: MongoClient = new MongoClient(mongoURI, {
        useUnifiedTopology: true,
    });

    try {
        console.log("connecting....");
        await client.connect();
        console.log("connected.");
        const db = client.db(dbName);
        Object.keys(data).forEach((collectionName: string & keyof uploadData) => {
            if (data[collectionName] == null || data[collectionName].length == 0) {
                console.log(
                    collectionName + " has no data to be uploaded. Skipping...",
                );
                return;
            }

            const collection: Collection = db.collection(collectionName);
            collection.insertMany(data[collectionName]);
            console.log(collectionName + " uploaded successfully");
        });
    } catch (err) {
        console.log(err);
    }
    return;
}
export default uploadToDatabase;
