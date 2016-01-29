var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/login', function(req, res, next) {
	res.render('login');
});
router.post('/login', function(req, res, next) {
	var User = global.dbModels.getModel('users');
	var userInfo = req.body;
	userInfo.password = global.getHash(userInfo.password);
	User.findOne(userInfo, function(err, doc) {
		if (err) {
			res.send({
				status: 3,
				mes: "服务器错误"
			});
		} else if (doc) {
			req.session.id = doc._id;
			req.session.name = doc.name;
			res.send({
				status: 0,
				mes: "登录成功",
				body:doc
			});
		} else {
			res.send({
				status: 1,
				mes: "用户名或密码错误"
			});
		}
	})
});
router.get('/register', function(req, res, next) {
	res.render('register');
});
router.post('/register', function(req, res, next) {
	var userInfo = req.body;
	var User = global.dbModels.getModel('users');
	User.findOne({
		name: userInfo.name
	}, function(err, doc) {
		if (err) {
			res.send({
				status: 3,
				mes: "服务器错误"
			});
		} else if (doc) {
			res.send({
				status: 1,
				mes: "用户名存在"
			});
		} else {
			userInfo.password = global.getHash(userInfo.password);
			User.create(userInfo, function(err, doc) {
				if (err) {
					res.send({
						status: 3,
						mes: "服务器错误"
					});
				} else {
					res.send({
						status: 0,
						mes: "注册成功"
					});
				}
			})
		}
	})
});
router.get('/logout', function(req, res, next) {
	req.session.id = req.session.name = null;
	res.redirect('/login');
});
module.exports = router;