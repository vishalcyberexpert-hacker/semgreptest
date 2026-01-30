/**
 * Vulnerable JavaScript Application
 * For Semgrep Testing & Security PoC
 * DO NOT USE IN PRODUCTION
 */

const express = require("express");
const fs = require("fs");
const path = require("path");
const child_process = require("child_process");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ❌ Hardcoded credentials
const DB_USER = "admin";
const DB_PASSWORD = "admin123";
const DB_HOST = "localhost";

// ❌ Insecure database connection
const db = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: "testdb"
});

// ❌ SQL Injection vulnerability
app.get("/user", (req, res) => {
    const username = req.query.username;
    const query = "SELECT * FROM users WHERE name = '" + username + "'";
    db.query(query, (err, result) => {
        if (err) {
            res.send("DB Error");
        } else {
            res.json(result);
        }
    });
});

// ❌ Command Injection vulnerability
app.post("/ping", (req, res) => {
    const host = req.body.host;
    child_process.exec("ping -c 1 " + host, (err, output) => {
        if (err) {
            res.send("Execution failed");
        } else {
            res.send(output);
        }
    });
});

// ❌ Path Traversal vulnerability
app.get("/read-file", (req, res) => {
    const filename = req.query.file;
    const filePath = path.join(__dirname, filename);
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            res.send("File not found");
        } else {
            res.send(data);
        }
    });
});

// ❌ Reflected XSS vulnerability
app.get("/search", (req, res) => {
    const q = req.query.q;
    res.send("<h1>Search Result for: " + q + "</h1>");
});

// ❌ Insecure eval usage
app.post("/calculate", (req, res) => {
    const expression = req.body.expr;
    try {
        const result = eval(expression);
        res.send("Result: " + result);
    } catch (e) {
        res.send("Invalid expression");
    }
});

// ❌ Weak authentication check
app.post("/login", (req, res) => {
    const user = req.body.user;
    const pass = req.body.pass;

    if (user == "admin" && pass == "password") {
        res.send("Login successful");
    } else {
        res.send("Login failed");
    }
});

// ❌ Information disclosure
app.get("/debug", (req, res) => {
    res.json(process.env);
});

// Server start
app.listen(3000, () => {
    console.log("Vulnerable app running on port 3000");
});
