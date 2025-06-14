import customAxios from "../config/axios.config";

const passengerForm = document.querySelector("#passengerForm");
const seatForm = document.querySelector("#seatForm"); 
const seatSection = document.querySelector("#seatSection"); 
const ticket = JSON.parse(localStorage.getItem("selectedTicket"));
const user = JSON.parse(localStorage.getItem("user"));
const userId = user;
console.log(userId);

const msgBox = document.getElementById("passengerMessage");
const ticketBox = document.getElementById("ticketMessage");

if (!ticket || !user) {
  document.getElementById("ticketInfo").innerHTML =
    "<p>Ma'lumotlar topilmadi. <a href='index.html'>Ortga qayting</a></p>";
} else {
  document.getElementById("ticketInfo").innerHTML = `
    <p><strong>Yo‘nalish:</strong> ${ticket.from}</p>
    <p><strong>Jo‘nash:</strong> ${ticket.departure}</p>
    <p><strong>Yetib borish:</strong> ${ticket.arrival}</p>
    <p><strong>Narxi:</strong> ${ticket.price}</p>
  `;
}

let createdPassengerId = null;

passengerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(passengerForm);
  const fullName = formData.get("fullName");
  const passport = formData.get("passport");
  const gender = formData.get("gender");
  const birthDate = formData.get("birthDate");

  if (!userId) {
    msgBox.style.display = "block";
    msgBox.textContent = "Foydalanuvchi aniqlanmadi.";
    return hideMessageAfterDelay();
  }

  const payload = {
    fullName,
    passport,
    gender,
    birthDate,
    userId,
  };

  try {
    const res = await customAxios.post("/passenger-info", payload);
    console.log(res.data.data.id);
    createdPassengerId = res.data.data?.id;
    console.log(createdPassengerId);

    msgBox.style.display = "block";
    msgBox.style.color = "green";
    msgBox.textContent = "Ma'lumotlar saqlandi. Endi joy tanlang.";

    passengerForm.reset();
    seatSection.style.display = "block";
  } catch (error) {
    msgBox.style.display = "block";
    msgBox.style.color = "red";
    msgBox.textContent =
      error?.response?.data?.message || "Jo‘natishda xatolik yuz berdi.";
  } finally {
    hideMessageAfterDelay();
  }
});

seatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const seatNumber = document.querySelector("#seatNumber").value;

  if (!createdPassengerId || !ticket) {
    ticketBox.textContent = "Avval yo'lovchi ma'lumotlarini to'ldiring.";
    return;
  }

  const ticketPayload = {
    passengerInfoId: createdPassengerId,
    seatNumber: Number(seatNumber),
    userId,
  };

  if (ticket.type === "flight") {
    ticketPayload.flightId = Number(ticket.id);
  } else if (ticket.type === "train") {
    ticketPayload.trainId = Number(ticket.id);
  }

  try {
    await customAxios.post("/ticket", ticketPayload);
    ticketBox.textContent = "Chipta muvaffaqiyatli yaratildi!";
    seatForm.reset();
    seatSection.style.display = "none";
    window.location.href = "../pages/ticket.html";
  } catch (error) {
    ticketBox.textContent =
      error?.response?.data?.message || "Chipta yaratishda xatolik.";
  }
});

function hideMessageAfterDelay() {
  setTimeout(() => {
    msgBox.style.display = "none";
    msgBox.textContent = "";
    msgBox.style.color = "red";
  }, 3000);
}
