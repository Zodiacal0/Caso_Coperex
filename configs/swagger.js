import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "API COPEREX",
            version: "1.3.0",
            description: "API Coperex",
            contact: {
                name: "Javier Herrera",
                email: "jherrera-2020459@kinal.edu.gt"
            }
        },
        servers: [
            {
                url: "http://127.0.0.1:3005/casocoperex/v1"
            }
        ]
    },
    apis: [
        "./src/Auth/auth.routes.js",
        "./src/user/user.routes.js",
        "./src/company/company.routes.js"
    ]
};

const swaggerDocs = swaggerJSDoc(options);

export { swaggerDocs, swaggerUi };