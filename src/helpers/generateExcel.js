import fs, { cp } from "fs";
import path from "path";
import ExcelJS from "exceljs";

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

