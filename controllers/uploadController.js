const path = require("path");
const User = require('../models/User');
const fs = require("fs");
const ConfidenceScore = require('../models/ConfidenceScore');
const ParsedData = require('../models/ParsedData');
const OriginalData = require('../models/OriginalData');
const UserData = require('../models/UserData');
const jwt = require('jsonwebtoken');
const Tesseract = require('tesseract.js');
const pdfPoppler = require('pdf-poppler');
const fetch = require('node-fetch');


const loader = async (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
}
const uploader = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded or file too large." });
    }

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { file } = req;
        const filePath = file.path;
        let imagesToProcess = [];

        // If PDF, convert to images
        if (file.mimetype === 'application/pdf') {
            const outputDir = path.join(__dirname, '..', 'uploads', `pdf_${Date.now()}`);
            fs.mkdirSync(outputDir, { recursive: true });

            const opts = {
                format: 'png',
                out_dir: outputDir,
                out_prefix: path.parse(file.filename).name,
                page: null
            };

            await pdfPoppler.convert(filePath, opts);

            // Collect all generated images
            imagesToProcess = fs.readdirSync(outputDir)
                .filter(f => f.endsWith('.png'))
                .map(f => path.join(outputDir, f));
        } else {
            imagesToProcess = [filePath];
        }

        let allWords = [];
        let allText = '';
        let confidences = [];

        for (const imgPath of imagesToProcess) {
            const result = await Tesseract.recognize(imgPath, 'eng', {
                logger: info => console.log(info),
                config: {
                    tessedit_create_tsv: '1',
                    tessedit_pageseg_mode: '3'
                }
            });

            const { text, tsv, confidence } = result.data;
            allText += text + '\n';
            if (confidence !== undefined) confidences.push(confidence);

            if (tsv) {
                const lines = tsv.split('\n');
                for (let i = 1; i < lines.length; i++) {
                    const cols = lines[i].split('\t');
                    if (cols.length > 11 && parseInt(cols[0]) === 5 && cols[11].trim()) {
                        allWords.push({
                            text: cols[11],
                            confidence: parseFloat(cols[10]),
                            position: {
                                left: parseInt(cols[6]),
                                top: parseInt(cols[7]),
                                width: parseInt(cols[8]),
                                height: parseInt(cols[9])
                            }
                        });
                    }
                }
            }
        }

        if (file.mimetype === 'application/pdf') {
            fs.rmSync(path.dirname(imagesToProcess[0]), { recursive: true, force: true });
        }
        fs.unlinkSync(filePath);

        // res.status(200).json({
        //     message: "File uploaded and processed successfully",
        //     text: allText.trim(),
        //     confidence: confidences.length ? (confidences.reduce((a, b) => a + b, 0) / confidences.length) : null,
        //     filePath: file.originalname
        // });
       

      const geminiResponse = await fetch('http://localhost:5000/api/upload/gemni', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        text: allText.trim(),
        confidence: confidences.length ? (confidences.reduce((a, b) => a + b, 0) / confidences.length) : null,
        filePath: file.originalname,
        UserID: decoded.id
    })
});

        const data = await geminiResponse.json();
        res.json({ Parsed_Updated_ID: data.Parsed_Updated_ID });
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};




module.exports = {loader,uploader};
