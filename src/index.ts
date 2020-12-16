import { ArgumentParser } from "argparse";
import transferData from "./transfer/transfer";
import uploadData from "./upload/upload";
import downloadData from "./download/download";

import fs = require("fs");
import process = require("process");

const version = "0.0.1";

const parser: ArgumentParser = new ArgumentParser({
  description:
    "Mongo Utils - Handy utilities for managing multiple mongo instances.",
});

parser.add_argument("-v", "--version", { action: "version", version });

parser.add_argument("-d", "--download", {
  help: "Name of Database to Download data from instance",
});

parser.add_argument("-u", "--upload", {
  help: "Name of Database to Upload data to instance",
});

parser.add_argument("-t", "--transfer", {
  help: "Name of Database to Transfer Data FROM",
});

parser.add_argument("-n", "--database2", {
  help: "Name of the database to transfer data TO - use with -t flag",
});

parser.add_argument("-x", "--mongoURI", {
  help:
    "Mongo URI for the database - to download from/ upload to/ transfer from",
});

parser.add_argument("-p", "--path", {
  help:
    "Path of JSON file to upload data in proper format - use only with upload(-u)",
});
parser.add_argument("-y", "--mongoURI2", {
  help:
    "MongoURI of the database you want to transfer data to - use only with transfer(-t)",
});

parser.add_argument("-e", "--type", {
  help: "Export as json/csv/excel",
  choices: ["json", "excel", "csv"],
});

(async (): Promise<void> => {
  const args = parser.parse_args();
  if (args.download) {
    if (args.mongoURI && args.download && args.type) {
      await downloadData({
        mongoURI: args.mongoURI,
        database: args.download,
        type: args.type,
      });
      process.exit(1);
    } else {
      console.log(
        `Please provide mongoURI, database name and export type in arguements\nYou may expore -h flag`,
      );
    }
  } else if (args.upload) {
    if (args.upload && args.mongoURI && args.path) {
      try {
        const data = JSON.parse(fs.readFileSync(args.path).toString());
        await uploadData({
          dbName: args.upload,
          mongoURI: args.mongoURI,
          data: data,
        });
        process.exit(1);
      } catch (err) {
        console.log(err.message);
      }
    } else
      console.log(
        `Please provide mongoURI,database name and JSON file path in arguements\nYou may expore -h flag`,
      );
  } else if (args.transfer) {
    if (args.mongoURI && args.transfer && args.mongoURI2 && args.database2) {
      await transferData({
        transferFrom: args.mongoURI,
        databaseFrom: args.transfer,
        transferTo: args.mongoURI2,
        databaseTo: args.database2,
      });
      process.exit(1);
    } else {
      console.log(
        `Please provide mongoURIs of both clusters and database names in arguements\nYou may expore -h flag`,
      );
    }
  } else {
    console.log(
      `Welcome to Mongo Utils - Handy utilities for managing multiple mongo instances\nYou may expore -h flag`,
    );
  }
})();

exports.printMsg = function () {
  console.log(
    "Mongo Utils - Handy utilities for managing multiple mongo instances.",
  );
};
export { transferData, uploadData, downloadData };
