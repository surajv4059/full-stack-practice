const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.json());
let TODOS = [];

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
    res.send(TODOS); 
});

app.post('/todos',(req,res) =>{
    const newTodo = {
        id: Math.floor(Math.random() * 1000000),
        title: req.body.title,
        description:req.body.description
    } 
    TODOS.push(newTodo);
    res.send(newTodo);
});

app.delete('/deleteTodo',(req,res) => {
    const id = parseInt(req.body.id);
    let indextodelete = findIndex(TODOS,id);
    if(indextodelete != -1){
        TODOS = removeIndex(TODOS,indextodelete);
        res.send("Deleted");
    }
    else {
        res.send("entry not present");
    }
    
});

app.put('/updateTodo',(req,res) =>{
    const id = parseInt(req.body.id);
    let indextoupdate = findIndex(TODOS,id);
    if(indextoupdate != -1){
        TODOS[indextoupdate].title = req.body.title;
        TODOS[indextoupdate].description = req.body.description;

        res.send("updated");
    }
    else res.send("entry not found");

});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});