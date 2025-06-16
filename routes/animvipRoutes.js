const express = require('express');
const router = express.Router();
const animController = require('../controllers/animateurVip');
const authMiddleware = require('../middleware/authMiddleware');

// GET
router.get('/getAll', animController.getAll);
router.get('/getOne/:id', animController.getOne);

// POST
router.post('/add', animController.uploadOptions, animController.add); // ✅ upload ici
router.post('/update/:id', animController.update);
router.post('/suprimmer/:id', animController.deletes);

// RATING
router.post('/:id/rate', authMiddleware, animController.ratingAnimateur);

module.exports = router;
