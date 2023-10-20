import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000

let todayList = [];
let workList = [];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));



app.get("/", (req, res) => {
    res.redirect("/today");
});

app.get("/today", (req, res) => {
    res.render("index.ejs", 
    {
        taskList: todayList,
        page: "today"
    });
});

app.get("/work", (req, res) => {
    res.render("index.ejs", 
    {
        taskList: workList,
        page: "work"
    });
});

app.post("/submit-today", (req, res) => {
    todayList.push([req.body["tName"], req.body["tDescription"]]);
    res.redirect("back");
});

app.post("/submit-work", (req, res) => {
    workList.push([req.body["tName"], req.body["tDescription"]]);
    res.redirect("back");
})

app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});