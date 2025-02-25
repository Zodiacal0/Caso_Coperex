import { body , param } from "express-validator";
import { emailExist, uidExist } from "../helpers/db-validators.js";
import { validationsFields } from "./fields-validator.js";
import { catchErrors } from "./catch-errors.js";
import { validateJWT } from "./validate-token.js";

export const registerValidator = [
    body("name").not().isEmpty().withMessage("Name is required"),
    body("email").not().isEmpty().withMessage("Email is required").isEmail().withMessage("Invalid Email").custom(emailExist),
    body("password").isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }).withMessage("The password must be more strong"),
    validationsFields,
    catchErrors
];

export const loginValidator = [
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("The password need have 8 characteres"),
    validationsFields,
    catchErrors
];


export const updatePasswordValidator = [
    validateJWT,
    param("uid").isMongoId().withMessage("No es un ID válido de MongoDB").custom(uidExist),
    body("newPassword").isLength({min: 8}).isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }).withMessage("El password debe contener al menos 8 caracteres"),
    validationsFields,
    catchErrors
];

export const updateUserValidator = [
    validateJWT,
    param("uid", "No es un ID válido").isMongoId().custom(uidExist),
    validationsFields,
    catchErrors
];
