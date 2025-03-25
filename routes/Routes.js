import express from 'express';
import PostModel from "../Models/PostModel.js";
import UserModel from "../Models/UserModel.js"
import CommentModel from "../Models/CommentModel.js"
import BoardModel from "../Models/BoardModel.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";



const router = express.Router();



function isLoggedIn(req, res, next) {
    if (req.cookies.UserToken === "" || Object.keys(req.cookies).length === 0) res.redirect('/');
    else {
        let data = jwt.verify(req.cookies.UserToken,process.env.JWT_SECRET);
        req.user = data; //creating a user field in req and saving data in it,
        // so if we need user data in and protected route, we can directly get the user from this req
        next();
    }

}

function redirectIfLoggedIn(req, res, next) {

    try {
        const token = req.cookies.UserToken;
        if (token) {
            const data = jwt.verify(token, process.env.JWT_SECRET);
            return res.redirect('/home');
        }
    } catch (err) {
        console.log("Invalid token, allowing access to login/signup.");
    }

    next();
}


router.post('/create',async (req, res) => {

    try{
        const {email,password,fullname,username} = await req.body;
        const foundUser = await UserModel.findOne({email});

        if(foundUser){
            res.status(401).json({error:"User already exists"});
        }
        bcrypt.hash(password, 10, async function(err, hash) {
            const CreatedUser = await UserModel.create({
                email,
                fullname,
                username,
                password: hash,
            })
            // console.log(CreatedUser);
            let token = jwt.sign({email:email,userid:CreatedUser._id},process.env.JWT_SECRET);
            res.cookie('UserToken',token);
            res.redirect('/');
        });



    }
    catch(err){
        res.json({error:err.message});
    }




})


router.post('/login', async (req, res) => {
    try{
        const {email,password} = req.body;
        const FoundUser = await UserModel.findOne({email});

        if (!FoundUser) {
            res.status(401).json({error:"User Doesn't Exist"});
        }
        if(FoundUser){
            bcrypt.compare(password, FoundUser.password, function(err, result) {
                    if (result) {
                        res.cookie('UserToken',"");
                        let token = jwt.sign({email:email,userid:FoundUser._id},process.env.JWT_SECRET);
                        res.cookie('UserToken',token);
                        res.redirect('/home');
                    }else{
                        return res.status(401).json({error:"Email or Password is incorrect"});
                    }
            });
        }


    }
    catch(err){
        res.status(401).json({error:err.message});
    }

})

