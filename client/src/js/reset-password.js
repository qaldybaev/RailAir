import customAxios from "../config/axios.config.js";

document
  .getElementById("resetPasswordForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const msgBox = document.getElementById("resetMessage");

    const email = localStorage.getItem("reset_email");
    const code = document.getElementById("code").value;
    const newPassword = document.getElementById("newPassword").value;

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      msgBox.style.display = "block";
      msgBox.textContent = "Parol kamida 8 belgi, harf va raqam bo‘lishi kerak";
      setTimeout(() => {
        msgBox.style.display = "none";
        msgBox.textContent = "";
      }, 3000);
      return;
    }

    try {
      const res = await customAxios.post("/auth/reset-password", {
        email,
        code,
        newPassword,
      });

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
