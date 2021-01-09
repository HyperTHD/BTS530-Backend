// ######################################################
// Add dotenv to access sensitive information
require('dotenv').config()

// ######################################################
// Necessary requires
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const HTTP_PORT = process.env.PORT || 8080
const app = express();
const employeeRoutes = require('./routes/routes')
const eventRoutes = require("./routes/eventRoutes")
const blogpostRoutes = require("./routes/blogpostRoutes");
const blogposts = require('./schemas/blogposts');

// ######################################################
// Needed middlewares for parsing data and accepting connection requests from the backend

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

// ######################################################
// Calling the strategy made in the routes and initalizing the web security

passport.use(employeeRoutes.Strategy);
app.use(passport.initialize());

// ######################################################
// Home page and routes

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/index.html"));
});

app.use("/employees", employeeRoutes);

app.use("/events", eventRoutes);

app.use("/blogposts", blogpostRoutes);

// ######################################################
// Connection function to start the web api

employeeRoutes.Employee.connect().then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`Server started on port ${HTTP_PORT}!`);
    });
}).catch(error => {
    console.log(`Server could not be started`);
    process.exit();
})

