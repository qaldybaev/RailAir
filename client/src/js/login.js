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

  const name = e.target.name.value;
  const email = e.target.email.value;
  const phoneNumber = e.target.phoneNumber.value;
  const password = e.target.password.value;

  try {
    const res = await customAxios.post("/auth/register", {
      name,
      email,
      phoneNumber,
      password,
    });

    form.reset();
    window.location.href = "/pages/login";
  } catch (error) {
    const msgBox = document.getElementById("registerMessage");
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

    console.log("data", res);

    const { token, refreshToken } = res.data.data;
    console.log(token, "refres", refreshToken);

    if (token && refreshToken) {
      localStorage.setItem("accessToken", token);
      localStorage.setItem("refreshToken", refreshToken);
    }

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
