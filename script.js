const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const brightnessSlider = document.getElementById("brightness");
const contrastSlider = document.getElementById("contrast");

const brightnessValue = document.getElementById("brightnessValue");
const contrastValue = document.getElementById("contrastValue");

const zoomInBtn = document.getElementById("zoomInBtn");
const zoomOutBtn = document.getElementById("zoomOutBtn");
const rotateBtn = document.getElementById("rotateBtn");
const flipBtn = document.getElementById("flipBtn");
const filterBtn = document.getElementById("filterBtn");
const downloadBtn = document.getElementById("downloadBtn");

let image = new Image();

let imageLoaded = false;

let rotation = 0;
let zoom = 1;
let flipX = 1;

let brightness = 100;
let contrast = 100;

let grayscale = false;


/* =========================
   CANVAS SIZE
========================= */

function resizeCanvas() {

    const container = document.querySelector(".canvas-container");

    if (!container) return;

    canvas.width = Math.max(100, container.clientWidth);
    canvas.height = Math.max(100, container.clientHeight);

    drawImage();
}


/* =========================
   DRAW IMAGE
========================= */

function drawImage() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    if (!imageLoaded) {
        return;
    }

    ctx.save();

    /*
       Move to canvas center
    */

    ctx.translate(
        canvas.width / 2,
        canvas.height / 2
    );


    /*
       Rotate
    */

    ctx.rotate(
        rotation * Math.PI / 180
    );


    /*
       Calculate image size
       so it fits inside workspace
    */

    const availableWidth =
        canvas.width * 0.85;

    const availableHeight =
        canvas.height * 0.85;

    const widthRatio =
        availableWidth / image.width;

    const heightRatio =
        availableHeight / image.height;

    let fitScale =
        Math.min(
            widthRatio,
            heightRatio
        );

    /*
       Prevent extremely small images
    */

    if (!isFinite(fitScale) || fitScale <= 0) {
        fitScale = 1;
    }


    /*
       Apply zoom
    */

    const finalScale =
        fitScale * zoom;


    const drawWidth =
        image.width * finalScale;

    const drawHeight =
        image.height * finalScale;


    /*
       Flip
    */

    ctx.scale(
        finalScale * flipX,
        finalScale
    );


    /*
       Apply image adjustments

       IMPORTANT:
       Brightness and contrast are applied
       independently of grayscale.
    */

    let filters =
        "brightness(" +
        brightness +
        "%) " +

        "contrast(" +
        contrast +
        "%)";

    if (grayscale) {

        filters +=
            " grayscale(100%)";
    }

    ctx.filter = filters;


    /*
       Draw image
    */

    ctx.drawImage(
        image,
        -image.width / 2,
        -image.height / 2
    );

    ctx.restore();
}


/* =========================
   UPLOAD IMAGE
========================= */

upload.addEventListener(
    "change",
    function (event) {

        const file =
            event.target.files[0];

        if (!file) return;

        const reader =
            new FileReader();

        reader.onload =
            function (e) {

                image.onload =
                    function () {

                        imageLoaded = true;

                        rotation = 0;
                        zoom = 1;
                        flipX = 1;

                        brightness = 100;
                        contrast = 100;

                        grayscale = false;

                        brightnessSlider.value = 100;
                        contrastSlider.value = 100;

                        brightnessValue.textContent = "100";
                        contrastValue.textContent = "100";

                        resizeCanvas();
                    };

                image.src = e.target.result;
            };

        reader.readAsDataURL(file);
    }
);


/* =========================
   BRIGHTNESS
========================= */

brightnessSlider.addEventListener(
    "input",
    function () {

        brightness =
            Number(this.value);

        brightnessValue.textContent =
            brightness;

        drawImage();
    }
);


/* =========================
   CONTRAST
========================= */

contrastSlider.addEventListener(
    "input",
    function () {

        contrast =
            Number(this.value);

        contrastValue.textContent =
            contrast;

        drawImage();
    }
);


/* =========================
   GRAYSCALE
========================= */

filterBtn.addEventListener(
    "click",
    function () {

        grayscale =
            !grayscale;

        drawImage();
    }
);


/* =========================
   ROTATE
========================= */

rotateBtn.addEventListener(
    "click",
    function () {

        if (!imageLoaded) return;

        rotation += 90;

        if (rotation >= 360) {
            rotation = 0;
        }

        drawImage();
    }
);


/* =========================
   FLIP
========================= */

flipBtn.addEventListener(
    "click",
    function () {

        if (!imageLoaded) return;

        flipX *= -1;

        drawImage();
    }
);


/* =========================
   ZOOM IN
========================= */

zoomInBtn.addEventListener(
    "click",
    function () {

        if (!imageLoaded) return;

        zoom += 0.1;

        if (zoom > 4) {
            zoom = 4;
        }

        drawImage();
    }
);


/* =========================
   ZOOM OUT
========================= */

zoomOutBtn.addEventListener(
    "click",
    function () {

        if (!imageLoaded) return;

        zoom -= 0.1;

        if (zoom < 0.2) {
            zoom = 0.2;
        }

        drawImage();
    }
);


/* =========================
   DOWNLOAD
========================= */

downloadBtn.addEventListener(
    "click",
    function () {

        if (!imageLoaded) {

            alert(
                "Please upload an image first."
            );

            return;
        }

        /*
           Create a temporary canvas
           for the exported image.
        */

        const exportCanvas =
            document.createElement("canvas");

        const exportCtx =
            exportCanvas.getContext("2d");


        /*
           Use the original image dimensions
           for good output quality.
        */

        exportCanvas.width =
            image.width;

        exportCanvas.height =
            image.height;


        exportCtx.save();

        exportCtx.translate(
            image.width / 2,
            image.height / 2
        );


        exportCtx.scale(
            flipX,
            1
        );


        exportCtx.rotate(
            rotation * Math.PI / 180
        );


        let filters =
            "brightness(" +
            brightness +
            "%) " +

            "contrast(" +
            contrast +
            "%)";

        if (grayscale) {

            filters +=
                " grayscale(100%)";
        }

        exportCtx.filter =
            filters;


        exportCtx.drawImage(
            image,
            -image.width / 2,
            -image.height / 2
        );

        exportCtx.restore();


        const link =
            document.createElement("a");

        link.download =
            "PixelProAI-Edited.png";

        link.href =
            exportCanvas.toDataURL(
                "image/png"
            );

        link.click();
    }
);


/* =========================
   SCREEN RESIZE
========================= */

window.addEventListener(
    "resize",
    function () {

        if (imageLoaded) {
            resizeCanvas();
        }
    }
);


/* =========================
   INITIAL CANVAS
========================= */

window.addEventListener(
    "load",
    function () {

        resizeCanvas();
    }
);
