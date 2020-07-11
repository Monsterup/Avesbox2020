const RearingRecord = require('../../models/rearingRecord');
const Rearing = require('../../models/rearing');
const User = require('../../models/user');
const House = require('../../models/house');
const {transformRearingRecord} = require('./merge');

module.exports = {
    // Rearing Records
    rearingRecords: async (args, { req }) => {
        if (!req.isAuth)
            throw new Error('Unauthenticated');
        const creator = await User.findOne({_id: req.userId});
        try {
            let rearing;
            let house;

            const q = [
                {otherInformation: {$regex: '.*' + args.keyword + '.*', $options: '-i'}},
            ];

            const rearingArr = await Rearing.find({creator})
                .and([{$or: q}])
                .skip(args.skip)
                .limit(args.limit);

            const totalCount = await RearingRecord.find({rearing: rearingArr})
                .skip(args.skip)
                .countDocuments();
            console.log(totalCount)
            const rearingRecords = await RearingRecord.find({rearing: rearingArr})
                .skip(args.skip)
                .limit(args.limit)

            const rearingRecordArr = rearingRecords.map(async RR => {
                rearing = await Rearing.findById(RR.rearing);
                house = await House.findById(rearing.house);
                const arrObject = {
                    _id: RR._id,
                    rearing: rearing.otherInformation,
                    rearingid: rearing._id,
                    house: house.name,
                    date: RR.date,
                    growing: RR.growing,
                    death: RR.death,
                    reject: RR.reject
                }
                
                return arrObject;
            });
            
            return {
                totalCount,
                rearingRecords: rearingRecordArr.map(rearingRecord => {
                    return rearingRecord
                })
            }
        } catch (error) {
            console.log(error);
        }
    },
    // Rearing Record
    rearingRecord: async (_id, { req }) => {
        if (!req.isAuth)
            throw new Error('Unauthenticated');
        try {
            const rearingRecord = await RearingRecord.findOne({_id})
            if(!rearingRecord)
                throw new Error('Rearing record not found');
            return transformRearingRecord(rearingRecord)
        } catch (error) {
            console.log(error);
        }
    },
    // Create
    createRearingRecord: async (args, { req }) => {
        if (!req.isAuth)
            throw new Error('Unauthenticated');
        let rearingRecord = new RearingRecord({
            date: args.rearingRecordInput.date,
            death: args.rearingRecordInput.death,
            reject: args.rearingRecordInput.reject,
            growing: args.rearingRecordInput.growing,
            feedType: args.rearingRecordInput.feedType,
            feedTotal: args.rearingRecordInput.feedTotal,
            rearing: args.rearingRecordInput.rearing,
            creator: req.userId
        });
        let createdRearingRecord;
        try {
            const res = await rearingRecord.save();
            createdRearingRecord = transformRearingRecord(res);
            const creator = await User.findById(req.userId);
            const rearing = await Rearing.findById(args.rearingRecordInput.rearing);
            if (!creator)
                throw new Error('user not found');
            creator.createdRearingRecord.push(rearingRecord);
            if (!rearing)
                throw new Error('user not found');
            rearing.rearingRecord.push(rearingRecord);
            await rearing.save();
            return createdRearingRecord;
        } catch (error) {
            throw error;
        }
    },
    // Update
    updateRearingRecord: async (args, { req }) => {
        if (!req.isAuth)
            throw new Error('Unauthenticated');
        let updatedRearingRecord;
        try {
            const rearingRecord = await RearingRecord.findOneAndUpdate({_id : args._id},{
                date: args.updateRearingRecordInput.date,
                death: args.updateRearingRecordInput.death,
                reject: args.updateRearingRecordInput.reject,
                growing: args.updateRearingRecordInput.growing,
                feedType: args.updateRearingRecordInput.feedType,
                feedTotal: args.updateRearingRecordInput.feedTotal,
                rearing: args.updateRearingRecordInput.rearing,
                creator: req.userId
            });
            updatedRearingRecord = transformRearingRecord(rearingRecord);
            return updatedRearingRecord;
        } catch (error) {
            throw error;
        }
    },
    // Delete
    deleteRearingRecord: async (args, { req }) => {
        if (!req.isAuth)
            throw new Error('Unauthenticated');
        let deleted;
        try {
            const res = await RearingRecord.findOne(args);
            console.log(res);
            await res.delete();
            deleted = {deleted : true};
            return deleted;
        } catch (error) {
            throw error;
        }
    }
};