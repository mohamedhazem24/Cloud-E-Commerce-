const { Category } = require("../models/category");
const express = require("express");
const router = express.Router();



router.get("/", async (req, res) => {
  
  const cache=await redis.getData("categories");
  if(cache!=null){return res.status(200).send(JSON.parse(cache));}

  const categoryList = await Category.find();
  if (categoryList.length==0) {
    return res.status(500).json({ success: false });
  }
  await redis.setData('categories',categoryList);
  res.status(200).send(categoryList);
});

router.get("/:id", async (req, res) => {
  console.log(req.params.id);
  const category = await Category.findById(req.params.id).catch(() => {
    res.status(500).json({ success: false });
  });
  res.status(200).send(category);
});

router.post("/", async (req, res) => {
  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  });
  category = await category.save();
  if (!category) {
    return res.status(404).send("the category not created");
  }

  res.send(category);
});

router.put("/:id", async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    },
    {
      new: true,
    }
  );
  if (!category) {
    return res.status(400).send("the category not updated");
  }
  res.send(category);
});

router.delete("/:id", (req, res) => {
  Category.findByIdAndDelete(req.params.id)
    .then((category) => {
      if (category) {
        return res.status(200).json({
          success: true,
          message: "the category deleted",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "category not found",
        });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

module.exports = router;
