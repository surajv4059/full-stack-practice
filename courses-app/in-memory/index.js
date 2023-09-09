const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");


const app = express();
const port = 3000;

app.use(bodyParser.json());

let ADMINS = []
fs.readFile("ADMINS.json","utf-8",(err,data) => {
    ADMINS = JSON.parse(data);
})
let COURSES = []
fs.readFile("COURSES.json","utf-8",(err,data) => {
    COURSES = JSON.parse(data);
})
let USERS = []
fs.readFile("USERS.json","utf-8",(err,data) => {
    USERS = JSON.parse(data);
})

function adminAuthentication(req,res,next){
    const {username,password} = req.headers;
    const admin = ADMINS.find(a => a.username == username && a.password == password);
    console.log(admin)
    if(admin){
        req.admin = admin;
        next();
    }
    else{
        res.status(403).json({message:"admin authentication failed"});
    }
}

function userAuthentication(req,res,next){
    const {username,password} = req.headers;
    const user = USERS.find(a => a.username == username && a.password == password);
    console.log(user)
    if(user){
        req.user = user;
        next();
    }
    else{
        res.status(403).json({message:"admin authentication failed"});
    }
}


app.post("/admin/signup",(req,res) => {
    const admin = req.body;
    const existingAdmin = ADMINS.find( a =>a.username === admin.username);
    if(existingAdmin){
        res.status(403).json({message:"admin already exist"});
    }
    else{
        ADMINS.push(admin);
        fs.writeFile("ADMINS.json",JSON.stringify(ADMINS), (err) => {
            if(err) throw err;
            res.json({message:"admin added successfully"});
        });
        
    }
})


app.post("/admin/login",adminAuthentication,(req,res) => {
    res.json("logged in successfully");
})


app.post("/admin/courses" , adminAuthentication, (req,res) => {
    const course = req.body;
    course.id = Date.now();
    COURSES.push(course);
    fs.writeFile("COURSES.json",JSON.stringify(COURSES), (err) => {
        if(err) throw err;
        res.json({message:"course added successfully" , courseID:course.id});
    });
})


app.get("/admin/courses",adminAuthentication,(Req,res) => {
    res.json({courses:COURSES});
})


app.put("/admin/courses/:courseId",adminAuthentication, (req,res) => {
    const courseId = parseInt(req.params.courseId);   
    const course = COURSES.find(c => c.id === courseId);
    if(course){
        Object.assign(course,req.body);

        fs.writeFile("COURSES.json",JSON.stringify(COURSES), (err) => {
            if(err) throw err;
            res.json({message:"course updated successfully"});
        });
    }
    else{
        res.status(404).json({message:"course not found"});
    }
}) 





app.post("/user/signup",(req,res) => {
    const user = {...req.body , purchasedCourses: [] };
    USERS.push(user);
    fs.writeFile("USERS.json",JSON.stringify(USERS), (err) => {
        if(err) throw err;
        res.send({message:"user created"});
    });
})

app.post("/user/login",userAuthentication,(req,res) => {
    res.json({message:"logged in successfully"});
})

app.get("/user/courses",userAuthentication,(req,res) => {
    res.json({courses: COURSES.filter(c => c.published)});
})

app.post("/user/courses/:courseId",userAuthentication,(req,res) => {
    const courseId = parseInt(req.params.courseId);
    const course = COURSES.find(c => c.id ===courseId && c.published);
    if(course){
        req.user.purchasedCourses.push(courseId);
        fs.writeFile("USERS.json",JSON.stringify(USERS), (err) => {
            if(err) throw err;
            res.json({message:"course purchased successfully"});
        });
    }
    else{
        res.json({mesage:"could not find course or course not availabile"});
    }
})

app.get("/user/purchasedCourses",userAuthentication,(req,res) => {
    const purchasedCourses = COURSES.filter(c => req.user.purchasedCourses.includes(c.id));
    res.json({purchasedCourses: purchasedCourses});
})

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});