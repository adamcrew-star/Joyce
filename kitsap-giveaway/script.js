/*
 * Mailchimp configuration.
 *
 * These values come from your Mailchimp embedded signup form (Audience >
 * Signup forms > Embedded form). They are NOT secret and are safe to ship in
 * client-side code. Do NOT put a Mailchimp API key here — a static page cannot
 * keep it private.
 *
 * How to find them: in the embedded form's code, the <form action> looks like
 *   https://<dc>.list-manage.com/subscribe/post?u=<U>&id=<ID>
 *   - dc  = the subdomain before ".list-manage.com" (e.g. "us21")
 *   - u   = the value of the "u" query parameter
 *   - id  = the value of the "id" query parameter
 */
const MAILCHIMP = {
  dc: "REPLACE_WITH_DATACENTER", // e.g. "us21"
  u: "REPLACE_WITH_USER_ID",
  id: "REPLACE_WITH_AUDIENCE_ID",
};

const form = document.querySelector("#giveaway-form");
const entryStep = document.querySelector("#entry-step");
const successStep = document.querySelector("#success-step");
const submitButton = document.querySelector("#submit-button");
const submitLabel = submitButton.querySelector(".submit-label");
const statusEl = document.querySelector("#form-status");
const honeypot = document.querySelector("#hp-input");

const fields = {
  fname: document.querySelector("#fname"),
  lname: document.querySelector("#lname"),
  email: document.querySelector("#email"),
  phone: document.querySelector("#phone"),
  consent: document.querySelector("#consent"),
};

function isConfigured() {
  return !Object.values(MAILCHIMP).some((value) => value.startsWith("REPLACE_WITH_"));
}

function setStatus(message, type) {
  statusEl.textContent = message;
  statusEl.className = "form-status" + (type ? " " + type : "");
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validate() {
  let firstInvalid = null;

  [fields.fname, fields.lname, fields.email].forEach((input) => {
    const empty = !input.value.trim();
    const badEmail = input === fields.email && input.value.trim() && !validEmail(input.value.trim());
    const invalid = empty || badEmail;
    input.classList.toggle("invalid", invalid);
    if (invalid && !firstInvalid) firstInvalid = input;
  });

  if (firstInvalid) {
    firstInvalid.focus();
    setStatus(
      firstInvalid === fields.email && fields.email.value.trim()
        ? "Please enter a valid email address."
        : "Please fill in your name and email.",
      "error"
    );
    return false;
  }

  if (!fields.consent.checked) {
    setStatus("Please tick the box to enter the giveaway.", "error");
    return false;
  }

  return true;
}

function submitToMailchimp() {
  return new Promise((resolve, reject) => {
    const callbackName = "mcCallback_" + Date.now();
    const params = new URLSearchParams({
      u: MAILCHIMP.u,
      id: MAILCHIMP.id,
      EMAIL: fields.email.value.trim(),
      FNAME: fields.fname.value.trim(),
      LNAME: fields.lname.value.trim(),
      PHONE: fields.phone.value.trim(),
      c: callbackName,
    });
    // Mailchimp bot-detection honeypot: named b_<u>_<id>, must stay empty.
    params.set("b_" + MAILCHIMP.u + "_" + MAILCHIMP.id, honeypot.value);

    const script = document.createElement("script");
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error("timeout"));
    }, 12000);

    function cleanup() {
      window.clearTimeout(timeout);
      delete window[callbackName];
      if (script.parentNode) script.parentNode.removeChild(script);
    }

    window[callbackName] = (response) => {
      cleanup();
      resolve(response || {});
    };

    script.onerror = () => {
      cleanup();
      reject(new Error("network"));
    };

    script.src =
      "https://" + MAILCHIMP.dc + ".list-manage.com/subscribe/post-json?" + params.toString();
    document.body.appendChild(script);
  });
}

function showSuccess() {
  entryStep.hidden = true;
  successStep.hidden = false;
  successStep.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus("", null);

  if (!validate()) return;

  if (!isConfigured()) {
    setStatus(
      "Sign-up isn't connected yet. Add your Mailchimp details in script.js to go live.",
      "error"
    );
    return;
  }

  submitButton.disabled = true;
  submitLabel.textContent = "Entering…";

  try {
    const response = await submitToMailchimp();
    if (response.result === "error") {
      const alreadyIn = /already subscribed/i.test(response.msg || "");
      if (alreadyIn) {
        showSuccess();
        return;
      }
      const clean = (response.msg || "Something went wrong. Please try again.").replace(/<[^>]*>/g, "");
      setStatus(clean, "error");
      submitButton.disabled = false;
      submitLabel.textContent = "Enter the giveaway";
      return;
    }
    showSuccess();
  } catch (error) {
    setStatus("We couldn't reach the sign-up service. Please try again in a moment.", "error");
    submitButton.disabled = false;
    submitLabel.textContent = "Enter the giveaway";
  }
});

[fields.fname, fields.lname, fields.email].forEach((input) => {
  input.addEventListener("input", () => {
    if (input.classList.contains("invalid")) input.classList.remove("invalid");
  });
});
