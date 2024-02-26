const express = require('express');
const {getcoworkingspace,getcoworkingspaces,updatecoworkingspace,createcoworkingspace,deletecoworkingspace} = require('../controllers/coworkingspaces');
const router = express.Router();

router.route('/').get(getcoworkingspaces).post(createcoworkingspace);
router.route('/:id').get(getcoworkingspace).put(updatecoworkingspace).delete(deletecoworkingspace);

module.exports=router;