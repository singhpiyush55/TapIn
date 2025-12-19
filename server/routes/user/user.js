const {Router} = require('express');
const router = Router();
const {z} =require('zod');
const Model = require('../../config/db')
const jwt = require('jsonwebtoken');

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


module.exports = router;