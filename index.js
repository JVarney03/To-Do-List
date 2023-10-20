import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const port = 3000

let todayList = [];
let workList = [];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));




//Mongoose setup

//Connect to Database
mongoose.connect('mongodb://127.0.0.1:27017/ToDoDB');

//Schema
const toDoSchema = new mongoose.Schema({
    taskName: String,
    taskDescription: String
});

//Model
const HomeToDo = mongoose.model("HomeToDo", toDoSchema);
const WorkToDo = mongoose.model("WorkToDo", toDoSchema);


//Load database



async function populateData (model, list) {
    const data = await model.find();
    for (let i = list.length; i < data.length; i++) {
        list.push([data[i].taskName, data[i].taskDescription]);
    }
}










app.get("/", (req, res) => {
    res.redirect("/today");
});

app.get("/today", async (req, res) => {
    await populateData(HomeToDo, todayList);
    res.render("index.ejs", 
    {
        taskList: todayList,
        page: "today"
    });
});

app.get("/work", async (req, res) => {
    await populateData(WorkToDo, workList);
    res.render("index.ejs", 
    {
        taskList: workList,
        page: "work"
    });
});

app.post("/submit-today", async (req, res) => {
    const newToDo = new HomeToDo({ taskName: req.body.tName, taskDescription: req.body.tDescription});
    await newToDo.save();
    res.redirect("back");
});

app.post("/submit-work", async (req, res) => {
    const newToDo = new WorkToDo({ taskName: req.body.tName, taskDescription: req.body.tDescription});
    await newToDo.save();
    res.redirect("back");
})

app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});