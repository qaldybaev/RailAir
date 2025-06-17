import customAxios from "../config/axios.config";

const form = document.getElementById("flightForm");
const messageDiv = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const flightData = {
    from: document.getElementById("from").value.trim(),
    to: document.getElementById("to").value.trim(),
    departureTime: document.getElementById("departureTime").value,
    arrivalTime: document.getElementById("arrivalTime").value,
    price: parseFloat(document.getElementById("price").value),
    seatCount: parseInt(document.getElementById("seatCount").value),
    availableSeats: parseInt(document.getElementById("availableSeats").value),
    airline: document.getElementById("airline").value.trim(),
  };


  try {
    const response = await customAxios.post("/flight", flightData); 

    messageDiv.style.color = "green";
    messageDiv.textContent = "Reys muvaffaqiyatli qo'shildi!";
    form.reset();
  } catch (err) {
    messageDiv.style.color = "red";
    messageDiv.textContent = err.response?.data?.message || "Xatolik yuz berdi";
  }
});
