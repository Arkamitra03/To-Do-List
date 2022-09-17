const express = require("express");
const bodyParser = require("body-parser");

 const app = express();
 app.set('view engine', 'ejs');
 app.use(bodyParser.urlencoded({extended:true}));
 app.use(express.static("public"));
 //array of to do items
 let items = [];
 app.get("/",function(req,res){
   
    // var currDate = day.getDay();
    // var today="";
    // //6 for saturday and 0 for sunday
    // //getDay() func checks current date 1 for monday 2 for tuesday and so on..
    
    // if(currDate===6) {
    //     today = "Saturday";
    // }
    // else if(currDate===1){
    //     today = "Monday";
    // }
    // else if(currDate===2){
    //     today = "Tuesday";
    // }
    // else if(currDate===3){
    //     today = "Wednesday";
    // }
    // else if(currDate===4){
    //     today = "Thursday";
    // }
    // else if(currDate===5){
    //     today = "Friday";
    // }
    // else{
    //     today = "Sunday";
    // }
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
   let day = new Date();
    //english US format passed in which the date will be returned
   let today = (day.toLocaleDateString("en-US",options));

    res.render("list", {todayDate: today, newItems:items});
   
 });
 app.post("/",function(req,res){
    let item = req.body.newItem;
    items.push(item); //new item entered by user pushed into array of items
    res.redirect("/");
 });

 app.listen(process.env.PORT || 3000,function(){
    console.log("server started on port 3000");
 });