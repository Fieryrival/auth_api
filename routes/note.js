const express = require("express");
const router = express.Router();
const Note = require("../models/notes"); // import the note model
const { authenticateToken, masterAdmin } = require("../middlewares/middleware");

// updating by userId
// finding notes by userId then updating
//

router.get("/getNoteById", async (req, res) => {
  let authNotes;
  try {
    authNotes = await Note.find({ userId: req.userId }).then();
    res.json(authNotes);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.post("/updateNote", async (req, res) => {
  let noteToEdit = await Note.find({ noteId: req.query.noteId }).then();
  // let content,title,designation;
  let { content, title, designation } = req.body;
  if (content === undefined) content = noteToEdit[0]._doc["content"];
  if (title === undefined) title = noteToEdit[0]._doc["title"];
  if (designation === undefined)
    designation = noteToEdit[0]._doc["designation"];

  noteToEdit[0].title = title;
  noteToEdit[0].content = content;
  noteToEdit[0].designation = designation;
  noteToEdit[0].wasChanged = "YES";
  // noteToEdit[0].updateTime = Date.now();
  const date_ob = new Date();
  let day = date_ob.getDate();
  let month = date_ob.getMonth()+1;
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let seconds = date_ob.getSeconds();
  let timeUpdate = String(`${day}-${month}-${year} ${hours}:${minutes}:${seconds}`);
  // console.log(timeUpdate);
  noteToEdit[0].timeUpdate = timeUpdate;
  let updatedNote = await noteToEdit[0].save();
  // console.log(content, title, designation);
  res.json(updatedNote);
});

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
router.get("/allNotes", authenticateToken, async (req, res) => {
  let notes;
  try {
    notes = await Note.find().sort({ noteId: -1 }).then();
    res.send({ notes });
  } catch (err) {
    res.send({ err: "error getting notes" });
  }
});

router.get("/latestNotes", authenticateToken, async (req, res) => {
  // GET top 3 recently added Notes
  let notes;
  try {
    notes = await Note.find().sort({ noteId: -1 }).limit(3);
    res.send({ notes });
  } catch (err) {
    res.send({ err: "error getting notes" });
  }
});

router.post("/deleteNote", authenticateToken, masterAdmin, async (req, res) => {
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
