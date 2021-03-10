const router = require("express").Router();

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const auth = require("../middleware/auth");

const Users = require("../models/users.model");

// Purpose: Register User from Signup Page
// Created By: CIPL
router.post("/register", async (req, res) => {
  try {
    let { name, emailaddress, password, passwordCheck } = req.body;
    // validate
    if (!name || !emailaddress || !password || !passwordCheck) {
      return res.status(400).json({ msg: "Please entered all the fields." });
    }
    if (password.length < 5) {
      return res
        .status(400)
        .json({ msg: "The password needs to be at least 5 characters long." });
    }
    if (password !== passwordCheck) {
      return res
        .status(400)
        .json({ msg: "Enter the same password twice for verification." });
    }
    //check user is already created or not with same emailaddress
    const existingUser = await findOne({ emailaddress: emailaddress });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "A user with this emailaddress already exists." });
    }

    const salt = await genSalt();
    const passwordHash = await hash(password, salt);
    const newUser = new Users({
      name,
      emailaddress,
      password: passwordHash,
      status: 1,
    });

    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Purpose: Login API
// Created By: CIPL
router.post("/login", async (req, res) => {
  try {
    const { emailaddress, password } = req.body;
    // validate
    if (!emailaddress || !password) {
      return res.status(400).json({ msg: "Not all fields have been entered." });
    }

    const user = await findOne({ emailaddress: emailaddress });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "No user with this emailaddress has been added." });
    } else {
      //Check user is Active/Inactive
      if (!user.status) {
        return res.status(400).json({ msg: "User is not active." });
      }
    }

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    const token = sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Purpose: Check if token is valid
// Created By: CIPL
router.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      return res.json(false);
    }
    const verified = verify(token, process.env.JWT_SECRET);
    if (!verified) {
      return res.json(false);
    }
    const user = await findById(verified.id);
    if (!user) {
      return res.json(false);
    }
    return res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Purpose: Create user after Login
// Created By: CIPL
router.post("/add", auth, async (req, res) => {
  try {
    let {
      name,
      emailaddress,
      password,
      passwordCheck,
      status,
      createdBy,
    } = req.body;
    // validate
    if (!name || !emailaddress || !password || !passwordCheck) {
      return res.status(400).json({ msg: "Please enter all fields!" });
    }
    if (password.length < 5) {
      return res
        .status(400)
        .json({ msg: "The password needs to be at least 5 characters long." });
    }
    if (password !== passwordCheck) {
      return res
        .status(400)
        .json({ msg: "Enter the same password twice for verification." });
    }
    const existingUser = await findOne({ emailaddress: emailaddress });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "A user with this emailaddress already exists." });
    }

    const salt = await genSalt();
    const passwordHash = await hash(password, salt);
    const newUser = new Users({
      name,
      emailaddress,
      password: passwordHash,
      status,
      createdBy,
    });

    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Purpose: Get All Users
// Created By: CIPL
router.get("/", auth, async (req, res) => {
  find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Purpose: Get user By Id
// Created By: CIPL
router.get("/:id", auth, async (req, res) => {
  findById(req.params.id)
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Purpose: Delete user By Id
// Created By: CIPL
router.delete("/:id", auth, async (req, res) => {
  try {
    await findByIdAndDelete(req.params.id);
    res.json("User deleted!");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Purpose: Update user By Id
// Created By: CIPL
router.post("/update/:id", auth, async (req, res) => {
  try {
    let {
      name,
      emailaddress,
      password,
      passwordCheck,
      status,
      createdBy,
    } = req.body;

    if (!name || !emailaddress || !password || !passwordCheck) {
      return res.status(400).json({ msg: "Please enter all fields!" });
    }
    if (password.length < 5) {
      return res
        .status(400)
        .json({ msg: "The password needs to be at least 5 characters long." });
    }
    if (password !== passwordCheck) {
      return res
        .status(400)
        .json({ msg: "Enter the same password twice for verification." });
    }
    // const existingUser = await Users.find({ emailaddress: emailaddress, _id: {$ne :id } });
    // if (existingUser) {
    //   return res
    //     .status(400)
    //     .json({ msg: "A user with this emailaddress already exists." });
    // }

    const salt = await genSalt();
    const passwordHash = await hash(password, salt);

    findById(req.params.id)
      .then((user) => {
        user.name = name;
        user.emailaddress = emailaddress;
        user.status = status;
        user.password = passwordHash;
        user.updatedBy = createdBy;

        user
          .save()
          .then(() => res.json("User updated!"))
          .catch((err) => res.status(400).json("Error: " + err));
      })
      .catch((err) => res.status(400).json("Error: " + err));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
