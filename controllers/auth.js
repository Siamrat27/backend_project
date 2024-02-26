const User = require('../models/User');

//@desc     Register user
//@route    POST /api/v1/auth/register
//@access   Public
exports.register=(req,res,next)=> {
    res.status(200).json({sucess:true});
};
exports.register=async (req,res,next)=>{
    try{
        const {name,email,password,tel,role}=req.body;

        //Create user
        const user=await User.create({
            name,
            email,
            password,
            tel,
            role
        });
        res.status(200).json({success:true});
    } catch(err) {
        res.status(400).json({success:false});
        console.log(err.stack);
    }
}