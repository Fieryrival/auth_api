const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Forms = require("../models/forms");
const Users = require("../models/users");

router.post("/register", async (req, res) => {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // Find the number of users in the table
    const count = await Users.countDocuments();
    // Assign the userId
    const userId = 100 + count + 1;
    // Create the new user
    const user = new Users({
      username: req.body.username,
      password: hashedPassword,
      userId: userId,
    });
    // Save the user to the database
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error creating user", error: err });
  }
});

router.post("/deleteUser", async (req, res) => {
  try {
    const deletedUser = await Users.findOneAndDelete({
      username: req.body.username,
    }).then();
    res.send(deletedUser);
  } catch (err) {
    res.send(err);
  }
});

router.get("/users", async (req, res) => {
  try {
    const listUsers = await Users.find().then();
    res.send(listUsers);
  } catch (err) {
    res.send(err);
  }
});
// one function to check forms and their admins
router.get("/forms", async (req, res) => {
  try {
    const listForms = await Forms.find().then();
    res.send(listForms);
  } catch (err) {
    res.send(err);
  }
});

router.post("/addForm", async (req, res) => {
  const { formName, formId } = req.body;

  let newForm = new Forms({ formName: formName, formId: formId });
  await newForm.save();
  res.json(newForm);
});

router.get("/editForm", async (req, res) => {
  let formToEdit = await Forms.findOne({ formName: "tn_in_wshop" }).then();
  formToEdit["formId"] = 6002;
  await formToEdit.save();
  res.json(formToEdit);
});

// one function to add a particular user to that form
router.post("/addAdmin", async (req, res) => {
  const formToEdit = await Forms.findOne({
    formName: req.body.formName,
  }).then();
  if (!formToEdit) res.send({ err: "form not found" });
  //   res.send({ formToEdit });

  const admins = await Users.find(
    { username: { $in: req.body.admins } },
    { userId: 1 }
  ).then();
  if (!admins) res.send({ err: "no adminIds" });
  //   res.send({admins});
  const adminIds = admins.map((admin) => admin.userId);
  //   res.send({adminIds});
  //   const uniqueAdminIds = [...new Set(adminIds)].filter(
  //     (id) => !formToEdit.formAdmins.includes(id)
  //   );
  formToEdit.formAdmins = adminIds;
  await formToEdit.save();
  res.send(formToEdit);
});
// one function to edit formAdmins by form id.....i guess above function wont be required if this function is made universal

module.exports = router;
