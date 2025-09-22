// logout.js ফাইলের সম্পূর্ণ কোড:

document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const loginBtn = document.querySelector(".login-btn");
  const signupBtn = document.querySelector(".signup-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const logoutPopup = document.getElementById("logout-popup");
  const confirmLogoutBtn = document.getElementById("confirm-logout-btn");
  const cancelLogoutBtn = document.getElementById("cancel-logout-btn");

  // Hero Section-এর জন্য ভ্যারিয়েবল (যদি থাকে)
  const heroUserInfoDiv = document.getElementById("hero-user-info");
  const heroUserNameSpan = document.getElementById("userName");

  // Function to update button visibility and user info
  function updateAuthButtons() {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    const userName = localStorage.getItem("userName");

    if (isLoggedIn) {
      if (loginBtn && signupBtn && logoutBtn) {
        loginBtn.style.display = "none";
        signupBtn.style.display = "none";
        logoutBtn.style.display = "inline-block";
      }
      if (heroUserInfoDiv && heroUserNameSpan) {
        heroUserInfoDiv.style.display = "flex";
        heroUserNameSpan.textContent = userName
          ? `Hi, ${userName}`
          : "Hi, Guest";
      }
    } else {
      if (loginBtn && signupBtn && logoutBtn) {
        loginBtn.style.display = "inline-block";
        signupBtn.style.display = "inline-block";
        logoutBtn.style.display = "none";
      }
      if (heroUserInfoDiv) {
        heroUserInfoDiv.style.display = "none";
      }
    }
  }

  // Show the custom popup when the logout button is clicked
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (logoutPopup) {
        logoutPopup.style.display = "flex";
      }
    });
  }

  // Handle 'Yes, Log Out' button click
  if (confirmLogoutBtn) {
    confirmLogoutBtn.addEventListener("click", () => {
      localStorage.setItem("loggedIn", "false");
      localStorage.removeItem("userName");
      localStorage.removeItem("userAddress");
      updateAuthButtons();
      alert("You have been logged out!");
      if (logoutPopup) {
        logoutPopup.style.display = "none";
      }
      window.location.href = "../index.html"; // যেহেতু আপনি html ফোল্ডারের মধ্যে আছেন
    });
  }

  // Handle 'No, Cancel' button click
  if (cancelLogoutBtn) {
    cancelLogoutBtn.addEventListener("click", () => {
      if (logoutPopup) {
        logoutPopup.style.display = "none";
      }
    });
  }

  // Call the update function when the page loads
  updateAuthButtons();
});
