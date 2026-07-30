const express = require('express');
const router = express.Router();
const actorController = require('../../controllers/actorController');

router.route('/')
  .get(actorController.getAllActors)
  .post(actorController.createActor);

router.route('/:id')
  .get(actorController.getActorById)
  .put(actorController.updateActor)
  .delete(actorController.deleteActor);

module.exports = router;
