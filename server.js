const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const dbFile = require('./db/db.json');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/notes", (req, res) => {
  console.log("Fetching all notes");
  res.json(dbFile);
});

app.post("/api/notes", (req, res) => {
  console.log("Adding a new note");

  const newNote = req.body;
  newNote.id = uuidv4();
  dbFile.push(newNote);
  fs.writeFileSync("./db/db.json", JSON.stringify(dbFile), (err) => {
    if (err) {
      console.error("Error writing to the database file", err);
    }
  });
  res.send(dbFile);
});

app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;
  const updatedDb = dbFile.filter(note => note.id !== noteId);
  fs.writeFile("./db/db.json", JSON.stringify(updatedDb), (err) => {
    if (err) {
      console.error("Error writing to the database file", err);
    }
  });
  res.send(updatedDb);
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});