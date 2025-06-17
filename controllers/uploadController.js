const path = require("path");
const User = require('../models/User');
const fs = require("fs");
const jwt = require('jsonwebtoken');
const Tesseract = require('tesseract.js');
const fetch = require('node-fetch');
const { createCanvas } = require('canvas');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');


const loader = async (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
}
const uploader = async (req, res) => {
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
    }
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded or file too large." });
    }
    console.log("Uploader called, file:", req.file);
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

if (file.mimetype === 'application/pdf') {

    const data = new Uint8Array(fs.readFileSync(filePath));
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = createCanvas(viewport.width, viewport.height);
        const context = canvas.getContext('2d');
        await page.render({ canvasContext: context, viewport }).promise;
        const imgPath = path.join(__dirname, '..', 'uploads', `page_${pageNum}_${Date.now()}.png`);
        const out = fs.createWriteStream(imgPath);
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        await new Promise(resolve => out.on('finish', resolve));
        imagesToProcess.push(imgPath);
    }
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



    const geminiResponse = await fetch('/api/upload/gemni', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        text: allText.trim(),
        confidence: confidences.length ? (confidences.reduce((a, b) => a + b, 0) / confidences.length) : null,
        filePath: file.path,           
        filename: file.filename,       
        originalname: file.originalname,
        UserID: decoded.id
    })
});

        const data = await geminiResponse.json();
        res.json({ Parsed_Updated_ID: data.Parsed_Updated_ID });
    } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
}
};




module.exports = {loader,uploader};

