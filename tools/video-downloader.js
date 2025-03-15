// Video Downloader Elements
const videoUrlInput = document.getElementById('video-url');
const downloadBtn = document.getElementById('download-video-btn');
const videoOutput = document.getElementById('video-output');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');

// Handle Download Button Click
downloadBtn.addEventListener('click', async function () {
    const videoUrl = videoUrlInput.value;

    if (!videoUrl) {
        alert('Please enter a valid video URL.');
        return;
    }

    // Show Progress Bar
    progressContainer.style.display = 'block';
    progressBar.style.width = '0%';

    try {
        // Simulate Parsing Progress (Replace with actual parsing logic)
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            progressBar.style.width = `${progress}%`;

            if (progress >= 100) {
                clearInterval(interval);
                progressContainer.style.display = 'none'; // Hide Progress Bar
                downloadVideo(videoUrl); // Start Downloading
            }
        }, 300);
    } catch (error) {
        console.error('Error parsing video URL:', error);
        alert('An error occurred while parsing the video URL. Please try again.');
    }
});

// Download Video Function
async function downloadVideo(videoUrl) {
    try {
        // Fetch Video Data (Replace with actual download logic)
        const response = await fetch(`https://your-backend-api.com/download?url=${encodeURIComponent(videoUrl)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch video.');
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        // Display Download Link
        videoOutput.innerHTML = `
            <a href="${url}" download="downloaded-video.mp4" class="btn">Download Video</a>
        `;

        // Automatically Download the Video
        const link = document.createElement('a');
        link.href = url;
        link.download = `downloaded-video-${Date.now()}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error downloading video:', error);
        alert('An error occurred while downloading the video. Please try again.');
    }
}