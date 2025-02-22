'use strict';

const HttpStatus = require('http2').constants;

const ErrorMessage = {
	CONFLICT: 'Conflict Error',
	BAD_REQUEST: 'Bad Request',
	FOBIDDEN: 'Fobidden Request',
	NOT_FOUND: 'Not Found',
	UNANUTHENTICATED: 'UnAuthenticated',
};

class CustomError extends Error {
	constructor(message, statusCode) {
		super(message);
		this.statusCode = statusCode;
	}
}

class ConflictRequestError extends CustomError {
	constructor(
		message = ErrorMessage.CONFLICT,
		statusCode = HttpStatus.HTTP_STATUS_CONFLICT
	) {
		super(message, statusCode);
	}
}

class BadRequestError extends CustomError {
	constructor(
		message = ErrorMessage.BAD_REQUEST,
		statusCode = HttpStatus.HTTP_STATUS_BAD_REQUEST
	) {
		super(message, statusCode);
	}
}

class FobiddenError extends CustomError {
	constructor(
		message = ErrorMessage.FOBIDDEN,
		statusCode = HttpStatus.HTTP_STATUS_FORBIDDEN
	) {
		super(message, statusCode);
	}
}

class NotFoundError extends CustomError {
	constructor(
		message = ErrorMessage.NOT_FOUND,
		statusCode = HttpStatus.HTTP_STATUS_NOT_FOUND
	) {
		super(message, statusCode);
	}
}

class AuthenticationError extends CustomError {
	constructor(
		message = ErrorMessage.UNANUTHENTICATED,
		statusCode = HttpStatus.HTTP_STATUS_UNAUTHORIZED
	) {
		super(message, statusCode);
	}
}

module.exports = {
	CustomError,
	ConflictRequestError,
	BadRequestError,
	FobiddenError,
	NotFoundError,
	AuthenticationError,
};
