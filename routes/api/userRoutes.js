const router = require('express').Router();
const {
    getUsers,
    getSingleUser,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    deleteFriend,
} = require('../../controllers/userController');

// /users
router.route('/').get(getUsers).post(createUser);

// bonus /users/:userId/friends/:friendId
router
    .route('/:userId')
    .get(getSingleUser)
    .put(updateUser)
    .delete(deleteUser)
    .put(addFriend);

router
    .route('/:userId/friends/:friendId')
    .put(deleteFriend);

module.exports = router;