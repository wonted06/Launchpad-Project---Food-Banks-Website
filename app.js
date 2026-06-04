const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'src', 'public')));

// Register both template engines
app.engine('pug', require('pug').__express);

// Look in src/ (for .ejs) and src/views/ (for .pug)
app.set('views', [
    path.join(__dirname, 'src'),
    path.join(__dirname, 'src', 'views'),
]);
app.set('view engine', 'pug');

// ─── Public pages ────────────────────────────────────────────

app.get('/', (_req, res) => {
    res.render('dashboard'); // 
});


app.listen(3001, () => {
    console.log('Server is running on port 3001');
    console.log('Visit http://localhost:3001 to see your app');
});
