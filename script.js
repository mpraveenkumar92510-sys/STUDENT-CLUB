const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".navigation");
const navLinks = document.querySelectorAll(".nav-link");
const registrationForm = document.querySelector("#registration-form");
const feedback = document.querySelector("#form-feedback");

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation menu" : "Close navigation menu");
  navigation.classList.toggle("is-open", !isExpanded);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    navigation.classList.remove("is-open");
  });
});

document.querySelectorAll(".card-link[data-workshop]").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector("#workshop").value = link.dataset.workshop;
  });
});

const sections = document.querySelectorAll("main section[id]");
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-35% 0px -55% 0px" }
  );
  sections.forEach((section) => sectionObserver.observe(section));
}

const countdown = document.querySelector("#countdown");
const countdownDate = new Date(countdown.dataset.countdownDate);
const countdownParts = {
  days: document.querySelector("#countdown-days"),
  hours: document.querySelector("#countdown-hours"),
  minutes: document.querySelector("#countdown-minutes"),
  seconds: document.querySelector("#countdown-seconds")
};

function updateCountdown() {
  const remaining = Math.max(0, countdownDate.getTime() - Date.now());
  const totalSeconds = Math.floor(remaining / 1000);
  countdownParts.days.textContent = String(Math.floor(totalSeconds / 86400)).padStart(2, "0");
  countdownParts.hours.textContent = String(Math.floor((totalSeconds % 86400) / 3600)).padStart(2, "0");
  countdownParts.minutes.textContent = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  countdownParts.seconds.textContent = String(totalSeconds % 60).padStart(2, "0");
}

updateCountdown();
window.setInterval(updateCountdown, 1000);

const fields = [
  { input: document.querySelector("#name"), error: document.querySelector("#name-error"), message: "Please enter your name." },
  { input: document.querySelector("#email"), error: document.querySelector("#email-error"), message: "Please enter a valid email address." },
  { input: document.querySelector("#department"), error: document.querySelector("#department-error"), message: "Please choose your department." },
  { input: document.querySelector("#workshop"), error: document.querySelector("#workshop-error"), message: "Please choose a workshop." }
];

function validateField(field) {
  const value = field.input.value.trim();
  const isEmail = field.input.type === "email";
  const isValid = value.length > 0 && (!isEmail || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));

  field.input.setAttribute("aria-invalid", String(!isValid));
  field.error.textContent = isValid ? "" : field.message;
  return isValid;
}

fields.forEach((field) => {
  field.input.addEventListener("input", () => {
    if (field.input.getAttribute("aria-invalid") === "true") validateField(field);
    feedback.textContent = "";
  });
  field.input.addEventListener("change", () => {
    if (field.input.getAttribute("aria-invalid") === "true") validateField(field);
    feedback.textContent = "";
  });
});

registrationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const isValid = fields.map(validateField).every(Boolean);
  if (!isValid) {
    fields.find((field) => field.input.getAttribute("aria-invalid") === "true").input.focus();
    feedback.textContent = "Please check the highlighted fields.";
    return;
  }

  const registrant = document.querySelector("#name").value.trim();
  const workshop = document.querySelector("#workshop").value;
  feedback.textContent = `Thanks, ${registrant}! You’re on the list for ${workshop}.`;
  registrationForm.reset();
  fields.forEach((field) => field.input.removeAttribute("aria-invalid"));
});
