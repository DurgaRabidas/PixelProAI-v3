const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let img = new Image();

let brightness = 100;
let contrast = 100;
let rotation = 0;
let flipH = 1;
let flipV = 1;
let filterMode = "none";
let zoom = 1;


// ====================
// UPLOAD IMAGE
// ====================

upload.addEventListener("change", function (e) {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {

        img.onload = function () {

            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;

            brightness = 100;
            contrast = 100;
            rotation = 0;
            flipH = 1;
            flipV = 1;
            filterMode = "none";
            zoom = 1;

            drawImage();
        };

        img.src = event.target.result;
    };

    reader.readAsDataURL(file);
});


// ====================
// DRAW IMAGE
// ====================

function drawImage() {

    if (!img.complete || !img.naturalWidth) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();

    // Move to center
    ctx.translate(canvas.width / 2, canvas.height / 2);

    // Rotate
    ctx.rotate(rotation * Math.PI / 180);

    // Flip + Zoom
    ctx.scale(flipH * zoom, flipV * zoom);

    // Brightness + Contrast + Filter
    ctx.filter =
        "brightness(" + brightness + "%) " +
        "contrast(" + contrast + "%) " +
        filterMode;

    // Draw image
    ctx.drawImage(
        img,
        -img.naturalWidth / 2,
        -img.naturalHeight / 2,
        img.naturalWidth,
        img.naturalHeight
    );

    ctx.restore();
}


// ====================
// BRIGHTNESS
// ====================

const brightnessSlider =
    document.getElementById("brightness");

if (brightnessSlider) {

    brightnessSlider.addEventListener("input", function () {

        brightness = Number(this.value);

        drawImage();
    });
}


// ====================
// CONTRAST
// ====================

const contrastSlider =
    document.getElementById("contrast");

if (contrastSlider) {

    contrastSlider.addEventListener("input", function () {

        contrast = Number(this.value);

        drawImage();
    });
}


// ====================
// ROTATE
// ====================

const rotateBtn =
    document.getElementById("rotateBtn");

if (rotateBtn) {

    rotateBtn.addEventListener("click", function () {

        rotation += 90;

        if (rotation >= 360) {
            rotation = 0;
        }

        drawImage();
    });
}


// ====================
// FLIP
// ====================

const flipBtn =
    document.getElementById("flipBtn");

if (flipBtn) {

    flipBtn.addEventListener("click", function () {

        flipH *= -1;

        drawImage();
    });
}


// ====================
// FILTER
// ====================

const filterBtn =
    document.getElementById("filterBtn");

if (filterBtn) {

    filterBtn.addEventListener("click", function () {

        if (filterMode === "none") {

            filterMode = "grayscale(100%)";

        } else {

            filterMode = "none";
        }

        drawImage();
    });
}


// ====================
// ZOOM IN
// ====================

const zoomInBtn =
    document.getElementById("zoomInBtn");

if (zoomInBtn) {

    zoomInBtn.addEventListener("click", function () {

        zoom += 0.1;

        if (zoom > 3) {
            zoom = 3;
        }

        drawImage();
    });
}


// ====================
// ZOOM OUT
// ====================

const zoomOutBtn =
    document.getElementById("zoomOutBtn");

if (zoomOutBtn) {

    zoomOutBtn.addEventListener("click", function () {

        zoom -= 0.1;

        if (zoom < 0.2) {
            zoom = 0.2;
        }

        drawImage();
    });
}


// ====================
// CROP
// ====================

const cropBtn =
    document.getElementById("cropBtn");

if (cropBtn) {

    cropBtn.addEventListener("click", function () {

        if (!img.naturalWidth) return;

        // Take the smaller dimension
        // to create a square crop.

        const size =
            Math.min(img.naturalWidth, img.naturalHeight);

        const startX =
            (img.naturalWidth - size) / 2;

        const startY =
            (img.naturalHeight - size) / 2;

        const cropCanvas =
            document.createElement("canvas");

        cropCanvas.width = size;
        cropCanvas.height = size;

        const cropCtx =
            cropCanvas.getContext("2d");

        cropCtx.drawImage(
            img,
            startX,
            startY,
            size,
            size,
            0,
            0,
            size,
            size
        );

        img.onload = function () {

            canvas.width = size;
            canvas.height = size;

            drawImage();
        };

        img.src = cropCanvas.toDataURL("image/png");
    });
}


// ====================
// DOWNLOAD
// ====================

const downloadBtn =
    document.getElementById("downloadBtn");

if (downloadBtn) {

    downloadBtn.addEventListener("click", function () {

        const link =
            document.createElement("a");

        link.download = "PixelProAI-edited.png";

        link.href =
            canvas.toDataURL("image/png");

        link.click();
    });
}
