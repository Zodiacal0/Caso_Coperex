import {Schema, model} from "mongoose";

const companySchema = Schema({
    name: {
        type: String,
        required: [true, "Name is requiered"],
        maxLength: [25, "Name cannot exceed 25 characteres"]
    },
    email: {
        type: String,
        required: [true, "Email is requiered"],
    },
    phone: {
        type: String,
        minLength: 8,
        maxLength: 8,
        required: true,
    },
    address:{
        type: String,
        required: [true, "Addres is required"],
    },
    impactLevel: {
        type: String,
        required: [true, "Impact Level is required"],
    },
    yearsOfExperience:{
        type: Number,
    },
    category:{
        type: String,
        enum: ["Technology", "Healthcare", "Education", "Industry & Manufacturing", "Services"],
        required: true
    },
    creationYear:{
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true,
    },
},
{
    versionKey: false,
    timeStamps: true
});

companySchema.methods.toJSON = function(){
    const {_v, password, _id, ...company} = this.toObject()
    company.uid = _id;
    return company;
};

export default model("Company", companySchema);