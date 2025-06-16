"use strict";
const fileInput = document.querySelector(".file-input"),
  aspectRatio = document.querySelector(".aspect-ratio"),
  reduceQuality = document.querySelector(".reduce-quality"),
  chooseImg = document.querySelector(".choose-img"),
  previewImg = document.querySelector(".preview-img"),
  imgWidth = document.querySelector(".width"),
  imgHeight = document.querySelector(".height"),
  filterOptions = document.querySelectorAll(".filter-options button"),
  filterName = document.querySelector(".name"),
  filterValue = document.querySelector(".value"),
  slider = document.querySelector(".slider input"),
  rotateOptions = document.querySelectorAll(".rotate-options button"),
  qualityOptions = document.querySelectorAll(".quality-options button"),
  qualityContainer = document.querySelector(".quality-container"),
  formatMsg = document.querySelector(".msg"),
  resetFilterBtn = document.querySelector(".reset-filter"),
  selectFormat = document.querySelector(".select-format"),
  saveImageBtn = document.querySelector(".save-img");

let imgRatio,
  imgQuality = 1;

// Filter and transform states
let brightness = 100,
  saturate = 100,
  contrast = 100,
  grayscale = 0,
  sepia = 0,
  blurValue = 0,
  rotate = 0,
  flipX = 1,
  flipY = 1;

// Uploading image file
function uploadFile(e) {
  const file = e.target.files[0];
  console.log("clicked");
  if (!file) return;
  // console.log(file);
  previewImg.src = URL.createObjectURL(file);
  previewImg.addEventListener("load", () => {
    imgWidth.value = previewImg.naturalWidth;
    imgHeight.value = previewImg.naturalHeight;
    imgRatio = previewImg.naturalWidth / previewImg.naturalHeight;
    document.querySelector(".disable").classList.remove("disable");
  });
}

// Setting the ratio width and height
imgWidth.addEventListener("keyup", () => {
  // Getting height if Aspect ratio box is checked or not
  const height = aspectRatio.checked
    ? imgWidth.value / imgRatio
    : imgHeight.value;

  imgHeight.value = Math.floor(height);
});

imgHeight.addEventListener("keyup", () => {
  // Getting width if Aspect ratio box is checked or not
  const width = aspectRatio.checked
    ? imgHeight.value * imgRatio
    : imgWidth.value;

  imgWidth.value = Math.floor(width);
});

// Applying filters and transform to the image
function applyFilters() {
  previewImg.style.transform = `rotate(${rotate}deg) scale(${flipX}, ${flipY})`;
  previewImg.style.filter = `brightness(${brightness}%) saturate(${saturate}%) contrast(${contrast}%) grayscale(${grayscale}%) sepia(${sepia}%) blur(${blurValue}px)`;
}

// Selecting specific filter
filterOptions.forEach((option) => {
  option.addEventListener("click", () => {
    document.querySelector(".active").classList.remove("active");
    option.classList.add("active");
    filterName.textContent = option.textContent;

    if (option.id === "brightness") {
      filterValue.textContent = `${brightness}%`;
      slider.value = brightness;
      slider.max = "200";
    } else if (option.id === "saturate") {
      filterValue.textContent = `${saturate}%`;
      slider.value = saturate;
      slider.max = "200";
    } else if (option.id === "contrast") {
      filterValue.textContent = `${contrast}%`;
      slider.value = contrast;
      slider.max = "200";
    } else if (option.id === "grayscale") {
      filterValue.textContent = `${grayscale}%`;
      slider.value = grayscale;
      slider.max = "100";
    } else if (option.id === "sepia") {
      filterValue.textContent = `${sepia}%`;
      slider.value = sepia;
      slider.max = "100";
    } else {
      filterValue.textContent = `${blurValue}px`;
      slider.value = blurValue;
      slider.max = "10";
      slider.step = "0.5";
    }
  });
});

function updateFilter() {
  const selectedFilter = document.querySelector(".active");

  filterValue.innerText =
    selectedFilter.id === "blur" ? `${slider.value}px` : `${slider.value}%`;

  if (selectedFilter.id === "brightness") {
    brightness = slider.value;
  } else if (selectedFilter.id === "saturate") {
    saturate = slider.value;
  } else if (selectedFilter.id === "contrast") {
    contrast = slider.value;
  } else if (selectedFilter.id === "grayscale") {
    grayscale = slider.value;
  } else if (selectedFilter.id === "sepia") {
    sepia = slider.value;
  } else {
    blurValue = slider.value;
  }
  applyFilters();
}

// Rotating image
rotateOptions.forEach((option) => {
  option.addEventListener("click", () => {
    document
      .querySelector(".rotate-options .active")
      ?.classList.remove("active");

    option.classList.add("active");

    if (option.id == "right") {
      rotate += 90;
    } else if (option.id === "left") {
      rotate -= 90;
    } else if (option.id === "horizontal") {
      flipX = flipX === 1 ? -1 : 1;
    } else {
      flipY = flipY === 1 ? -1 : 1;
    }

    applyFilters();
  });
});

// Looping through image quality
qualityOptions.forEach((option) => {
  option.addEventListener("click", () => {
    document
      .querySelector(".quality-options .active")
      ?.classList.remove("active");

    option.classList.add("active");

    if (option.id === "25") {
      imgQuality = 0.25;
    } else if (option.id === "50") {
      imgQuality = 0.5;
    } else if (option.id === "75") {
      imgQuality = 0.75;
    } else if (option.id === "90") {
      imgQuality = 0.9;
    } else {
      imgQuality = 0.9;
    }
  });
});

// Disabling img quality when png is selected
selectFormat.addEventListener("change", () => {
  if (selectFormat.value === "png") {
    qualityContainer.classList.add("opacity-50", "pointer-events-none");
    imgQuality = 1;

    // Showing the format message
    formatMsg.classList.remove("hidden");
  } else {
    qualityContainer.classList.remove("opacity-50", "pointer-events-none");
    formatMsg.classList.add("hidden");
  }
});

// Resetting filters
function resetFilter() {
  brightness = 100;
  saturate = 100;
  contrast = 100;
  grayscale = 0;
  sepia = 0;
  blurValue = 0;
  rotate = 0;
  flipX = 1;
  flipY = 1;
  filterOptions[0].click();
  applyFilters();
}

// Saving Image
function saveFinalImage() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = parseInt(imgWidth.value);
  canvas.height = parseInt(imgHeight.value);

  ctx.filter = `brightness(${brightness}%) saturate(${saturate}%) contrast(${contrast}%) grayscale(${grayscale}%) sepia(${sepia}%) blur(${blurValue}px)`;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  if (rotate !== 0) {
    ctx.rotate((rotate * Math.PI) / 180);
  }

  ctx.scale(flipX, flipY);
  ctx.drawImage(
    previewImg,
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  );

  const format = selectFormat.value;
  console.log("format");
  const mime = {
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
  }[format];

  const ext = {
    jpeg: "jpg",
    png: "png",
    webp: "webp",
  }[format];

  const quality = format === "png" ? 1.0 : imgQuality;

  const link = document.createElement("a");
  link.download = `image-${Date.now()}.${ext}`;
  link.href = canvas.toDataURL(mime, quality);
  link.click();
}

fileInput.addEventListener("change", uploadFile);
slider.addEventListener("input", updateFilter);
chooseImg.addEventListener("click", () => fileInput.click());
resetFilterBtn.addEventListener("click", resetFilter);
saveImageBtn.addEventListener("click", saveFinalImage);
