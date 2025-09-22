const loadingScreen = document.getElementById("loadingScreen");
const bookingSection = document.querySelector(".booking-section");

// ২ সেকেন্ড পর লোডিং স্ক্রিন সরানো হবে
setTimeout(() => {
  loadingScreen.classList.add("hidden");   // লুকিয়ে দাও
  bookingSection.classList.remove("hidden");
  bookingSection.classList.add("visible"); // ফেড-ইন
}, 2000);
