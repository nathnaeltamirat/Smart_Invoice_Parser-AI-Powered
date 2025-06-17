const axios = require('axios');
const ConfidenceScore = require('../models/ConfidenceScore');
const OriginalData = require('../models/OriginalData');
const ParsedData = require('../models/ParsedData');
const UserData = require('../models/UserData');
const path = require('path');
require('dotenv').config();
const gemniProcess = async (req, res) => { 

    const {filename,originalname,filePath, text, confidence, UserID } = req.body;
    if (!text || !confidence) {
        return res.status(400).json({ message: "Text and confidence are required" });
    }

    try {
        console.log("Sending to Gemini:", text, confidence);
        // ...API call...

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [
                    {
                       parts: [
                            {
                                text: `
                            Given the following OCR-extracted invoice text (with an overall OCR confidence of ${confidence}), extract the following fields if possible:
                            - Vendor/Company name
                            - Invoice number
                            - Total amount
                            - Invoice date

                            If a field cannot be found, return an empty string for that field.

                            IMPORTANT: For "invoice_date", always return the date in ISO format (YYYY-MM-DD). If the date is not found or not valid, return an empty string.

                            Respond ONLY in this JSON format:
                            {
                            "vendor": "...",
                            "invoice_number": "...",
                            "total_amount": "...",
                            "invoice_date": "..."
                            }

                            OCR text:
                            ${text}
                            `
                            }
                        ]
                    }
                ]
            },
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );
      function parseNumberOrNull(numStr) {
        const n = parseFloat(numStr.toString().replace(/[^0-9.\-]/g, ''));
    return isNaN(n) ? null : n;
}
        console.log("Gemini raw response:", response.data);
        const message = response.data.candidates?.[0]?.content?.parts?.[0]?.text || null;
        let cleanMessage = message ? message.trim() : "";
        if (cleanMessage.startsWith("```json")) {
            cleanMessage = cleanMessage.replace(/^```json/, "").replace(/```$/, "").trim();
        } else if (cleanMessage.startsWith("```")) {
            cleanMessage = cleanMessage.replace(/^```/, "").replace(/```$/, "").trim();
        }

        let extracted = {};
        try {
            extracted = JSON.parse(cleanMessage);
        } catch (e) {
            extracted = {
                vendor: "",
                invoice_number: "",
                total_amount: "",
                invoice_date: ""
            };
        }
        function parseDateOrNull(dateStr) {
            const d = new Date(dateStr);
            return isNaN(d.getTime()) ? null : d;
        }

        const originalData = await OriginalData.create({
            Vendor: extracted.vendor,
            Invoiced_Number: extracted.invoice_number,
            Total_Amount: parseNumberOrNull(extracted.total_amount),
            Invoice_Date: parseDateOrNull(extracted.invoice_date),
        });

        const confidenceScore = await ConfidenceScore.create({
            Vendor: confidence,
            Invoice_Number: confidence,
            Total_Amount: confidence,
            Invoice_Date: confidence
        });
    // originalname comes from req.body.originalname
    const userData = await UserData.create({
        link: filePath,
        name: originalname || path.basename(filePath),
    });

        const parsedData = await ParsedData.create({
            Vendor: extracted.vendor,
            Invoiced_Number: extracted.invoice_number,
            Total_Amount: parseNumberOrNull(extracted.total_amount),
            Invoice_Date: parseDateOrNull(extracted.invoice_date),
            User_ID: UserID,
            Parsed_Original_ID: originalData.Parsed_Original_ID, 
            Score_ID: confidenceScore.Score_ID,
            User_Data_ID: userData.User_Data_ID
        });

        res.json({ Parsed_Updated_ID: parsedData.Parsed_Updated_ID });
        
    } catch (error) {
        console.error('Gemini API error:', error.response?.data || error.message);
        res.status(500).json({ message: 'Error calling Gemini API', error: error.response?.data || error.message });
    }
};

module.exports = gemniProcess ;