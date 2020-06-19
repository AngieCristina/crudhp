const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const app = express();

MongoClient.connect(
  "mongodb+srv://harry:potter@cluster0-e4msk.mongodb.net/harry?retryWrites=true&w=majority",
  {
    useUnifiedTopology: true,
  }
).then((client) => {
  console.log("Connected to Database");
  const db = client.db("harry-potter-quotes");
  const quotesCollection = db.collection("quotes");
  //create a server that browsers can connect to. by using the Express’s listen method.
  app.listen(3000, function () {
    console.log("listening on 3000");
  });
  app.set("view engine", "ejs");
  //Body-parser is a middleware. They help to tidy up the request object before I use them
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(express.static("public"));

  //This is how Express handles a GET request (READ operation) in a nutshell.
  app.get("/", (req, res) => {
    db.collection("quotes")
      .find()
      .toArray()
      .then((results) => {
        res.render("index.ejs", { quotes: results });
      })
      .catch((error) => console.error(error));
  });
  app.post("/quotes", (req, res) => {
    quotesCollection
      .insertOne(req.body)
      .then((result) => {
        res.redirect("/");
      })
      .catch((error) => console.error(error));
  });
  app.put('/quotes', (req, res) => {
    console.log(req.body)
  })
});
