const express = require("express");
const fs = require("fs");
const { promisify } = require("util");
const path = require("path");
const getAndRenderNotes = require("./public/assets/js/index");
const Note = require("./public/assets/js/Note");
const shortid = require("shortid");

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
    readFile("./db/db.json", "utf-8", (err, data) => {
        return res.json(JSON.parse(data));
    });
});
    
app.post("/api/notes", (req, res) => {
    //addNotes(req);
    const { title, text, id } = req.body;
    const newNote = new Note(title, text, shortid.generate());
    readFile("./db/db.json", "utf-8", (err, data) => {
        if (err) throw err;
        let notes = JSON.parse(data);
        for (let note in notes) {
            if (notes[note].id === id) {
                res.end();
                return;
            }
        }
        notes.push(newNote);
        writeFile("./db/db.json", JSON.stringify(notes, null, 2), (err) => {
            if(err) throw err;
        });
    });
});

app.listen(PORT, () => {
    console.log("App listening on PORT " + PORT);
});

async function addNotes(req) {
    try {
        let notes;

        await readFile("./db/db.json", "utf-8", (err, data) => {
            notes = JSON.parse(data);
            notes.push(req.body);
        });

        await writeFile("./db/db.json", JSON.stringify(notes, null, 2), (err) => {
            if (err) throw err;
            getAndRenderNotes();
        });

        updateNotes();
    } catch (err) {
        throw err;
    }
}

const updateNotes = () => {
    app.get("/api/notes", (req, res) => {
        readFile("./db/db.json", "utf-8", (err, data) => {
            return res.json(JSON.parse(data));
        });
    });
};

// readFile("./db/db.json", "utf-8", (err, data) => {
//     if (err) throw err;
//     let notes = JSON.parse(data);
//     notes.push(req.body);
//     return notes;
// }).then((res) => {
//     writeFile("./db/db.json", JSON.stringify(res, null, 2), (err) => {
//     if(err) throw err;
//     }).then(() => {
//         getAndRenderNotes();
//         updateNotes();
//     });
// });