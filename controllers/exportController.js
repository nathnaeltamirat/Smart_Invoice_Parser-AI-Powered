const ParsedData = require('../models/ParsedData')
const PDFDocument = require('pdfkit')
const jwt = require('jsonwebtoken');
const singleExport = async (req, res) => {
    const parse_id = req.query.Parsed_Updated_ID;
    const format = req.query.format || 'json'; // 'json' or 'pdf'
    const parsedData = await ParsedData.findByPk(parse_id);
    if (!parsedData) {
        return res.status(404).json({ message: "Parsed data not found" });
    }
    try {
        const data = parsedData.toJSON();
        delete data.Parsed_Updated_ID;
        delete data.User_ID;
        delete data.Parsed_Original_ID;
        delete data.Score_ID;
        delete data.User_Data_ID;

        if (format === 'pdf') {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=parsed_data_${parse_id}.pdf`);

            const doc = new PDFDocument();
            doc.pipe(res);
            doc.fontSize(20).text('Parsed Invoice Data', { align: 'center' });
            doc.moveDown();
            Object.entries(data).forEach(([key, value]) => {
                doc.fontSize(12).text(`${key}: ${value}`, { align: 'left' });
                doc.moveDown();
            });
            doc.addPage();
            doc.fontSize(24).text('Internship project for ehopn ', { align: 'center' });
            doc.end();
        } else {
            res.setHeader('Content-Disposition', `attachment; filename=parsed_data_${parse_id}.json`);
            res.json(data);
        }
    } catch (error) {
        console.error('Error exporting parsed data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const multiExport = async (req, res) => {
    const format = req.query.format || 'json'; 
    const user_id = req.userId;
    const parsedData = await ParsedData.findAll({
        where: { User_ID: user_id },
        attributes: [ 'Vendor', 'Invoiced_Number', 'Total_Amount', 'Invoice_Date','createdAt', 'updatedAt' ]
    });
    if (!parsedData || parsedData.length === 0) {
        return res.status(404).json({ message: "No parsed data found for this user" });
    }
    try {
        if (format === 'pdf') {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=parsed_data_all.pdf`);

            const doc = new PDFDocument();
            doc.pipe(res);
            doc.fontSize(24).text('All Parsed Invoice Data', { align: 'center' });
            doc.moveDown();

            parsedData.forEach(data => {
                Object.entries(data.toJSON()).forEach(([key, value]) => {
                    if (key === 'Parsed_Updated_ID' || key === 'User_ID' || key === 'Parsed_Original_ID' || key === 'Score_ID' || key === 'User_Data_ID') {
                        return; 
                    }
                    doc.fontSize(12).text(`${key}: ${value}`, { align: 'left' });
                    doc.moveDown();
                });
                doc.addPage();
            });
            doc.fontSize(12).text('Internship project for ehopn ', { align: 'center' });
            doc.end();
        } else {
      
            res.setHeader('Content-Disposition', `attachment; filename=parsed_data_all.json`);
            const jsonData = parsedData.map(data => {
                const obj = data.toJSON();
                delete obj.Parsed_Updated_ID;
                delete obj.User_ID;
                delete obj.Parsed_Original_ID;
                delete obj.Score_ID;
                delete obj.User_Data_ID;
                return obj;
            });
            res.json(jsonData);
        }
    } catch (error) {
        console.error('Error exporting all parsed data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
module.exports = {singleExport, multiExport};