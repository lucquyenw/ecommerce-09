'use strict';

const commentService = require('../services/comment.service');

class CommentController {
	createComment = async (req, res, next) => {
		return res.status(200).json({
			message: 'Create new comment',
			metadata: await commentService.createComment(req.body),
		});
	};

	getCommentsByParentId = async (req, res, next) => {
		return res.status(200).json({
			message: 'get comments',
			metadata: await commentService.getCommentsByParentId(req.query),
		});
	};

	deleteComments = async (req, res, next) => {
		return res.status(200).json({
			message: 'delete comments',
			metadata: await commentService.deleteComments(req.body),
		});
	};
}

module.exports = new CommentController();
