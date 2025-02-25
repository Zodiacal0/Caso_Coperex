import { hash , verify } from "argon2";
import User from "../user/user.model.js";
import { generateJWT } from "../helpers/generate-jwr.js";

export const register = async(req,res) =>{
    try{

        const data = req.body
        const encryptedPass = await hash(data.password);
        data.password = encryptedPass;
        console.log(data)

        const user = await User.create(data)

        return res.status(201).json({
            message: "User has been created",
            name: user.name,
            email: user.email,
            role: user.role
        })
    }catch(error){
        return res.status(500).json({
            message: "user registration failed",
            error: error.message
        })
    }
}

export const login = async(req,res) =>{
    const {email, password} = req.body
    try{
        const user = await User.findOne({ email });

        if(!user){
            return res.status(400).json({
                message: "Credenciales inválidas",
                error: "correo electrónico"
            })
        };

        const validPassword = await verify(user.password, password);

        if(!validPassword){
            return res.status(400).json({
                message: "Credenciale inválidas",
                error: "Contraseña incorrecta"
            })
        }

        const token = await generateJWT(user.id);

        return res.status(200).json({
            message: "Login succeful",
            userDetails: {
                token: token,
            }
        })

    }catch(err){
        return res.status(500).json({ 
            message: "login failed, server Error",
            error: err.message
        })    
    }
}
