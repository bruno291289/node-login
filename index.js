const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

//Connect to db
mongoose.connect(process.env.DB_CONNECT, (err) => {
    if (err){
        console.log('Error db: '+err);
    } else{
        console.log('Connected to db');
    }
});

//Middlewares
app.use(express.json());

//Import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

//Routes middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(3000, (err) => {
    if (err){
        console.log('Error: '+err);
    } else{
        console.log('Server up');
    }
});