'use strict';

const express = require('express');
const asyncErrorHandler = require('../../utils/asyncErrorHandler');
const { authentication } = require('../../utils/authUtil');
const commentController = require('../../controllers/comment.controller');
const router = express.Router();

router.use(authentication);
router.post('/', asyncErrorHandler(commentController.createComment));
router.get('/', asyncErrorHandler(commentController.getCommentsByParentId));
router.delete('/', asyncErrorHandler(commentController.deleteComments));

module.exports = router;
