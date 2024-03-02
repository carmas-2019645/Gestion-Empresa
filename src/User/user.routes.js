import express from 'express'
import { validateJwt} from '../middlewares/validate-jwt.js';
import {test, registerAdmin, login} from './user.controller.js'

const api = express.Router();

api.get('/test', [validateJwt], test)
api.post('/registerAdmin', registerAdmin)
api.post('/login', login)


export default api
