import express from 'express'
import { validateJwt} from '../middlewares/validate-jwt.js';
import {addCompany, getAllCompaniesAZ, getAllCompaniesZA, updateCompany, generateExcelReport} from './company.controller.js'


const api = express.Router();

api.post('/add',  [validateJwt], addCompany)
api.get('/getAllCompaniesAZ', [validateJwt], getAllCompaniesAZ)
api.get('/getAllCompaniesZA', [validateJwt], getAllCompaniesZA)
api.put('/updateCompany/:id',[validateJwt], updateCompany)
api.get('/generateExcelReport',[validateJwt], generateExcelReport)

export default api
