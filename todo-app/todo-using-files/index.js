const fs = require("fs");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

todos = []

fs.readFile("data.json" , "utf-8" , (err,data) => {
    todos = JSON.parse(data);
    console.log(todos)
})

function findIndex(arr,id){
    for(let i=0 ; i < arr.length ; i ++){
        if(arr[i].id == id)return i;
    }
    return -1;
}

function removeIndex(arr,id){
    let newArr = []
    for(let i = 0; i < arr.length ; i++){
        if(i != id){
            newArr.push(arr[i]);
        }
    }
    return newArr;
}


app.get('/todos', (req,res) =>{
    res.send(todos); 
});

app.post('/todos',(req,res) =>{
    const newTodo = {
        id: Math.floor(Math.random() * 1000000),
        title: req.body.title,
        description:req.body.description
    } 

    todos.push(newTodo);
    fs.writeFile("data.json",JSON.stringify(todos), (err)=>{
        if(err) throw err;
        res.status(200).json("posted successfully");
    });
    
});

app.delete('/deleteTodo',(req,res) => {
    const id = parseInt(req.body.id);
    let indextodelete = findIndex(todos,id);
    if(indextodelete != -1){
        todos = removeIndex(todos,indextodelete);
        fs.writeFile("data.json",JSON.stringify(todos), (err)=>{
            if(err) throw err;
            res.status(200).json("deleted successfully");
        });
    }
    else {
        res.send("entry not present");
    }
    
});

app.put('/updateTodo',(req,res) =>{
    const id = parseInt(req.body.id);
    let indextoupdate = findIndex(todos,id);
    if(indextoupdate != -1){
        todos[indextoupdate].title = req.body.title;
        todos[indextoupdate].description = req.body.description;
        fs.writeFile("data.json",JSON.stringify(todos), (err)=>{
            if(err) throw err;
            res.status(200).json("updated successfully");
        });
    }
    else res.send("entry not found");

});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

