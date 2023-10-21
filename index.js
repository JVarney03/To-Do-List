import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const port = 3000

//Lists used to populate ejs templates
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




//Update todo lists with database data

async function populateData (model, list) {
    //Empty list
    list.length = 0;
    //Get all Todos
    const data = await model.find();
    //If there is more todos in the database then in the local list add new todos
    for (let i = 0; i < data.length; i++) {
        list.push(data[i]);
    }
}







//Redirect to today
app.get("/", (req, res) => {
    res.redirect("/today");
});

//Today page
app.get("/today", async (req, res) => {
    //update data
    await populateData(HomeToDo, todayList);
    //render page
    res.render("index.ejs", 
    {
        taskList: todayList,
        page: "today"
    });
});

//Work page
app.get("/work", async (req, res) => {
    //update data
    await populateData(WorkToDo, workList);
    //render page
    res.render("index.ejs", 
    {
        taskList: workList,
        page: "work"
    });
});



//Today form submit
app.post("/submit", async (req, res) => {
    let model = null
    if (req.body.page === "today") {
        model = HomeToDo;
    } else if (req.body.page === "work") {
        model = WorkToDo;
    }
    
    //Create new todo object
    const newToDo = new model({ taskName: req.body.tName, taskDescription: req.body.tDescription});
    //Save to database
    await newToDo.save();
    //Redirect to work page
    res.redirect("back");
});

//Work form submit
app.post("/submit-work", async (req, res) => {
    //Create new todo object
    const newToDo = new WorkToDo({ taskName: req.body.tName, taskDescription: req.body.tDescription});
    //Save to database
    await newToDo.save();
    //Redirect to work page
    res.redirect("back");
})


//Today delete todo
app.post("/delete-today", async (req, res) => {
    try {
        await HomeToDo.deleteOne({_id: req.body.checkbox})
    } catch(error) {
        console.log(error);
    }
    res.redirect("back");
    
});

//Work delete todo
app.post("/delete-work", async (req, res) => {
    try {
        await WorkToDo.deleteOne({_id: req.body.checkbox})
    } catch(error) {
        console.log(error);
    }
    res.redirect("back");
    
});

app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});