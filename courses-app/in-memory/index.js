const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.json());

let ADMINS = []
let COURSES = []
let USERS = []

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



app.get("/admin/courses",adminAuthentication,(Req,res) => {
    res.json({courses:COURSES});
})

app.post("/admin/courses" , adminAuthentication, (req,res) => {
    const course = req.body;
    course.id = Date.now();
    COURSES.push(course);
    res.json({message:"course added successfully" , courseID:course.id});
})

app.put("/admin/courses/:courseId",adminAuthentication, (req,res) => {
    const courseId = parseInt(req.params.courseId);   
    const course = COURSES.find(c => c.id === courseId);
    if(course){
        Object.assign(course,req.body);
        res.json({message:"course updated successfully"});
    }
    else{
        res.status(404).json({message:"course not found"});
    }
}) 

app.post("/admin/signup",(req,res) => {
    const admin = req.body;
    const existingAdmin = ADMINS.find( a =>a.username === admin.username);
    if(existingAdmin){
        res.status(403).json({message:"admin already exist"});
    }
    else{
        ADMINS.push(admin);
        res.json(ADMINS);
    }
})

app.post("/admin/login",adminAuthentication,(req,res) => {
    res.json("logged in successfully");
})


app.post("/user/signup",(req,res) => {
    const user = {...req.body , purchasedCourses: [] };
    USERS.push(user);
    res.send({message:"user created"});
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
        res.json({message:"course purchased successfully"});
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