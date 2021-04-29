const fs = require('fs');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const app = express();

app.use(cors())

function editHelper(value) {
    console.log("value", value.quiz_id);
    fs.readFile("./questions-example.json", "utf8", (err, jsonString) => {
        if (err) {
            console.log("Error reading file from disk:", err);
            return;
          }
        try {
            const questions = JSON.parse(jsonString); 
            var questionArray = [];
            questionArray.push(questions);
            console.log("questionArray", questionArray);
            for(var i = 0; i < questionArray[0].quizzes.length; i++){
                if(questionArray[0].quizzes[i].quiz_id === value.quiz_id){
                    questions.quizzes[i] = value;
               }
            }
            let data = JSON.stringify(questions, null, 2);
            //console.log("edited quiz", data);
            fs.writeFile('./questions-example.json', data, (err) => {
                if (err) throw err;
                console.log('Data written to file');
            });
          } 
          catch (err) {
            console.log("Error parsing JSON string:", err);
          }
    });
}

app.use(function (req, res, next) {
  req.editHelper = editHelper;
  next();
});

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
    //let data = JSON.stringify(req.body, null, 2);;
    req.editHelper(req.body)
//    fs.writeFile('./questions-example.json', data, (err) => {
//        if (err) throw err;
//        console.log('Data written to file');
//    });
    res.sendStatus(200);
        
});

app.listen(2020, () => {
    console.log('server is listening on port 2020');
});
