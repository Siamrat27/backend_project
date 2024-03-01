const express = require('express');
const {getCoworkingspace,getCoworkingspaces,updateCoworkingspace,createCoworkingspace,deleteCoworkingspace} = require('../controllers/coworkingspaces');
const router = express.Router();

//Include other resource routers
const reservationRouter=require('./reservations');

const {protect,authorize}=require('../middleware/auth');

//Re-route into other resource routers
router.use('/:coworkingspaceId/reservations/',reservationRouter);

router.route('/').get(getCoworkingspaces).post(protect,authorize('admin'),createCoworkingspace);
router.route('/:id').get(getCoworkingspace).put(protect,authorize('admin'),updateCoworkingspace).delete(protect,authorize('admin'),deleteCoworkingspace);


module.exports=router;