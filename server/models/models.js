const sequelize = require('../db');
const nanoid = require('nanoid');
const { DataTypes } = require('sequelize');
const { NUMERIC } = require('sequelize');

const User = sequelize.define('user', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	email: { type: DataTypes.STRING, unique: true },
	password: { type: DataTypes.STRING },
	role: { type: DataTypes.STRING, defaultValue: 'USER' },
});

const Basket = sequelize.define('basket', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const BasketDevice = sequelize.define(
	'basket_device',
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		count: {
			type: DataTypes.INTEGER,
			defaultValue: 1,
		},
	},
	// {
	// 	hooks: {
	// 		beforeUpdate: (data, options) => {
	// 			console.log(data.toJSON(),'hooks before update');
	// 			if (data.count>10) data.count = Math.ceil(Math.random()*10);
	// 		},
	// 		afterUpdate: (data, options) => {
	// 			console.log(data.toJSON(), options, 'hooks after update');				
	// 		},
	// 	},
	// }
);

const Order = sequelize.define('order', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	uuid: { type: DataTypes.UUID, unique: true, allowNull: false, defaultValue: DataTypes.UUIDV4 },
});

const OrderDevice = sequelize.define(
	'order_device',
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		count: {
			type: DataTypes.INTEGER,
			defaultValue: 1,
		},
	}
	// {
	// 	hooks: {
	// 		beforeUpdate: (data, options) => {
	// 			console.log(data.toJSON(),'hooks before update');
	// 			if (data.count>10) data.count = Math.ceil(Math.random()*10);
	// 		},
	// 		afterUpdate: (data, options) => {
	// 			console.log(data.toJSON(), options, 'hooks after update');
	// 		},
	// 	},
	// }
);

const Device = sequelize.define('device', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	name: { type: DataTypes.STRING, unique: true, allowNull: false },
	price: { type: DataTypes.FLOAT, allowNull: false },
	rating: { type: DataTypes.INTEGER, defaultValue: 0 },
	img: { type: DataTypes.STRING, allowNull: false },
});

const Type = sequelize.define('type', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const Brand = sequelize.define('brand', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const Rating = sequelize.define('rating', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	rate: { type: DataTypes.INTEGER, allowNull: false },
});

const DeviceInfo = sequelize.define('device_info', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	title: { type: DataTypes.STRING, allowNull: false },
	description: { type: DataTypes.STRING, allowNull: false },
});

const TypeBrand = sequelize.define('type_brand', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

User.hasOne(Device);
Basket.belongsTo(User);
Order.belongsTo(User);

User.hasMany(Rating, { as: 'rate' });
Rating.belongsTo(User);

Type.hasMany(Device);
Device.belongsTo(Type);

Brand.hasMany(Device);
Device.belongsTo(Brand);

Device.hasMany(Rating, { as: 'rate' });
Rating.belongsTo(Device);

Device.hasMany(DeviceInfo, { as: 'info' });
DeviceInfo.belongsTo(Device);

// The Super Many-to-Many relationship
Basket.belongsToMany(Device, { through: BasketDevice });
Device.belongsToMany(Basket, { through: BasketDevice });

Basket.hasMany(BasketDevice, { as: 'baskets' });

Order.belongsToMany(Device, { through: OrderDevice });
Device.belongsToMany(Order, { through: OrderDevice });

Order.hasMany(OrderDevice, { as: 'orders' });
//BasketDevice.belongsTo(Basket);
//BasketDevice.hasOne(Device);
//Device.hasMany(BasketDevice);

//BasketDevice.belongsTo(Device);
//Device.hasOne(BasketDevice);

Type.belongsToMany(Brand, { through: TypeBrand });
Brand.belongsToMany(Type, { through: TypeBrand });

module.exports = {
	User,
	Basket,
	BasketDevice,
	Order,
	OrderDevice,
	Device,
	Type,
	Brand,
	Rating,
	TypeBrand,
	DeviceInfo,
};
