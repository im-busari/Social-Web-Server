const { Post, User, Comment } = require('../models/index');

class CommentController {
  //  Create new comment if user is Auth, for post with provided ID inside URL.
  async storeComment(req, res) {
    try {
      const userId = req.user.user.id;
      const postId = req.params.postId;

      const post = await Post.findByPk(postId);

      if (post) {
        const comment = await Comment.create({
          postId: post.id,
          userId: userId,
          content: req.body.content,
        });
        res.status(201).send(comment);
      } else {
        res.status(404).send("Post doesn't exist");
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }

  //  Get Comment by PrimaryKey and display info for the Post and User
  async getCommentById(req, res) {
    try {
      const commentId = req.params.commentId;

      const comment = await Comment.findByPk(commentId, {
        include: [{ model: User }, { model: Post }],
      });
      if (comment) {
        res.status(200).send(comment);
      } else {
        res.status(404).send("Couldn't find anything.");
      }
    } catch (err) {
      res.status(500).send('Something happened: ', err);
    }
  }

  //  Update/Edit comment if it belongs to user
  async updateComment(req, res) {
    try {
      const userId = req.user.user.id;
      const commentId = req.params.commentId;

      const comment = await Comment.findByPk(commentId, {
        include: [{ model: User }, { model: Post }],
      });

      if (comment && comment.userId === userId) {
        await comment.update({ content: req.body.content });

        res.status(200).json(comment);
      } else {
        res
          .status(404)
          .send(
            'The following action is unavailable! Please ensure this is your comment and that it still exists'
          );
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }

  //  Delete comment if it belongs to user or the request comes from Admin
  async deleteComment(req, res) {
    try {
      const userId = req.user.user.id;
      const commentId = req.params.commentId;

      const comment = await Comment.findByPk(commentId);
      const user = await User.findOne({ where: { id: userId } });

      if (comment && (user.roleId === 1 || comment.userId === userId)) {
        await comment.destroy();

        res.status(200).json('You will no longer see this comment');
      } else {
        res
          .status(404)
          .send(
            'The following action is unavailable at the moment! Please ensure this is your comment and that it exists'
          );
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }
}

module.exports = new CommentController();
