let express = require("express");
let app = express();
let mongoose = require("mongoose");
let bodyPaser = require("body-parser");
let route = require("./routes/route")
let multer = require("multer")

app.use(bodyPaser.json());
app.use(multer().any())


mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://Suman-1432:Suman1432@cluster0.bkkfmpr.mongodb.net/Godamwale_Assignment").then((res) => {
    console.log("Mongo DB is connected successfully")
}).catch((err) => {
    console.log(err)
})


app.use("/", route)

app.use((req, res, next) => {
    res.status(404).send({
        status: false,
        message: `not found ${req.url}`
    });
    next();
})

let port = 5000;
app.listen(port, (err) => {
    if (!err) {
        console.log(`Connected to port no ${port}`)
    } else {
        console.log("ERROR")
    }
})