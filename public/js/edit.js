document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const parsedId = urlParams.get('Parsed_Updated_ID');

    const vendorName = document.getElementById("vendorName");
    const invoiceNumber = document.getElementById("invoiceNumber");
    const totalAmount = document.getElementById("totalAmount");
    const invoiceDate = document.getElementById("invoiceDate");
    const submitButton = document.getElementById("submitButton");
    const restore = document.getElementById("restoreButton");
    if (parsedId) {
       fetch(`/api/upload/get?Parsed_Updated_ID=${parsedId}`)
            .then(res => res.json())
            .then(data => {
                vendorName.value = data.Vendor || '';
                invoiceNumber.value = data.Invoiced_Number || '';
                totalAmount.value = data.Total_Amount || '';
                invoiceDate.value = data.Invoice_Date || '';
            });
    }
    restore.addEventListener("click", function(event) {
        event.preventDefault();
        fetch(`/api/upload/restore?Parsed_Updated_ID=${parsedId}`)
            .then(res => res.json())
            .then(data => {
                vendorName.value = data.Vendor || '';
                invoiceNumber.value = data.Invoiced_Number || '';
                totalAmount.value = data.Total_Amount || '';
                invoiceDate.value = data.Invoice_Date || '';
            });
    });
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
                window.location.href = '/api/history/';
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