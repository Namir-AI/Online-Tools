// File Input and Upload Button
const fileInput = document.getElementById('heic-upload');
const fileNameDisplay = document.getElementById('file-name');
const uploadBtn = document.getElementById('upload-btn');
const uploadProgressContainer = document.getElementById('upload-progress-container');
const uploadProgressBar = document.getElementById('upload-progress-bar');
const convertProgressContainer = document.getElementById('convert-progress-container');
const convertProgressBar = document.getElementById('convert-progress-bar');
const convertBtn = document.getElementById('convert-btn');

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
        // Show Upload Progress Bar
        uploadProgressContainer.style.display = 'block';
        uploadProgressBar.style.width = '0%';

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
        uploadProgressBar.style.width = `${progress}%`;

        if (progress >= 100) {
            clearInterval(interval);
            alert('Upload complete!');
            uploadProgressContainer.style.display = 'none'; // Hide Upload Progress Bar
            convertBtn.style.display = 'block'; // Show Convert Button
        }
    }, 300);
}

// Handle Convert Button Click
convertBtn.addEventListener('click', async function () {
    const file = fileInput.files[0];

    if (file) {
        // Show Conversion Progress Bar
        convertProgressContainer.style.display = 'block';
        convertProgressBar.style.width = '0%';

        // Convert HEIC to JPG
        try {
            const resultBlob = await heic2any({
                blob: file,
                toType: 'image/jpeg',
                quality: 1.0, // Maximum quality
                onProgress: (percentage) => {
                    // Update Conversion Progress Bar
                    convertProgressBar.style.width = `${percentage}%`;
                },
            });

            // Complete Conversion Progress Bar
            convertProgressBar.style.width = '100%';

            // Display Converted Image
            const url = URL.createObjectURL(resultBlob);
            const output = document.getElementById('converted-output');
            output.innerHTML = `
                <a href="${url}" download="converted-image.jpg" class="btn">Download JPG</a>
            `;

            // Automatically Download the Converted Image
            const link = document.createElement('a');
            link.href = url;
            link.download = `converted-image-${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error converting HEIC to JPG:', error);
            alert('An error occurred while converting the image. Please try again.');
        } finally {
            convertProgressContainer.style.display = 'none'; // Hide Conversion Progress Bar
        }
    } else {
        alert('Please select a file first.');
    }
});