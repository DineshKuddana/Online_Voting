const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin  = require('../middleware/requireLogin')
const Post =  mongoose.model("Post")
  
router.get('/allpost',(req,res)=>{
    Post.find()
    .then((posts)=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/posts',(req,res)=>{
    Post.find()
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})



router.post('/createpost',(req,res)=>{
    const {title,pic} = req.body 
    if(!title ){
      return  res.status(422).json({error:"Please add all the fields"})
    }
    // req.user.password = undefined
    console.log('Creating post with data:', { title, photo: pic, postedBy: 'admin' }); // Log data
    const post = new Post({
        title,
        photo:pic,
        postedBy:"admin"
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })
})



router.put('/vote',requireLogin,(req,res)=>{
   
    const {postId,userId} = req.body
    
    Post.findByIdAndUpdate(postId,{
        $push:{votes:userId}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

module.exports = router