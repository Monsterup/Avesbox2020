const FeedStock = require('../../models/feedStock');
const Feed = require('../../models/feed');
const House = require('../../models/house');
const User = require('../../models/user');
const Company = require('../../models/company');
const {transformFeedStock, transformFeed, transformHouse} = require('./merge');

module.exports = {
    feedStocks: async (args, { req }) => {
        if (!req.isAuth)
            throw new Error('Unauthenticated');
        const creator = await User.findById(req.userId);
        try {
            let pakan;
            let kandang;

            const q = [
                {name: {$regex: '.*' + args.keyword + '.*', $options: '-i'}},
            ];

            const houseArr = await House.find({creator})
                .and([{$or: q}])
                .skip(args.skip)
                .limit(args.limit);
            
            let totalCount = await FeedStock.find({house: houseArr})
                .skip(args.skip)
                .countDocuments();
            
            const feedStocks = await FeedStock.find({house: houseArr})
                .skip(args.skip)
                .limit(args.limit);

            const feedArr = await feedStocks.map(async feedStock => {
                pakan = await Feed.findById(feedStock.feed);
                kandang = await House.findById(feedStock.house);
                const arrObject = {
                    _id: feedStock._id,
                    number: feedStock.number,
                    feed: pakan.code,
                    house: kandang.name,
                    type: pakan.type
                };
                return arrObject;
            })
            
            return {
                totalCount,
                feedStocks: feedArr.map(feedStock => {
                    return feedStock
                })
            }

        } catch (error) {
            console.log(error);
        }
    },
  
    feedStock: async (_id, { req }) => {
        if (!req.isAuth)
            throw new Error('Unauthenticated');
        try {
            const feedStock = await FeedStock.findOne({_id});
            if (!feedStock)
                throw new Error('Feed Stock not found');
            return transformFeedStock(feedStock)
        } catch (error) {
            console.log(error);
        }
    },
    createFeedStock: async (args, { req }) => {
        if (!req.isAuth)
            throw new Error('Unauthenticated');
        let feedStock = new FeedStock({
            number: args.feedStockInput.number,
            feed: args.feedStockInput.feed,
            house: args.feedStockInput.house,
            creator: req.userId
        });
        let createdFeedStock;
        try {
            const res = await feedStock.save();
            createdFeedStock = transformFeedStock(res);
            const creator = await User.findById(req.userId);
            const feed = await Feed.findById(args.feedStockInput.feed);
            if (!creator)
                throw new Error('user not found');
            if (!feed)
                throw new Error('feed not found');
            creator.createdFeedStock.push(feedStock);
            feed.feedStocks.push(feedStock);
            await creator.save();
            await feed.save();
            return createdFeedStock;
        } catch (error) {
            throw error;
        }
    },
    updateFeedStock: async (args, { req }) => {
        if (!req.isAuth)
            throw new Error('Unauthenticated');
        let updatedFeedStock;
        try {
            const feedStock = await FeedStock.findOneAndUpdate({_id : args._id},{
                number: args.updateFeedStockInput.number,
                feed: args.updateFeedStockInput.feed,
                house: args.updateFeedStockInput.house
            });
            updatedFeedStock = transformFeedStock(feedStock);
            return updatedFeedStock;
        } catch (error) {
            throw error;
        }
    },
    deleteFeedStock: async (args, { req }) => {
        if (!req.isAuth)
            throw new Error('Unauthenticated');
        let deleted;
        try {
            const res = await FeedStock.findOne(args);
            await res.delete();
            deleted = {deleted : true};
            return deleted;
        } catch (error) {
            throw error;
        }
    },
};