// =======================
// 🔹 Firebase import
// =======================
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// 🔹 Initialize Auth
const auth = getAuth();

// =======================
// 🔹 Logout button click handler
// =======================
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      console.log("User logged out successfully");
      alert("Logged out successfully!");
      // চাইলে এখানে redirect করতে পারো
      // window.location.href = "index.html";
    } catch (err) {
      console.error("Logout error:", err);
      alert("Logout failed!");
    }
  });
}
