<br />

<h1 align="center">mongo-assist</h1>
<p align="center">
  <a href ="https://npmjs.org/"> <img src = "https://img.shields.io/npm/v/npm"/></a>
   <a href ="https://bundlephobia.com/result?p=mongo-assist"> <img src = "https://flat.badgen.net/bundlephobia/minzip/mongo-assist"/></a>
   <a href ="https://npmjs.org/"> <img src = "https://img.shields.io/npm/types/typescript"/></a>
<a href ="https://github.com/vasusharma7/mongo-utils/blob/master/LICENSE"> <img src = "https://img.shields.io/apm/l/npm"/></a>
 </p>

<p align="center">
    <a href="https://github.com/vasusharma7/mongo-utils/issues">Report a Bug</a> &nbsp &nbsp
    <a href="https://github.com/vasusharma7/mongo-utils/issues">Request a Feature</a>
 </center>
 
Mongo Assist is a group of handy utilities for managing mongoDB instances. It can be used to : 
- Download MongoDB Databases in json/csv/excel formats.
- Upload Data in json format to MongoDB databases.
- Transfer data from one MongoDB database to another.

Available as a module as well as in CLI mode,

## How to install

You can install mongo-assist as a dependency using NPM.

```sh
# Global so it can be called from anywhere
$ npm install -g mongo-assist
# or as a dependency of a project
$ npm install mongo-assist --save
```

## Usage

This can be used as a Javascript module or as a command line tool.

### Javascript module

It provides 3 functions -

- _downloadData_ - To download MongoDB Databases in json/csv/excel formats.
- _uploadToDatabase_ - To upload Data(in json) to MongoDB instances.
- _transferData_ - To transfer data from one MongoDB instance to another

Import necessary functions from mongo-assist as

`import { transferData, downloadData, uploadToDatabase } from "mongo-assist";`

#### downloadData() function can be used as -

```
(async () => {
  await downloadData({
      mongoURI: <mongoDB_connection_string>,
      database: <database_name>,
      type: < "json" | "csv" | "excel" >,
    });
 })();
```

_Parameters -_

- **mongoURI** - Mongo DB connection string of the instance from which you want to download data.

      Example - mongodb://localhost:27017

- **database** - Name of the database to download from MongoDB instance.
- **type** - Type describes the way you want the data to get stored. This can be "json", "csv" or "excel".

#### uploadToDatabase() function can be used as -

```
(async () => {
  await uploadToDatabase({ dbName: <database_name>, mongoURI: <mongoDB_connection_string>, data: <data-to-upload> });
 })();
```

_Parameters -_

- **dbName** - Name of the database to upload data to (If this doesn't already exist, new database will be created)
- **mongoURI** - Mongo DB connection string of the instance to which you want to upload data TO.

       Example - mongodb+srv://user:password@cluster0-miow4.mongodb.net/test

- **data** - Data should be in JSON format with keys as collection names and values as array of documents to upload. Illustration given below -

#### Data to be uploaded should be in json format as -

```
{
    "collectionName1":[document11, document12, ....],
    "collectionName2":[document21, document22, ....]
}

```

\*In CLI mode, path of JSON file in above format should be provided to upload.

#### transferData() function can be used as -

```
(async () => {
   await transferData({
      transferFrom: <mongoDB_connection_string>,
      databaseFrom: <database_name>,
      transferTo: <mongoDB_connection_string>,
      databaseTo: <database_name>,
    });
 })();
```

_Parameters -_

- **transferFrom**- Mongo DB connection string of the instance from which you want to transfer data FROM.
- **databaseFrom** - Name of the database from which to transfer data.
- **transferTo** - Mongo DB connection string of the instance to which you want to transfer data TO.
- **databaseTo** - Name of the database to transfer data to -(If this doesn't already exist, new database will be created)

#### Test files

Test files for javascript modules can be found [here](https://github.com/vasusharma7/mongo-utils/tree/test/test/)

## Command Line Interface

To use globally from the command line, install the package with -g flag as -

`npm install -g mongo-assist`

Run `mongo-assist -h` to display all the options and verify installation is succesful -

```
$ mongo-assist -h

usage: index.js [-h] [-v] [-d DOWNLOAD] [-u UPLOAD] [-t TRANSFER] [-n DATABASE2] [-x MONGOURI] [-p PATH] [-y MONGOURI2] [-e {json,excel,csv}]

Mongo Assist - Handy utilities for managing mongo instances. For detailed guide with examples - head on to https://github.com/vasusharma7/mongo-utils

optional arguments:
  -h, --help            show this help message and exit
  -v, --version         show program's version number and exit
  -d DOWNLOAD, --download DOWNLOAD
                        Name of Database to Download data from instance
  -u UPLOAD, --upload UPLOAD
                        Name of Database to Upload data to instance
  -t TRANSFER, --transfer TRANSFER
                        Name of Database to Transfer Data FROM
  -n DATABASE2, --database2 DATABASE2
                        Name of the database to transfer data TO - use with -t flag
  -x MONGOURI, --mongoURI MONGOURI
                        MongoDB connection string of the instance - to download from/ upload to/ transfer from
  -p PATH, --path PATH  Path of JSON file to upload data in proper format - use only with upload(-u)
  -y MONGOURI2, --mongoURI2 MONGOURI2
                        MongoDB connection string of the instance you want to transfer data to - use only with transfer(-t)
  -e {json,excel,csv}, --type {json,excel,csv}
                        Export as json/csv/excel

Note: Enclose MongoDB connection strings within quotes ""

```

##### CLI Examples -

```
#download data
$ mongo-assist -d test-database -e json -x "mongodb+srv://user:password@cluster0-miow4.mongodb.net/test"

#upload data
$ mongo-assist -u test-database -p ./test-database.json -x "mongodb+srv://user:password@cluster0-miow4.mongodb.net/test"

#transfer data
$ mongo-assist -t test-database -n test-database-copy -x "mongodb+srv://Vasu:htccg321@cluster0-miow4.mongodb.net/test" -y "mongodb://localhost:27017"

```

#### Note: In CLI mode, the mongoDB connection strings should be enclosed within quotes - ""

## Contributors

- [Pranav Joglekar](https://github.com/Pranav2612000/)
- [Vasu Sharma](https://github.com/vasusharma7/)
- [-Yash Shah](https://github.com/yashshah1/)
