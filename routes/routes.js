const express = require('express');
const jwt = require('jsonwebtoken')
const passportJWT = require("passport-jwt");
const employees = require('../schemas/employeemanagers')
const router = express.Router();
const Employee = employees();

// ###################################################### 
// JWT and PassportJWT setup

let ExtractJWT = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJWT.fromAuthHeaderWithScheme("jwt");

jwtOptions.secretOrKey = process.env.JWT_SECRET_KEY

let strategy = new JwtStrategy(jwtOptions, function(payload, next) {
    if (payload) {
        next(null, {_id: payload._id});
    } else {
        next(null, false)
    }
});


// ######################################################
// Employee Routes:

router.get("/", (req, res) => {
    Employee.EmployeesGetAll()
            .then(data => {
                res.json(data)
            })
            .catch(error => {
                res.status(500).json({ "message": error});
            })
});

router.get("/:id", (req, res) => {
    Employee.getEmployeeByID(req.params.id)
            .then(data => {
                res.json(data);
            })
            .catch(error => {
                res.status(404).json({ "message": error});
            })
});

// Logining in
router.post("/login", (req, res) => {
    Employee.EmployeeLogin(req.body)
            .then(data => {
                var payload = {
                    _id: data._id,
                    username: data.username,
                    password: data.password
                };
                var token = jwt.sign(payload, jwtOptions.secretOrKey)
                res.status(200).json({ "message": "Login was successful", token: token });
            })
            .catch(error => {
                res.status(404).json({ "message": "Login was unsuccessful"})
            })
});

// Administrator/Manager routes
// Creating an employee

router.post("/", (req, res) => {
    Employee.EmployeesAdd(req.body)
            .then(data => {
                res.json(data);
            })
            .catch(error => {
                res.status(500).json({"message": error});
            })
});

// Editing an employee

router.put("/:id", (req, res) => {
    Employee.EmployeesEdit(req.body)
            .then(data => {
                res.json(data);
            })
            .catch(() => {
                res.status(404).json({ "message": "Resource not found"});
            })
});

// Deleting an employee

router.delete("/:id" , (req, res) => {
    Employee.EmployeesDelete(req.params.id)
            .then(() => {
                res.status(204).end();
            })
            .catch(error => {
                res.status(500).json({ "message": "Resource not found" })
            })
})


router.Employee = Employee;
router.Strategy = strategy

module.exports = router;