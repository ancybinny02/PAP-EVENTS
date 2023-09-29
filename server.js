const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());

app.use(bodyParser.json());

app.post("/register", (req, res) => {
    const userData = req.body;

    fs.readFile("users.json", (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error" });
        }

        let users = JSON.parse(data);
        users.push(userData);

        fs.writeFile("users.json", JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Internal server error" });
            }

            console.log("User data saved successfully");
            res.status(200).json({ message: "User data saved successfully" });
        });
    });
});
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    fs.readFile("users.json", (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error" });
        }

        let users = JSON.parse(data);

        const user = users.find((u) => u.email === email && u.password === password);

        if (user) {
            res.status(200).json({ message: "Login successful", user });
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
