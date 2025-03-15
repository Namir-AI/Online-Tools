// File Input and Upload Button
const fileInput = document.getElementById('resize-input');
const fileNameDisplay = document.getElementById('file-name');
const uploadBtn = document.getElementById('upload-btn');
const uploadProgressContainer = document.getElementById('upload-progress-container');
const uploadProgressBar = document.getElementById('upload-progress-bar');
const resizeBtn = document.getElementById('resize-btn');
const resizeProgressContainer = document.getElementById('resize-progress-container');
const resizeProgressBar = document.getElementById('resize-progress-bar');
const widthSlider = document.getElementById('width');
const heightSlider = document.getElementById('height');
const widthValue = document.getElementById('width-value');
const heightValue = document.getElementById('height-value');

// Update Slider Values
widthSlider.addEventListener('input', function () {
    widthValue.textContent = `${widthSlider.value}px`;
});

heightSlider.addEventListener('input', function () {
    heightValue.textContent = `${heightSlider.value}px`;
});

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
            resizeBtn.style.display = 'block'; // Show Resize Button
        }
    }, 300);
}

// Handle Resize Button Click
resizeBtn.addEventListener('click', function () {
    const file = fileInput.files[0];
    const width = parseInt(widthSlider.value);
    const height = parseInt(heightSlider.value);

    if (file) {
        if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
            alert('Please enter valid width and height.');
            return;
        }

        // Show Resize Progress Bar
        resizeProgressContainer.style.display = 'block';
        resizeProgressBar.style.width = '0%';

        // Resize the Image
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (event) {
            const img = new Image();
            img.src = event.target.result;

            img.onload = function () {
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(function (blob) {
                    resizeProgressBar.style.width = '100%'; // Complete Progress Bar

                    // Display Resized Image
                    const url = URL.createObjectURL(blob);
                    const output = document.getElementById('resized-output');
                    output.innerHTML = `
                        <a href="${url}" download="resized-image.jpg" class="btn">Download Resized Image</a>
                    `;

                    // Automatically Download the Resized Image
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `resized-image-${Date.now()}.jpg`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }, 'image/jpeg', 1.0);
            };
        };
    } else {
        alert('Please select a file first.');
    }
});