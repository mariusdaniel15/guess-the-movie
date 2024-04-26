
import express from 'express';
import bodyParser from 'body-parser';
import https from 'https';
import { dirname } from 'path';
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function generateRandomQuery() {
    return Math.floor((Math.random() * 100) + 1);
}

let randomQuery = generateRandomQuery();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get("/play", function(req,res){
    randomQuery = generateRandomQuery();
    res.sendFile(__dirname + "/play.html");
});

app.get("/play-data", function(req, res) {
    const options = {
        method: 'GET',
        hostname: 'imdb-top-100-movies.p.rapidapi.com',
        port: null,
        path: `/top${randomQuery}`,
        headers: {
            'X-RapidAPI-Key': '',
            'X-RapidAPI-Host': 'imdb-top-100-movies.p.rapidapi.com'
        }
    };

    const reqApi = https.request(options, function(resApi) {
        let chunks = '';

        resApi.on('data', function(chunk) {
            chunks += chunk;
        });

        resApi.on('end', function() {
            // Parse the received data
            const data = JSON.parse(chunks);
            // Send the received data back to the client
            res.send(data);
        });
    });

    reqApi.on('error', function(error) {
        console.error(error);
        // Handle error responses from the API
        res.status(500).send('Error fetching game data');
    });

    reqApi.end();
});

app.post('/play', (req, res) => {
    const userInput = req.body.movieName.toUpperCase();

    const options = {
        method: 'GET',
        hostname: 'imdb-top-100-movies.p.rapidapi.com',
        port: null,
        path: `/top${randomQuery}`,
        headers: {
            'X-RapidAPI-Key': '',
            'X-RapidAPI-Host': 'imdb-top-100-movies.p.rapidapi.com'
        }
    };

    const reqApi = https.request(options, function(resApi) {
        let chunks = '';

        resApi.on('data', function(chunk) {
            chunks += chunk;
        });

        resApi.on('end', function() {
            // Parse the received data
            const data = JSON.parse(chunks);
            const movieTitle = data.title.toUpperCase();

            // Compare userInput with movieTitle
            const isCorrect = userInput === movieTitle;
            if(isCorrect){
                res.sendFile(__dirname + "/correct.html");}
            else{
                res.sendFile(__dirname + "/try_again.html")
            }
        });
    });

    reqApi.on('error', function(error) {
        console.error(error);
        res.status(500).send('Error fetching game data');
    });

    reqApi.end();
});

app.listen(3000, function() {
    console.log("Server running on port 3000");
});
