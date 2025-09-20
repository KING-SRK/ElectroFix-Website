// 🔹 Menu toggle
const menuToggle = document.getElementById("menu-toggle");
const nav = document.getElementById("main-nav");

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("active");
  menuToggle.classList.toggle("active");
});

// 🔹 Active nav link highlight
const navLinks = document.querySelectorAll(".nav a");
let currentPath = window.location.pathname.split("/").pop();

// যদি root path হয় ("/"), তাহলে index.html ধরে নাও
if (currentPath === "" || currentPath === "/") {
  currentPath = "index.html";
}

navLinks.forEach((link) => {
  const linkPath = link.getAttribute("href");
  if (linkPath === currentPath || linkPath.endsWith(currentPath)) {
    link.classList.add("active");
  } else {
    link.classList.remove("active");
  }
});

// 🔹 Feature card click (mobile only)
function isMobile() {
  return window.innerWidth <= 576; // max-width: 576px
}

const featureCards = document.querySelectorAll(".feature-card");

featureCards.forEach((card) => {
  const button = card.querySelector(".feature-btn");

  if (isMobile() && button) {
    card.addEventListener("click", () => {
      let link = button.getAttribute("href");

      // যদি button <a> হয়
      if (button.tagName === "A" && link) {
        window.location.href = link;
      }
      // যদি button <button> হয় (যেমন Pay Now / Help)
      else if (button.tagName === "BUTTON") {
        button.click();
      }
    });
  }
});
