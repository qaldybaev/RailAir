import customAxios from "../config/axios.config";
const form = document.getElementById("createUserForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const msgBox = document.getElementById("createUserMessage");

  const name = e.target.name.value.trim();
  const email = e.target.email.value.trim();
  const phoneNumber = e.target.phoneNumber.value.trim();
  const password = e.target.password.value;
  const role = e.target.role.value;
  const isBlocked = e.target.isBlocked.checked;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+998[0-9]{9}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

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

  const payload = { name, email, phoneNumber, password, role, isBlocked };

  try {
    const response = await customAxios.post("/users", payload);

    msgBox.style.display = "block";
    msgBox.style.color = "green";
    msgBox.textContent = "Foydalanuvchi muvaffaqiyatli yaratildi!";

    form.reset();

    setTimeout(() => {
      msgBox.style.display = "none";
      msgBox.textContent = "";
    }, 3000);
  } catch (error) {
    const msgBox = document.getElementById("createUserMessage");
    msgBox.style.display = "block";
    msgBox.style.color = "red";
    msgBox.textContent = error?.response?.data?.message || "Xatolik yuz berdi.";

    setTimeout(() => {
      msgBox.style.display = "none";
      msgBox.textContent = "";
    }, 3000);
  }
});
