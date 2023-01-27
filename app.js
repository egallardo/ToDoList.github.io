//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});
//schema
const itemsSchema = {
    name: String
}
//model
const Item = mongoose.model("Item", itemsSchema);

//new documents
const item = new Item({
    name: "Welcome to your todolist!"
});


const item2 = new Item({
    name: "Hit the + button to add a new item."
});


const item3 = new Item({
    name: "<-- Hit this to delete an item."
});

const defaultItems = [item, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res){
    Item.find(function(err, foundItems){
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("Successfully saved all the default values to todolistDB");
                }
            });
            res.redirect("/");
        } else {
            res.render("list", { listTitle: "Today", newListItems: foundItems });
        }
    });
});


app.post("/", function(req, res){
    const itemName = req.body.newItem;

    const item = new Item({
        name: itemName
    });
    item.save();
    res.redirect("/");
});

app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox;
    Item.findByIdAndRemove(checkedItemId, function(err){
        if(err){
            console.log(err);
        }else{
            console.log("Item deleted");
        }
    });
    res.redirect("/");
});

app.get("/:customList", function(req, res){
    const customListName = req.params.customList;
    List.findOne({name: customListName}, function(err, foundList){
        if(!err){
            if (!foundList){
            //create a new list
            const list = new List({
                name: customListName,
                items: defaultItems
            });
            list.save();
            res.redirect("/"+customListName);
        }else {
            //show an existing list
            res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
        }
        }
    });
});

app.post("/work", function(req, res){
    const item = req.body.newItem;
    workItems.push(item);
    res.reditect("/work");
});

app.get("/about", function(req, res){
    res.render("about");
})

app.listen(3000, function(){
    console.log("Server started on port 3000");
});

