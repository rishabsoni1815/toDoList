const express = require("express");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://admin:abcd@cluster0.lmetb.mongodb.net/todolistDB",
  //use password as alphabets as special characters are encoded (@ as %40)
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const itemSchema = {
  name: String,
};
const Item = mongoose.model("Item", itemSchema);
const item1 = new Item({
  name: "Hi! Sir the tasks scheduled for today are ",
});
const Tasks = [item1];

app.get("/", function (req, res) {
  Item.find({}, function (err, foundedItems) {
    if (foundedItems.length == 0) {
      Item.insertMany(Tasks, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved items to database");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { newListItems: foundedItems });
    }
  });
});
app.post("/", function (req, res) {
  const itemName = req.body.input;
  if (itemName.length != 0) {
    const item = new Item({
      name: itemName,
    });
    item.save();
  } else {
  }
  res.redirect("/");
});

app.post("/delete", function (req, res) {
  const check = req.body.checkbox;
  Item.findByIdAndDelete(check, function (err) {
    if (!err) {
      console.log("Successfully deleted");
    }
    res.redirect("/");
  });
});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3001;
}
app.listen(port, function () {
  console.log("Listening to port 3001");
});
