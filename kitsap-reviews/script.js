const googleReviewUrl = "https://g.page/r/CdXw4tNKYRNhEBM/review";
const ratingButtons = document.querySelectorAll(".rating-option");
const redirectStatus = document.querySelector("#redirect-status");

ratingButtons.forEach((button) => {
  button.addEventListener("click", () => {
    ratingButtons.forEach((ratingButton) => {
      ratingButton.disabled = true;
    });
    button.classList.add("is-selected");
    redirectStatus.textContent = "Opening Google Reviews…";
    window.location.assign(googleReviewUrl);
  });
});
