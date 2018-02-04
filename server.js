const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const Bear = require("./Bears/BearModel.js");

const port = 5000;
const server = express();

server.use(bodyParser.json());

server.get("/", (req, res) => {
  res.status(200).json({ message: "api running" });
});

server.post("/api/bears", (req, res) => {
  const bearInformation = req.body;

  if (!bearInformation.species || !bearInformation.latinName) {
    res
      .status(400)
      .json({
        error: "please provide both species and latinName for the bear"
      });
  } else {
    const bear = new Bear(bearInformation);
    bear
      .save()
      .then(newBear => {
        res.status(201).json(newBear);
      })
      .catch(error => {
        res.status(500).json({
          error: "there was an error while saving the bear to the database"
        });
      });
  }
});

server.get("/api/bears", (req, res) => {
  Bear.find({})
    .then(bears => {
      res.status(200).json(bears);
    })
    .catch(() => {
      res
        .status(500)
        .json({ error: "The informnation could not be retrieved" });
    });
});

server.get("/api/bears/:id", (req, res) => {
  const { id } = req.params;
  Bear.findById(id)
    .then(bear => {
      res.status(200).json(bear);
    })
    .catch(error => {
      res.status(500).json({ error: "the information could not be retrieved" });
    });
});

mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost:27017/Bears")
  .then(() => {
    console.log(`Database connected successfully`);
  })
  .catch(error => {
    console.log(`Database connection failed: ${error}`);
  });

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
