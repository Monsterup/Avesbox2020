module.exports = {
    types: `
        type Device{
            _id: ID!
            serialNumber: String!
            house: House
            deviceType: String
            deviceRecord: [DeviceRecord!]
            creator: User!
            createdAt: String!
            updatedAt: String!
            deletedAt: String
        }

        type DeviceAll{
            _id: ID!
            serialNumber: String!
            deviceType: String
            house: String
            creator: String
        }

        type Devices{
            totalCount: Int!
            devices: [DeviceAll!]
        }

        type CheckCreatedDevice{
            created: Boolean!
        }

        type CheckDeleteDevice{
            deleted: Boolean!
        }
    `
    ,
    queries: `
        devices(keyword: String, limit: Int, skip: Int): Devices
        devicesAll(keyword: String, limit: Int, skip: Int): Devices
        device(_id: ID!): Device
    `
    ,
    mutations: `
        createSN(SN: [SN!]!, creator: String!): CheckCreatedDevice
        createDevice(deviceInput: DeviceInput): Device
        updateDevice(_id: ID!, updateDeviceInput: UpdateDeviceInput): Device
        updateDeviceAdmin(_id: ID!, updateDeviceInput: UpdateDeviceInput): Device
        deleteDevice(_id: ID!): CheckDeleteDevice
    `
    ,
    inputs: `
        input SN{
            serialNumber: String!
        }
        input DeviceInput{
            serialNumber: String!
            house: String!
            deviceType: String!
        }
        input UpdateDeviceInput{
            serialNumber: String
            house: String
            deviceType: String
            creator: String
        }
    `
};