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

upload.addEventListener("change", function (e) {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {
        img.onload = function () {

            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;

            rotation = 0;
            flipH = 1;
            flipV = 1;

            drawImage();
        };

        img.src = event.target.result;
    };

    reader.readAsDataURL(file);
});


function drawImage() {

    if (!img.complete || !img.naturalWidth) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();

    ctx.translate(canvas.width / 2, canvas.height / 2);

    ctx.rotate(rotation * Math.PI / 180);

    ctx.scale(flipH, flipV);

    ctx.filter =
        "brightness(" + brightness + "%) " +
        "contrast(" + contrast + "%) " +
        filterMode;

    ctx.drawImage(
        img,
        -img.naturalWidth / 2,
        -img.naturalHeight / 2,
        img.naturalWidth,
        img.naturalHeight
    );

    ctx.restore();
}


// BRIGHTNESS
document.getElementById("brightness").addEventListener("input", function () {

    brightness = Number(this.value);

    drawImage();
});


// CONTRAST
document.getElementById("contrast").addEventListener("input", function () {

    contrast = Number(this.value);

    drawImage();
});


// ROTATE
document.getElementById("rotateBtn").addEventListener("click", function () {

    rotation += 90;

    if (rotation >= 360) {
        rotation = 0;
    }

    drawImage();
});


// FLIP
document.getElementById("flipBtn").addEventListener("click", function () {

    flipH *= -1;

    drawImage();
});


// FILTER
document.getElementById("filterBtn").addEventListener("click", function () {

    if (filterMode === "none") {
        filterMode = "grayscale(100%)";
    } else {
        filterMode = "none";
    }

    drawImage();
});


// DOWNLOAD
document.getElementById("downloadBtn").addEventListener("click", function () {

    const link = document.createElement("a");

    link.download = "edited-image.png";

    link.href = canvas.toDataURL("image/png");

    link.click();
});
