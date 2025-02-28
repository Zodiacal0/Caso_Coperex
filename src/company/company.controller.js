import Company from "../company/company.model.js"
import fs, { cp } from "fs";
import path from "path";
import ExcelJS from "exceljs";

export const registerCompany = async(req,res) =>{
    try{
        const data = req.body
        const year = new Date().getFullYear()

        if (!data.creationYear || data.creationYear < 1900) {
            return res.status(400).json({
                success: false,
                message: "Invalid creation year",
                error: "The 'creationYear' field must be a valid 4-digit year"
            });
        }

        if (data.creationYear > year) {
            return res.status(400).json({
                success: false,
                message: "Invalid creation year",
                error: `The 'creationYear' cannot be greater than ${year}`
            });
        }

        const experience = ( year - data.creationYear )
        data.yearsOfExperience = experience
        const company = await Company.create(data)

        return res.status(201).json({
            success: true,
            message: "Company has been created",
            company
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Company registration failed",
            error: error.message
        })
    }
}

export const getCompanyFilters = async (req, res) => {
    try {
        const { category, rangoMin, rangoMax, experienceMin, experienceMax } = req.body;
        const filterTypes = Array.isArray(req.body.filterTypes) ? req.body.filterTypes : [];
        let query = {};
        let sortOption = {};
        let result = [];

        if (filterTypes.includes(2)) {
            if (!category) {
                return res.status(400).json({
                    success: false,
                    message: "Category is required for this filter",
                });
            }
            query.category = category;
            result.push(`Filtered by Category: ${category}`);
        }

        if(filterTypes.includes(1)) {
            sortOption.yearsOfExperience = -1;
            result.push("Sorted by Years of Experience (Descending)");
        }

        if(filterTypes.includes(3)) {
            sortOption.name = 1;
            result.push("Sorted by Name (A-Z)");
        } else if (filterTypes.includes(4)) {
            sortOption.name = -1;
            result.push("Sorted by Name (Z-A)");
        }

        if (experienceMin && experienceMax) {
            query.yearsOfExperience = { $gte: Number(experienceMin), $lte: Number(experienceMax) };
        }

        const companies = await Company.find(query)
            .sort(sortOption)
            .skip(Number(rangoMin) || 0) 
            .limit(Number(rangoMax) || 10); 

        generateReport(companies);

        return res.status(200).json({
            success: true,
            appliedFilters: result,
            companies,
        });

    } catch (err) {
        console.error("Error:", err.message);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve companies",
            error: err.message,
        });
    }
};


export const updateCompany = async (req, res) => {
    try {
        const { uid } = req.params;
        const  data  = req.body;
        const year = new Date().getFullYear()
        const experience = ( year - data.creationYear )
        data.yearsOfExperience = experience.toString()

        const company = await Company.findByIdAndUpdate(uid, data, { new: true });

        res.status(200).json({
            success: true,
            msg: "Company updated",
            company,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: "Error to update the Company",
            error: err.message
        });
    }
}

const getFormattedDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
};

export const generateReport = async (companies) => {
    try {
        if (!companies || companies.length === 0) {
            throw new Error("No companies found");
        }

        const exportDir = path.join("public", "docs");
        if (!fs.existsSync(exportDir)) {
            fs.mkdirSync(exportDir, { recursive: true });
        }

        const timestamp = getFormattedDateTime();
        const fileName = `companiesReport_${timestamp}.xlsx`;
        const exportPath = path.join(exportDir, fileName);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Companies");

        worksheet.columns = [
            { header: "ID", key: "uid", width: 10 },
            { header: "Name", key: "name", width: 25 },
            { header: "Email", key: "email", width: 30 },
            { header: "Phone", key: "phone", width: 15 },
            { header: "Address", key: "address", width: 40 },
            { header: "Impact Level", key: "impactLevel", width: 15 },
            { header: "Years of Experience", key: "yearsOfExperience", width: 20 },
            { header: "Category", key: "category", width: 25 },
            { header: "Creation Year", key: "creationYear", width: 15 },
            { header: "Status", key: "status", width: 10 }
        ];

        companies.forEach((company) => {
            worksheet.addRow({
                uid: company._id.toString(),
                name: company.name,
                email: company.email,
                phone: company.phone,
                address: company.address,
                impactLevel: company.impactLevel,
                yearsOfExperience: company.yearsOfExperience ?? "N/A",
                category: company.category,
                creationYear: company.creationYear,
                status: company.status ? "Active" : "Inactive"
            });
        });

        await workbook.xlsx.writeFile(exportPath);
        console.log("Excel document generated:", exportPath);

        return exportPath;
    } catch (error) {
        console.error("Error generating the report:", error.message);
        throw new Error("Failed to generate Excel file");
    }
};

