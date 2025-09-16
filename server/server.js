const dotenv = require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');  

const app = express();
const port = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
    });
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Error connecting to MongoDB", err);
});