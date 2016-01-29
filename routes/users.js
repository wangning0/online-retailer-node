var express = require('express');
var router = express.Router();
var fs = require('fs');
var formidable = require('formidable');

/* GET users listing. */
router.get('/', function(req, res, next) {
	if (req.session.name && req.session.id) {
		next()
	} else {
		res.redirect('/login');
	}
})
router.get('/carts', function(req, res, next) {
	if (req.session.name && req.session.id) {
		next()
	} else {
		res.redirect('/login');
	}
})
router.get('/addcommodity', function(req, res, next) {
	if (req.session.name && req.session.id) {
		next()
	} else {
		res.redirect('/login');
	}
})
router.get('/', function(req, res, next) {
	res.render('commodity', {
		name: req.session.name
	});
});
router.get('/commodity', function(req, res, next) {
	var uId = req.session.id;
	var commodityModel = global.dbModels.getModel('commodities');
	commodityModel.find({}, function(err, doc) {
		if (err || !doc) {
			res.send({
				status: 1,
				mes: '服务器错误'
			});
		} else {
			res.send({
				status: 0,
				mes: '',
				body: doc
			});
		}
	})
});
router.get('/addcommodity', function(req, res, next) {
	res.render('addcommodity', {
		name: req.session.name
	});
})
router.post('/addcommodity', function(req, res, next) {
	var commodityModel = global.dbModels.getModel('commodities');
	commodityModel.create(req.body, function(err, doc) {
		if (err || doc.length == 0) {
			res.send({
				status: 1,
				mes: '服务器错误'
			});
		} else {
			res.send({
				status: 0,
				body: doc
			});
		}
	})
})
router.post('/addcommodity/uploadpic', function(req, res, next) {
	var form = new formidable.IncomingForm();
	form.uploadDir = 'public/avator/';
	form.parse(req, function(err, filed, files) {
		if (err) {
			res.send({
				status: 1
			})
		}
		var extName = ''; //后缀名
		switch (files.file.type) {
			case 'image/pjpeg':
				extName = 'jpg';
				break;
			case 'image/jpeg':
				extName = 'jpg';
				break;
			case 'image/png':
				extName = 'png';
				break;
			case 'image/x-png':
				extName = 'png';
				break;
		}

		var avatarName = Date.now() + '' + req.session.name + '.' + extName;
		var newPath = form.uploadDir + avatarName;

		var a = fs.renameSync(files.file.path, newPath); //重命名
		res.send({
			status: 0,
			msg: '上传成功',
			body: 'avator/' + avatarName
		});
	})
})
router.get('/addCommodityToCarts', function(req, res, next) {
	var commodityModel = global.dbModels.getModel('commodities');
	var cartsModel = global.dbModels.getModel('carts');
	var cid = req.query.cid;
	commodityModel.findOne({
		_id: cid
	}, function(err, doc) {
		if (err) {
			res.send({
				status: 1,
				mes: '服务器错误，添加失败'
			});
		} else {
			var obj = {
						uId: req.session.id,
						cId: cid,
						cName: doc.cName,
						cPrice: parseInt(doc.cPrice),
						cImgSrc: doc.cImgSrc,
						cQuality: 1
					}
					cartsModel.create(obj, function(err, doc) {
						if (err || !doc) {
							res.send({
								status: 1,
								mes: '服务器错误，添加失败'
							});
						} else {
							res.send({
								status: 0,
								body: doc,
								mes: ''
							});
						}
					})
		}
	})
})
router.get('/carts', function(req, res, next) {
	res.render('carts', {
		name: req.session.name
	});
})
router.get('/getCarts', function(req, res, next) {
	var cartsModel = global.dbModels.getModel('carts');
	var uId = req.session.id;
	cartsModel.find({
		uId: uId,
		cStatus: false
	}, function(err, doc) {
		if (err) {
			res.send({
				status: 1,
				mes: "服务器错误"
			});
		} else {
			res.send({
				status: 0,
				body: doc,
				mes: ''
			});
		}
	})
})

router.post('/clear', function(req, res, next) {
	console.log('uid:' + req.session.id);
	console.log('cid:' + req.body.cId);
	var cartsModel = global.dbModels.getModel('carts');
	cartsModel.update({
		cId: req.body.cId,
		uId: req.session.id
	}, {
		$set: {
			cQuality: req.body.cQuality,
			cStatus: true
		}
	}, {
		multi: true
	}, function(err, doc) {
		if (err) {
			res.send({
				status: 1,
				mes: "服务器错误"
			});
		} else {
			res.send({
				status: 0,
				body: doc,
				mes: ''
			});
		}
	})
})
router.get('/delete', function(req, res, next) {
	var cartsModel = global.dbModels.getModel('carts');
	cartsModel.remove({
		cId: req.query.cid,
		uId: req.session.id
	}, function(err, doc) {
		if (err) {
			res.send({
				status: 1,
				mes: "服务器错误"
			});
		} else {
			res.send({
				status: 0,
				body: doc,
				mes: ''
			});
		}
	})
})
module.exports = router;