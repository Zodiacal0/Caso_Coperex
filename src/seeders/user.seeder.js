import User from '../user/user.model.js';
import { hash } from 'argon2';

export const userSeeder = async() =>{
    try{

        const user = await User.findOne({role: "ADMIN_ROLE"});

        const encriptedPassword = await hash("Admin123@");

        if(!user){
            await User.create({
                name: "Admin",
                surname: "Admin",
                email: "adminexample@gmail.com",
                password: encriptedPassword,
                phone: "12345678",
            })
            console.log("Admin is created succefully")
        }else{
            console.log("Admin is already created")
        }
        
    }catch (error){
        console.log(`Error at create admin : ${error}`);
    }
}