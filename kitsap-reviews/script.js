const ratingButtons = document.querySelectorAll(".rating-option");
const ratingStep = document.querySelector("#rating-step");
const platformStep = document.querySelector("#platform-step");
const backButton = document.querySelector("#back-button");

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
    showPlatformStep();
  });
});

backButton.addEventListener("click", showRatingStep);
