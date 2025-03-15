// File Input and Upload Button
const fileInput = document.getElementById('image-to-pdf-input');
const fileNameDisplay = document.getElementById('file-name');
const uploadBtn = document.getElementById('upload-btn');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const convertBtn = document.getElementById('convert-to-pdf-btn');

// Show Upload Button when a file is selected
fileInput.addEventListener('change', function (event) {
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
    const file = fileInput.files[0];
    if (file) {
        // Show Progress Bar
        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';

        // Simulate Upload Process (Replace with actual upload logic)
        simulateUpload(file);
    } else {
        alert('Please select a file first.');
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
            convertBtn.style.display = 'block'; // Show Convert Button
        }
    }, 300);
}

// Handle Convert Button Click
convertBtn.addEventListener('click', function () {
    const file = fileInput.files[0];

    if (file) {
        // Show Progress Bar
        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';

        // Convert Image to PDF
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (event) {
            const img = new Image();
            img.src = event.target.result;

            img.onload = function () {
                const pdf = new jsPDF();
                pdf.addImage(img, 'JPEG', 10, 10, 180, 0);
                progressBar.style.width = '100%'; // Complete Progress Bar

                // Display PDF
                const url = pdf.output('bloburl');
                const output = document.getElementById('pdf-output');
                output.innerHTML = `
                    <a href="${url}" download="converted-image.pdf" class="btn">Download PDF</a>
                `;

                // Automatically Download the PDF
                const link = document.createElement('a');
                link.href = url;
                link.download = `converted-image-${Date.now()}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };
        };
    } else {
        alert('Please select a file first.');
    }
});