const googleReviewUrl = "https://search.google.com/local/writereview?placeid=ChIJX_T0-VQ7kFQR1fDi00phE2E";
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
