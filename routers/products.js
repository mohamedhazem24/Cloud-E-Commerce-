const { Category } = require("../models/category");
const { Product } = require("../models/product");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }
  console.log(filter);
  const productlist = await Product.find(filter);
  if (!productlist) {
    res.status(500).json({ success: false });
  }
  res.send(productlist);
});

router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("category")
    .catch(() => {
      res.status(400).send("Invalid Category");
    });

  res.send(product);
});

router.post("/", async (req, res) => {
  const category = await Category.findById(req.body.category).catch(() => {
    res.status(400).send("Invalid Category");
  });

  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });
  product = await product.save();
  if (!product) {
    return res.status(500).send("product cant be created");
  }
  res.send(product);
});
router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Product");
  }
  const category = await Category.findById(req.body.category).catch(() => {
    res.status(400).send("Invalid Category");
  });
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    {
      new: true,
    }
  );
  if (!product) {
    return res.status(400).send("the product not updated");
  }
  res.send(product);
});

router.delete("/:id", (req, res) => {
  Product.findByIdAndDelete(req.params.id)
    .then((product) => {
      if (product) {
        return res.status(200).json({
          success: true,
          message: "the product deleted",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "product not found",
        });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

router.get("/get/count", async (req, res) => {
  const productlist = await Product.find().select("name price");
  if (!productlist) {
    res.status(500).json({ success: false });
  }

  res.send({
    productCount: productlist.length,
  });
});

router.get("/get/featured/:count", async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const productlist = await Product.find({ isFeatured: true }).limit(+count);
  if (!productlist) {
    res.status(500).json({ success: false });
  }

  res.send(productlist);
});

module.exports = router;
