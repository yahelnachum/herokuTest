// Author Yahel Nachum
// Website http://yn-cs4241-main-a5.herokuapp.com/

var express = require('express');
var path = require('path');
var app = express();
var port = process.env.PORT || 3000;
var bodyParser = require("body-parser");
var pg = require('pg');
var fs = require('fs');
app.use(bodyParser.urlencoded({extended: false}));


app.use(express.static(path.join(__dirname, '/public')));

app.get('/', function(req, res) {
  res.send(path.join(__dirname, '/public/index.html'));
});

app.get('/list', function(req, res) {
  var fileData = fs.readFileSync(path.join(__dirname, '/public/list.txt')).toString().split("\n");
  res.send(JSON.stringify(fileData));
});

app.get('/querying', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post('/add', function(req, res) {
  var chunk = "";
  req.on('data', function(data) {
    chunk += data;
  });
  req.on('end', function(data) {
    // Note: this is not a great way to access this object.
    var obj = chunk.split('=');
    var found = 0;
      var fileData = fs.readFileSync(path.join(__dirname, '/public/list.txt')).toString().split("\n");
      for(var i = 0; i < fileData.length; i++){
        if(fileData[i].toLowerCase() == obj[1].toLowerCase()){
          found = 1;
          i = fileData.length;
        }
      }

      if(found === 0){
        fs.appendFileSync(path.join(__dirname, '/public/list.txt'), "\n" + obj[1]);
      }
      res.end();
  });
});

app.post('/remove', function(req, res) {
  var chunk = "";
  req.on('data', function(data) {
    chunk += data;
  });
  req.on('end', function(data) {
    // Note: this is not a great way to access this object.
    var obj = chunk.split('=');
    var fileData = fs.readFileSync(path.join(__dirname, '/public/list.txt')).toString().split("\n");
      for(var i = 0; i < fileData.length; i++){
        if(fileData[i].toLowerCase() == obj[1].toLowerCase()){
          fileData.splice(i, 1);
          i = fileData.length;
        }
      }
      fs.writeFileSync(path.join(__dirname, '/public/list.txt'), fileData.join("\n"));
      res.end();
  });
});


app.listen(port, function() {
  console.log('App is listening on port ' + port);
});
