module.exports = {
    types: `
        type Mutation{
            _id: ID!
            death: Int!
            reject: Int!
            rearingRecord: RearingRecord!
            creator: User!
            createdAt: String!
            updatedAt: String!
            deletedAt: String
        }

        type Mutations{
            totalCount: Int!
            mutations: [Mutation!]
        }

        type CheckDeleteMutation{
            deleted: Boolean!
        }
    `
    ,
    queries: `
        mutations(keyword: String, limit: Int, skip: Int): Mutations
        mutation(_id: ID!): Mutation
    `
    ,
    mutations: `
        createMutation(mutationInput: MutationInput): Mutation
        updateMutation(_id: ID!, updateMutationInput: UpdateMutationInput): Mutation
        deleteMutation(_id: ID!): CheckDeleteMutation
    `
    ,
    inputs: `
        input MutationInput{
            death: Int!
            reject: Int!
            rearingRecord: String!
        }
        input UpdateMutationInput{
            death: Int
            reject: Int
        }
    `
};