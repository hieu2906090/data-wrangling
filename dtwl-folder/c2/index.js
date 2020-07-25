"use strict"

const express = require('express');
const path = require('path');



const app = express();

const staticFilesPath = path.join(__dirname, "public");
const staticFilesMiddleWare = express.static(staticFilesPath);

app.use('./', staticFilesMiddleWare);

// app.get("./", (req, res) => {
//     res.send("This is a demo web page!");
// });

app.listen(3000, () => {
    console.log("Web server listening to client request!");
});

