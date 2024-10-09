// Load environment variables from .env file
// require('dotenv').config();
// Define a route for the root path

// cors and ejs

// Import express
const express = require('express');
const app = express();
const mysql = require('mysql2');
const dotenv = require('dotenv')

//configuring environment variables
dotenv.config();

//creating a connection object
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

//testing the connection
db.connect((err) => {
  //connection is not successful
  if(err) {
            return console.log("Error connecting to the database:", err)
  }

  //connection is successful
  console.log("Successfully connected to MySQL:", db.threadId)
});

// Defining a route for the root path
app.get('/', (req, res) => {
  res.send('Welcome to the Hospital DB API');
});

// Get all patients
app.get('/patients', (req, res) => {
  const getPatients = "SELECT patient_id, first_name, last_name, date_of_birth FROM patients";
  // if i have an error
  db.query(getPatients, (err, results) => {
    if (err) {
      return res.status(500).send("Error retrieving patients: " + err.message);
    }
    res.status(200).send(results);
  });
});

// Get all providers
app.get('/providers', (req, res) => {
  const getProviders = "SELECT first_name, last_name, provider_specialty FROM providers";
  //if i have an error
  db.query(getProviders, (err, results) => {
    if (err) {
      return res.status(500).send("Error retrieving providers: " + err.message);
    }
    res.json(results);
  });
});

// Get patients by first name
app.get('/patients/name/:firstName', (req, res) => {
  const firstName = req.params.firstName;
  const getPatients = "SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?";
  //if i have an error
  db.query(getPatients, [firstName], (err, results) => {
    if (err) {
      return res.status(500).send("Error retrieving patients: " + err.message);
    }
    res.json(results);
  });
});

// Get providers by specialty
app.get('/providers/specialty/:specialty', (req, res) => {
  const specialty = req.params.specialty;
  const getProviders = "SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?";
  // if i have an error
  db.query(getProviders, [specialty], (err, results) => {
    if (err) {
      return res.status(500).send("Error retrieving providers: " + err.message);
    }
    res.json(results);
  });
});



// Example: Route for testing the server
// app.get('/', (req, res) => {
  // res.send('Server is running! I am in London and i am loving it here, come and join me, tongue out');
// });

// Start the server
const PORT = process.env.PORT || 3300;
app.listen(PORT, () => { 
  console.log(`Server running on port ${PORT}`);
});
