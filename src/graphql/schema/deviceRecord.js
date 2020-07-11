module.exports = {
    types: `
        type DeviceRecord{
            _id: ID!
            value: Float!
            device: Device!
            sensorType: String!
            date: String!
            createdAt: String!
            updatedAt: String!
            deletedAt: String
        }

        type DeviceRecordAll{
            _id: ID!
            value: Float!
            device: String!
            date: String!
            house: String!
            sensorType: String!
            createdAt: String!
            updatedAt: String!
            deletedAt: String
        }

        type DeviceRecords{
            totalCount: Int!
            deviceRecords: [DeviceRecordAll!]
        }

        type CheckDeleteDeviceRecord{
            deleted: Boolean!
        }
    `
    ,
    queries: `
        deviceRecords(keyword: String, limit: Int, skip: Int): DeviceRecords
        deviceRecord(_id: ID!): DeviceRecord
        `
    ,
    mutations: `
        createDeviceRecord(deviceRecordInput: DeviceRecordInput): DeviceRecord
        updateDeviceRecord(_id: ID!, updateDeviceRecordInput: UpdateDeviceRecordInput): DeviceRecord
        deleteDeviceRecord(_id: ID!): CheckDeleteDeviceRecord
    `
    ,
    inputs: `
        input DeviceRecordInput{
            value: Float!
            device: String
            sensorType: String
            date: String
        }
        input UpdateDeviceRecordInput{
            value: Float
            device: String
            sensorType: String
            date: String
        }
    `
};