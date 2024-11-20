'use strict';

const commentModel = require('../models/comment.model');
const { findProduct } = require('../models/repositories/product.repo');
const { convertToObjectId } = require('../utils');
const { NotFoundError } = require('../utils/customError');

/**
 * add comment (User | shop)
 * get a list of comments [User, Shop]
 * delete a comment (User | Shop | Admin)
 */
class CommentService {
	static async createComment({
		productId,
		userId,
		content,
		parentCommentId = null,
	}) {
		const comment = new commentModel({
			comment_productId: productId,
			comment_userId: userId,
			comment_content: content,
			comment_parentId: parentCommentId,
		});

		let rightValue;
		if (parentCommentId) {
			const parentComment = await commentModel.findById(parentCommentId);
			if (!parentComment) throw new NotFoundError('parent comment not found');

			rightValue = parentComment.comment_right;

			const result = await commentModel.updateMany(
				{
					comment_productId: convertToObjectId(productId),
					comment_right: { $gte: rightValue },
				},
				{
					$inc: { comment_right: 2 },
				}
			);

			await commentModel.updateMany(
				{
					comment_productID: convertToObjectId(productId),
					comment_left: { $gte: rightValue },
				},
				{
					$inc: { comment_left: 2 },
				}
			);
		} else {
			const existedComment = await commentModel
				.findOne(
					{
						comment_productId: convertToObjectId(productId),
					},
					'comment_right',
					{ sort: { comment_right: -1 } }
				)
				.lean();

			if (existedComment) {
				rightValue = existedComment.comment_right + 1;
			} else {
				rightValue = 1;
			}
		}

		comment.comment_left = rightValue;
		comment.comment_right = rightValue + 1;

		await comment.save();
		return comment;
	}

	static async getCommentsByParentId({
		productId,
		parentCommentId,
		limit = 50,
		offset = 0,
	}) {
		if (parentCommentId) {
			const rootComment = await commentModel
				.findById(convertToObjectId(parentCommentId))
				.lean();
			if (!rootComment) throw new NotFoundError('there is no any comment');

			const childComments = await commentModel
				.find({
					comment_productId: convertToObjectId(productId),
					comment_left: { $gt: rootComment.comment_left },
					comment_right: { $lte: rootComment.comment_right },
				})
				.select({
					comment_left: 1,
					comment_right: 1,
					comment_content: 1,
					comment_parentId: 1,
				})
				.limit(limit)
				.skip(offset)
				.sort({ comment_left: 1 })
				.lean();

			return {
				childComments,
			};
		}

		const comments = await commentModel
			.find({
				comment_productId: convertToObjectId(productId),
				comment_parentId: null,
			})
			.select({
				comment_left: 1,
				comment_right: 1,
				comment_content: 1,
				comment_parentId: 1,
			})
			.limit(limit)
			.skip(offset)
			.sort({ comment_left: 1 })
			.lean();

		return {
			comments,
		};
	}

	static async deleteComments({ commentId, productId }) {
		const foundProduct = await findProduct({
			product_id: productId,
		});

		if (!foundProduct) throw NotFoundError('product not found');

		const comment = await commentModel.findById(commentId);
		if (!comment) throw new NotFoundError('Comment not found');

		const leftValue = comment.comment_left;
		const rightValue = comment.comment_right;

		const width = rightValue - leftValue + 1;

		await commentModel.deleteMany({
			comment_productId: convertToObjectId(productId),
			comment_left: { $gte: leftValue },
			comment_right: { $lte: rightValue },
		});

		await commentModel.updateMany(
			{
				comment_productId: convertToObjectId(productId),
				comment_right: { $gt: rightValue },
			},
			{ $inc: { comment_right: -width } }
		);

		await commentModel.updateMany(
			{
				comment_productId: convertToObjectId(productId),
				comment_left: { $gt: rightValue },
			},
			{ $inc: { comment_left: -width } }
		);

		return true;
	}
}

module.exports = CommentService;
