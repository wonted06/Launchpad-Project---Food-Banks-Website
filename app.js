const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt'); // bcrypt: hashing 

//if we use json, and also put it in /public 
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//if we use ejs, and also put it in /src
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src'));

app.get('/', (_req, res) => {
    res.render('main');
});

app.listen(3001, () =>{
    console.log('Server is running on port 3001');
    console.log('Visit http://localhost:3001 to see your app')
})