require('dotenv').config()

console.log(process.env)
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json())
app.use(cors())

const posts = [
    {
        username: 'John',
        title: 'post 1'
    },
    {
        username: 'Jack',
        title: 'post 2'
    }
]

app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name))
})

app.post('/login', (req, res) => {

    const username = req.body.username
    const user = { name: username }
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({ accessToken: accessToken })
})

function authenticateToken(req, res, next) {
    let authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split(' ')[1];

    // Log the secret even if the token is missing:
    // console.log(process.env.ACCESS_TOKEN_SECRET);
    // console.log(token)
    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log(err);
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}

const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '',
    database: 'testdb'
})

app.get('/', (re, res) => {
    return res.json("From Backend side");
})

app.get('/gegevens', (req, res) => {
    const sql = "SELECT * FROM gegevens";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.listen(8081, () => {
    console.log("listening");
})