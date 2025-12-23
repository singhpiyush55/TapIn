const {Router} = require('express');
const router = Router();
const {z} =require('zod');
const Model = require('../../config/db')
const jwt = require('jsonwebtoken');
const auth = require('../../middlewares/auth');

router.post('/login',async (req, res)=>{
    // Schema validation.
    // Finding User 
    // If found --> return a JWT
    // Else --> Contact the administrator.

    userLoginSchema = z.object({
        email: z.string(),
        password: z.string()
    });

    const result = userLoginSchema.safeParse(req.body);
    
    // If valid schema
    if(result.success){
        const foundUser = await Model.User.findOne(result.data);
        // If user is found in DB then creating the JWT
        if(foundUser){
            const token = jwt.sign({email: foundUser.email}, process.env.JWTSECRET);
            res.status(200).json({token: token});
        }else{
            res.status(400).send("User not found contact Admin.")
        }
    }else{
        res.status(409).send("Invalid Format.")
    }
})

//router.get('/dashboard')
//Fig out what to do.

// When the user dashboard gets mounted from frontend.
// -> it hits two following requests 
// 1. GET/api/v1/user/profile (User version)
// req: none 
// res: { "name": "John Doe", "email": "john@example.com", "designation": "Engineer", "phone_no": "1234567890", "rfid": "TAG123", "dob": "1999-01-01" }

router.get('/profile', auth, async (req, res)=>{
    // console.log(req.user)
    // const foundUser = await Model.User.findOne({email: req.user.email})
    // // Untill duplicate users are allowed, we are sending first user found in the db. 
    // res.status(200).json(foundUser)
    // console.log(foundUser)

    try {
        // 1. Get email from the decoded token (req.user)
        // We use req.user because GET requests generally don't carry a req.body
        const userEmail = req.user.email; 

        if (!userEmail) {
            return res.status(400).json({ message: "Invalid token data" });
        }

        // 2. Find the user in the database
        const user = await Model.User.findOne({ email: userEmail });

        // 3. Check if user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 4. Send the response
        // We convert to object to safely remove sensitive fields like password before sending
        const userResponse = user.toObject();
        delete userResponse.password; // Security best practice: don't send the password back

        res.status(200).json(userResponse);

    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
})



// 2. GET/api/v1/user/attendence
// req: none
// res: [ { "date": "2025-12-01", "status": "present" }, { "date": "2025-12-02", "status": "present" } ]
router.get('/attendance', auth, async (req, res)=>{
    const userEmail = req.user.email;

    if(!userEmail){
        res.status(400).json({message: "User not found."})
    }

    // Getting the complete users detail form the database. 
    const user = await Model.User.findOne({email: userEmail});

    // Extracting the RFID from complete user detail. 
    const rfid = user.rfid;

    // Fetching all the attendence detail for the corroesponding 'rfid'
    const attendanceDB = await Model.Attendance.find({rfid : rfid});

    // returning the attendence array, fe wants only date & status. But we have the complete schema details.
    // We have to map
    const attFinal = attendanceDB.map((current)=>({
        date: current.date,
        status: current.status
    }));

    res.status(200).json(attFinal);
})


// When admin is viewing the users profile, it is making the request on following endpoint with given detail. Just return the attendence for that user.
router.post('/attendanceForAdmin', auth, async (req, res)=>{
    // console.log(req.body); { userId: '694aff6f0b0e558df8e6334b' }
    
    const userId = req.body.userId;
    const foundUser = await Model.User.findById(userId);

    // Extracting the rfid for the fetching the attendence. 
    const userRFID = foundUser.rfid;

    // Fetching all the attendence detail for the corroesponding 'rfid'
    const attendanceDB = await Model.Attendance.find({rfid : userRFID});

    // returning the attendence array, fe wants only date & status. But we have the complete schema details.
    // We have to map
    const attFinal = attendanceDB.map((current)=>({
        date: current.date,
        status: current.status
    }));

    res.status(200).json(attFinal);
})


module.exports = router;