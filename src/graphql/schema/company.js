module.exports = {
    types: `
        type Company{
            _id: ID!
            name: String!
            type: String!
            creator: User!
            feedWarehouse: [FeedWarehouse!]
            companyManage: [Manage!]
            feeds: [Feed!]
            house: [House!]
            createdAt: String!
            updatedAt: String!
            deletedAt: String
        }

        type CompanyAll{
            _id: ID!
            name: String!
            type: String!
            creator: String!
        }

        type Companies{
            totalCount: Int!
            companies: [CompanyAll!]
        }

        type CheckDeleteCompany{
            deleted: Boolean!
        }
    `
    ,
    queries: `
        companies(keyword: String, limit: Int, skip: Int): Companies
        companiesAll(keyword: String, limit: Int, skip: Int): Companies
        company(_id: ID!): Company
    `
    ,
    mutations: `
        createCompany(companyInput: CompanyInput): Company
        updateCompany(_id: ID!, updateCompanyInput: UpdateCompanyInput): Company
        deleteCompany(_id: ID!): CheckDeleteCompany
    `
    ,
    inputs: `
        input CompanyInput{
            name: String!
            type: String!
        }
        input UpdateCompanyInput{
            name: String
            type: String
        }
    `
};