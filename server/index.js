// imports
import express from "express";
import morgan from 'morgan';
import cors from 'cors';
import * as dao from './dao.js';

import passport from "passport";
import LocalStrategy from 'passport-local';
import session from 'express-session';

// init express
const app = express();
const port = 3001;

//middlewares
app.use(morgan('dev'));
app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessState: 200,
  credentials: true
}

app.use(cors(corsOptions));

// passport configuration
passport.use(new LocalStrategy(
  async function(username, password, cb) {
    const user = await dao.getUser(username, password);

    if (!user) {
      return cb(null, false, "Incorrect username or password");
    }
    return cb(null, user);
  }
))

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  console.log(req.user)
  return res.status(401).json({error: "Not authorized"});
}

app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.authenticate("session"));


// AUTHENTICATION ROUTES

// 1. POST /api/sessions - Login
app.post("/api/sessions", passport.authenticate("local"), function(req, res) {
  return res.status(201).json(req.user);
});

// 2. GET /api/sessions/current
app.get("/api/sessions/current", (req, res) => {
  if(req.isAuthenticated()) {
    res.json(req.user);}
  else
    res.status(401).json({error: "Not authenticated"});
});

// 3. DELETE /api/sessions/current
app.delete("/api/sessions/current", (req, res) => {
  req.logout(() => {
    res.end();
  });
});


// GAME ROUTES

// 1. GET /api/network
app.get('/api/network', async (req, res) => {
  try {
    const [stations, lines, segments] = await Promise.all([
      dao.getStations(),
      dao.getLines(),
      dao.getSegments()
    ]);

    res.json({ stations, lines, segments} );
  } catch (err) {
      console.error("Error in getting the network.", err);
      res.status(500).end();
  }
})


// 2. GET /api/ranking

app.get("/api/ranking", async (req, res) => {
  try {
    const ranking = await dao.getRanking();
    res.json(ranking);
  } catch (err) {
    console.error("Error in getting the ranking.", err);
    res.status(500).end();
  }
})


// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});