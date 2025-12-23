const {Router} = require('express');
const router = Router();
const {z} = require('zod');
const Model = require('../../config/db');
const auth = require('../../middlewares/auth');
const jwt = require('jsonwebtoken');

router.post('/signup',async (req, res)=>{
    // Schema validation
    adminDataSchema = z.object({
        name: z.string(), 
        email: z.string(),
        password: z.string(),
        phone_no: z.string()
    })

    const result = adminDataSchema.safeParse(req.body);
    
    // Pushing to DB
    try{
        const admin = await Model.Admin.create(result.data);
        res.status(200).json({
            message: "Succesfully Signed Up!"
        });
    }catch(err){
        if(err.code === 11000){
            res.status(409).json({message: "Admin already exist."})
        }
    }
})

router.post('/login', async (req, res)=>{
    adminSchema = z.object({
        email: z.string(),
        password: z.string()
    });
    const result = adminSchema.safeParse(req.body);

    const foundAdmin = await Model.Admin.findOne({email: result.data.email, password: result.data.password});
    if(foundAdmin){
        // Create and send JWT.
        const token = jwt.sign({email: result.data.email}, process.env.JWTSECRET);
        res.status(200).json({token: token});
    }else{
        res.status(404).send("user not found");
    }
})


router.post('/adduser', auth, async (req, res)=>{

    const userSchema = z.object({
        name: z.string(),
        rfid: z.string(),
        dob: z.string(),
        phone_no: z.string(),
        email: z.string(),
        password: z.string(),
        designation: z.string()
    })

    const result = userSchema.safeParse(req.body);

    if(result.success){
        const createdUser = await Model.User.create(result.data);
        res.status(200).json({message: "User created succesfully."});
    }else{
        res.status(400).send("Failed");
    }
})

// router.get('/userporfile')
// return the user profile. 
// router.get('/dashboard')
// Return the page



// /api/v1/admin/adduser DONE

// /api/v1/admin/userprofile : Returns the same user profile thing. i,e. redirect it to the user/profile
// When admin click view-profile a POST request is made here. (Having the users id)
// And i am supposed to return the that users profile datail.
// And when the users profile is getting mounted it will hit /user/attendenc and get the attendence. 

router.post('/userprofile', auth, async (req, res)=>{
    // console.log(req.headers, req.body) => [Function: header] { userId: '694aff6f0b0e558df8e6334b' }
    const foundUser = await Model.User.findById(req.body.userId)
    res.status(200).json(foundUser);
})



// /api/v1/admin/dashboard : This will be called when the admin dashboard gets mounted. It will return basic details of the users.
router.get('/dashboard', auth, async (req, res)=>{
    const users = await Model.User.find();
    // console.log(users);
    res.status(200).json({users: users});
})

module.exports = router;