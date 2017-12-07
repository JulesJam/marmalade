var express = require('express');
var router = express.Router();


var locationsController = require('../controllers/locationsController');

router.route('/locations')
  .post(locationsController.create)
  .get(locationsController.index);

router.route('/locations/:id')
  .get(locationsController.show)
  .put(locationsController.update)
  .patch(locationsController.update)
  .delete(locationsController.delete);


module.exports = router;