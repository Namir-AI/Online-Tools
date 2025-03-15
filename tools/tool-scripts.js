//browser-image-compression
document.getElementById('compress-btn').addEventListener('click', async function () {
    const fileInput = document.getElementById('compress-input');
    const compressionLevel = parseFloat(document.getElementById('compression-level').value);

    if (fileInput.files.length === 0) {
        alert('Please upload an image.');
        return;
    }

    const file = fileInput.files[0];
    const options = {
        maxSizeMB: compressionLevel, // Compression level
        maxWidthOrHeight: 1024, // Optional: Resize image
        useWebWorker: true, // Use web worker for better performance
    };

    try {
        const compressedFile = await imageCompression(file, options);
        const url = URL.createObjectURL(compressedFile);
        const outputContainer = document.getElementById('compressed-output');
        outputContainer.innerHTML = `
            <a href="${url}" download="compressed-image.jpg" class="btn">Download Compressed Image</a>
        `;
    } catch (error) {
        console.error('Error compressing image:', error);
        alert('Error compressing image. Please try again.');
    }
});

//image-resize
document.getElementById('resize-btn').addEventListener('click', function () {
    const fileInput = document.getElementById('resize-input');
    const width = parseInt(document.getElementById('width').value);
    const height = parseInt(document.getElementById('height').value);

    if (fileInput.files.length === 0) {
        alert('Please upload an image.');
        return;
    }

    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
        alert('Please enter valid width and height.');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

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
                const url = URL.createObjectURL(blob);
                const outputContainer = document.getElementById('resized-output');
                outputContainer.innerHTML = `
                    <a href="${url}" download="resized-image.jpg" class="btn">Download Resized Image</a>
                `;
            }, 'image/jpeg', 1.0);
        };
    };

    reader.readAsDataURL(file);
});

//pdf-compression

document.getElementById('compress-pdf-btn').addEventListener('click', async function () {
    const fileInput = document.getElementById('compress-pdf-input');

    if (fileInput.files.length === 0) {
        alert('Please upload a PDF file.');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = async function (event) {
        const pdfBytes = new Uint8Array(event.target.result);
        const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);

        // Compress PDF (example: reduce image quality)
        const pages = pdfDoc.getPages();
        for (const page of pages) {
            const images = page.getImages();
            for (const image of images) {
                image.setQuality(50); // Reduce image quality
            }
        }

        const compressedPdfBytes = await pdfDoc.save();
        const blob = new Blob([compressedPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const outputContainer = document.getElementById('compressed-pdf-output');
        outputContainer.innerHTML = `
            <a href="${url}" download="compressed-pdf.pdf" class="btn">Download Compressed PDF</a>
        `;
    };

    reader.readAsArrayBuffer(file);
});

//pdf-merger

document.getElementById('merge-pdf-btn').addEventListener('click', async function () {
    const fileInput = document.getElementById('merge-pdf-input');

    if (fileInput.files.length < 2) {
        alert('Please upload at least two PDF files.');
        return;
    }

    const pdfDoc = await PDFLib.PDFDocument.create();

    for (const file of fileInput.files) {
        const reader = new FileReader();
        reader.onload = async function (event) {
            const pdfBytes = new Uint8Array(event.target.result);
            const pdf = await PDFLib.PDFDocument.load(pdfBytes);
            const copiedPages = await pdfDoc.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => pdfDoc.addPage(page));
        };
        reader.readAsArrayBuffer(file);
    }

    const mergedPdfBytes = await pdfDoc.save();
    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const outputContainer = document.getElementById('merged-pdf-output');
    outputContainer.innerHTML = `
        <a href="${url}" download="merged-pdf.pdf" class="btn">Download Merged PDF</a>
    `;
});

//image-to-pdf

document.getElementById('convert-to-pdf-btn').addEventListener('click', function () {
    const fileInput = document.getElementById('image-to-pdf-input');

    if (fileInput.files.length === 0) {
        alert('Please upload an image.');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        const img = new Image();
        img.src = event.target.result;

        img.onload = function () {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            const pdf = new jsPDF();
            pdf.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 10, 10, 180, 0);
            const url = pdf.output('bloburl');
            const outputContainer = document.getElementById('pdf-output');
            outputContainer.innerHTML = `
                <a href="${url}" download="converted-image.pdf" class="btn">Download PDF</a>
            `;
        };
    };

    reader.readAsDataURL(file);
});
//video-downloader
document.getElementById('download-video-btn').addEventListener('click', async function () {
    const videoUrl = document.getElementById('video-url').value;

    if (!videoUrl) {
        alert('Please enter a valid video URL.');
        return;
    }

    try {
        const response = await fetch(`https://your-backend-api.com/download?url=${encodeURIComponent(videoUrl)}`);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const outputContainer = document.getElementById('video-output');
        outputContainer.innerHTML = `
            <a href="${url}" download="downloaded-video.mp4" class="btn">Download Video</a>
        `;
    } catch (error) {
        console.error('Error downloading video:', error);
        alert('Error downloading video. Please try again.');
    }
});
