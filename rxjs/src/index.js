import express from "express";
import fetch from "node-fetch";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  fetch("file.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
