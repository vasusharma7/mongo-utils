
<br />

<h1 align="center">Mongo Utils</h1>

  
[![NPM Version](https://img.shields.io/npm/v/npm)](https://npmjs.org/)
 [![Minzipped Size](https://flat.badgen.net/bundlephobia/minzip/json-2-csv)](https://bundlephobia.com/result?p=mongo-utils)
[![Typings](https://img.shields.io/npm/types/typescript)](https://npmjs.org/)
[![Lisence](https://img.shields.io/npm/l/node)](https://npmjs.org/)
 

 
<p align="center">
    <a href="https://github.com/vasusharma7/mongo-utils/issues">Report Bug</a> &nbsp &nbsp
    <a href="https://github.com/vasusharma7/mongo-utils/issues">Request Feature</a>
 </center>
 
Mongo Utils are handy utilities for managing multiple mongo instances. Available as a module as well as in CLI mode, you can

- Download MongoDB Databases in json/csv/excel format.
- Upload Data to MongoDB instances.
- Transfer data from one MongoDB instance to another

## How to install

You can install json2csv as a dependency using NPM.  

```sh
# Global so it can be called from anywhere
$ npm install -g mongo-utils
# or as a dependency of a project
$ npm install mongo-utils --save
```
## Usage

This can be used as a Javascript module or from Command Line Interface

## Javascript module

It provides 3 functions - 

- downloadData - To download MongoDB Databases in json/csv/excel format.
- uploadToDatabase - To upload Data to MongoDB instances.
- transferData - To transfer data from one MongoDB instance to another

Import necessary functions from mongo-utils as 

`import { transferData, downloadData, uploadToDatabase } from "mongo-utils";`

 - downloadData function can be used as - 

```
(async () => {
  await downloadData({
      mongoURI: <mongoDB_connection_string>,
      database: <database_name>,
      type: < "json" | "csv" | "excel" >,
    });
 })();
```
- uploadToDatabase function can be used as - 
 
```
(async () => {
  await uploadToDatabase({ dbName: <database_name>, mongoURI: <mongoDB_connection_string>, data: <data-to-upload> });
 })();
```

Data to be uploaded should be in json format as - 
  
```
{
    "collectionName1":[document11, document12, ....],
    "collectionName2":[document21, document22, ....]
}

```

- transferData function can be used as - 

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



## Command Line Interface 

To use globally, first make sure you have installed package with -g flag as - 

`npm install -g mongo-utils`







## Contributors 

 - [Pranav Joglekar](https://github.com/Pranav2612000/)
 - [Vasu Sharma](https://github.com/vasusharma7/)
 - [Yash Shah](https://github.com/yashshah1/)









