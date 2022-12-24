const express = require('express');
const { v4: uuidv4 } = require("uuid");

const { env } = require('process');

const app = express()

const port = 3000 || env.process.PORT;
app.set('view engine', 'ejs')
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.redirect(`/${uuidv4()}`)
});

app.get("/:room", (req, res) => {
    res.render("room", { roomId : req.params.room });
});

app.listen((port), () => {
    console.log(`Server is listening to port ${port}`);
})