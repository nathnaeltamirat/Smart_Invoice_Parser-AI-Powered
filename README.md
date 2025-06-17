# Smart Invoice Parser - AI Powered

A full-stack web application for parsing invoices using OCR and Generative AI (Google Gemini/GPT).  
Users can upload PDF or image invoices, extract structured data, view/edit history, and export results as JSON or PDF.

---

## 🚀 Features

- **User Authentication:** Register and login with JWT-based authentication.
- **Invoice Upload:** Upload PDF, JPEG, or PNG invoices.
- **OCR Processing:** Extract text from invoices using Tesseract.js.
- **PDF Handling:** Convert PDF pages to images using pdfjs-dist and canvas (Linux compatible).
- **AI Data Extraction:** Use Google Gemini (GPT) API to extract structured invoice data.
- **History:** View, edit, and delete parsed invoice history.
- **Export:** Download parsed data as JSON or PDF (single or all).
- **Responsive Frontend:** Simple UI for upload, history, and export.

---

## 🛠 Tech Stack

- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (via Sequelize ORM)
- **OCR:** [Tesseract.js](https://github.com/naptha/tesseract.js)
- **PDF Processing:** [pdfjs-dist](https://github.com/mozilla/pdfjs-dist), [canvas](https://github.com/Automattic/node-canvas)
- **Authentication:** JWT (jsonwebtoken)
- **File Uploads:** Multer
- **Generative AI:** Google Gemini - Summarization (GPT - Assistant) API 

---

## 🧠 Generative AI

- **Model:** Google Gemini (GPT) via Google Generative Language API
- **Usage:** Extracts structured fields (vendor, invoice number, total, date) from OCR text.

---

## 📦 Installation & Deployment

### 1. **Clone the repository**
```sh
git clone https://github.com/yourusername/Smart_Invoice_Parser-AI-Powered.git
cd Smart_Invoice_Parser-AI-Powered
```

### 2. **Install dependencies**
```sh
npm install
```

### 3. **Environment Variables**

Create a `.env` file in the root directory with the following (example):

```
DATABASE_URL=your_postgres_connection_string
JWT_SECRET_KEY=your_jwt_secret
GEMINI_API_KEY=your_google_gemini_api_key
```

### 4. **Database Setup**

- The app uses Sequelize. On first run, tables will be created automatically.
- For production, use Sequelize migrations.

### 5. **Run Locally**

```sh
npm start
```
or
```sh
node server.js
```

Visit [http://localhost:5000](http://localhost:5000)

---

## ☁️ Deploying on Render

1. **Push your code to GitHub.**
2. **Create a new Web Service on [Render](https://render.com/):**
   - Connect your GitHub repo.
   - Set build command: `npm install`
   - Set start command: `npm start` or `node server.js`
   - Add environment variables (`DATABASE_URL`, `JWT_SECRET_KEY`, `GEMINI_API_KEY`)
3. **Create a PostgreSQL database on Render and update your `.env` accordingly.**
4. **Deploy!**

**Note:**  
- Render's filesystem is ephemeral. For persistent uploads, use cloud storage (e.g., AWS S3).
- All static files (HTML, CSS, JS) must be in the `public` folder and use lowercase filenames (e.g., `register.html`).

---

## 📝 Usage

- Register or login.
- Upload an invoice (PDF, JPEG, PNG).
- Wait for OCR and AI parsing.
- View, edit, or delete your parsed invoice history.
- Export results as JSON or PDF.

---

## 🐞 Troubleshooting

- **PDF not processing on Linux/Render:**  
  Make sure you use `pdfjs-dist` and `canvas` for PDF-to-image conversion, not `pdf-poppler`.
- **Static file not found:**  
  Ensure filenames are lowercase and match exactly (Linux is case-sensitive).
- **"linux is NOT supported" error:**  
  Remove any Windows-only dependencies or code. Use only Linux-compatible libraries.

---

## 📄 License

MIT

---

## 🤖 Credits

- [Tesseract.js](https://github.com/naptha/tesseract.js)
- [pdfjs-dist](https://github.com/mozilla/pdfjs-dist)
- [Google Gemini API](https://ai.google.dev/)
- [pdfkit](https://github.com/foliojs/pdfkit)