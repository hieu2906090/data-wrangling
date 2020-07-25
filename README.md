# DATA WRANGLING USING JAVASCRIPT

## C1 - Getting started: establishing your data pipeline

![Data wrangling definition](readme-dtwl/data-wrangling-definition.png)

(3) Data wrangling involves wrestling with many different issues. How can you filter or optimize data, so you can work with it more effectively? How can you improve your code to process the data more quickly? How do you work with your language to be more effective? How can you scale up and deal with larger data sets?

(8) Mocha with Chai for JavaScript unit and integration testing.
Collection of Data: Linq (from C#)
Working with time: Moment.JS

(10) The biggest problem I see in many programmers is their failure to think and plan out their work before coding.
(11) If you don’t have enough information to plan, then move forward with exploratory coding and return to planning when you have a better understanding of the problem you’re trying to solve.
Requirements usually change over time as you develop your understanding of the proj- ect. Don’t be concerned if this happens.
>![Dashboard web structure](readme-dtwl/dashboard-web-struct.png)
>
>![Dashboard page mockup](readme-dtwl/dashboard-page-mockup.png)

(15) Exploratory coding is the process of incrementally building your code through an iterative and interactive process (figure 1.10). Code a few lines, then run the code and inspect the output, repeat. Repeating this process builds up your code and understand- ing at the same time.

## C2 - Working with Node JS

### 1. Working with Node

(35) You might wonder why you need to install dependencies for such a simple code example. Well, truth be told—you don’t! I want you to get in the habit of doing this because most examples do have dependencies and you do need to run npm install to download the dependencies before you run the code.

>**Use Strict**
This statement was introduced in ECMAScript 5 and allows you to opt in to a more restricted and safer version of the language.

```js
npm install --save moment
```

Note the --save parameter saves the dependency in package.json and tracks the ver- sion number

**_Creating a command line app_**
(37) Uses yargs for access to command-line arguments
Uses chai for its assert library for validation

```js
"use strict";

const yargs = require('yargs');
const argv = yargs.argv;
const assert = require('chai').assert;
```

**_Creating a code library_**
(38) Exports the function so that it can be reused in other code module. The code module can now be imported into your command-line app (or indeed any other code module) using Node’s _require_ function

```js
"use strict";
function generateReport (data) {
    const columns = Object.keys(data[0]); 
    return {
        numRows: data.length, numColumns: columns.length, columnNames: columns,
    };
};
module.exports = generateReport;
```

---
In other code module:

```js
...
const generateReport = require(‘./generate-report.js’);
const report = generateReport(data);
...
```

---

We can also export an object, and this allows us to export a library of functions.

```js
module.exports = {
    someFunction1: function (param1, param2, etc) {
    //
    // Code //
    // Return result
    },
    someFunction2: function (param1, param2, etc) { //
    // Code //
    // Return result
    },
    ...
};
```

### 2. Creating a simple web server

Using Express:

```bash
npm install -–save express
```

### 3. Adding a REST API

(43) Define a handler for the route /rest/data

```js
app.get("/rest/data", (req, res) => { const report = generateReport(data); res.json(report);
});
```

(44) Then we can use jQuery or 

```js
<script>
$.getJSON("/rest/data", function (report) { 
    document.write(
        "Num rows: " + report.numRows + "\r\n" +
        "Num columns: " + report.numColumns + "\r\n" + "Columns: " + report.columns.join(', ')
    );
});
</script>
```

$.getJSON() ~ $.ajax({})

(47) In other languages and environments where synchronous coding is normal, we can avoid this problem by delegating such resource-intensive operations to a worker thread. Generally, though, we can’t use threads like this in Node.js, which is typically consid- ered to be single-threaded.

A callback is a JavaScript function that’s automatically called for you when a single asynchronous operation has completed.

![Async task illustration](./readme-dtwl/async-task-illus.png)

(52) Asynchronous coding with promises (Promise design pattern) dealing with the following problems of callbacks:

- Callback Hell
- Callback Order
- Error Handling

>**A promise** is an object that wraps an asynchronous operation and promises to deliver an outcome (or an error) at some time in the future.
Promises give us a vocabulary to express chains of asynchronous operations in a way that almost looks (if you squint your eyes) like it was a sequence of synchronous operations.

_**THEN**_

Then is used to chain together a sequence of asynchronous operations

>![Then in code block](./readme-dtwl/then-promise.png)

_**ALL**_

Promise.all is used to manage asynchronous operations that are running in paral- lel. It automatically weaves together the callbacks and invokes a single final callback (figure 2.22). Using all, you no longer need to worry about coordinating multiple callbacks that might be invoked in any order.

_**CATCH**_

Using promises, we can attach an error handler to the end of our chain

![Async with catch error statement](./readme-dtwl/async-with-catch.png)

>Always have at least 1 error handler

### 4. Wrapping async ops in promises

(55) We instantiate a Promise object with an anonymous function that initiates the asyn- chronous file loading operation. The anonymous function is passed two parameters. The first parameter is a resolve function that we call when the asynchronous operation has completed and we’re ready to resolve the promise. This will trigger the next then handler that is chained to the promise. The second parameter is a reject function that we can call if an error occurs. We can use this to fail the promise and trigger the closest catch handler in the promise chain:

![Promise return template for conversion](./readme-dtwl/promise-conversion-template.png)

### 5. Async code with async and await

## C3 - Acquisition, storage and retrieval

### 1. Core Data Representation (CDR)

(61) This is a design pattern for structuring data pipelines. The CDR allows us to piece together flexible data pipe- lines from reusable code modules.

![CDR Core Data Representation](./readme-dtwl/cdr-illustrate.png)

(62) You might say the CDR is the glue that binds together our data pipeline. its purpose is to allow our pipeline stages to communicate and be cleanly separated with no hard dependencies on each other. ***This separation is what allows us to build reusable code modules that we can then rearrange to create other data pipelines.***

![CDR Communication Design Pattern](./readme-dtwl/cdr-communication.png)

### 2. Importing data

```js
const fs = require('fs');
// Read a text file form the file system.
function read (fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, "utf8",
            (err, textFileData) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(textFileData);
            }
        );
    });
};
```

(69) What happens when we load a large text file that doesn’t fit in memory?
When this happens, Node.js raises an out-of-memory error.

Using request-promise library for getting data from REST API

```bash
npm install –-save request-promise request
```

![request promise library](./readme-dtwl/request-promise-lib.png)

(71) Parse JSON using Javascript JSON API

```js
const file = require('./file.js');
// Helper function to import a JSON file.
function importJsonFile (filePath) {
 return file.read(filePath)
  .then(textFileData => {
   return JSON.parse(textFileData);
  });
};
module.exports = importJsonFile;
```

(72) Passing data from a REST API

```js
const importJsonFromRestApi = require('./toolkit/importJsonFromRestApi.js'); // Require our "importJsonFromRestApi" toolkit function.

const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

importJsonFromRestApi(url) // Use our toolkit function to import data from the REST API.
.then(data => { // Callback to handle imported data.
    const earthquakes = data.features.map(feature => { // Restructure incoming data to the CDR.
        const earthquake = Object.assign({}, feature.properties, { id: feature.id }); 
        return earthquake;
    });
    console.log(earthquakes); // Print the data to the console so that we can verify it.
 })
.catch(err => { // Handle any error that might have occurred.
    console.error("An error occurred.");
    console.error(err.stack);
});
```

(74) Parsing CSV text data - using papa parse
As with JSON, we start by reading the CSV text file into memory; after that, we use Papa Parse to decode the text data to the CDR.

![Parse CSV file format using papa parse](./readme-dtwl/parse-csv-files.png)

(76) Parsing CSV data from REST API

(78) Importing data from database
(79) MongoDB doesn’t impose a fixed schema on your data, so we don’t need to predefine the structure of the database.

```bash
npm install –-save promised-mongo
```

![Retrieve data via mongo network protocol](./readme-dtwl/retrieve-data-via-mongo-protocol.png)

```js
const mongo = require('promised-mongo');
const importFromMongoDB = require('./toolkit/importFromMongoDB.js');

const db = mongo("localhost:6000/earthquakes", ["largest_earthquakes"]);

importFromMongoDB(db, "largest_earthquakes")
    .then(data => {
        console.log(data);
    })
    .then(() => db.close())
    .catch(err => {
        console.error(err);
    });
```

(82) Importing data from MySQL

### 3. Exporting Data

**General Pattern for Data Export:**

```js
const importCsvFile = require('./importCsvFile');
importCsvFile("./data/earthquakes.csv")
.then(earthquakesData => {
    //
    // ... Export code here ... //
})
.catch(err => {
    console.error("An error occurred.");
    console.error(err.stack);
});
```

(85) Exporting to a text file starts with serialization of the data that we’re holding in the core data representation.

![Export data diagram](./readme-dtwl/export-data-diag.png)

```js
function write (fileName, textFileData) {
    return new Promise((resolve, reject) => {
        fs.writeFile(fileName, textFileData, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
};
```

(89) Export data to CSV text files
>Uses papa.unparse to convert from CDR to CSV text data.
Uses our file.write toolkit function to write the CSV data to the filesystem.


```js
const papa = require('papaparse');
const file = require('./file.js');

function exportCsvFile (fileName, data) {
    const csv = papa.unparse(data);
    return file.write(fileName, csv);
};
module.exports = exportCsvFile;
```

(91) Export data to Database

```js
function exportToMongoDB (db, collectionName, data) {
    return db[collectionName].insert(data);
};
module.exports = exportToMongoDB;

...

const db = mongo("localhost:6000/earthquakes", ["largest_earthquakes_export"]
);

importCsvFile("./data/earthquakes.csv")
.then(data =>
    exportToMongoDB(db, "largest_earthquakes_export", data)
    .then(() => db.close())
    .catch(err => {
        console.error("An error occurred.");
        console.error(err.stack);
    });

```

### 4. Building complete data conversion

### 5. Expanding the concept

![General Data Conversion Pipeline](./readme-dtwl/general-data-conversion.png)

## C4 - WORKING WITH UNUSUAL DATA

![Chapter 4 Toolkit](./readme-dtwl/c4-toolkit.png)

### 1. Import custom data

Our first port of call when working with regular expressions should be to an online testing tool such as <https://regex101.com>.

(103) You should recognize regular expressions as a powerful technique for parsing unusual data formats.

### 2. Import data by web scrape

(104) Your web scraping script depends on the structure of the page being scraped: if that structure changes, then your script will be broken. This makes web scraping scripts inherently fragile. For these reasons web scraping as a data source should be considered a last resort.

![Web Scrape data diagram](./readme-dtwl/web-scrape-diagram.png)

***Scraping with cheerio***

```js
function scrapeWebPage (url) {
    return request.get(url)
        .then(response => {
            const $ = cheerio.load(response);
            const headers = $("thead tr")
                .map((i, el) => {
                    return $(el)
                        .find("th")
                        .map((i, el) => {
                            return $(el).text();
                        })
                        .toArray();
                })
                .toArray();

            const rows = $("tbody tr")
                .map((i, el) => {
                    return [$(el)
                        .find("td")
                        .map((i, el) => {
                            return $(el).text();
                        })
                        .toArray()];
                })
                .toArray();

            return rows.map(row => {
                    const record = {};
                    headers.forEach((fieldName, columnIndex) => {
                        if (fieldName.trim().length > 0) {
                            record[fieldName] = row[columnIndex];
                        }
                    });
                    return record;
                });
        });
};
```

(107) If you have a more complex scraping job to do, for example, one that requires authenti- cation, browser interaction, or even waiting for the browser’s JavaScript to evaluate, then this simple approach won’t be enough for you. You’ll need to simulate the web page fully using a headless browser —that’s a web browser that has no visible UI and is driven only by code.

### 4. Working with binary data

#### 4.1. Read from JS Buffer

(107) The built-in JSON serializer is already well optimized and extremely fast. You’ll have to be smart and work pretty hard to beat it!

![Binary data read by JS Buffer](./readme-dtwl/binary-data-read.png)

```js
const buffer = fs.readFileSync("./data/earthquakes.bin");
const numRecords = buffer.readInt32LE(0);
let bufferOffset = 4;
const records = [];

for (let recordIndex = 0; recordIndex < numRecords; ++recordIndex) {
    const time = buffer.readDoubleLE(bufferOffset);
    const record = {
        Time: new Date(time),
        Latitude: buffer.readDoubleLE(bufferOffset + 8),
        Longitude: buffer.readDoubleLE(bufferOffset + 16),
        Depth_Km: buffer.readDoubleLE(bufferOffset + 24),
        Magnitude: buffer.readDoubleLE(bufferOffset + 32),
    };
    bufferOffset += 8 * 5;
    records.push(record);
}
```

(110) Does this work for large files?
The short answer is no. This technique is simple, but unfortunately it doesn’t scale to large files. Loading a large file in this way will cause an out-of-memory error.
>To work with large files, you’ll need to use Node.js streams (which you’ll look at in chapter 7) that allow you to iteratively process a large file in chunks.

#### 4.2. Packing to binary data file

(111) We start by creating a Node.js Buffer object (1). Before writing records to the buffer, we must first record the number of records (2), because this allows us to know how many records to expect when we later decode the binary file. Then we pack each earthquake record sequentially into the buffer (3). Finally, the buffer is written out to our binary file earthquakes.bin (4).

***Illustrate packing 1 record to buffer***

>![Packed to buffer](./readme-dtwl/binary-packed-record.png)

***Illustrate Write buffer record to data file***

>![Illustrate writing record from buffer to file](readme-dtwl/binary-write-to-file.png)

```js
const fs = require('fs');
const moment = require('moment');

const records = JSON.parse(fs.readFileSync("./data/earthquakes.json", "utf8"));

const bufferSize = 4 + 8 * 5 * records.length;
const buffer = new Buffer(bufferSize);

buffer.writeInt32LE(records.length);

let bufferOffset = 4;

for (let recordIndex = 0; recordIndex < records.length; ++recordIndex) {

    const record = records[recordIndex];
    const time = moment(record.Time).toDate().getTime();
    buffer.writeDoubleLE(time, bufferOffset);
    bufferOffset += 8;

    buffer.writeDoubleLE(record.Latitude, bufferOffset);
    bufferOffset += 8;

    buffer.writeDoubleLE(record.Longitude, bufferOffset);
    bufferOffset += 8;

    buffer.writeDoubleLE(record.Depth_Km, bufferOffset);
    bufferOffset += 8;

    buffer.writeDoubleLE(record.Magnitude, bufferOffset);
    bufferOffset += 8;
}

fs.writeFileSync("./output/earthquakes.bin", buffer);
```

#### 4.3. Replacing JSON with BSON

(113) BSON is a standard and mature data format. It’s the format that underlies Mon- goDB.

***Convert JSON to BSON format***

```js
const fs = require('fs');
const moment = require('moment');
const BSON = require('bson');

const records = JSON.parse(fs.readFileSync("./data/earthquakes.json", "utf8"));

for (let recordIndex = 0; recordIndex < records.length; ++recordIndex) {
    const record = records[recordIndex];
    record.Time = moment(record.Time).toDate();
}

const bson = new BSON();
const serializedData = bson.serialize(records);

fs.writeFileSync("./output/earthquakes.bson", serializedData);
```

***Deserialize a BSON file***

```js
const fs = require('fs');
const BSON = require('bson');

const loadedData = fs.readFileSync("./data/earthquakes.bson");

const bson = new BSON();
const deserializedData = bson.deserialize(loadedData);

console.log(deserializedData);
```

## C5 - Eploratory Coding

### 1. Expanding your toolkit

(116) Having quick iterations and reducing the trip around the feedback loop are vital for your productivity.

![Toolkit for exploratory code](./readme-dtwl/c5-toolkit.png)

### 2. Working with reduce data sample

(120) When we’re sure that our code is robust and reliable, we can scale up to the full data set.

### 3. Prototype with Excel

() We’re only using Excel for quick prototyping before we move to Node.js, which can save time initially.
We’ll create a new Trend column in our data set. Using Excel’s FORECAST function, we’ll forecast fatalities based on six months of data.

![Using FORECAST function in Excel](./readme-dtwl/using-forecast-excel.png)

### 4. Explore data using NOdeJS

#### 4.1. Using nodemon

(123) Install nodemon globally (live-server and nodemon to be global packages)

```bash
npm install -g nodemon
```

We then using the nodemon instead of regular node listing-5.1.js like this:

```bash
nodemon listing-5.1.js
```


