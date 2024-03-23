const Reservation = require('../models/Reservation');
const Coworkingspace = require('../models/Coworkingspace');

//@desc Get all reservations
//@route GET ?api/v1/reservations
//@access Private

exports.getReservations=async(req,res,next)=>{
    let query;
    //General users can see only their reservations!
    if(req.user.role!=='admin'){
        query=Reservation.find({user:req.user.id}).populate({
            path:'coworkingspace',
            select:'name province telephone_number'
        });
    } else{//If you are an admin, you can see all!
        if (req.params.coworkingspaceId) { // Corrected to req.params.coworkingspaceId
            console.log(req.params.coworkingspaceId); // Logging the coworkingspaceId parameter
            query = Reservation.find({ coworkingspace: req.params.coworkingspaceId }).populate({
                path: 'coworkingspace',
                select: 'name province telephone_number'
            });
        } else {
            query = Reservation.find().populate({
                path: 'coworkingspace',
                select: 'name province telephone_number'
            });
        }
    }

    try{
        const reservations=await query;
        res.status(200).json({
            success:true,
            count:reservations.length,
            data:reservations
        });
    } catch(err){
        console.log(err.stack);
        return res.status(500).json({success:false,message:"Cannot find Reservation"});
    }
};


//@desc Get single reservations
//@route GET /api/v1/reservations/:id
//@access Public

exports.getReservation=async(req,res,next)=>{
    try{
        const reservation=await Reservation.findById(req.params.id).populate({
            path:'coworkingspace',
            select:'name description telephone_number'
        });
        if(!reservation){
            return res.status(404).json({success:false,message:`No reservation with the id of ${req.params.id}`})
        }

        res.status(200).json({
            success:true,
            data:reservation
        });
    } catch(err){
        console.log(err.stack);
        return res.status(500).json({success:false,message:"Cannot find Reservation"});
    }
}

function getStartTime(timeRange) {
    const parts = timeRange.split('-');
    return parts[0].trim();
}

function getEndTime(timeRange) {
    const parts = timeRange.split('-');
    return parts[1].trim();
}


function isMoreThan3Hours(startTime, endTime) {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    let [endHour, endMinute] = endTime.split(':').map(Number);

    // Adjust end time if it's earlier than start time
    if (endHour < startHour || (endHour === startHour && endMinute < startMinute)) {
        endHour += 24; // Add 24 hours
    }

    // Convert times to minutes
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    // Calculate duration in minutes
    const durationInMinutes = endMinutes - startMinutes;

    // Check if duration is greater than 180 minutes (3 hours)
    return durationInMinutes > 180;
}


function isInRangeTime(startTime, endTime, testStartTime, testEndTime) {
    // Convert time strings to minutes
    const startMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
    const endMinutes = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);
    const testStartMinutes = parseInt(testStartTime.split(':')[0]) * 60 + parseInt(testStartTime.split(':')[1]);
    const testEndMinutes = parseInt(testEndTime.split(':')[0]) * 60 + parseInt(testEndTime.split(':')[1]);

    if(!(parseInt(startTime.split(':')[0])<=23 && (parseInt(endTime.split(':')[0])>=0) && parseInt(endTime.split(':')[0])<parseInt(startTime.split(':')[0])) && 
    (parseInt(testStartTime.split(':')[0])<=23 && (parseInt(testEndTime.split(':')[0])>=0) && parseInt(testEndTime.split(':')[0])<parseInt(testStartTime.split(':')[0]))){
      return false;
    }
    // If start time is greater than end time, it means the time range spans across midnight
    if (startMinutes > endMinutes) {
      // Test start time should be greater than start time or less than end time
      return testStartMinutes >= startMinutes || testEndMinutes <= endMinutes || (testStartMinutes < testEndMinutes && testStartMinutes < endMinutes && testEndMinutes > startMinutes);
    } else {
      // If test start time is greater than test end time, it means the test time range spans across midnight
      if (testStartMinutes > testEndMinutes) {
        return testStartMinutes >= startMinutes || testEndMinutes <= endMinutes;
      } else {
        // Test start time should be greater than start time and test end time should be less than end time
        return testStartMinutes >= startMinutes && testEndMinutes <= endMinutes;
      }
    }
  }




