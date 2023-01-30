const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

try {
  mongoose.set("strictQuery", false);
  mongoose.connect("mongodb://localhost:27017/wikiDB", () => {
    console.log("Connected to MongoDB");
  });
} catch (error) {
  console.log(error);
}

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

app
  .route("/articles")
  .get((req, res) => {
    Article.find({}, (err, results) => {
      if (err) return res.send(err);
      res.send(results);
    });
  })
  .post((req, res) => {
    const { title, content } = req.body;

    const newArticle = new Article({
      title,
      content,
    });

    newArticle.save((err) => {
      if (err) return res.send(err);
      res.send("New Article Added");
    });
  })
  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (err) return res.send(err);
      res.send("Articles Deleted");
    });
  });

////////////////////////Requesting Specifi Article///////////////////////

app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    const _articleTitle = req.params.articleTitle;
    Article.findOne({ title: _articleTitle }, (err, result) => {
      if (err) return res.send(err);
      result ? res.send(result) : res.send("Not articles found");
    });
  })
  .put(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      function (err) {
        if (!err) {
          res.send("Successfully updated the selected article.");
        }
      }
    );
  })
  .patch(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send("Successfully updated article.");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }, function (err) {
      if (!err) {
        res.send("Successfully deleted the corresponding article.");
      } else {
        res.send(err);
      }
    });
  });

app.listen(8000, () => {
  console.log("Server started at port 8000");
});
