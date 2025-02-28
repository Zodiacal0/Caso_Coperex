import { Router } from "express"
import { updatePassword, updateUser } from "./user.controller.js"
import { updatePasswordValidator, updateUserValidator } from "../middlewares/user-validators.js"

const router = Router()

/**
 * @swagger
 * /user/updatePassword/{uid}:
 *   patch:
 *     summary: Update user password
 *     tags: [User]
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
 *         description: Unique user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: Current password
 *               newPassword:
 *                 type: string
 *                 description: New password
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized (Token missing or invalid)
 *       404:
 *         description: User not found
 */
router.patch("/updatePassword/:uid", 
    updatePasswordValidator, 
    updatePassword
);


/**
 * @swagger
 * /user/updateUser/{uid}:
 *   put:
 *     summary: Update user details
 *     tags: [User]
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
 *         description: Unique user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the user
 *               email:
 *                 type: string
 *                 description: Updated email of the user
 *               role:
 *                 type: string
 *                 description: Updated user role
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized (Token missing or invalid)
 *       404:
 *         description: User not found
 */
router.put("/updateUser/:uid", 
    updateUserValidator, 
    updateUser
);

export default router