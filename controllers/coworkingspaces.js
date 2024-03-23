const Coworkingspace = require('../models/Coworkingspace');


//@desc Get all coworkingspaces
//@route GET /api/v1/coworkingspaces
//@access Public
exports.getCoworkingspaces=async (req,res,next)=>{
    let query;

    //Copy req.query
    const reqQuery={...req.query};

    //Fields to exclude
    const removeFields=['select','sort','page','limit'];

    //Loop over remove fields and delete them from reqQuery
    removeFields.forEach(param=>delete reqQuery[param]);
    console.log(reqQuery);

    //Create query
    let queryStr=JSON.stringify(reqQuery);
    queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match=>`$${match}`);

    query=Coworkingspace.find(JSON.parse(queryStr)).populate('reservations');

    //Select fields
    if(req.query.select){
        const fields=req.query.select.split(',').join(' ');
        query=query.select(fields);
    }
    //Sort
    if(req.query.sort){
        const sortBy=req.query.sort.split(',').join(' ');
        query=query.sort(sortBy);
    } else{
        query=query.sort('-createdAt');
    }

    //Pagination
    const page=parse=parseInt(req.query.page,10)||1;
    const limit=parseInt(req.query.limit,10)||25;
    const startIndex=(page-1)*limit;
    const endIndex=page*limit;
    

    try{
        const total=await Coworkingspace.countDocuments();
        query=query.skip(startIndex).limit(limit);
        //Execute query
        const coworkingspaces = await query;

        //Pagination result
        const pagination={};

        if(endIndex<total){
            pagination.next={
                page:page+1,
                limit
            }
        }

        if(startIndex>0){
            pagination.prev={
                page:page-1,
                limit
            }
        }

        res.status(200).json({success:true,count:coworkingspaces.length,data:coworkingspaces});
    } catch(err){
        res.status(400).json({success:false});
    }
}

//@desc Get single coworkingspace
//@route GET /api/v1/coworkingspaces/:id
//@access Public
exports.getCoworkingspace=async (req,res,next)=>{
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
exports.createCoworkingspace=async (req,res,next)=>{
    try{
        const coworkingspace = await Coworkingspace.create(req.body);
        res.status(201).json({success:true,data:coworkingspace});
    } catch(err){
        res.status(400).json({success:false});
    }
}

//@desc Update single coworkingspace
//@route PUT /api/v1/coworkingspaces/:id
//@access Private
exports.updateCoworkingspace=async (req,res,next)=>{
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
exports.deleteCoworkingspace=async (req,res,next)=>{
    try{
        const coworkingspace = await Coworkingspace.findById(req.params.id);
        if(!coworkingspace){
            return res.status(400).json({success:false});
        }
        await coworkingspace.deleteOne();
        res.status(200).json({success:true,data:{}})
    }catch(err){
        res.status(400).json({success:false});
    }
}