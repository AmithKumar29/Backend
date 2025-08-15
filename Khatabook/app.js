const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

// Path to "hisaab" folder inside project
const hisaabPath = path.join(__dirname, 'hisaab');

// Create "hisaab" folder if it doesn't exist
if (!fs.existsSync(hisaabPath)) {
  fs.mkdirSync(hisaabPath, { recursive: true });
  console.log(`Created folder: ${hisaabPath}`);
}

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Home - List all files
app.get('/', (req, res) => {
  fs.readdir(hisaabPath, (err, files) => {
    if (err) return res.status(500).send(err);
    res.render('index', { files });
  });
});

// Create page
app.get('/create', (req, res) => {
  res.render('create');
});

// Create file
app.post('/createhisaab', (req, res) => {
  const cd = new Date();
  const date = `${cd.getDate()}-${cd.getMonth() + 1}-${cd.getFullYear()}`;
  const filePath = path.join(hisaabPath, `${date}.txt`);
  
  fs.writeFile(filePath, req.body.content, (err) => {
    if (err) return res.status(500).send(err);
    res.redirect('/');
  });
});

// Edit page
app.get('/edit/:filename', (req, res) => {
  const filePath = path.join(hisaabPath, req.params.filename);
  fs.readFile(filePath, 'utf-8', (err, filedata) => {
    if (err) return res.status(500).send(err);
    res.render('edit', { filedata, filename: req.params.filename });
  });
});

// Update file
app.post('/update/:filename', (req, res) => {
  const filePath = path.join(hisaabPath, req.params.filename);
  fs.writeFile(filePath, req.body.content, (err) => {
    if (err) return res.status(500).send(err);
    res.redirect('/');
  });
});

// View file
app.get('/hisaab/:filename', (req, res) => {
  const filePath = path.join(hisaabPath, req.params.filename);
  fs.readFile(filePath, 'utf-8', (err, filedata) => {
    if (err) return res.status(500).send(err);
    res.render('hisaab', { filedata, filename: req.params.filename });
  });
});

// Delete file
app.get('/delete/:filename', (req, res) => {
  const filePath = path.join(hisaabPath, req.params.filename);
  fs.unlink(filePath, (err) => {
    if (err) return res.status(500).send(err);
    res.redirect('/');
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
