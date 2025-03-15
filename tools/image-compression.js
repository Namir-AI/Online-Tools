// File Input and Upload Button
const fileInput = document.getElementById('compress-input');
const fileNameDisplay = document.getElementById('file-name');
const uploadBtn = document.getElementById('upload-btn');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const compressBtn = document.getElementById('compress-btn');

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
            compressBtn.style.display = 'block'; // Show Compress Button
        }
    }, 300);
}

// Handle Compress Button Click
compressBtn.addEventListener('click', async function () {
    const file = fileInput.files[0];
    const compressionLevel = parseFloat(document.getElementById('compression-level').value);

    if (file) {
        // Show Progress Bar
        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';

        // Compress the Image
        try {
            const compressedFile = await compressImage(file, compressionLevel);
            progressBar.style.width = '100%'; // Complete Progress Bar

            // Display Compressed Image
            const reader = new FileReader();
            reader.readAsDataURL(compressedFile);
            reader.onload = function (event) {
                const output = document.getElementById('compressed-output');
                output.innerHTML = `
                    <p>Original Size: ${(file.size / 1024).toFixed(2)} KB</p>
                    <p>Compressed Size: ${(compressedFile.size / 1024).toFixed(2)} KB</p>
                    <img src="${event.target.result}" alt="Compressed Image" style="max-width: 100%;">
                `;

                // Automatically Download the Compressed Image
                const link = document.createElement('a');
                link.href = event.target.result;
                link.download = `compressed-image-${Date.now()}.jpg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };
        } catch (error) {
            console.error('Error compressing image:', error);
            alert('An error occurred while compressing the image. Please try again.');
        } finally {
            progressContainer.style.display = 'none'; // Hide Progress Bar
        }
    } else {
        alert('Please select a file first.');
    }
});

// Compress Image Function
async function compressImage(file, quality) {
    const options = {
        maxSizeMB: quality === 0.1 ? 0.1 : quality === 0.5 ? 0.5 : 1, // Adjust based on compression level
        maxWidthOrHeight: 1024, // Optional: Resize image
        useWebWorker: true, // Use web workers for better performance
        fileType: 'image/jpeg', // Output format
        onProgress: (percentage) => {
            progressBar.style.width = `${percentage}%`; // Update Progress Bar
        },
    };

    return await imageCompression(file, options);
}