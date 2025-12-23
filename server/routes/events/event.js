const {Router} = require('express');
const router = Router();
const Model = require('../../config/db');

// Following is what data pushed by ESP32 collected via NFC Module V3 and RTC. 
// -> {"uid":"9A:D4:1B:06","date":"23-12-2025","time":"04:02:42"}
// Fetch the data from body and push it in DB in the given fomat: Same what received and add {status: "present"}

router.post('/rfidscan', async (req, res)=>{
    try{
        const attendance = await Model.Attendance.create({
            rfid: req.body.uid,
            date: req.body.date,
            time: req.body.time,
            status: "present"
        })
        res.status(200).send("OK", attendance);
        console.log(`Created entry: ${attendance}`);
    }catch(err){
        res.status(400).send(err);
    }
})

module.exports = router;