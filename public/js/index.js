const token = localStorage.getItem('token');
if (!token) {
    window.location.href = '/api/auth/login';
}

const uploadArea = document.getElementById('uploadArea');
const uploadBtn = document.getElementById('uploadBtn');
const fileInput = document.getElementById('fileInput');

uploadBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change',handleFileUpload);



uploadArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    uploadArea.classList.add('dragover');
});
uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});
uploadArea.addEventListener('drop', (event) => {
    event.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = event.dataTransfer.files;
    handleFileUpload({target:{files:files}})
});

function handleFileUpload(event){
    const progressContainer = document.getElementById('progressContainer');
    const uploadProgress = document.getElementById('uploadProgress');
    const progressText = document.getElementById('progressText');

    progressContainer.style.display = 'block';
    uploadProgress.value = 0;
    progressText.textContent = '0%';
    const files = event.target.files;
    const file = files[0];
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
        alert('Please upload a valid PDF, JPEG, or PNG file.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    axios.post('/api/upload/load/', formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: function(progressEvent) {
            if (progressEvent.lengthComputable) {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                uploadProgress.value = percent;
                progressText.textContent = `Uploading: ${percent}%`;
            }
        }
    }).then(response => {

        uploadProgress.value = 100;
        progressText.textContent = 'Parsing: 0%';
        let parsePercent = 0;
        const parseInterval = setInterval(() => {
            parsePercent += 10;
            if (parsePercent >= 100) {
                parsePercent = 100;
                progressText.textContent = 'Parsing complete!';
                clearInterval(parseInterval);
                setTimeout(() => {
                    progressContainer.style.display = 'none';
                    if (response.data.Parsed_Updated_ID) {
                        window.location.href = `/api/upload/update?Parsed_Updated_ID=${response.data.Parsed_Updated_ID}`;
                    } else {
                        alert('File uploaded successfully, but no data was returned.');
                    }
                }, 800);
            } else {
                progressText.textContent = `Parsing: ${parsePercent}%`;
                uploadProgress.value = parsePercent;
            }
        }, 100); 
    }).catch(error => {
        console.error('Error uploading file:', error);
        if (error.response && error.response.data) {
            alert(`Error: ${error.response.data.message}`);
        } else {
            alert('An error occurred while uploading the file. Please try again.');
        }
        progressContainer.style.display = 'none';
    });
}