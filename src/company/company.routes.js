import { Router } from "express"
import { registerCompany , getCompanyFilters, updateCompany } from "./company.controller.js";
import { registerCompanyValidator, listCompanyByFiltersValidator, updateCompanyValidator } from "../middlewares/company-validators.js";

const router = Router()


router.post("/registerCompany", 
    registerCompanyValidator, 
    registerCompany
);


router.get("/getByFilter",
    listCompanyByFiltersValidator,
    getCompanyFilters
)

router.put("/updateCompany/:uid", 
    updateCompanyValidator, 
    updateCompany
);

export default router