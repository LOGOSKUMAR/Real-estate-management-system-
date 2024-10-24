// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

// Create an instance of Express
const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection (without useNewUrlParser, useUnifiedTopology)
mongoose.connect('mongodb://127.0.0.1:27017/estateflow')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('MongoDB connection error:', err));

// Define the schema for customer registration
const customerSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    phone: String,
    ownPlot: String,
    location: String,
    startTime: String,
    budget: String
});

// Create a model based on the schema
const Customer = mongoose.model('Customer', customerSchema);

// Define the schema for user sign-up
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

// Create a model based on the user schema
const User = mongoose.model('User', userSchema);

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Support JSON data

// Serve static files
app.use(express.static(path.join(__dirname)));

// Serve the index.html page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve the signup.html page
app.get('/signup.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

// Serve the success.html page
app.get('/success.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'success.html'));
});

// Serve the new.html page
app.get('/new.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'new.html'));
});

// Handle form submission and save customer data to MongoDB (for registration)
app.post('/register', (req, res) => {
    const newCustomer = new Customer({
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        ownPlot: req.body.ownPlot,
        location: req.body.location,
        startTime: req.body.startTime,
        budget: req.body.budget
    });

    newCustomer.save()
        .then(() => {
            res.redirect('/success.html'); // Redirect to success page on successful registration
        })
        .catch(err => {
            console.log(err); // Log the error for better debugging
            res.status(500).send('Error saving data');
        });
});

// Handle sign-up form submission and save user data to MongoDB
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;

    const newUser = new User({
        username,
        email,
        password
    });

    newUser.save()
        .then(() => {
            res.redirect('/success.html'); // Redirect to success page on successful sign-up
        })
        .catch(err => {
            console.error("Error saving user:", err);
            res.status(500).send("Error registering user");
        });
});

// Handle login form submission and show "Login Successful"
app.post('/login', (req, res) => {
    const { email } = req.body;

    // You can add authentication logic here (for now, it's just a simple success message)
    // Assuming the email exists in the database or you have other login verification logic

    // For now, we assume login is always successful
    res.redirect('/new.html'); // Redirect to new.html showing "Login Successful"
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
