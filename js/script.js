// 🔹 Menu toggle
const menuToggle = document.getElementById("menu-toggle");
const nav = document.getElementById("main-nav");
if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("active");
    menuToggle.classList.toggle("active");
  });
}

// 🔹 Active nav link highlight
const navLinks = document.querySelectorAll(".nav a");
let currentPath = window.location.pathname.split("/").pop();
if (currentPath === "" || currentPath === "/") currentPath = "index.html";
navLinks.forEach((link) => {
  const linkPath = link.getAttribute("href");
  if (linkPath === currentPath || linkPath.endsWith(currentPath))
    link.classList.add("active");
  else link.classList.remove("active");
});

// 🔹 Feature card click (mobile only)
function isMobile() {
  return window.innerWidth <= 576;
}
const featureCards = document.querySelectorAll(".feature-card");
featureCards.forEach((card) => {
  const button = card.querySelector(".feature-btn");
  if (isMobile() && button) {
    card.addEventListener("click", () => {
      let link = button.getAttribute("href");
      if (button.tagName === "A" && link) window.location.href = link;
      else if (button.tagName === "BUTTON") button.click();
    });
  }
});

// 🔹 Swiper.js Initialization
const swiperElement = document.querySelector("#mobileSwiper");
if (swiperElement) {
  const swiper = new Swiper("#mobileSwiper", {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 0,
    autoplay: { delay: 3000, disableOnInteraction: false },
    pagination: { el: ".swiper-pagination", clickable: true },
  });
}

// =======================
// 🔹 User Info UI Handling (Mobile + Desktop)
// =======================
function updateAuthUI() {
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  const userName = localStorage.getItem("userName") || "Guest";
  const userAddress = localStorage.getItem("userAddress") || "";

  // Mobile
  const userInfoMobile = document.querySelector(".user-info-mobile");
  const userNameDisplayMobile = document.getElementById("user-name-display");
  const userAddressDisplayMobile = document.getElementById(
    "user-address-display"
  );

  if (userInfoMobile && userNameDisplayMobile && userAddressDisplayMobile) {
    if (isLoggedIn) {
      userInfoMobile.classList.add("active");
      userNameDisplayMobile.textContent = `Hi, ${userName}`;
      userAddressDisplayMobile.textContent =
        userAddress || "Address not available";
    } else {
      userInfoMobile.classList.remove("active");
      userNameDisplayMobile.textContent = "";
      userAddressDisplayMobile.textContent = "";
    }
  }

  // Desktop (nav-links or header desktop)
  const userInfoDesktop = document.querySelector(".user-info-desktop");
  if (userInfoDesktop) {
    if (isLoggedIn) {
      userInfoDesktop.innerHTML = `<span>Hi, ${userName}</span> <small>${
        userAddress || ""
      }</small>`;
    } else {
      userInfoDesktop.innerHTML = "";
    }
  }

  // Show/hide logout button
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.style.display = isLoggedIn ? "inline-block" : "none";
  }
}

// পেজ লোড হলে কল করবে
window.addEventListener("DOMContentLoaded", updateAuthUI);
