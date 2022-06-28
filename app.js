const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require("body-parser");
const dotenv = require('dotenv')
// This will allow our presentation layer to retrieve data from this API without
// running into cross-origin issues (CORS)
app.use(cors());
app.use(bodyParser.json());
dotenv.config();
const PORT = process.env.PORT;
const MONGO_ENDPOINT = "mongodb://192.168.10.50:30509/users";
console.log(MONGO_ENDPOINT)
// Connect to running database
mongoose.connect(MONGO_ENDPOINT,
    { useNewUrlParser: true });
const UserSchema = mongoose.Schema({
    name: { type: String },
    email: { type: String }
}, { collection: 'users' });

// Define the mongoose model for use below in method
const User = mongoose.model('User', UserSchema);

function getUserByEmail(email, callback) {
    try {
        User.findOne({ email: email }, callback);
    } catch (err) {
        callback(err);
    }
};
app.get("/users", (req, res) => {
    try {
        User.find({});
    } catch (err) {
        callback(err);
    }
    return res.send(JSON.stringify(User.findOne()));
})

// set the view engine to ejs
app.set('view engine', 'ejs');

// index page 
app.get('/', function (req, res) {
    res.render('home');
});

app.post('/register', function (req, res) {
    const newUser = new User({
        name: req.body.name,
        email: req.body.email
    });

    newUser.save((err, user) => {
        res.status(200).json(user);
    });

});

app.listen(PORT);
console.log(`Visit app at http://localhost:${PORT}`)