router.post('/post', isLoggedIn, async (req, res) => {
    try {
        const { url, title, desc } = req.body;

        if (!url || !title) {
            return res.status(400).json({ error: "Image (url) and title are required" });
        }

        const FoundUser = await UserModel.findById(req.user.userid);
        if (!FoundUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const CreatedPost = await PostModel.create({
            image: url,
            title,
            description: desc,
            createdBy: req.user.userid
        });

        FoundUser.posts.push(CreatedPost._id);
        await FoundUser.save();
        res.status(201).json({ message: "Post created successfully", redirect: "/home" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.post('/like/:id', isLoggedIn, async (req, res) => {
    try{
        const FoundPost = await PostModel.findById(req.params.id)
        if (FoundPost.likes.includes(req.user.userid)){
            await FoundPost.likes.pull(req.user.userid);
            await FoundPost.save();
            return res.redirect(`/posts/${req.params.id}`);
        }
        await FoundPost.likes.push(req.user.userid);
        await FoundPost.save();
        res.redirect(`/posts/${req.params.id}`);
    }
    catch(err){
        res.status(401).json({error:err.message});
    }
})

router.post("/commentlike/:id/:PostId", isLoggedIn, async (req, res) => {
            try{
            const FoundComment = await CommentModel.findById(req.params.id);
            if (FoundComment.likes.includes(req.user.userid)){
                await FoundComment.likes.pull(req.user.userid);
                await FoundComment.save();
                return res.redirect(`/posts/${req.params.PostId}`);
            }
            await FoundComment.likes.push(req.user.userid);
            await FoundComment.save();
            res.redirect(`/posts/${req.params.PostId}`);
            }catch(err){
                res.status(401).json({error:err.message});
            }
})


router.post('/comment/:id', isLoggedIn, async (req, res) => {
            try {
                const FoundPost = await PostModel.findById(req.params.id);
                if (!FoundPost) res.status(401).json({error:"Post Doesn't Exist"});

                const CreatedComment = await CommentModel.create({
                    user: req.user.userid,
                    post: FoundPost._id,
                    text: req.body.comment,
                })
                    res.redirect(`/posts/${req.params.id}`);
            }
            catch(err){
                res.status(401).json({error:err.message});
            }
})



router.post('/profile/update', isLoggedIn, async (req, res) => {
    try{
        const {dp, fullname, username} = req.body;
        const FoundUser = await UserModel.findByIdAndUpdate(req.user.userid, { dp, fullname, username }, { new: true });
        if (!FoundUser) {
            res.status(401).json({error:"User not found"});
        }
        res.redirect('/');

    }catch(err){
        res.status(401).json({error:err.message});
    }

})

router.post('/deletecomment/:id/:PostId', isLoggedIn, async (req, res) => {
    try{
        await CommentModel.findByIdAndDelete(req.params.id);
        res.redirect(`/posts/${req.params.PostId}`);
    }catch(err){
        res.status(401).json({error:err.message});
    }

})


router.post("/createBoard", isLoggedIn, async (req, res) => {
    try{
        const CreatedBoard = await BoardModel.create({
            user: req.user.userid,
        })
        const FoundUser = await UserModel.findById(req.user.userid);
        await FoundUser.Boards.push(CreatedBoard._id);
        await FoundUser.save();
        res.redirect('/profile')
    }catch(err){
        res.status(401).json({error:err.message});
    }
})


router.post("/savepin/:id", isLoggedIn, async (req, res) => {
    try{
        const LoggedInUser = await UserModel.findById(req.user.userid);
        if (LoggedInUser.pins.includes(req.params.id)) {
            await LoggedInUser.pins.pull(req.params.id);
            await LoggedInUser.save();
            return res.redirect(`/posts/${req.params.id}`)
        }
        await LoggedInUser.pins.push(req.params.id);
        await LoggedInUser.save();
        res.redirect(`/posts/${req.params.id}`)
    }catch(err){
        res.status(401).json({error:err.message});
    }
})


router.post("/saveBoard/:BoardId/:PostId", isLoggedIn, async (req, res) => {
    try{
        const FoundBoard = await BoardModel.findById(req.params.BoardId);
        if (FoundBoard.post.includes(req.params.PostId)) {
            await FoundBoard.post.pull(req.params.PostId);
            await FoundBoard.save();
            return res.redirect(`/posts/${req.params.PostId}`)
        }
        await FoundBoard.post.push(req.params.PostId);
        await FoundBoard.save();
        res.redirect(`/posts/${req.params.PostId}`)
    }catch(err){
        res.status(401).json({error:err.message});
    }
})

router.post("/editboard/:id", isLoggedIn, async (req, res) => {
    try{
        await BoardModel.findByIdAndUpdate(req.params.id,{
            title: req.body.boardName,
        });
        res.redirect(`/profile`);
    }catch(err){
        res.status(401).json({error:err.message});
    }
})

router.get("/getuser", isLoggedIn, async (req, res) => {
    res.json(req.user);
})

router.get('/', redirectIfLoggedIn,async (req, res) => {
    res.render("login")
})

router.get('/postcreate', isLoggedIn, async (req, res) => {
    res.render("createpost")
})


router.get('/signup', redirectIfLoggedIn,async (req, res) => {
    res.render("signup")
})



router.get('/profile', isLoggedIn, async (req, res) => {
    const User = await UserModel.findById(req.user.userid)
        .populate("posts")
        .populate({
            path: "Boards",
            populate: {
                path: "post",
            },
        });
     res.render("profile",{User});
})

router.get('/logout', isLoggedIn, async (req, res) => {
    res.clearCookie('UserToken');
    res.redirect('/');
})


router.get('/home', isLoggedIn, async (req, res) => {
    const posts = await PostModel.find().sort({createdAt: -1});
    const User = await UserModel.findById(req.user.userid);

   res.render('home', {posts,User});
})

router.get('/editprofile', isLoggedIn, async (req, res) => {
    const user = await UserModel.findById(req.user.userid);
res.render("editprofile",{user})
})


router.get('/posts/:id', isLoggedIn, async (req, res) => {
    const Post = await PostModel.findById(req.params.id).populate("createdBy");
    const User = await UserModel.findById(req.user.userid).populate("Boards").populate("pins");
    const Comment = await CommentModel.find({post:req.params.id}).populate("user");
    if (!Post) {
        res.status(401).json({error:"Post not found"});
    }

    res.render('post',{Post,User,Comment});
})


router.get('/Createdbyyou', isLoggedIn, async (req, res) => {
    const User = await UserModel.findById(req.user.userid).populate("posts");
    res.render('Createdbyyou',{User});
})

router.get('/yourpins', isLoggedIn, async (req, res) => {
    const User = await UserModel.findById(req.user.userid).populate("pins");
    res.render('Yourpins',{User});
})

router.get('/Board/:id', isLoggedIn, async (req, res) => {
    const User = await UserModel.findById(req.user.userid);
    const Board = await BoardModel.findById(req.params.id).populate("post");

    res.render('Board',{User,Board});
})


router.get("/editboard/:id", isLoggedIn, async (req, res) => {
    const User = await UserModel.findById(req.user.userid);
    const Board = await BoardModel.findById(req.params.id);
    res.render("EditBoard",{User,Board})
})


router.get('/deletepost/:id', isLoggedIn, async (req, res) => {
    try{
        await PostModel.findByIdAndDelete(req.params.id);
        res.redirect(`/`);
    }
    catch(err){
        res.status(401).json({error:err.message});
    }
})

router.get('/editpost/:id', isLoggedIn, async (req, res) => {
try{
    const FoundPost = await PostModel.findById(req.params.id);
    const User = await UserModel.findById(req.user.userid);
    res.render('editpost',{Post:FoundPost,User:User});
}
catch(err){
    res.status(401).json({error:err.message});
}
})

router.post("/editpost/:id", isLoggedIn, async (req, res) => {
    try{
        await PostModel.findByIdAndUpdate(req.params.id,{title: req.body.PostName});
        res.redirect(`/posts/${req.params.id}`);

    }catch(err){
        res.status(401).json({error:err.message});
    }
})

router.get("/deleteboard/:id", isLoggedIn, async (req, res) => {
    try{
           await BoardModel.findByIdAndDelete(req.params.id);
           res.redirect('/profile');
    }
    catch(err){
        res.status(401).json({error:err.message});
    }
})

export default router;