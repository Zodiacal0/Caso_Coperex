import { body , param } from "express-validator";
import { companyExist } from "../helpers/db-validators.js";
import { validationsFields } from "./fields-validator.js";
import { catchErrors } from "./catch-errors.js";
import { validateJWT } from "./validate-token.js";

export const registerCompanyValidator = [
    validateJWT,
    body("name").not().isEmpty().withMessage("Name is required"),
    body("email").not().isEmpty().withMessage("Email is required").isEmail().withMessage("Invalid Email"),
    body("phone").not().isEmpty().withMessage("Phone is required"),
    body("address").not().isEmpty().withMessage("Address is required"),
    body("impactLevel").not().isEmpty().withMessage("Impact Level is required"),
    body("category").not().isEmpty().withMessage("Impact Level is required").isIn(["Technology", "Healthcare", "Education", "Industry & Manufacturing", "Services"]).withMessage("Only must be Technology, Healthcare, Education, Industry & Manufacturing, Services"),
    body("creationYear").isNumeric().withMessage("The creation year must be number").not().isEmpty().withMessage("Impact Level is required"),
    validationsFields,
    catchErrors
];

export const listCompanyByFiltersValidator = [
    validateJWT,
    body("filterTypes").notEmpty().withMessage("FilterType is required"),
    body("category").optional().isIn(["Technology", "Healthcare", "Education", "Industry & Manufacturing", "Services"]).withMessage("Only must be Technology, Healthcare, Education, Industry & Manufacturing, Services"),
    body("rangoMin").optional().isNumeric().withMessage("The range minimun must be Number"),
    body("rangoMax").optional().isNumeric().withMessage("The range maximun must be Number"),
    validationsFields,
    catchErrors
];


export const updateCompanyValidator = [
    validateJWT,
    param("uid").isMongoId().withMessage("No es un ID válido de MongoDB").custom(companyExist),
    body("category").optional().isIn(["Technology", "Healthcare", "Education", "Industry & Manufacturing", "Services"]).withMessage("Only must be Technology, Healthcare, Education, Industry & Manufacturing, Services"),
    body("creationYear").optional().isNumeric().withMessage("The creation year must be number"),
    validationsFields,
    catchErrors
];
