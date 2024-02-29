const express = require('express');
const {getCoworkingspace,getCoworkingspaces,updateCoworkingspace,createCoworkingspace,deleteCoworkingspace} = require('../controllers/Coworkingspaces');
const router = express.Router();

//Include other resource routers
const reservationRouter=require('./reservations');

const {protect,authorize}=require('../middleware/auth');

//Re-route into other resource routers
router.use('/:coworkingspaceId/reservations/',reservationRouter);

router.route('/').get(getCoworkingspaces).post(protect,authorize('admin'),createCoworkingspace);
router.route('/:id').get(getCoworkingspace).put(protect,authorize('admin'),updateCoworkingspace).delete(protect,authorize('admin'),deleteCoworkingspace);

/**
* @swagger
* components:
*   schemas:
*       Coworkingspace:
*           type: object
*           required:
*             - name
*             - address
*           properties:
*             id:
*               type: string
*               format: uuid
*               description: The auto-generated id of the coworkingspace
*               example: d290f1ee-6c54-4b01-90e6-d701748f0851
*             ลําดับ:
*               type: string
*               description: Ordinal number
*             name:
*               type: string
*               description: Coworkingspace name
*             address:
*               type: string
*               description: House No., Street, Road
*             district:
*               type: string
*               description: District
*             province:
*               type: string
*               description: province
*             postalcode:
*               type: string
*               description: 5-digit postal code
*             tel:
*               type: string
*               description: telephone number
*             region:
*               type: string
*               description: region
*           example:
*               id: 609bda561452242d88d36e37
*               ลําดับ: 121
*               name: Happy Coworkingspace
*               address: 121 ถ.สุขุมวิท
*               district: บางนา
*               province: กรุงเทพมหานคร
*               postalcode: 10110
*               tel: 02-2187000
*               region: กรุงเทพมหานคร (Bangkok)
*/

/**
* @swagger
* tags:
*   name: Coworkingspaces
*   description: The coworkingspaces managing API
*/

/**
* @swagger
* /coworkingspaces:
*   get:
*     summary: Returns the list of all the coworkingspaces
*     tags: [Coworkingspaces]
*     responses:
*       200:
*         description: The list of the coworkingspaces
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Coworkingspace'
*/

/**
* @swagger
* /coworkingspaces/{id}:
*   get:
*     summary: Get the coworkingspace by id
*     tags: [Coworkingspaces]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The coworkingspace id
*     responses:
*       200:
*         description: The coworkingspace description by id
*         contents:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Coworkingspace'
*       404:
*         description: Thse Coworkingspace was not found
*/

/**
* @swagger
* /coworkingspaces:
*   post:
*     summary: Create a new coworkingspace
*     tags: [Coworkingspaces]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Coworkingspace'
*         responses:
*           201:
*             description: The coworkingspace was successfully created
*             content:
*               application/json:
*                 schema:
*                   $ref: '#/components/schemas/Coworkingspace'
*           500:
*             description: Some server error
*/

/**
* @swagger
* /coworkingspaces/{id}:
*   put:
*     summary: Update the Coworkingspace by the id
*     tags: [Coworkingspaces]
*     parameters:
*       - in: path
*         name: id
*         schema:
*          type: string
*         required: true
*         description: The coworkingspace id
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Coworkingspace'
*       responses:
*         200:
*           description: The coworkingspace was updated
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/Coworkingspace'
*         404:
*           description: The coworkingspace was not found
*         500:
*           description: Some error happened
*/

/**
* @swagger
* /coworkingspaces/{id}:
*   delete:
*     summary: Remove the Coworkingspace by id
*     tags: [Coworkingspaces]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The coworkingspace id
*
*     responses:
*       200:
*         description: The coworkingspace was deleted
*       404:
*         description: The coworkingspace was not found
*/

module.exports=router;