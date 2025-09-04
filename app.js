const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("Hello from Devtron + Git Flow 🚀"));

app.get("/about", (req, res) => res.send("This is Hello World App - About Page!"));

app.get('/services', (req, res) => {
  res.send('Our Services');
});

app.listen(port, () => console.log(`App running at http://localhost:${port}`));
