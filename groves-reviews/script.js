const ratingButtons = document.querySelectorAll(".rating-option");
const ratingStep = document.querySelector("#rating-step");
const platformStep = document.querySelector("#platform-step");
const backButton = document.querySelector("#back-button");
const platformLinks = document.querySelectorAll(".platform-option");

function track(name, params) {
  if (typeof gtag === "function") {
    gtag("event", name, params);
  }
}

function showPlatformStep() {
  ratingStep.hidden = true;
  platformStep.hidden = false;
  platformStep.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function showRatingStep() {
  platformStep.hidden = true;
  ratingStep.hidden = false;
  ratingButtons.forEach((button) => button.classList.remove("is-selected"));
}

ratingButtons.forEach((button) => {
  button.addEventListener("click", () => {
    ratingButtons.forEach((ratingButton) => ratingButton.classList.remove("is-selected"));
    button.classList.add("is-selected");
    track("rating_selected", { rating: button.dataset.rating });
    showPlatformStep();
  });
});

backButton.addEventListener("click", showRatingStep);

platformLinks.forEach((link) => {
  link.addEventListener("click", () => {
    track("review_platform_click", {
      platform: link.classList.contains("platform-google") ? "google" : "facebook",
    });
  });
});
