const express = require('express');
const path = require('path');
const app = express();

// Set view engine
app.set('view engine', 'ejs');

// Serve static Bootstrap files
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));

// Middleware to parse request bodies (only use Express built-in)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
    res.locals.genres = ['Ifjúsági irodalom', 'Irodalom', 'Számítástechnika'];
    next();
});

// Load routing
require('./routing/index')(app);

// Start server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});