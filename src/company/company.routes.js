import { Router } from "express"
import { registerCompany , getCompanyFilters, updateCompany } from "./company.controller.js";
import { registerCompanyValidator, listCompanyByFiltersValidator, updateCompanyValidator } from "../middlewares/company-validators.js";

const router = Router()

/**
 * @swagger
 * /company/registerCompany:
 *   post:
 *     summary: Register a new company
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer Token required for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the company
 *               category:
 *                 type: string
 *                 description: Business category
 *               yearsOfExperience:
 *                 type: integer
 *                 description: Years of experience
 *     responses:
 *       201:
 *         description: Company registered successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized (Token missing or invalid)
 */
router.post("/registerCompany", 
    registerCompanyValidator, 
    registerCompany
);

/**
 * @swagger
 * /company/getByFilter:
 *   get:
 *     summary: Retrieve companies based on filters
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer Token required for authentication
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: experienceMin
 *         schema:
 *           type: integer
 *         description: Minimum years of experience
 *       - in: query
 *         name: experienceMax
 *         schema:
 *           type: integer
 *         description: Maximum years of experience
 *     responses:
 *       200:
 *         description: List of filtered companies
 *       400:
 *         description: Invalid filters
 *       401:
 *         description: Unauthorized (Token missing or invalid)
 */
router.get("/getByFilter",
    listCompanyByFiltersValidator,
    getCompanyFilters
)

/**
 * @swagger
 * /company/updateCompany/{uid}:
 *   put:
 *     summary: Update company details
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer Token required for authentication
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique company ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the company
 *               category:
 *                 type: string
 *                 description: Updated business category
 *               yearsOfExperience:
 *                 type: integer
 *                 description: Updated years of experience
 *     responses:
 *       200:
 *         description: Company updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized (Token missing or invalid)
 *       404:
 *         description: Company not found
 */
router.put("/updateCompany/:uid", 
    updateCompanyValidator, 
    updateCompany
);

export default router