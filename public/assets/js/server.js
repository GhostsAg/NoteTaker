const express = require("express");
const fs = require("fs");
const path = require("path");

app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 8080;

const notesArr = new Array;

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../../index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "../../notes.html"));
});

app.route("/api/notes").get( function(req, res) {
    fs.readFile("../../../db/db.json", "utf-8", function(err, data) {
        if(err) {
            throw err;
        }
        return res.json(JSON.parse(data));
    });
});
// .post( function(req, res) {
    

//     res.json(notesArr);
// });

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});

function fileTo(path, array) {
    fs.readFile(path, "utf-8", function(err, data) {
        if (err) {
            throw err;
        }
        array.push(data);
    });
}

// let newNote = req.body;
    
//     newNote.routeName = newNote.title.replace(/\s+/g, "");

//     console.log(newNote);