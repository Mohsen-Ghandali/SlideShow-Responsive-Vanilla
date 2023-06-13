const container = document.querySelector(".sliderContainer");
const containerWidth = container.offsetWidth;
const margin = 15;
let items = 0;
let totalItems = 0;
const responsive = [
  { breakPoint: { width: 0, item: 1 } },
  { breakPoint: { width: 560, item: 2 } },
  { breakPoint: { width: 760, item: 3 } },
  { breakPoint: { width: 1090, item: 4 } },
  { breakPoint: { width: 1910, item: 5 } },
];

// Calculate the number of items based on the responsive breakpoints
const load = () => {
  responsive.forEach((response) => {
    if (window.innerWidth > response.breakPoint.width) {
      items = response.breakPoint.item;
    }
  });
  start();
};

// Set initial styles and dimensions for the slider items
const start = () => {
  let totalItemsWidth = 0;
  const allBox = Array.from(container.children);
  for (let i = 0; i < allBox.length; i++) {
    const itemWidth = containerWidth / items - margin;
    allBox[i].style.width = `${itemWidth}px`;
    allBox[i].style.margin = `${margin / 2}px`;
    totalItemsWidth += containerWidth / items;
    totalItems++;
  }
  container.style.width = `${totalItemsWidth}px`;

  // Add touch event listeners to the container element for touch-based scrolling
  container.addEventListener("touchstart", handleTouchStart, {
    passive: true,
  });
};

let xStart = 0;

// Handle touch start event
const handleTouchStart = (event) => {
  xStart = event.touches[0].clientX;
  container.addEventListener("touchmove", handleTouchMove, {
    passive: true,
  });
  container.addEventListener("touchend", handleTouchEnd, {
    passive: true,
  });
};

// Handle touch move event
const handleTouchMove = (event) => {
  const xCurrent = event.touches[0].clientX;
  const deltaX = xStart - xCurrent;
  const slideWidth = containerWidth / items;
  const containerMarginLimit = -(totalItems - items) * slideWidth;

  let newMarginLeft = parseInt(container.style.marginLeft) || 0;
  newMarginLeft -= deltaX;
  newMarginLeft = Math.max(newMarginLeft, containerMarginLimit);
  newMarginLeft = Math.min(newMarginLeft, 0);

  container.style.marginLeft = `${newMarginLeft}px`;

  xStart = xCurrent;
};

// Handle touch end event
const handleTouchEnd = () => {
  container.removeEventListener("touchmove", handleTouchMove);
  container.removeEventListener("touchend", handleTouchEnd);
};

// Load the slider on page load
window.addEventListener("load", load);

const prevButton = document.querySelector(".prevButton");
const nextButton = document.querySelector(".nextButton");

prevButton.addEventListener("click", () => {
  const slideWidth = containerWidth / items;
  const containerMarginLimit = 0;

  let newMarginLeft = parseInt(container.style.marginLeft) || 0;
  newMarginLeft += slideWidth;
  newMarginLeft = Math.min(newMarginLeft, containerMarginLimit);

  container.style.marginLeft = `${newMarginLeft}px`;

  if (newMarginLeft >= containerMarginLimit) {
    prevButton.disabled = true; // Disable the previous button
    nextButton.disabled = false; // Enable the next button
  }
});

nextButton.addEventListener("click", () => {
  const slideWidth = containerWidth / items;
  const containerMarginLimit = -(totalItems - items) * slideWidth;

  let newMarginLeft = parseInt(container.style.marginLeft) || 0;
  newMarginLeft -= slideWidth;
  newMarginLeft = Math.max(newMarginLeft, containerMarginLimit);

  container.style.marginLeft = `${newMarginLeft}px`;

  if (newMarginLeft <= containerMarginLimit) {
    nextButton.disabled = true; // Disable the next button
    prevButton.disabled = false; // Enable the previous button
  }
});

// Disable the previous button initially
prevButton.disabled = true;
prevButton.style.cursor = "not-allowed";

// Disable the next button initially
nextButton.disabled = true;
nextButton.style.cursor = "not-allowed";

// Add a window load event listener to enable the next button after the images are loaded
window.addEventListener("load", () => {
  nextButton.disabled = false;
  nextButton.style.cursor = "pointer";
});

// Observe changes in the container to adjust button states
const observer = new MutationObserver(() => {
  const slideWidth = containerWidth / items;
  const containerMarginLimit = -(totalItems - items) * slideWidth;
  const currentMarginLeft = parseInt(container.style.marginLeft) || 0;

  // Check the first and last slide positions and set the button states accordingly
  if (currentMarginLeft >= 0) {
    prevButton.disabled = true; // Disable the previous button
    prevButton.style.cursor = "not-allowed";
    nextButton.disabled = false; // Enable the next button
    nextButton.style.cursor = "pointer";
  } else if (currentMarginLeft <= containerMarginLimit) {
    prevButton.disabled = false; // Enable the previous button
    prevButton.style.cursor = "pointer";
    nextButton.disabled = true; // Disable the next button
    nextButton.style.cursor = "not-allowed";
  } else {
    prevButton.disabled = false; // Enable the previous button
    prevButton.style.cursor = "pointer";
    nextButton.disabled = false; // Enable the next button
    nextButton.style.cursor = "pointer";
  }
});

// Start observing changes in the container
observer.observe(container, {
  attributes: true,
  attributeFilter: ["style"],
});