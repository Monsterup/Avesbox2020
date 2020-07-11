const DeviceRecord = require('../../models/deviceRecord');
const SensorType = require('../../models/sensorType');
const Device = require('../../models/device');
const User = require('../../models/user');
const {transformDeviceRecord} = require('./merge');

module.exports = {
    // Device Records
    deviceRecords: async (args, {req}) => {
        if (!req.isAuth)
            throw new Error('Unauthenticated');
        const creator = await User.findOne({_id: req.userId});
        try {
            let device;

            const q = [
                {serialNumber: {$regex: '.*' + args.keyword + '.*', $options: '-i'}},
            ];

            const deviceArr = await Device.find({creator})
                .and([{$or: q}])
                .skip(args.skip)
                .limit(args.limit);

            let totalCount = await DeviceRecord.find({device: deviceArr})
                .skip(args.skip)
                .countDocuments();

            const deviceRecords = await DeviceRecord.find({device: deviceArr})
                .skip(args.skip)
                .limit(args.limit)
                
            const deviceRecordArr = await deviceRecords.map(async dr => {
                        device = await Device.findById(dr.device);
                        const arrObject = {
                            _id: dr._id,
                            value: dr.value,
                            date: dr.date,
                            sensorType: dr.sensorType,
                            device: device.serialNumber,
                            house: device.house,
                        };
                        return arrObject;
                    }
                )

            return {
                totalCount,
                deviceRecords: deviceRecordArr.map(deviceRecord => {
                    return deviceRecord
                })
            }
        } catch (error) {
            console.log(error);
        }
    },
    // Device Record
    deviceRecord: async (_id, { req }) => {
        if (!req.isAuth)
            throw new Error('Unauthenticated');
        try {
            const deviceRecord = await DeviceRecord.findOne({_id});
            if(!deviceRecord)
                throw new Error('Device Record not found');
            return transformDeviceRecord(deviceRecord)
        } catch (error) {
            console.log(error);
        }
    },
    // Create
    createDeviceRecord: async (args, { req }) => {
        if (!req.isAuth)
            throw new Error('Unauthenticated');
        let deviceRecord = new DeviceRecord({
            value: args.deviceRecordInput.value,
            device: args.deviceRecordInput.device,
            sensorType: args.deviceRecordInput.sensorType,
            date: args.deviceRecordInput.date
        });
        let createdDeviceRecord;
        try {
            const res = await deviceRecord.save();
            createdDeviceRecord = transformDeviceRecord(res);
            const device = await Device.findById(args.deviceRecordInput.device);
            if (!device)
                throw new Error('device not found');
            device.deviceRecord.push(deviceRecord);
            await device.save();
            return createdDeviceRecord;
        } catch (error) {
            throw error;
        }
    },
    // Update
    updateDeviceRecord: async (args, { req }) => {
        if (!req.isAuth)
            throw new Error('Unauthenticated');
        let updatedDeviceRecord;
        try {
            // const dr = await DeviceRecord.findById({_id});
            // let tmpDevice = await Device.findOneAndUpdate({_id: dr.device}, {
            //     $pull: { 'deviceRecord' : dr._id }
            // });

            const deviceRecord = await DeviceRecord.findOneAndUpdate({_id : args._id},{
                date: args.updateDeviceRecordInput.date,
                device: args.updateDeviceRecordInput.device,
                value: args.updateDeviceRecordInput.value,
                sensorType: args.updateDeviceRecordInput.sensorType,
            });

            const device = await Device.findById(args.updateDeviceRecordInput.device);
            if (!device)
                throw new Error('device not found');
            device.deviceRecord.push(deviceRecord);

            updatedDeviceRecord = transformDeviceRecord(deviceRecord);
            return updatedDeviceRecord;
        } catch (error) {
            throw error;
        }
    },
    // // Delete
    deleteDeviceRecord: async (args, { req }) => {
        if (!req.isAuth)
            throw new Error('Unauthenticated');
        let deleted;
        try {
            const res = await DeviceRecord.findOne(args);
            await res.delete();
            deleted = {deleted : true};
            return deleted;
        } catch (error) {
            throw error;
        }
    }
};