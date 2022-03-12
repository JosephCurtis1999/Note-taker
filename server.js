const fs = require("fs");
const express = require("express");
const path = require("path");
const uuid = require("uuid");

let noteData = require("./db/db.json");

const app = express();
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "notes.html"));
});

app.get("/api/notes", (req, res) => {
    res.json(noteData);
});

app.post("/api/notes", (req, res) => {
    const newNote = {
        title: req.body.title,
        text: req.body.text,
        id: uuid.v4(),
    }

    noteData.push(newNote);
    res.json(noteData);

    fs.writeFile("db/db.json", JSON.stringify(noteData), (err) => {
        if (err) throw err;
    });
});

app.delete("/api/notes/:id", (req, res) => {
    let { id } = req.params;
    noteData = noteData.filter((note) => note.id !== id);
    res.send(`User with the id ${id} has been deleted from the database`);
    fs.writeFile("db/db.json", JSON.stringify(noteData), (err) => {
        if (err) throw err;
    });
});

