import customAxios from "../config/axios.config.js";

document
  .getElementById("resetPasswordForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = localStorage.getItem("reset_email");
    const code = document.getElementById("code").value;
    const newPassword = document.getElementById("newPassword").value;

    try {
      const res = await customAxios.post("/auth/reset-password", {
        email,
        code,
        newPassword,
      });

      const msgBox = document.getElementById("resetMessage");
      msgBox.style.display = "block";
      msgBox.style.color = "green";
      msgBox.textContent = res.data.message || "Parol muvaffaqiyatli tiklandi.";

      setTimeout(() => {
        msgBox.style.display = "none";
        msgBox.textContent = "";
        window.location.href = "../pages/login.html";
      }, 1000);
    } catch (error) {
      const msgBox = document.getElementById("resetMessage");
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
