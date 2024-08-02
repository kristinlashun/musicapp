/*
    SETUP
*/
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var app = express();
PORT = 9134;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// File paths
const songsFilePath = path.join(__dirname, 'data', 'songs.json');

// Helper function to read data from JSON file
function readData(filePath) {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        return JSON.parse(data);
    }
    return [];
}

// Helper function to write data to JSON file
function writeData(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

/*
    ROUTES
*/

// Serve the index.html at the root URL
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Add Song
app.post('/add-song', function(req, res) {
    console.log('Add Song - Request Body:', req.body); // Debugging statement
    let { title, artist, album, genre } = req.body;
    if (!title || !artist || !album || !genre) {
        console.error('Add Song - Missing parameters:', { title, artist, album, genre }); // Debugging statement
        return res.status(400).send({ error: "Missing parameters" });
    }
    let songs = readData(songsFilePath);
    console.log('Current Songs:', songs); // Debugging statement
    let newSong = { id: songs.length + 1, title, artist, album, genre };
    songs.push(newSong);
    writeData(songsFilePath, songs);
    console.log('Updated Songs:', songs); // Debugging statement
    res.status(200).send({ message: "Song added successfully!" });
});

// Search Songs
app.get('/search-songs', function(req, res) {
    console.log('Search Songs - Query:', req.query.q); // Debugging statement
    let query = req.query.q;
    if (!query) {
        console.error('Search Songs - Missing query parameter'); // Debugging statement
        return res.status(400).send({ error: "Missing query parameter" });
    }
    let songs = readData(songsFilePath);
    let results = songs.filter(song => 
        song.title.includes(query) || 
        song.artist.includes(query) || 
        song.album.includes(query) || 
        song.genre.includes(query)
    );
    console.log('Search Results:', results); // Debugging statement
    if (results.length > 0) {
        res.status(200).json(results);
    } else {
        res.status(404).send({ message: "No songs found" });
    }
});

// Tag Songs
app.post('/tag-song', function(req, res) {
    console.log('Tag Song - Request Body:', req.body); // Debugging statement
    let { songId, tags } = req.body;
    if (!songId || !tags) {
        console.error('Tag Song - Missing parameters:', { songId, tags }); // Debugging statement
        return res.status(400).send({ error: "Missing parameters" });
    }
    let songs = readData(songsFilePath);
    let song = songs.find(song => song.id == songId);
    if (song) {
        song.tags = tags;
        writeData(songsFilePath, songs);
        console.log('Updated Songs with Tags:', songs); // Debugging statement
        res.status(200).send({ message: "Song tagged successfully!" });
    } else {
        res.status(404).send({ error: "Song not found" });
    }
});

/*
    LISTENER
*/
app.listen(PORT, function() {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
