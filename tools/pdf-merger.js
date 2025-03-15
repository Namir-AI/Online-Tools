// File Input and Upload Button
const fileInput = document.getElementById('merge-pdf-input');
const fileNameDisplay = document.getElementById('file-names');
const uploadBtn = document.getElementById('upload-btn');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const mergeBtn = document.getElementById('merge-pdf-btn');

// Show Upload Button when files are selected
fileInput.addEventListener('change', function (event) {
    const files = event.target.files;
    if (files.length > 0) {
        fileNameDisplay.textContent = `${files.length} files selected`;
        uploadBtn.style.display = 'block'; // Show Upload Button
    } else {
        fileNameDisplay.textContent = 'No files chosen';
        uploadBtn.style.display = 'none'; // Hide Upload Button
    }
});

// Handle Upload Button Click
uploadBtn.addEventListener('click', function () {
    const files = fileInput.files;
    if (files.length > 1) {
        // Show Progress Bar
        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';

        // Simulate Upload Process (Replace with actual upload logic)
        simulateUpload(files);
    } else {
        alert('Please select at least two files.');
    }
});

// Simulate Upload Process (Replace with actual upload logic)
function simulateUpload(files) {
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        progressBar.style.width = `${progress}%`;

        if (progress >= 100) {
            clearInterval(interval);
            alert('Upload complete!');
            progressContainer.style.display = 'none'; // Hide Progress Bar
            mergeBtn.style.display = 'block'; // Show Merge Button
        }
    }, 300);
}

// Handle Merge Button Click
mergeBtn.addEventListener('click', async function () {
    const files = fileInput.files;

    if (files.length > 1) {
        // Show Progress Bar
        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';

        // Merge PDFs
        const pdfDoc = await PDFLib.PDFDocument.create();

        for (const file of files) {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = async function (event) {
                const pdfBytes = new Uint8Array(event.target.result);
                const pdf = await PDFLib.PDFDocument.load(pdfBytes);
                const copiedPages = await pdfDoc.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => pdfDoc.addPage(page));
            };
        }

        const mergedPdfBytes = await pdfDoc.save();
        progressBar.style.width = '100%'; // Complete Progress Bar

        // Display Merged PDF
        const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const output = document.getElementById('merged-pdf-output');
        output.innerHTML = `
            <a href="${url}" download="merged-pdf.pdf" class="btn">Download Merged PDF</a>
        `;

        // Automatically Download the Merged PDF
        const link = document.createElement('a');
        link.href = url;
        link.download = `merged-pdf-${Date.now()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        alert('Please select at least two files.');
    }
});