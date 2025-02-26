import Company from "../company/company.model.js"

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

export const getCompanyFilters = async(req, res) =>{
    try{
        const {filterType, category} = req.body
        let company, result

        switch(filterType){
            case 1:
                company = await Company.find().sort({yearsOfExperience: -1})
                result = "Filter Type Years of Experience descending"
                break
            case 2:
                if (!category) {
                    return res.status(400).json({
                        message: "Category is required for this filter",
                    });
                }
                company = await Company.find({ category: category });
                result = "Filter Type Category"
                break
            case 3:
                company = await Company.find().sort({ name: 1})
                result = "Filter Type Alphabetic order A-Z"
                break
            case 4:
                company = await Company.find().sort({ name: -1})
                result = "Filter Type Alphabetic order Z-A"
                break
            default:
                return res.status(400).json({
                    success: false,
                    message: "Invalid filter type",
                })
        }

        return res.status(200).json({
            success: true,
            FilterType: result,
            company
    
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve companies",
            error: err.message
        })
    }
}

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
