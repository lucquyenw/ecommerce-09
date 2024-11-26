'use strict';

const { listNotiByUser } = require('../services/notification.service');

class NotificationController {
	listNotiByUser = async (req, res, next) => {
		return res.status(200).json({
			message: 'list all noti by user',
			metadata: await listNotiByUser(req.query),
		});
	};
}

module.exports = new NotificationController();
