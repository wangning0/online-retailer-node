module.exports = {
	users:{
		name:{type:String},
		password:{type:String}
	},
	commodities:{
		cName:{type:String},
		cPrice:{type:Number},
		cImgSrc:{type:String}
	},
	carts:{
		uId:{type:String},
		cId:{type:String},
		cName:{type:String},
		cPrice:{type:Number},
		cImgSrc:{type:String},
		cQuality:{type:Number},
		cStatus:{type:Boolean,default:false}
	}
}