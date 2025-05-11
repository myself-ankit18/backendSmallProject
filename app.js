const express = require('express');
const app = express();
const path = require('path');
const userModel = require('./models/user')

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"public")));
app.set('view engine','ejs');

app.get("/",(req,res)=>{
    res.render("index");
})
app.get("/read",async (req,res)=>{
    let users = await userModel.find();
    res.render('read',{users: users})
})

app.get("/edit/:userid",async (req,res)=>{
    let user = await userModel.findOne({_id:req.params.userid})
    res.render("edit",{user:user})
})

app.post("/update/:userid",async (req,res)=>{
    let {imgurl,name,email} = req.body;
    let user = await userModel.findOneAndUpdate({_id:req.params.userid},{
        image: imgurl,
        name: name,
        email:email
    },{new:true})
    res.redirect("/read");
})

app.get("/delete/:id",async (req,res)=>{
    let users = await userModel.findOneAndDelete({_id: req.params.id});
    res.redirect("/read");
})
app.post("/create",async (req,res)=>{
    let {name, email, imgurl} = req.body;
    let user = await userModel.create({
        name: name,
        email: email,
        image: imgurl
    })
    res.redirect("/read");
})

app.listen(3000,()=>{
    console.log("server running");
})