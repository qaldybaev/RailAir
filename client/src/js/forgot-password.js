import customAxios from "../config/axios.config.js";

document
  .getElementById("forgotPasswordForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const msgBox = document.getElementById("forgotMessage");

    const email = document.getElementById("email").value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      msgBox.style.display = "block";
      msgBox.textContent = "Noto‘g‘ri email formati";
      setTimeout(() => {
        msgBox.style.display = "none";
        msgBox.textContent = "";
      }, 3000);
      return;
    }
    localStorage.setItem("reset_email", email);

    try {
      const res = await customAxios.post("/auth/forgot-password", { email });

      msgBox.style.display = "block";
      msgBox.style.color = "green";
      msgBox.textContent = res.data.message || "Emailga OTP yuborildi.";

      setTimeout(() => {
        msgBox.style.display = "none";
        msgBox.textContent = "";
        window.location = "../pages/reset-password.html";
      }, 1000);
    } catch (error) {
      const msgBox = document.getElementById("forgotMessage");
      msgBox.style.display = "block";
      msgBox.style.color = "red";
      msgBox.textContent =
        error?.response?.data?.message || "Xatolik yuz berdi.";
      setTimeout(() => {
        msgBox.style.display = "none";
        msgBox.textContent = "";
      }, 3000);
    }
  });
