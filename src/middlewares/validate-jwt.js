'use strict'

import jwt from 'jsonwebtoken'
import Admin from '../User/user.model.js'

export const validateJwt = async(req, res, next)=>{
    try{
        //Obtener
        let secretKey = process.env.SECRET_KEY
        //obtener el token
        let { authorization } = req.headers
        //Verificar
        if(!authorization) return res.status(401).send({message: 'Unauthorized'})
        //Obtener el uid
        let { uid } = jwt.verify(authorization, secretKey)
        //Validar si existe
        let admin = await Admin.findOne({_id: uid})
        if(!admin) return res.status(404).send({message: 'User not found - Unauthorized'})
        req.admin = admin
        next()
    }catch(err){
        console.error(err)
        return res.status(401).send({message: 'Invalid Authorization'})
    }
}
