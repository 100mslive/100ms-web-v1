const express = require("express");
const path = require("path");

const app = express();

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Homepage Route
app.get('/', (req, res) => res.render('index'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
