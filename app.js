const fs = require('fs');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const app = express();

app.use(cors())



//_________________GET______________________
app.get('/', (req, res) => {
    fs.readFile("./questions-example.json", "utf8", (err, jsonString) => {
      if (err) {
        console.log("Error reading file from disk:", err);
        return;
      }
      try {
        const questions = JSON.parse(jsonString); 
        res.json(questions);
      } 
      catch (err) {
        console.log("Error parsing JSON string:", err);
      }
    });
});

//________________POST_______________
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.post('/', (req, res, next) => {
    console.log("req", req.body);
    let data = JSON.stringify(req.body, null, 2);
    
    fs.writeFile('./questions-example.json', data, (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });
    res.sendStatus(200);
        
});

app.listen(2020, () => {
    console.log('server is listening on port 2020');
});