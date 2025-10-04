const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

// Serve static files (HTML, CSS, JS, Images)
app.use(express.static(__dirname));

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// SQLite database setup
const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error("Database opening error: ", err);
    } else {
        console.log("✅ Connected to SQLite database.");
    }
});

// Create bookings table if not exists
db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    destination TEXT NOT NULL,
    people TEXT NOT NULL,
    arrival TEXT NOT NULL,
    leaving TEXT NOT NULL,
    details TEXT NOT NULL
)`);

// Route: Serve HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'tour.html'));
});

// Route: Handle Booking Form Submission
app.post('/book', (req, res) => {
    const { destination, people, arrival, leaving, details } = req.body;

    const query = `INSERT INTO bookings (destination, people, arrival, leaving, details) VALUES (?, ?, ?, ?, ?)`;
    const values = [destination, people, arrival, leaving, details];

    db.run(query, values, function (err) {
        if (err) {
            console.error("❌ Error inserting data: ", err.message);
            res.status(500).send("Internal Server Error: Could not save booking.");
        } else {
            console.log("✅ Booking saved with ID:", this.lastID);
            res.send(`<h2 style="color:green;">✅ Booking Successful!</h2><a href='/'>Go Back</a>`);
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Server is running at: http://localhost:${port}`);
});
