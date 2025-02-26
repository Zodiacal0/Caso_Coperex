import User from "../user/user.model.js";
import Company from "../company/company.model.js"

export const emailExist = async(email = "") =>{
    const exist = await User.findOne({email});
    if(exist){
        throw new Error(`The email ${email} is already registered`);
    }

};

export const uidExist = async(uid = "") =>{
    const exist = await User.findById(uid);
    if(!exist){
        throw new Error("No exixte el ID proporcionado");
    }
};

export const companyExist = async(uid = "") =>{
    const exist = await Company.findById(uid);
    if(!exist){
        throw new Error("No exixte el ID proporcionado");
    }
};

