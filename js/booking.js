import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  get,
  child,
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
const auth = getAuth(app);

// 🔹 DOM Elements
const bookingForm = document.getElementById("bookingForm");
const autoDetectBtn = document.getElementById("autoDetectBtn");
const customerAddressInput = document.getElementById("customerAddress");
const customerPincodeInput = document.getElementById("customerPincode");
const submitBtn = document.querySelector(".submit-btn");

// 🔹 Latitude & Longitude
let userLatitude = null;
let userLongitude = null;

// ✅ নতুন অটো-রি-সাইজ ফাংশন
function autoResizeTextarea(element) {
  if (element.scrollHeight > element.clientHeight) {
    element.style.height = element.scrollHeight + "px";
  }
}

// 🔹 Auto-Detect Location Button
autoDetectBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    autoDetectBtn.innerText = "Detecting...";
    autoDetectBtn.disabled = true;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        userLatitude = position.coords.latitude;
        userLongitude = position.coords.longitude;
        console.log("📍 Location found:", { userLatitude, userLongitude });

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLatitude}&lon=${userLongitude}`
          );
          const data = await response.json();
          console.log("🏠 Address data:", data);

          if (data.address) {
            const address = data.address;
            const fullAddress = [
              address.house_number,
              address.road,
              address.suburb,
              address.neighbourhood,
              address.village || address.town || address.city,
              address.county,
              address.state_district,
              address.state,
              address.postcode,
              address.country,
            ]
              .filter(Boolean)
              .join(", ");

            customerAddressInput.value = fullAddress;
            customerPincodeInput.value = address.postcode || "";
            // ✅ এখানে অটো-রি-সাইজ ফাংশন কল করা হচ্ছে
            autoResizeTextarea(customerAddressInput);
          } else {
            customerAddressInput.value = "Could not find a detailed address.";
          }
        } catch (error) {
          console.error("❌ Error fetching address:", error);
          alert(
            "Could not automatically fill the address. Please enter it manually."
          );
        } finally {
          autoDetectBtn.innerText = "Auto-Detect Location 📍";
          autoDetectBtn.disabled = false;
        }
      },
      (error) => {
        console.error("❌ Geolocation error:", error.message);
        alert(
          "Permission denied or location not available. Please enter your address manually."
        );
        autoDetectBtn.innerText = "Auto-Detect Location 📍";
        autoDetectBtn.disabled = false;
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
});

// 🔹 Check user login state and handle form submission
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;
    const dbRef = ref(db);

    // রিয়েলটাইম ডেটাবেস থেকে ব্যবহারকারীর তথ্য লোড করা হচ্ছে
    try {
      const snapshot = await get(child(dbRef, `users/${uid}`));
      if (snapshot.exists()) {
        const userData = snapshot.val();
        console.log("✅ User data loaded from Realtime DB:", userData);

        // Fill form safely
        document.getElementById("customerName").value = userData.fullName ?? "";
        document.getElementById("customerPhone").value =
          (userData.phoneNumber
            ? userData.phoneNumber.replace(/^\+91\s?/, "")
            : "") ?? "";

        // Ensure country code is added to the phone number field
        const customerPhoneInput = document.getElementById("customerPhone");
        const countryCode = "+91 ";
        if (!customerPhoneInput.value.startsWith(countryCode)) {
          customerPhoneInput.value = countryCode + customerPhoneInput.value;
        }

        // Fill other fields if available
        document.getElementById("customerAddress").value =
          userData.address ?? "";
        document.getElementById("customerPincode").value =
          userData.postalCode ?? "";

        // ✅ এখানেও অটো-রি-সাইজ ফাংশন কল করা হচ্ছে যাতে ডেটা লোড হওয়ার সাথে সাথে সাইজ ঠিক হয়ে যায়
        autoResizeTextarea(customerAddressInput);
      } else {
        console.warn("⚠️ User profile not found in database!");
      }
    } catch (error) {
      console.error("❌ Error loading profile:", error);
    }

    // Booking Form Submit
    bookingForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      submitBtn.innerText = "Booking...";
      submitBtn.disabled = true;
      submitBtn.style.cursor = "not-allowed";

      if (!userLatitude || !userLongitude) {
        if (navigator.geolocation) {
          try {
            const position = await new Promise((resolve, reject) =>
              navigator.geolocation.getCurrentPosition(resolve, reject)
            );
            userLatitude = position.coords.latitude;
            userLongitude = position.coords.longitude;
          } catch (err) {
            console.warn("Location not detected. Will save as null.");
          }
        }
      }

      const newBooking = {
        customerName: document.getElementById("customerName").value,
        customerPhone: document.getElementById("customerPhone").value,
        customerAddress: document.getElementById("customerAddress").value,
        customerPincode: document.getElementById("customerPincode").value,
        deviceType: document.getElementById("deviceType").value,
        problemDescription: document.getElementById("problemDescription").value,
        latitude: userLatitude || null,
        longitude: userLongitude || null,
        bookingDate: new Date().toISOString(),
        status: "Pending",
      };

      const bookingsRef = ref(db, `bookings/${uid}`);
      const newBookingRef = push(bookingsRef);

      try {
        await set(newBookingRef, newBooking);
        console.log("✅ Booking successful!");
        showSuccessPopup();
      } catch (error) {
        console.error("❌ Error submitting booking:", error);
        alert("There was an error booking your service. Please try again.");

        submitBtn.innerText = "Book Now";
        submitBtn.disabled = false;
        submitBtn.style.cursor = "pointer";
      }
    });
  } else {
    console.log("User not logged in. Redirecting to login page.");
    // এটি অন্য স্ক্রিপ্ট দ্বারা হ্যান্ডেল করা হবে
  }
});

// 🔹 Success Popup Function
function showSuccessPopup() {
  const popup = document.createElement("div");
  popup.className = "success-popup";
  popup.innerHTML = `
    <div class="popup-content">
      <i class="fas fa-check-circle"></i>
      <h3>Booking Successful!</h3>
      <p>Your repair request has been submitted. Our team will contact you shortly.</p>
      <button id="okBtn" class="btn">OK</button>
    </div>
  `;
  document.body.appendChild(popup);

  document.getElementById("okBtn").addEventListener("click", () => {
    window.location.href = "../index.html";
  });
}
