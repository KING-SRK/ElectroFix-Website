import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth();

// 🔹 DOM Elements
const confirmPaymentBtn = document.getElementById("confirmPaymentBtn");
const cancelBtn = document.getElementById("cancelBtn");
const buttonText = document.getElementById("buttonText");
const loadingSpinner = document.getElementById("loadingSpinner");
const successPopup = document.getElementById("successPopup");
const okBtn = document.getElementById("okBtn");

// 🔹 Load booking data from local storage
const bookingData = JSON.parse(localStorage.getItem("pendingBooking"));
let localUID = localStorage.getItem("pendingBookingUID");

if (bookingData) {
  document.getElementById("customerNameSummary").innerText =
    bookingData.customerName;
  document.getElementById("deviceTypeSummary").innerText =
    bookingData.deviceType;
  document.getElementById("problemSummary").innerText =
    bookingData.problemDescription;
} else {
  alert("No pending booking found. Redirecting to home page.");
  window.location.href = "../index.html";
}

// 🔹 Auth check
onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("You must be logged in to confirm payment.");
    window.location.href = "../login.html";
    return;
  }

  const currentUID = user.uid;

  // Confirm Payment Button
  confirmPaymentBtn.addEventListener("click", async () => {
    // Show loading state
    buttonText.style.display = "none";
    loadingSpinner.style.display = "inline";
    confirmPaymentBtn.disabled = true;

    // Validate UID
    if (!bookingData || !localUID || localUID !== currentUID) {
      alert("Booking data mismatch or missing! Please try again.");
      window.location.href = "../index.html";
      return;
    }

    // Update status
    bookingData.status = "Paid (Unverified)";
    bookingData.paymentDate = new Date().toISOString();

    try {
      const bookingsRef = ref(db, `bookings/${currentUID}`);
      const newBookingRef = push(bookingsRef);
      await set(newBookingRef, bookingData);

      // Hide loading, show popup
      loadingSpinner.style.display = "none";
      successPopup.style.display = "flex";

      // Clear localStorage
      localStorage.removeItem("pendingBooking");
      localStorage.removeItem("pendingBookingUID");
    } catch (error) {
      console.error("❌ Error saving booking:", error);
      alert("Something went wrong. Please try again.");
      buttonText.style.display = "inline";
      confirmPaymentBtn.disabled = false;
    }
  });

  // Cancel Button
  cancelBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to cancel your booking?")) {
      localStorage.removeItem("pendingBooking");
      localStorage.removeItem("pendingBookingUID");
      alert("Booking cancelled successfully.");
      window.location.href = "../services-html/booking.html";
    }
  });

  // OK Button in success popup
  okBtn.addEventListener("click", () => {
    window.location.href = "../index.html";
  });
});
