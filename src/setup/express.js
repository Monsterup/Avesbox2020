// import express from 'express'
// import bodyParser from 'body-parser'
// import cookieParser from 'cookie-parser'
// import dotenv from 'dotenv'
// import cors from 'cors'
// import jwt from 'jsonwebtoken'
// import { ApolloServer } from 'apollo-server-express'
// import graphqlSchema from '../graphql/schema'
// import graphqlResolvers from '../graphql/resolvers'
// import isAuth from '../middleware/is-auth'
// import user from '../modules/user/routes'
// import User from '../models/user'

// function setupExpress() {
//     dotenv.config();
//     const app = express();

//     app.use(cors({
//         origin: true,
//         credentials: true
//     }))
//     app.use(cookieParser())
//     app.use(bodyParser.urlencoded({
//         extended: true
//     }))
//     app.use(bodyParser.json());

//     let port = process.env.PORT || 5000
//     global.config_ = require('../../config')

//     app.use(isAuth);
//     app.use('/', user)
// }