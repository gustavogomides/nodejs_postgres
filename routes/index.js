var express = require('express');
var router = express.Router();
var controller = require('./../controllers/controller.js');

module.exports = router;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// CREATE
router.post('/create', function(req, res, next) {
  controller.create(req, res);  
});

// READ
router.get('/read', function(req, res, next) {
  controller.read(res);  
});

// UPDATE
router.put('/update/:id', function(req, res, next) {
  controller.update(req, res);  
});

// DELETE
router.delete('/delete/:id', function(req, res, next) {
  controller.deleteDB(req, res);  
});