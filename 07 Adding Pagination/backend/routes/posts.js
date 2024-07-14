const express = require('express');
const multer = require('multer');

const Post = require("../models/post");

const router = express.Router();

const Mime_Type_Map = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      const isValid = Mime_Type_Map[file.mimetype];
      let error = new Error("Invalid Mime Type");
      if (isValid) {
          error = null;
      }
      cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
      const name = file.originalname.toLowerCase().split('').join('-');
      const ext = Mime_Type_Map[file.mimetype];
      cb(null, name + '-' + Date.now() + '.' + ext);
  }
});
router.post("",multer({storage:storage}).single("image"), 
(req, res, next) => {
  const url = req.protocol + '://' + req.get("host"); 
  const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/"+ req.file.filename,
    });
    post.save().then((createdPost) => {
      res.status(201).json({ message: "Post Added successfully",
         post: {
          ...createdPost,
          id: createdPost._id,
         }
        });
    });
  });
  router.put("/:id",multer({storage:storage}).single("image"), (req, res, next) => {
    let imagePath= req.body.imagePath;
    
    if(req.file){
      const url = req.protocol + '://' + req.get("host"); 
      imagePath = url + "/images/"+ req.file.filename;
    }
    const post = new Post({
      _id:req.body.id, 
      title: req.body.title, 
      content: req.body.content,
      imagePath: imagePath,
    });
    Post.updateOne({ _id: req.params.id }, post).then((result) => {
      res.status(200).json({
        message: "Post updated Successfully!",
      });
    }).catch((err) => { });
  });

  router.get("", (req, res, next) => {
    const pageSize =  +req.query.pageSize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if(pageSize && currentPage){
      postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize)
    }
    postQuery.find().then((documents) => {
      fetchedPosts = documents;
      return Post.countDocuments()
    }).then(count =>{
      res.status(200).json({
        message: "Posts fetched Successfully!",
        posts: fetchedPosts,
        maxPosts: count
      });
    });
  });
  
  router.get("/:id", (req, res, next) => { 
    Post.findById(req.params.id).then((post) => {
      if(post) {
        res.status(200).json(post);
  
      }else {
        res.status(404).json({ message: "Post not found!" });
      }
    })
  })

  
  router.delete("/:id", (req, res, next) => {
    Post.deleteOne({ _id: req.params.id })
      .then((result) => {
        res.status(200).json({
          message: "Post deleted Successfully!",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });

module.exports = router;