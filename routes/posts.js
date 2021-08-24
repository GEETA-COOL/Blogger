const router = require('express').Router();
const {ensureAuth} = require('../middleware/auth');
const Post = require('../model/post');

// Get /posts/add
router.get('/add',ensureAuth,(req,res)=>{
    res.render('posts/add',{
        layout:'main'
    });
});


// GET --> /posts/:id --> Show single Post
router.get('/:id',async(req,res)=>{
    try{
        let post = await Post.findById(req.params.id)
                             .populate('user')
                             .lean();
        if(!post) return res.send('Error 404');
        res.render('posts/show',{
            post,
        });
    }catch(err){
        console.log(err);
        res.send('Error 404');
    }
})

// POST --> /posts
router.post('/',ensureAuth,async(req,res)=>{
    try{
        req.body.user = req.user.id;
         // console.log(req.body);
         const post = await Post.create(req.body);
        // console.log(post);
        res.redirect('/dashboard');
    } catch(err){
        res.send('Server Error');
    }
});

// GET --> /posts
router.get('/',ensureAuth,async(req,res)=>{
    try{
        const posts = await Post.find({status:'public'})
                                .populate('user')
                                .sort({createdAt:'desc'})
                                .lean();
        console.log(posts);
        res.render('posts/index',{
            posts,
        });
    }catch (err){
        console.log('Error :',err);
    }
});

// GET --> /posts/edit/:id ----->show edit page
router.get('/edit/:id',ensureAuth,async(req,res)=>{
    const post = await Post.findOne({
        _id: req.params.id,
    }).lean();

    if(!post) return res.res('error/404');
    
    if(post.user != req.user.id){
        res.redirect('/posts');
    }else{
        res.render('posts/edit',{
            post,
        });
    }
});

// PUT /posts/:id --->Update Post
router.put('/:id',async(req,res)=>{
    try{
        let post  = await Post.findById(req.params.id).lean();
        if(!post) return res.res('error/404');
    
        if(post.user != req.user.id){
        res.redirect('/posts');
        }else{
        post = await Post.findOneAndUpdate({_id:req.params.id},req.body,{
           new:true,
           runValidators:true
        });
        res.redirect('/dashboard');
    }
    }catch(err){  
        console.log(err);
        return res.send('Error 500');
    }
});

// DELETE --> /posts/:id 
router.delete('/:id',async(req,res)=>{
    try{
        await Post.remove({_id:req.params.id});
        res.redirect('/dashboard');
    }catch(err){  
        console.log(err);
        return res.send('Error 500');
    }
})
module.exports = router;