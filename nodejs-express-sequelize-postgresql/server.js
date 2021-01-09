const express = require("express");
const bodyParser = require("body-parser");
const favicon = require('express-favicon');
const path = require('path');
require('dotenv').config()
const port = process.env.PORT || 8088;

const app = express();

const buildFolder = path.join(__dirname, '..', 'react-crud', 'build');


// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(favicon(path.join(buildFolder, 'favicon.ico')));
// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));
app.use(express.static(buildFolder));

const db = require("./app/models");
db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
});

// simple route
require("./app/routes/tutorial.routes")(app);
app.get('/*', function(req, res) {
  res.sendFile(path.join(buildFolder, 'index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})

// set port, listen for requests
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
