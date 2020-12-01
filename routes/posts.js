const express = require('express');
const router = express.Router();
const isAuth = require('../middlewares/isAuth');

const PostController = require('../controllers/PostController');

router.post('/', isAuth, PostController.storePost);
router.get('/', PostController.getAllPost);
router.get('/:postId', PostController.getPostById);
router.patch('/:postId', isAuth, PostController.updatePost);
router.delete('/:postId', isAuth, PostController.deletePost);

router.get('/:postId/comments', PostController.getPostComments);

module.exports = router;
