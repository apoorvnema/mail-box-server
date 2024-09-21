const express = require('express');
const bodyParser = require("body-parser");
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:5173"
}));
dotenv.config();

const userRoute = require("./routes/user");
const mailRoute = require("./routes/mail");

app.use('/user', userRoute);
app.use('/mail', mailRoute);

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(process.env.PORT || 3000, () => {
            console.log("Server running on port 3000");
        })
    })
    .catch(err => console.error(err))

