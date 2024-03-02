import { generateJwt } from '../utils/jwt.js'
import { encrypt, checkPassword, checkUpdate } from '../utils/validator.js'
import Admin from './user.model.js'


export const test = (req, res) => {
    console.log('test is running')
    return res.send({ message: 'Test is running' })
}


export const registerAdmin = async(req, res)=>{
    try{
        //Captura
        let data = req.body
        //Encriptar la contraseña
        data.password = await encrypt(data.password)
        data.role = "ADMIN"
        //Guardar la información
        let admin = new Admin(data)
        await admin.save()
        //Nos enseña un mensaje de exito o que fallo
        return res.send({message: `Registered successfully, can be logged with username ${admin.username}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error registering admin', err: err})
    }
}


export const login = async (req, res) => {
    try {
        // Capturar
        let { username, email, password } = req.body;
        
        // Validar
        let admin;
        if (username) {
            admin = await Admin.findOne({ username });
        } else if (email) {
            admin = await Admin.findOne({ email });
        } else {
            return res.status(400).send({ message: 'Username or email is required' });
        }

        // Verificamos el admin y password
        if (admin && await checkPassword(password, admin.password)) {
            let loggedAdmin = {
                uid: admin._id,
                username: admin.username,
                name: admin.name,
                role: admin.role
            };
            // Generar el Token
            let token = await generateJwt(loggedAdmin);
            // Responder al usuario
            return res.send({
                message: `Welcome ${loggedAdmin.name}`,
                loggedAdmin,
                token
            });
        }

        return res.status(404).send({ message: 'Invalid credentials' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error to login' });
    }
};
