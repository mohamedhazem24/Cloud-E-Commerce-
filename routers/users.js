const { User } = require("../models/user");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const userlist = await User.find();
  if (!userlist) {
    res.status(500).json({ success: false });
  }
  res.send(userlist);
});

router.post("/", async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: req.body.passwordHash,
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
})
  user = await user.save();
  if (!user) {
    return res.status(404).send("the user not created");
  }

  res.send(user);
});

router.post('/login',async(req,res)=>
  {
    const user = await User.findOne({email:req.body.email}).catch(()=>
      {
        res.status(400).send("the user not created");
      })
    if(user && req.body.passwordHash==user.passwordHash)
      {
        res.status(200).send('User Authentication')
      }
      else
      {
        res.status(400).send("Wrong Password");
      }
  })

module.exports = router;

