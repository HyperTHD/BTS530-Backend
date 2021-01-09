const express = require('express');
const blogposts = require('../schemas/blogpostmanagers');
const router = express.Router();
const BlogPost = blogposts();

// ######################################################
// BlogPost routes

router.get("/", (req,res) => {
    BlogPost.getAllBlogPosts()
          .then(data => {
              res.json(data);
          })
          .catch(error => {
              res.status(500).json({ "message": "Resource not found"})
          })
});

router.get("/:id", (req, res) => {
    BlogPost.getBlogPostByID(req.params.id)
         .then(data => {
             res.json(data);
         })
         .catch(error => {
             res.status(404).json({ "message" : error.message });
         })
});

router.post("/", (req, res) => {
    BlogPost.blogPostAdd(req.body)
         .then(data => {
             res.json(data);
         })
         .catch(error => {
             res.status(400).json({ "message" : error.message });
         })
});

router.put("/:id", (req,res) => {
    BlogPost.blogPostEdit(req.body)
         .then(data => {
             res.json(data);
         })
         .catch(error => {
            res.status(400).json({ "message": error.message });
         })
});


router.delete("/:id", (req, res) => {
    BlogPost.blogPostDelete(req.params.id)
         .then(() => {
             res.status(204).end();
         })
         .catch(error => {
             res.status(500).json({ "message": "Resource not found"});
         }) 
});


module.exports = router;