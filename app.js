 const express = require("express");
 const bodyParser = require("body-parser");
 const mongoose = require("mongoose");
 const _ = require("lodash");
 mongoose.set('strictQuery',true);
 const app = express();
 app.set('view engine', 'ejs');
 app.use(bodyParser.urlencoded({extended:true}));
 mongoose.connect("mongodb://localhost:27017/toDoListdb",{useNewUrlParser:true});
 app.use(express.static("public"));

const itemSchema = new mongoose.Schema({
   name : String
})
const Product = mongoose.model("Item",itemSchema);
const eat = new Product({
   name:"eat"
});
const sleep = new Product({
   name:"sleep"
});
const music = new Product({
   name:"music listen"
});
const arr = [eat,sleep,music];
const listSchema = new mongoose.Schema({
   name : String,
   items : [itemSchema]
});
const List = mongoose.model("List",listSchema);


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
   
   Product.find({},function(err,items){
      if(items.length===0){
         Product.insertMany(arr,function(err){
            if(err){
               console.log(err);
            }
            else{
               console.log("saved");
            }
         });
         res.redirect("/");
      }
      else{
         res.render("list", {listTitle: today, newItems:items});
      }
      
   });

    
   
 });
//  List.deleteMany({name:"work"},function(err){
//    if(err){
//       console.log(err);
//    }
//    else{
//       console.log("deleted");
//    }
//  })
 app.get("/:linkTitle",function(req,res){
   const linkTitle = _.lowerCase(req.params.linkTitle);
   console.log(linkTitle);
   List.findOne({name:linkTitle},function(err,result){
      if(!err){
         if(!result){
            const list = new List({
               name: linkTitle,
               items : arr
            });
            list.save();
            res.redirect("/"+linkTitle);         
         }
         else{
            res.render("list",{listTitle:result.name,newItems:result.items});
         }
         
      }
      else{
         console.log(err);
      }
   })
  
   
 })
//  app.get("/work",function(req,res){
//    res.render("list",{listTitle : "work list", newItems:workItems});
//  });
//  app.post("/work",function(req,res){
//    let item = req.body.newItem;
//    workItems.push(item);
//    res.redirect("/");
//  });
app.post("/delete",function(req,res){
   const id = req.body.deleteItem;
   const deletedItem = req.body.deletedItem;
   if(deletedItem==="today"){
      Product.findByIdAndRemove(id,function(err){
         if(err){
            console.log(err);
         }
         else{
            console.log("successfully removed");
         }
         res.redirect("/");
      })
   }
   else{
      List.findOneAndUpdate({name:deletedItem},{$pull:{items:{_id:id}}},function(err,elements){
          if(!err){
            res.redirect("/"+deletedItem);
          }
      });
   }
   
});

app.post("/",function(req,res){
    let itemName = req.body.newItem;
    let listHead = req.body.list;
    const itemN = new Product({
         name:itemName
    });
    if(listHead==="today"){
      itemN.save();
      res.redirect("/");
    }
   
    else{
      List.findOne({name:listHead},function(err,foundList){
         foundList.items.push(itemN);
         foundList.save();
         res.redirect("/"+listHead);
       
    });
   }
     
   
 });

 app.listen(process.env.PORT || 3000,function(){
    console.log("server started on port 3000");
 });