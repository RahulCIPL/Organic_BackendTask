const router = require("express").Router();

const auth = require("../middleware/auth");

const Pages = require("../models/pages.model");

// Purpose: Get All Pages
// Created By: CIPL
router.get("/", auth, async (req, res) => {
  find()
    .then((pages) => res.json(pages))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Purpose: Get Pages by Id
// Created By: CIPL
router.get("/:id", auth, async (req, res) => {
  findById(req.params.id)
    .then((page) => res.json(page))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Purpose: Delete Page by Id
// Created By: CIPL
router.delete("/:id", auth, async (req, res) => {
  findByIdAndDelete(req.params.id)
    .then(() => res.json("Page deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Purpose: Create Page
// Created By: CIPL
router.post("/add", auth, async (req, res) => {
  let { title, content, keywords, createdBy } = req.body;

  const newPage = new Pages({
    title,
    content,
    keywords,
    createdBy,
  });

  // validate
  if (!title ) {
    return res.status(400).json({ msg: "Please enter Title" });
  }

  if (!content ) {
    return res.status(400).json({ msg: "Please enter Content" });
  }

  newPage
    .save()
    .then(() => res.json("Page added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Purpose: Update Page By Id
// Created By: CIPL
router.post("/update/:id", auth, async (req, res) => {
  let { title, content, keywords, createdBy } = req.body;

  // validate
  if (!title) {
    return res.status(400).json({ msg: "Please enter Title" });
  }

  if (!content ) {
    return res.status(400).json({ msg: "Please enter Content" });
  }
  
  findById(req.params.id)
    .then((page) => {
      page.title = title;
      page.content = content;
      page.keywords = keywords;
      page.updatedBy = createdBy;

      page
        .save()
        .then(() => res.json("Page updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
