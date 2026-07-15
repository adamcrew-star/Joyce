const googleReviewUrl = "https://www.google.com/search?q=Kitsap+Roof+Pros#lrd=0x54903b54f9f4f45f:0x6113614ad3e2f0d5,3";
const ratingButtons = document.querySelectorAll(".rating-option");
const redirectStatus = document.querySelector("#redirect-status");

ratingButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const starRating = button.dataset.stars;

    ratingButtons.forEach((ratingButton) => {
      ratingButton.disabled = true;
    });
    button.classList.add("is-selected");
    redirectStatus.textContent = `Opening Google Reviews with ${starRating} stars…`;
    window.location.assign(`${googleReviewUrl},${starRating}`);
  });
});
