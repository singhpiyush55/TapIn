const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Async method for database connection.
async function connectDB() {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB.")
    }catch(err){
        console.log("Connection Failed! " + err)
    }
}

const userSchema = new mongoose.Schema({
    name: {type: String},
    rfid: {type: String},
    dob: {type: String},
    phone_no: {type: Number},
    email: {type: String},
    password: {type: String},
    designation: {type: String}
})

const adminSchema = new mongoose.Schema({
    name: {type: String, unique: true},
    email: {type: String, unique: true},
    password: {type: String, unique: true},
    phone_no: {type: Number, unique: true}
})

const attendanceSchema = new mongoose.Schema({
    rfid: {type: String},
    date: {type: String},
    time: {type: String}
})

const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports ={
    connectDB,
    User,
    Admin,
    Attendance
}