const epxress = require("express");
const app = epxress();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

module.exports = app;
