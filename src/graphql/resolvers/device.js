const Device = require('../../models/device');
const User = require('../../models/user');
const House = require('../../models/house');
const {transformDevice} = require('./merge');

module.exports = {
    devices: async (args, { req }) => {
        if (!req.isAuth)
            throw new Error('Unauthenticated');
        const creator = await User.findOne({_id: req.userId});
        try {
            let house;
            let user;
            const q = [
                {serialNumber: {$regex: '.*' + args.keyword + '.*', $options: '-i'}},
            ];
            let totalCount = await Device.find({creator})
                .and([{$or: q}])
                .skip(args.skip)
                .countDocuments();
            const devices = await Device.find({creator})
                .and([{$or: q}])
                .sort({serialNumber: 1})
                .skip(args.skip)
                .limit(args.limit);
            
            const deviceArr = devices.map(async device => {
                house = await House.findById(device.house);
                if(!house) {
                    house = {
                        name: "-"
                    }
                }
                const arrObject = {
                    _id: device._id,
                    serialNumber: device.serialNumber,
                    deviceType: device.deviceType,
                    house: house.name,
                    creator: creator.name
                }
                
                return arrObject;
            })
            
            return {
                totalCount,
                devices: deviceArr.map(device => {
                    return device;
                })
            }
        } catch (error) {
            console.log(error);
        }
    },
    devicesAll: async (args, { req }) => {
        if (!req.isAuth)
            throw new Error('Unauthenticated');
        const user = await User.findOne({_id: req.userId});
        if (user.type !== 'admin')
            throw new Error('Unauthorized');
        try {
            let house;
            const q = [
                {serialNumber: {$regex: '.*' + args.keyword + '.*', $options: '-i'}},
            ];
            let totalCount = await Device.find()
                .and([{$or: q}])
                .skip(args.skip)
                .countDocuments();
            const devices = await Device.find()
                .and([{$or: q}])
                .sort({serialNumber: 1})
                .skip(args.skip)
                .limit(args.limit);
            
            console.log(totalCount)
            
            const deviceArr = devices.map(async device => {
                let user = "-";
                user = await User.findById(device.creator);
                house = await House.findById(device.house);
                if(!house) {
                    house = {
                        name: "-"
                    }
                }
                const arrObject = {
                    _id: device._id,
                    serialNumber: device.serialNumber,
                    deviceType: device.deviceType,
                    house: house.name,
                    creator: user.username
                }
                
                return arrObject;
            })
            
            return {
                totalCount,
                devices: deviceArr.map(device => {
                    return device;
                })
            }
        } catch (error) {
            console.log(error);
        }
    },
    device: async (_id, { req }) => {
        if (!req.isAuth)
            throw new Error('Unauthenticated');
        try {
            const devices = await Device.findOne({_id});
            if (!devices)
                throw new Error('Device not found');
            return transformDevice(devices)
        } catch (error) {
            console.log(error);
        }
    },
    createSN: async (args, { req }) => {
        if (!req.isAuth)
            throw new Error('Unauthenticated');
        const user = await User.findOne({_id: req.userId});
        if (user.type !== 'admin')
            throw new Error('Unauthorized');
        let created;
        let devices = [];
        try {
            args.SN.map(async(x) => {
                let device = new Device({
                    serialNumber: x.serialNumber,
                    creator: args.creator
                });
                devices.push(device)
                await device.save();
            });
            console.log(devices);
            const creator = await User.findById(args.creator);
            if (!creator)
                throw new Error('user not found');
            devices.map(async(x) => {
                creator.createdDevices.push(x);
                await creator.save();
            })
            created = {created : true};
            return created;
        } catch (error) {
            throw error;
        }
    },
    createDevice: async (args, { req }) => {
        if (!req.isAuth)
            throw new Error('Unauthenticated');
        let device = new Device({
            serialNumber: args.deviceInput.serialNumber,
            house: args.deviceInput.house,
            deviceType: args.deviceInput.deviceType,
            creator: req.userId
        });
        let createdDevice;
        try {
            const res = await device.save();
            createdDevice = transformDevice(res);
            const creator = await User.findById(req.userId);
            if (!creator)
                throw new Error('user not found');
            creator.createdDevices.push(device);
            await creator.save();
            return createdDevice;
        } catch (error) {
            throw error;
        }
    },
    updateDevice: async (args, { req }) => {
        if (!req.isAuth)
            throw new Error('Unauthenticated');
        let updatedDevice;
        try {
            const device = await Device.findOneAndUpdate({_id : args._id},{
                serialNumber: args.updateDeviceInput.serialNumber,
                house: args.updateDeviceInput.house,
                creator: req.userId
            });
            updatedDevice = transformDevice(device);
            return updatedDevice;
        } catch (error) {
            throw error;
        }
    },
    updateDeviceAdmin: async (args, { req }) => {
        if (!req.isAuth)
            throw new Error('Unauthenticated');
        let updatedDevice;
        try {
            const device = await Device.findOneAndUpdate({_id : args._id},{
                serialNumber: args.updateDeviceInput.serialNumber,
                creator: args.updateDeviceInput.creator
            });
            updatedDevice = transformDevice(device);
            return updatedDevice;
        } catch (error) {
            throw error;
        }
    },
    deleteDevice: async (args, { req }) => {
        if (!req.isAuth)
            throw new Error('Unauthenticated');
        let deleted;
        try {
            const res = await Device.findOne(args);
            await res.delete();
            deleted = {deleted : true};
            return deleted;
        } catch (error) {
            throw error;
        }
    }
};