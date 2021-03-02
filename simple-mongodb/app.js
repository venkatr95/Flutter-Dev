var express = require("express");
var app = express();
var port = 3000;
var bodyParser = require('body-parser');
const dbPass = require('./conf.json')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const url = `mongodb+srv://farfromhome:${dbPass.mongodBPass}@ffh-0.vlr6a.mongodb.net/FFH-POC?retryWrites=true&w=majority`;

const connectionParams = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(url, connectionParams);
var nameSchema = new mongoose.Schema({
    firstName: String,
    lastName: String
}, { collection: 'sample-test-1' } // Needed for collection specific data entry
);
var User = mongoose.model("User", nameSchema);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/addname", (req, res) => {
    var myData = new User(req.body);
    myData.save()
        .then(item => {
            res.send("Name saved to database");
        })
        .catch(err => {
            res.status(400).send("Unable to save to database");
        });
});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});