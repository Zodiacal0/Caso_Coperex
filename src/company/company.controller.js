import Company from "../company/company.model.js"
import { generateReport } from "../helpers/generateExcel.js"

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
            .skip(Number(rangoMin-1) || 0) 
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
