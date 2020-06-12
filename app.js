const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const bodyParser = require('body-parser');
const generateToken = require('./utils');
const todos = require('./todo');
require('dotenv').config({ path: path.join(__dirname, ".env") })

const app = express();

app.use(bodyParser.json());
app.use(express.json());

const port = 5000 || process.env.PORT;
let refreshTokens = [];

//test route that gets all totos
app.get('/', (req, res) => {
    todos.all((err, todos) => {
        if (err) res.sendStatus(404)
        res.status(200).json(todos);
    })
});

//Test api route to check if server is up n responding
app.get('/api', (req, res) => {
    res.json({
        message: "Hello deeeeeps..."
    })
});

//Middleware that verifies token 
function checkToken(req, res, next) {

    const refreshToken = req.body.token;
    const tokenHeader = req.get('authorization') || req.headers['authorization'];
    const token = tokenHeader && tokenHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(403).json({ Error: "You need to login" });
    } else {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
            if (err) {
                jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
                    if (err) {
                        res.sendStatus(403);
                    } else {
                        return res.json({ accessToken: generateToken(req, "access") });  //if access token is expired then get new one with refresh token
                    }
                })
            }
            req.username = data;
            next();
        })
    }
};


//Login route, generates new access and refresh tokens
app.post('/api/login', (req, res) => {
    let accessToken = generateToken(jwt, req, "access");
    let refreshToken = generateToken(jwt, req, "refresh");
    refreshTokens.push(refreshToken);
    req.header.authorization = accessToken;
    res.json({ accessToken, refreshToken });
});

// A middleware that checks for Authorization is headers, if not present responds with Error message
app.use((req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).json({ error: 'No credentials found!' });
    }
    next();
});

// Protected route, goes through verification middleware to check if user is logged in then responds
app.post('/api/posts', checkToken, (req, res) => {
    let newTodo = req.body;
    console.log(newTodo)
    todos.add(newTodo);
    res.status(201).json({ msg: "New todo added..." });
});

//update specific todo
app.put('/api/posts/:id', checkToken, (req, res) => {
    let id = req.params.id;
    todoToUpdate = req.body;
    todoToUpdate.id = Number.parseInt(id);
    todos.update(todoToUpdate, (err, data) => {
        err ? res.status(404, "Todo not found").send()
            : res.status(200).send(data)
    })
});

//delete specific todo
app.delete('/api/posts/:id', checkToken, (req, res) => {
    let id = Number.parseInt(req.params.id);
    todos.delete(id, (err, data) => {
        err ? res.status(404, "Todo Not found").send()
            : res.status(200).send("Deleted Todo Successfully")
    })
});

//Access token expires in 60 seconds, subsequent requests will use refresh token to renew access token
app.post('/api/refresh', (req, res) => {
    const refreshToken = req.body.token;
    if (!refreshToken) return res.sendStatus(401);

    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
        if (err) res.sendStatus(403);
        res.json({ accessToken: generateToken(req, "access") })
    })
});

// Delete the current refresh token so that once access token expires, session wont get renewed
app.delete('/api/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    req.sendStatus(204)
});

//Server and the port
app.listen(port, () => {
    console.log("Server listening on port 5k...")
});

module.exports = app;