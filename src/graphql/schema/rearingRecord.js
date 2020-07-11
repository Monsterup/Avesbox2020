module.exports = {
    types: `
        type RearingRecord{
            _id: ID!
            date: String!
            death: Int!
            reject: Int!
            growing: Int!
            feedType: String!
            feedTotal: Int!
            creator: User!
            rearing: Rearing!
            createdAt: String!
            updatedAt: String!
            deletedAt: String
        }

        type RearingRecordAll{
            _id: ID!
            date: String!
            house: String!
            rearing: String!
            rearingid: String!
            creator: User!
            growing: Int!
            death: Int!
            reject: Int!
        }

        type RearingRecords{
            totalCount: Int!
            rearingRecords: [RearingRecordAll!]
        }

        type CheckDeleteRearingRecord{
            deleted: Boolean!
        }
    `
    ,
    queries: `
        rearingRecords(keyword: String, limit: Int, skip: Int): RearingRecords
        rearingRecord(_id: ID!): RearingRecord
    `
    ,
    mutations: `
        createRearingRecord(rearingRecordInput: RearingRecordInput): RearingRecord
        updateRearingRecord(_id: ID!, updateRearingRecordInput: UpdateRearingRecordInput): RearingRecord
        deleteRearingRecord(_id: ID!): CheckDeleteRearingRecord
    `
    ,
    inputs: `
        input RearingRecordInput{
            date: String!
            death: Int!
            reject: Int!
            growing: Int!
            feedType: String!
            feedTotal: Int!
            rearing: String!
        }
        input UpdateRearingRecordInput{
            date: String
            death: Int
            reject: Int
            growing: Int
            feedType: String
            feedTotal: Int
            rearing: String
        }
    `
};