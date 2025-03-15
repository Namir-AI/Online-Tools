// File Input and Upload Button
const pdfInput = document.getElementById('pdf-input');
const fileNameDisplay = document.getElementById('file-name');
const uploadBtn = document.getElementById('upload-btn');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const compressBtn = document.getElementById('compress-btn');

// Show Upload Button when a file is selected
pdfInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        fileNameDisplay.textContent = file.name;
        uploadBtn.style.display = 'block'; // Show Upload Button
    } else {
        fileNameDisplay.textContent = 'No file chosen';
        uploadBtn.style.display = 'none'; // Hide Upload Button
    }
});

// Handle Upload Button Click
uploadBtn.addEventListener('click', function () {
    const file = pdfInput.files[0];
    if (file) {
        // Show Progress Bar
        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';

        // Simulate Upload Process (Replace with actual upload logic)
        simulateUpload(file);
    } else {
        alert('Please select a PDF file first.');
    }
});

// Simulate Upload Process (Replace with actual upload logic)
function simulateUpload(file) {
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        progressBar.style.width = `${progress}%`;

        if (progress >= 100) {
            clearInterval(interval);
            alert('Upload complete!');
            progressContainer.style.display = 'none'; // Hide Progress Bar
            compressBtn.style.display = 'block'; // Show Compress Button
        }
    }, 300);
}

// Handle Compress Button Click
compressBtn.addEventListener('click', async function () {
    const file = pdfInput.files[0];
    const compressionLevel = document.getElementById('compression-level').value;

    if (file) {
        // Show Progress Bar
        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';

        // Compress the PDF
        try {
            const compressedPdf = await compressPdf(file, compressionLevel);
            progressBar.style.width = '100%'; // Complete Progress Bar

            // Display Download Link
            const output = document.getElementById('compressed-output');
            output.innerHTML = `
                <p>Original Size: ${(file.size / 1024).toFixed(2)} KB</p>
                <p>Compressed Size: ${(compressedPdf.size / 1024).toFixed(2)} KB</p>
                <a href="${URL.createObjectURL(compressedPdf)}" download="compressed-pdf.pdf" class="btn">Download Compressed PDF</a>
            `;
        } catch (error) {
            console.error('Error compressing PDF:', error);
            alert('An error occurred while compressing the PDF. Please try again.');
        } finally {
            progressContainer.style.display = 'none'; // Hide Progress Bar
        }
    } else {
        alert('Please select a PDF file first.');
    }
});

// Compress PDF Function
async function compressPdf(file, compressionLevel) {
    // Load the PDF file using PDF.js
    const pdfBytes = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
    const pdf = await loadingTask.promise;

    // Create a new PDF document
    const pdfDoc = await PDFLib.PDFDocument.create();

    // Iterate through each page
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.0 });

        // Create a canvas to render the page
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render the page onto the canvas
        const renderContext = {
            canvasContext: context,
            viewport: viewport,
        };
        await page.render(renderContext).promise;

        // Convert the canvas to an image and reduce its quality
        const imageData = canvas.toDataURL('image/jpeg', parseFloat(compressionLevel) / 100);
        const image = await pdfDoc.embedJpg(imageData);

        // Add the compressed image as a new page
        const pageWidth = 600; // Adjust as needed
        const pageHeight = (image.height / image.width) * pageWidth;
        const newPage = pdfDoc.addPage([pageWidth, pageHeight]);
        newPage.drawImage(image, {
            x: 0,
            y: 0,
            width: pageWidth,
            height: pageHeight,
        });
    }

    // Save the compressed PDF
    const compressedPdfBytes = await pdfDoc.save();

    // Create a Blob from the compressed PDF
    return new Blob([compressedPdfBytes], { type: 'application/pdf' });
}