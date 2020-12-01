const express = require('express');
const router = express.Router();
const isAuth = require('../middlewares/isAuth');

const UserController = require('../controllers/UserController');

/**
 * @swagger
 * /users:
 *  get:
 *    description: Get all users from the DB
 *    responses:
 *      '200':
 *        description: A successfull response.
 */
router.get('/', UserController.getAllUsers);

router.post('/signup', UserController.signup);

router.post('/signin', UserController.signin);

router.get('/me', isAuth, UserController.getSelf);
router.patch('/me', isAuth, UserController.updateSelf);

router.get('/:username/exists', UserController.checkUsername);

router.post('/:followedId/follow', isAuth, UserController.followUser);
router.post('/:followedId/unfollow', isAuth, UserController.unfollowUser);
router.get('/:userId/following', UserController.getAllFollowed);
router.get('/:userId/followers', UserController.getAllFollowers);

router.get('/:userId/posts', UserController.getUserPosts);

module.exports = router;
