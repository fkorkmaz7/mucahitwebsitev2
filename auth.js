const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const session = require("express-session");

// Use body-parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// Session setup
router.use(
    session({
        secret: "kartal712",
        resave: false,
        saveUninitialized: true,
    })
);

// Simulated user for demonstration purposes
const user = {
    username: "admin",
    password: "password", // In a real application, make sure to hash passwords
};

router.get("/", (req, res) => {
    res.redirect("/admin");
});

// Login route
router.get("/login", (req, res) => {
    res.render("login", { errorMessage: null }); // Render login form
});

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === user.username && password === user.password) {
        req.session.user = username; // Set user in session
        return res.redirect("/admin");
    }

    res.render("login", { errorMessage: "Lütfen tekrar deneyin" }); // Show error message
});

// Logout route
router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Failed to logout");
        }

        res.redirect("/login");
    });
});

// Middleware to protect admin routes
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect("/login");
};

router.use("/admin", isAuthenticated); // Apply authentication middleware to /admin routes

module.exports = router;
