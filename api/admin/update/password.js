var auth = require('server/auth.js');
var pg_pool = require("server/database").pg_pool;
var util = require('util');
var restify = require('restify');
var bcrypt = require('bcrypt-nodejs');


module.exports.handler = function(req, res, next) {
    if (!req.params.auth)
        return next(new restify.NotAuthorizedError('Auth token required.'));

    if (!req.params.user_id)
        return next(new restify.InvalidArgumentError('User ID required.'));

    if (!req.params.password)
        return next(new restify.InvalidArgumentError('Password required.'));

    var trusted_auth = auth.get(req.params.auth.token);
    if (trusted_auth === undefined) {
        return next(new restify.NotAuthorizedError('Bad auth token.'));
        return next();
    } else if (trusted_auth.rank < 10) {
        return next(new restify.NotAuthorizedError('Insufficient Permissions.'));
    } else {
        auth.change_password(req.params.user_id, req.params.password, res);
    }
}