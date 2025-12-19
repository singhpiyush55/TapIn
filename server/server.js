// Library imports
const express = require('express');
const dotenv= require('dotenv');


//Module imports
const db = require('./config/db');
const userRoutes = require('./routes/user/user');
const adminRoutes = require('./routes/admin/admin');
const eventRoutes = require('./routes/events/event');

//Initialization
const app = express();
dotenv.config();

//Routes
app.get('/', (req,res)=>{
    res.send('I am healthy and working fine!')
});

app.use(express.json());
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/events', eventRoutes);

db.connectDB();
app.listen(process.env.PORT, ()=>{
    console.log("Server is running on http://localhost:" + process.env.PORT)
});