const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const requireLogin = require('../middleware/requireLogin')
  

router.post('/signup', async (req, res) => {
  const { firstname, lastname, stateName, email, password, pic, mobile, city, age, isAdmin } = req.body;

  if (!firstname || !lastname || !stateName || !email || !password || !mobile || !city || !age ) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  try {
    const savedUser = await User.findOne({ email: email });
    if (savedUser) {
      return res.status(422).json({ error: "User already exists with that email" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      email,
      mobile,
      city,
      age,
      password: hashedPassword,
      firstname,
      lastname,
      stateName,
      pic,
      isAdmin
    });

    await user.save();
    res.json({ message: "User registered successfully" });

  } catch (err) {
    console.error("Error saving user:", err);
    res.status(500).json({ error: "Failed to save user" });
  }
});



router.post('/signin',(req,res)=>{
    const {email,password, userItem} = req.body
    console.log(req.body)
    if(!email || !password){
       return res.status(422).json({error:"please add email or password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
           return res.status(422).json({error:"Invalid Email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                // res.json({message:"successfully signed in"})
                const isAdmi = (userItem === 'Admin');

                        // Update savedUser with isAdmin
                savedUser.isAdmin = isAdmi;
                savedUser.save();
               const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
               const {_id, firstname,lastname,stateName,email,pic,mobile,city,age,isAdmin} = savedUser
               res.json({token,user:{_id, firstname,lastname,stateName,email,pic,mobile,city,age,isAdmin}})
            }
            else{
                return res.status(422).json({error:"Invalid Email or password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})


router.put('/updatepic',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},{new:true},
        (err,result)=>{
         if(err){
             return res.status(422).json({error:"pic canot post"})
         }
         res.json(result)
    })
})


module.exports = router