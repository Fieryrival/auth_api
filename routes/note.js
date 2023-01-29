const express = require("express");
const router = express.Router();
const Note = require("../models/notes"); // import the note model
const { authenticateToken } = require("../middlewares/middleware");

// Create a new note
router.post("/", authenticateToken, async (req, res) => {
  const { title, content } = req.body;
  const username = req.username;
  const userId = req.userId;
  let numOfDocs =await Note.countDocuments().then();
  const noteId = Number(numOfDocs+101);
  const newNote = new Note({ title, content, username, userId,noteId });
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
router.get("/", async (req, res) => {
  // res.send({ message: "get request for note app" });
  // Note.find()
  //   .then(notes => {
  //     res.status(200).json(notes);
  //   })
  //   .catch(err => {
  //     res.status(500).json(err);
  //   });
  const notes = await Note.find().sort({noteId:-1});
  res.send({ notes });
});

router.get("/latest", async (req, res) => {
  // GET top 3 recently added Notes
  const notes = await Note.find().sort({noteId:-1}).limit(3);
  res.send({ notes });
});

module.exports = router;
