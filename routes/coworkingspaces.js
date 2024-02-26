const express = require('express');
const {getcoworkingspace,getcoworkingspaces,updatecoworkingspace,createcoworkingspace,deletecoworkingspace} = require('../controllers/coworkingspaces');
const router = express.Router();

const {protect,authorize} = require('../middleware/auth');

router.route('/').get(getcoworkingspaces).post(protect,authorize('admin'),createcoworkingspace);
router.route('/:id').get(getcoworkingspace).put(protect,authorize('admin'),updatecoworkingspace).delete(protect,authorize('admin'),deletecoworkingspace);

module.exports=router;