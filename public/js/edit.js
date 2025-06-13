alert("It is working")
    // res.sendFile(path.join(__dirname, "..", "public", "edit.html"), {
    //     headers: {
    //         'Content-Type': 'text/html'
    //     },
    //     Parsed_Updated_ID,
    //     Vendor,
    //     Invoiced_Number,
    //     Total_Amount,
    //     Invoice_Date
    // });
document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const parsedId = urlParams.get('Parsed_Updated_ID');
    const form = document.querySelector(".editForm");
    const vendorName = document.getElementById("vendorName");
    const invoiceNumber = document.getElementById("invoiceNumber");
    const totalAmount = document.getElementById("totalAmount");
    const invoiceDate = document.getElementById("invoiceDate");
    const submitButton = document.getElementById("submitButton");
    if (parsedId) {
        // Fetch the parsed data from your backend
        fetch(`/api/upload/get?Parsed_Updated_ID=${parsedId}`)
            .then(res => res.json())
            .then(data => {
                document.getElementById("vendorName").value = data.Vendor || '';
                document.getElementById("invoiceNumber").value = data.Invoiced_Number || '';
                document.getElementById("totalAmount").value = data.Total_Amount || '';
                document.getElementById("invoiceDate").value = data.Invoice_Date || '';
            });
    }
    submitButton.addEventListener("click", function(event) {
        event.preventDefault();
        const updatedData = {
            Vendor: vendorName.value,
            Invoiced_Number: invoiceNumber.value,
            Total_Amount: totalAmount.value,
            Invoice_Date: invoiceDate.value,
            Parsed_Updated_ID: parsedId
        };
        fetch('/api/upload/change', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Data updated successfully!");
                window.location.href = '/api/upload/load';
            } else {
                alert("Error updating data: " + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred while updating the data.");
        });
    })
})