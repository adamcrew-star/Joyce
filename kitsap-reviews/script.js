const ratingStep = document.querySelector("#rating-step");
const shareStep = document.querySelector("#share-step");
const selectedEmoji = document.querySelector("#selected-emoji");
const responseTitle = document.querySelector("#response-title");
const reviewDraft = document.querySelector("#review-draft");
const googleReviewButton = document.querySelector("#google-review-button");
const googleButtonLabel = document.querySelector("#google-button-label");
const copyStatus = document.querySelector("#copy-status");
const feedbackForm = document.querySelector("#feedback-form");
const feedbackStatus = document.querySelector("#feedback-status");

const responseTitles = {
  Excellent: "That made our day. Thank you!",
  Good: "Thank you—we appreciate it.",
  Okay: "Thanks for being honest with us.",
  "Not great": "We’re sorry we missed the mark."
};

let selectedRating = "";

document.querySelectorAll(".rating-option").forEach((button) => {
  button.addEventListener("click", () => {
    selectedRating = button.dataset.rating;
    selectedEmoji.textContent = button.dataset.emoji;
    responseTitle.textContent = responseTitles[selectedRating];
    ratingStep.hidden = true;
    shareStep.hidden = false;
    document.querySelector("#back-button").focus();
  });
});

document.querySelector("#back-button").addEventListener("click", () => {
  shareStep.hidden = true;
  ratingStep.hidden = false;
  copyStatus.textContent = "";
  feedbackStatus.textContent = "";
  document.querySelector(`[data-rating="${selectedRating}"]`).focus();
});

reviewDraft.addEventListener("input", () => {
  googleButtonLabel.textContent = reviewDraft.value.trim()
    ? "Copy review & continue to Google"
    : "Continue to Google";
  copyStatus.textContent = "";
});

googleReviewButton.addEventListener("click", async () => {
  const draft = reviewDraft.value.trim();

  if (!draft) {
    copyStatus.textContent = "Google will open in a new tab.";
    return;
  }

  try {
    await navigator.clipboard.writeText(draft);
    copyStatus.textContent = "Review copied. Paste it into the Google review box.";
  } catch {
    reviewDraft.select();
    copyStatus.textContent = "Copy the selected text, then paste it into Google.";
  }
});

feedbackForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const feedback = document.querySelector("#feedback-message").value.trim();
  const name = document.querySelector("#customer-name").value.trim();
  const email = document.querySelector("#customer-email").value.trim();
  const subject = encodeURIComponent(`Customer feedback: ${selectedRating}`);
  const body = encodeURIComponent([
    `Experience rating: ${selectedRating}`,
    `Name: ${name || "Not provided"}`,
    `Email: ${email || "Not provided"}`,
    "",
    "Feedback:",
    feedback
  ].join("\n"));

  feedbackStatus.textContent = "Opening your email app to send this feedback...";
  window.location.href = `mailto:help@kitsaproofpros.com?subject=${subject}&body=${body}`;
});
