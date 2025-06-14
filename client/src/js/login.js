const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});
const URL = process.env.SERVER_BASE_URL;

import customAxios from "../config/axios.config.js";

const form = document.querySelector("#registerForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const msgBox = document.getElementById("registerMessage");

  const name = e.target.name.value;
  const email = e.target.email.value;
  const phoneNumber = e.target.phoneNumber.value;
  const password = e.target.password.value;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+998[0-9]{9}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  try {
    if (!emailRegex.test(email)) {
      msgBox.style.display = "block";
      msgBox.textContent = "Noto‘g‘ri email formati";
      setTimeout(() => {
        msgBox.style.display = "none";
        msgBox.textContent = "";
      }, 3000);
      return;
    }
    if (!phoneRegex.test(phoneNumber)) {
      msgBox.style.display = "block";
      msgBox.textContent = "Telefon raqam formati: +998901234567";
      setTimeout(() => {
        msgBox.style.display = "none";
        msgBox.textContent = "";
      }, 3000);
      return;
    }
    if (!passwordRegex.test(password)) {
      msgBox.style.display = "block";
      msgBox.textContent = "Parol kamida 8 belgi, harf va raqam bo‘lishi kerak";
      setTimeout(() => {
        msgBox.style.display = "none";
        msgBox.textContent = "";
      }, 3000);
      return;
    }

    const res = await customAxios.post("/auth/register", {
      name,
      email,
      phoneNumber,
      password,
    });

    form.reset();
    window.location.href = "/pages/login";
  } catch (error) {
    msgBox.style.display = "block";
    msgBox.textContent = error?.response?.data?.message || "Xatolik yuz berdi.";
    setTimeout(() => {
      msgBox.style.display = "none";
      msgBox.textContent = "";
    }, 3000);
  }
});

const googleBtn = document.getElementById("googleBtn");

googleBtn.addEventListener("click", () => {
  window.location.href = `${URL}/auth/google`;
});

const facebookBtn = document.getElementById("facebookBtn");

facebookBtn.addEventListener("click", () => {
  window.location.href = `${URL}/auth/facebook`;
});

const formLogin = document.querySelector("#loginForm");

formLogin.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;

  try {
    const res = await customAxios.post("/auth/login", {
      email,
      password,
    });

    const msgBox = document.getElementById("loginMessage");
    msgBox.style.display = "block";
    msgBox.style.color = "green";
    msgBox.textContent = res.data.message || "Muvaffaqiyatli kirdingiz.";

    window.location = "../index.html";
  } catch (error) {
    const msgBox = document.getElementById("loginMessage");
    msgBox.style.display = "block";
    msgBox.textContent = error?.response?.data?.message || "Kirishda xatolik.";
    setTimeout(() => {
      msgBox.style.display = "none";
      msgBox.textContent = "";
    }, 3000);
  }
});
