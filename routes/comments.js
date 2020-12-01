const express = require('express');
const router = express.Router();
const isAuth = require('../middlewares/isAuth');

const CommentController = require('../controllers/CommentController');

router.get('/:commentId', CommentController.getCommentById);
router.post('/:postId', isAuth, CommentController.storeComment);
router.patch('/:commentId', isAuth, CommentController.updateComment);
router.delete('/:commentId', isAuth, CommentController.deleteComment);

module.exports = router;
