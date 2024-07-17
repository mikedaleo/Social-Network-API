const router = require('express').Router();
const {
    getThoughts,
    getSingleThought,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction
} = require('../../controllers/thoughtController');
// /thoughts
router.route('/').get(getThoughts).post(createThought);
// /thoughts/:thoughtId/reactions
router
    .route('/:thoughtId')
    .get(getSingleThought)
    .put(updateThought)
    .delete(deleteThought)
    .put(addReaction);

router.route('/:thoughtId/reactions/:reactionId').put(deleteReaction);

module.exports = router;