//@desc Add reservation
//@route POST /api/v1/reservations/:coworkingspaceID/reservations/
//@access Private
exports.addReservation=async(req,res,next)=>{
    try{
        req.body.coworkingspace=req.params.coworkingspaceId;
        const coworkingspace=await Coworkingspace.findById(req.params.coworkingspaceId);
        console.log(req.params);
        if(!coworkingspace){
            return res.status(404).json({success:false,message:`No coworkingspace with the id of ${req.params.coworkingspaceId}`})
        }
        console.log(req.body);

        //add user Id to req.body
        req.body.user=req.user.id;
        //Check for existed reservation
        const existedReservations=await Reservation.find({user:req.user.id});

        //If the user is not an admin, they can only create 3 reservation.
        if(existedReservations.length>=3 && req.user.role !=='admin'){
            return res.status(400).json({success:false,message:`The user with ID ${req.user.id} has already made 3 reservations`})
        }
        const reservationTimeStart = getStartTime(req.body.timereservation);
        const reservationTimeEnd = getEndTime(req.body.timereservation);

        //Check Coworking open in timereservation
        if(!isInRangeTime(coworkingspace.opentime,coworkingspace.closetime,reservationTimeStart,reservationTimeEnd)){
            return res.status(400).json({success:false,message:`Coworkingspace ${coworkingspace.id} open between ${coworkingspace.opentime} - ${coworkingspace.closetime}`});
        }

        if(isMoreThan3Hours(reservationTimeStart,reservationTimeEnd)){
            return res.status(400).json({success:false,message:`You can not reserve more than 3 hours`})
        }

        const reservation = await Reservation.create(req.body);
        res.status(200).json({
            success:true,
            data:reservation
        });
    } catch(err){
        console.log(err.stack);
        return res.status(500).json({success:false,message:'Cannot create Reservation'});
    }
}



//@desc Update reservation
//@route PUT /api/v1/reservations/:id
//@access Private
exports.updateReservation=async(req,res,next)=>{
    try{
        let reservation = await Reservation.findById(req.params.id);
        if(!reservation){
            return res.status(404).json({success:false,message:`No reservation with the id of ${req.params.id}`})
        }

        //Make sure user is the appoint owner
        if(reservation.user.toString()!==req.user.id && req.user.role!=='admin'){
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to update this reservation`})
        }

        // Fetch the coworkingspace associated with the reservation
        const coworkingspace = await Coworkingspace.findById(reservation.coworkingspace);
        if (!coworkingspace) {
            return res.status(404).json({ success: false, message: `No coworkingspace associated with the reservation` });
        }

        // Check Coworking open in timereservation

        const reservationTimeStart = getStartTime(req.body.timereservation);
        const reservationTimeEnd = getEndTime(req.body.timereservation);

        //Check Coworking open in timereservation
        if(!isInRangeTime(coworkingspace.opentime,coworkingspace.closetime,reservationTimeStart,reservationTimeEnd)){
            return res.status(400).json({success:false,message:`Coworkingspace ${coworkingspace.id} open between ${coworkingspace.opentime} - ${coworkingspace.closetime}`});
        }

        if(isMoreThan3Hours(reservationTimeStart,reservationTimeEnd)){
            return res.status(400).json({success:false,message:`You can not reserve more than 3 hours`})
        }

        

        reservation=await Reservation.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });
        res.status(200).json({
            success:true,
            data:reservation
        });
    } catch(err){
        console.log(err.stack);
        return res.status(500).json({success:false,message:"Cannot update Reservation"});
    }
}

//@desc Delete reservation
//@route DELETE /api/v1/reservations/:id
//@access Private
exports.deleteReservation=async(req,res,next)=>{
    try{
        const reservation=await Reservation.findById(req.params.id);
        if(!reservation){
            return res.status(404).json({success:false,message:`No reservation with the id of ${req.params.id}`});
        }

        //Make sure user is the reservation owner
        if(reservation.user.toString()!==req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to update this reservation`})
        }

        await reservation.deleteOne();
        res.status(200).json({
            success:true,
            data:{}
        });
    } catch(err){
        console.log(err.stack);
        return res.status(500).json({success:false,message:"Cannot delete Reservation"});
    }
};
