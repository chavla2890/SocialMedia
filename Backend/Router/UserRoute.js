const express = require("express");
const {getAllUser, getUser, deleteUser, updateUser, followUser, unFollowUser} = require("../Controller/UserController");
const authMiddleware = require("../Middleware/auth");

const router = express.Router();
router.get('/', getAllUser);
router.get('/:id', getUser);
router.put('/:id',authMiddleware, updateUser);
router.delete('/:id',authMiddleware, deleteUser);
router.put('/:id/follow',authMiddleware, followUser);
router.put('/:id/unfollow',authMiddleware, unFollowUser);


module.exports = router;