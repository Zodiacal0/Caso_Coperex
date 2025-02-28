import {Schema, model} from "mongoose";

const userSchema = Schema({
    name: {
        type: String,
        required: [true, "Name is requiered"],
        maxLength: [25, "Name cannot exceed 25 characteres"]
    },
    surname:{
        type: String,
        required: [true, "Surname is requiered"],
        maxLength: [25, "Surname cannot exceed 25 characteres"]
    },
    email: {
        type: String,
        required: [true, "Email is requiered"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is requiered"]
    },
    phone: {
        type: String,
        minLength: 8,
        maxLength: 8,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ["ADMIN_ROLE"],
        default: "ADMIN_ROLE"
    },
    status: {
        type: Boolean,
        default: true
    },
},
{
    versionKey: false,
    timeStamps: true
});

userSchema.methods.toJSON = function(){
    const {_v, password, _id, ...usuario} = this.toObject()
    usuario.uid = _id;
    return usuario;
};

export default model("User", userSchema);