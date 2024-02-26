const Coworkingspace = require('../models/Coworkingspace');

//@desc Get all coworkingspaces
//@route GET /api/v1/coworkingspaces
//@access Public
exports.getcoworkingspaces=async (req,res,next)=>{
    try{
        const coworkingspaces = await Coworkingspace.find();
        res.status(200).json({success:true,count:coworkingspaces.length,data:coworkingspaces});
    } catch(err){
        res.status(400).json({success:false});
    }
}

//@desc Get single coworkingspace
//@route GET /api/v1/coworkingspaces/:id
//@access Public
exports.getcoworkingspace=async (req,res,next)=>{
    try{
        const coworkingspace = await Coworkingspace.findById(req.params.id);
        if(!coworkingspace){
            return res.status(400).json({success:false});
        }
        res.status(200).json({success:true,data:coworkingspace})
    } catch(err){
        res.status(400).json({success:false});
    }
}
 
//@desc Create a coworkingspaces
//@route POST /api/v1/coworkingspaces
//@access Private
exports.createcoworkingspace=async (req,res,next)=>{
    const coworkingspace = await Coworkingspace.create(req.body);
    res.status(201).json({success:true,data:coworkingspace});
}

//@desc Update single coworkingspace
//@route PUT /api/v1/coworkingspaces/:id
//@access Private
exports.updatecoworkingspace=async (req,res,next)=>{
    try{
        const coworkingspace = await Coworkingspace.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });
        if(!coworkingspace){
            return res.status(400).json({success:false});
        }
        res.status(200).json({success:true,data:coworkingspace});
    } catch(err){
        res.status(400).json({success:false});
    }
}

//@desc Delete single coworkingspace
//@route DELETE /api/v1/coworkingspaces/:id
//@access Private
exports.deletecoworkingspace=async (req,res,next)=>{
    try{
        const coworkingspace = await Coworkingspace.findByIdAndDelete(req.params.id);
        if(!coworkingspace){
            return res.status(400).json({success:false});
        }
        res.status(200).json({success:true,data:{}})
    }catch(err){
        res.status(400).json({success:false});
    }
}