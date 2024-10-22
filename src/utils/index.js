'use strict';

const _ = require('lodash');
const { Types } = require('mongoose');

const getInfoData = ({ fields = [], object = {} }) => {
	return _.pick(object, fields);
};

const getSelectData = (select = []) => {
	return Object.fromEntries(select.map((el) => [el, 1]));
};

const getUnSelectData = (select = []) => {
	return Object.fromEntries(select.map((el) => [el, 0]));
};

const updateNestedObjectParser = (payload) => {
	const final = {};

	Object.keys(payload).forEach((k) => {
		if (
			typeof payload[k] === 'object' &&
			!Array.isArray(payload[k]) &&
			payload[k]
		) {
			const response = updateNestedObjectParser(payload[k]);

			Object.keys(response).forEach((a) => (final[`${k}.${a}`] = response[a]));
		} else if (payload[k]) {
			final[k] = payload[k];
		}
	});

	console.log(final);
	return final;
};

const convertToObjectId = (id) => new Types.ObjectId(id);

module.exports = {
	getInfoData,
	getSelectData,
	getUnSelectData,
	updateNestedObjectParser,
	convertToObjectId,
};
