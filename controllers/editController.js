
const path = require('path');;
const OriginalData = require('../models/OriginalData');
const ParsedData = require('../models/ParsedData');

const editItem = async (req, res) => {
    const Parsed_Updated_ID = req.query.Parsed_Updated_ID;
    const data = await ParsedData.findOne({
        where: { Parsed_Updated_ID }
    });
    if (!data) return res.status(404).send('Not found');
    const { Vendor, Invoiced_Number, Total_Amount, Invoice_Date } = data;
    res.sendFile(path.join(__dirname, "..", "public", "edit.html"), {
        headers: {
            'Content-Type': 'text/html'
        },
        Parsed_Updated_ID,
        Vendor,
        Invoiced_Number,
        Total_Amount,
        Invoice_Date
    });
}

const getItem = async (req, res) => {
    const parsedId = req.query.Parsed_Updated_ID;
    if (!parsedId) {
        return res.status(400).json({ message: "Parsed_Updated_ID is required" });
    }
    try {
        const data = await ParsedData.findOne({
            where: { Parsed_Updated_ID: parsedId }
        });
        if (!data) {
            return res.status(404).json({ message: "Parsed data not found" });
        }
        res.json(data);
    } catch (error) {
        console.error('Error fetching parsed data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const updateItem  = async(req, res) => {

    const { Vendor, Invoiced_Number, Total_Amount, Invoice_Date, Parsed_Updated_ID } = req.body;
    if (!Parsed_Updated_ID) {
        return res.status(400).json({ message: "Parsed_Updated_ID is required" });
    }
    const existingData = await ParsedData.findOne({
        where: { Parsed_Updated_ID }
    })
    if (!existingData) {
        return res.status(404).json({ message: "Parsed data not found" });
    }   
    try {

        const updatedData = await ParsedData.update(
            { Vendor, Invoiced_Number, Total_Amount, Invoice_Date },
            { where: { Parsed_Updated_ID } }
        );
        if (updatedData[0] === 0) {
            return res.status(404).json({ message: "No data updated" });
        }
        res.json({ success: true, message: "Data updated successfully" });
    } catch (error) {
        console.error('Error updating parsed data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const restoreItem  = async(req, res) => {
    const Parsed_Updated_ID = req.query.Parsed_Updated_ID;
    if (!Parsed_Updated_ID) {
        return res.status(400).json({ message: "Parsed_Updated_ID is required" });
    }
    const existingData = await ParsedData.findOne({
        where: { Parsed_Updated_ID }
    })
    if (!existingData) {
        return res.status(404).json({ message: "Parsed data not found" });
    }   
    const originalData = await OriginalData.findOne({
        where: { Parsed_Original_ID: existingData.Parsed_Original_ID }
    });
    if (!originalData) {
        return res.status(404).json({ message: "Original data not found" });
    }
    try {

        res.json(originalData);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
const deleteItem = async (req,res) =>{
    const parse_id = req.query.Parsed_Updated_ID;
    if (!parse_id) {
        return res.status(400).json({ message: "Parsed_Updated_ID is required" });
    }
    try {
        const parsedData = await ParsedData.findOne({ where: { Parsed_Updated_ID:parse_id} });
        if (!parsedData) {
            return res.status(404).json({ success: false, message: "ParsedData not found" });
        }

        const parsedOriginalId = parsedData.Parsed_Original_ID;

        await ParsedData.destroy({
            where: { Parsed_Updated_ID: parse_id }
        });
         await OriginalData.destroy({
            where: { Parsed_Original_ID: parsedOriginalId }
        });
        
        res.json({ success: true, message: "Data deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {editItem,getItem,updateItem,restoreItem,deleteItem}