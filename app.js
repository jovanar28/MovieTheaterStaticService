const express = require("express");
const path = require("path");
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');
const cors=require('cors');
require('dotenv').config();



const { sequelize, User} = require("./models");

const app = express();


//nas middleware

function getCookies(req){
  if (req.headers.cookie == null) return {};

  const rawCookies = req.headers.cookie.split("; ");
  const parsedCookies = {};

  rawCookies.forEach(rawCookie => {
      const parsedCookie = rawCookie.split('=');
      parsedCookies[parsedCookie[0]] = parsedCookie[1];
  });

  return parsedCookies;
}

function authToken(req, res, next){
  const cookies = getCookies(req);
  const token = cookies['token'];

  if(token == null) {
    console.log("asd");
    return res.redirect(301, '/login');
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if(err) return res.redirect(301, '/login');

      req.user = user;

      next();
  });
}

app.use(express.static(path.join(__dirname, "static")));

app.get("/admin",authToken, (req, res) => {
  res.sendFile(path.join(__dirname, "static", "admin_dashboard.html"));
});

app.get("/admin/auditorijumi", authToken, (req, res) => {
  res.sendFile(path.join(__dirname, "static", "auditoriums.html"));
});

app.get("/admin/lokacije", authToken, (req, res) => {
  res.sendFile(path.join(__dirname, "static", "locations.html"));
});

app.get("/admin/filmovi", authToken, (req, res) => {
  res.sendFile(path.join(__dirname, "static", "movies.html"));
});

app.get("/admin/movietheaters", authToken, (req, res) => {
  res.sendFile(path.join(__dirname, "static", "movietheaters.html"));
});

app.get("/admin/payments", authToken, (req, res) => {
  res.sendFile(path.join(__dirname, "static", "payments.html"));
});

app.get("/admin/reservations", authToken, (req, res) => {
  res.sendFile(path.join(__dirname, "static", "reservations.html"));
});

app.get("/admin/roles", authToken, (req, res) => {
  res.sendFile(path.join(__dirname, "static", "roles.html"));
});

app.get("/admin/schedules", authToken, (req, res) => {
  res.sendFile(path.join(__dirname, "static", "schedules.html"));
});

app.get("/admin/seats", authToken, (req, res) => {
  res.sendFile(path.join(__dirname, "static", "seats.html"));
});

app.get("/admin/tickets", authToken, (req, res) => {
  res.sendFile(path.join(__dirname, "static", "tickets.html"));
});

app.get("/admin/users", authToken, (req, res) => {
  res.sendFile(path.join(__dirname, "static", "users.html"));
});

app.get("/admin/menadzeri", authToken, (req, res) => {
  res.sendFile(path.join(__dirname, "static", "managers.html"));
});

app.get("/login", (req,res)=>{
  res.sendFile(path.join(__dirname, 'static', 'login.html'));
});

app.listen({ port: 7000}, async () => {
  console.log("Pokrenut na portu 7000");
});
