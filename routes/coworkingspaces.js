const express = require('express');
const {getcoworkingspace,getcoworkingspaces,updatecoworkingspace,createcoworkingspace,deletecoworkingspace} = require('../controllers/coworkingspaces');
const router = express.Router();

const {protect} = require('../middleware/auth');

router.route('/').get(getcoworkingspaces).post(protect,createcoworkingspace);
router.route('/:id').get(getcoworkingspace).put(protect,updatecoworkingspace).delete(protect,deletecoworkingspace);

module.exports=router;