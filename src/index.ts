import { ArgumentParser } from "argparse";

import transferData from "./transfer/transfer";
import uploadData from "./upload/upload";
import downloadData from "./download/download";
const version = "0.0.1";

const parser: ArgumentParser = new ArgumentParser({
  description:
    "Mongo Utils - Handy utilities for managing multiple mongo instances",
});
parser.add_argument("-v", "--version", { action: "version", version });

parser.add_argument("-d", "--download", {
  help: "Name of Database to Download data from instance",
});
parser.add_argument("-u", "--upload", {
  help: "Name of Database to Upload data to instance",
});
parser.add_argument("-t", "--database-to", {
  help: "Name of Database to Transfer Data to from another instance",
});
parser.add_argument("-f", "--database-from", {
  help:
    "Name of Database from which to transfer data to another instance - use with -t",
});
parser.add_argument("-m", "--mongoURI", {
  help:
    "Mongo URI for the database - use with download and upload modules(-d , -u)",
});
parser.add_argument("-p", "--path", {
  help:
    "Path of JSON file to upload data in proper format - use only with upload(-u)",
});
parser.add_argument("-r", "--transfer-from", {
  help:
    "MongoURI of the database you want to transfer data from - use only with transfer(-t)",
});
parser.add_argument("-w", "--transfer-to", {
  help:
    "MongoURI of the database you want to transfer data to - use only with transfer(-t)",
});
parser.add_argument("-e", "--type", {
  help: "Export as json/csv/excel",
  choices: ["json", "excel", "csv"],
});

const run = async (): Promise<void> => {
  const args = parser.parse_args();
  if (args.download) {
    if (args.mongoURI && args.database && args.type)
      downloadData({
        mongoURI: args.mongoURI,
        database: args.database,
        type: args.type,
      });
    else {
      console.log(
        `Please provide mongoURI,database name and export type in arguements\nYou may expore -h flag`,
      );
    }
  } else if (args.upload) {
    if (args.upload && args.mongoURI && args.path)
      uploadData({
        dbName: args.upload,
        mongoURI: args.mongoURI,
        data: args.path,
      });
    else
      console.log(
        `Please provide mongoURI,database name and JSON file path in arguements\nYou may expore -h flag`,
      );
  } else if (args.transfer) {
    if (
      args.transfer_from &&
      args.database_from &&
      args.transfer_to &&
      args.database_to
    )
      transferData({
        transferFrom: args.transfer_from,
        databaseFrom: args.database_from,
        transferTo: args.transfer_to,
        databaseTo: args.database_to,
      });
    else
      console.log(
        `Please provide mongoURIs of both clusters and database names in arguements\nYou may expore -h flag`,
      );
  } else {
    console.log(
      `Welcome to Mongo Utils - Handy utilities for managing multiple mongo instances\nYou may expore -h flag`,
    );
  }
};

run();
