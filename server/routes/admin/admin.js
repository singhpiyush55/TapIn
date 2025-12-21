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


// router.get('/dashboard')
// Return the page

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

module.exports = router;