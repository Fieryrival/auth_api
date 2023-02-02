const express = require("express");
const router = express.Router();
const Note = require("../models/notes"); // import the note model
const { authenticateToken } = require("../middlewares/middleware");

// Create a new note
router.post("/addNote", authenticateToken, async (req, res) => {
  const { title, content, designation } = req.body;
  const username = req.username;
  const userId = req.userId;
  // const designation = req.body.designation;
  let noteId = 0;
  let numOfDocs = await Note.countDocuments().then();
  if (numOfDocs !== 0) {
    let tmp;
    tmp = await Note.aggregate([
      { $group: { _id: null, maxNoteId: { $max: "$noteId" } } },
    ]).then();
    noteId = Number(tmp[0].maxNoteId + 1);
  } else {
    noteId = Number(numOfDocs + 101);
  }

  const newNote = new Note({
    title,
    content,
    username,
    userId,
    noteId,
    designation,
  });
  newNote
    .save()
    .then((note) => {
      res.status(201).json(note);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
  // res.send("done");
});

// Get all notes
router.get("/allNotes", async (req, res) => {
  let notes;
  try {
    notes = await Note.find().sort({ noteId: -1 }).then();
    res.send({ notes });
  } catch (err) {
    res.send({ err: "error getting notes" });
  }
});

router.get("/latestNotes", async (req, res) => {
  // GET top 3 recently added Notes
  let notes;
  try {
    notes = await Note.find().sort({ noteId: -1 }).limit(3);
    res.send({ notes });
  } catch (err) {
    res.send({ err: "error getting notes" });
  }
});

router.post("/deleteNote", async (req, res) => {
  try {
    const deletedNote = await Note.findOneAndDelete({
      noteId: req.body.note_Id,
    }).then();
    res.send({ deletedNote });
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
