const ParsedData = require("../models/ParsedData");
const path = require('path');
const jwt = require('jsonwebtoken');
const ConfidenceScore = require('../models/ConfidenceScore');
const UserData = require("../models/UserData");
const serveHistory = async (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "history.html"));
}

const loadHistory = async (req, res) => {

     const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user_id = decoded.id;

    try {
        const history = await ParsedData.findAll({
            where: { User_ID: user_id },
            order: [['createdAt', 'DESC']],
            attributes: [
            'Parsed_Updated_ID',
            'Vendor',
            'Invoiced_Number',
            'Invoice_Date',
            'Total_Amount',
            'User_ID',
            'Parsed_Original_ID',
            'User_Data_ID',
            'Score_ID',
            'createdAt',
            'updatedAt'
        ]

        });

        
        if (history.length === 0) {
            return res.status(404).json({ message: "No history found for this user" });
        }

        // Fetch user data for each history item
        const results = await Promise.all(history.map(async (item) => {
            const confidence = await ConfidenceScore.findByPk(item.Score_ID);
            const confidenceRate = confidence ? confidence.Vendor : null;
            const userData = await UserData.findByPk(item.User_Data_ID);
            const filename = userData ? userData.name : null;

            return {
            ...item.toJSON(),
            confidenceRate,
            filename
            };
        }));

        res.json(results);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

}

module.exports = { serveHistory, loadHistory };