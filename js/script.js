// =======================
// 🔹 Firebase import
// =======================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
  child,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// 🔹 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCQneRn2fhr2MBPZ8FpGYQTHnSVXe-Y8oQ",
  authDomain: "electrofix-website.firebaseapp.com",
  projectId: "electrofix-website",
  storageBucket: "electrofix-website.appspot.com",
  messagingSenderId: "891241046906",
  appId: "1:891241046906:web:382d83e91f521a357cacc3",
  databaseURL:
    "https://electrofix-website-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// =======================
// 🔹 Menu toggle
// =======================
const menuToggle = document.getElementById("menu-toggle");
const nav = document.getElementById("main-nav");
if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("active");
    menuToggle.classList.toggle("active");
  });
}

// =======================
// 🔹 Active nav link highlight
// =======================
const navLinks = document.querySelectorAll(".nav a");
let currentPath = window.location.pathname.split("/").pop();
if (currentPath === "" || currentPath === "/") currentPath = "index.html";
navLinks.forEach((link) => {
  const linkPath = link.getAttribute("href");
  if (linkPath === currentPath || linkPath.endsWith(currentPath))
    link.classList.add("active");
  else link.classList.remove("active");
});

// =======================
// 🔹 Feature card click (mobile only)
// =======================
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

// =======================
// 🔹 Swiper.js Initialization
// =======================
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
// 🔹 User Info UI Handling (Firebase → Mobile + Desktop)
// =======================
const userNameMobile = document.getElementById("user-name-display");
const userAddressMobile = document.getElementById("user-address-display");
const userInfoMobile = document.querySelector(".user-info-mobile");
const userInfoDesktop = document.querySelector(".user-info-desktop");
const loginBtn = document.querySelector(".login-btn");
const signupBtn = document.querySelector(".signup-btn");
const logoutBtn = document.getElementById("logout-btn");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const snapshot = await get(child(ref(db), `users/${user.uid}`));
      if (snapshot.exists()) {
        const userData = snapshot.val();
        const name = userData.fullName || "Guest";
        const address = userData.address || "Address not available";

        // Mobile UI
        if (userInfoMobile && userNameMobile && userAddressMobile) {
          userInfoMobile.classList.add("active");
          userNameMobile.textContent = `Hi, ${name}`;
          userAddressMobile.textContent = address;
        }

        // Desktop UI
        if (userInfoDesktop) {
          userInfoDesktop.innerHTML = `<span>Hi, ${name}</span> <small>${address}</small>`;
        }

        // Show only Logout button
        if (logoutBtn) logoutBtn.style.display = "inline-block";
        if (loginBtn) loginBtn.style.display = "none";
        if (signupBtn) signupBtn.style.display = "none";
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
    }
  } else {
    // লগআউট বা লগইন না করা অবস্থায়
    if (userInfoMobile) userInfoMobile.classList.remove("active");
    if (userNameMobile) userNameMobile.textContent = "";
    if (userAddressMobile) userAddressMobile.textContent = "";
    if (userInfoDesktop) userInfoDesktop.innerHTML = "";

    // Show only Login & Signup buttons
    if (logoutBtn) logoutBtn.style.display = "none";
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (signupBtn) signupBtn.style.display = "inline-block";
  }
});

// =======================
// 🔹 Logout button click handler
// =======================
const logoutPopup = document.getElementById("logout-popup");
const confirmLogoutBtn = document.getElementById("confirm-logout-btn");
const cancelLogoutBtn = document.getElementById("cancel-logout-btn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (logoutPopup) {
      logoutPopup.style.display = "flex";
    }
  });
}

if (confirmLogoutBtn) {
  confirmLogoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully");
      window.location.href = "index.html";
    } catch (err) {
      console.error("Logout error:", err);
      alert("Logout failed!");
    } finally {
      if (logoutPopup) {
        logoutPopup.style.display = "none";
      }
    }
  });
}

if (cancelLogoutBtn) {
  cancelLogoutBtn.addEventListener("click", () => {
    if (logoutPopup) {
      logoutPopup.style.display = "none";
    }
  });
}
