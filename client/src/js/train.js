import customAxios from "../config/axios.config";

const form = document.getElementById("trainForm");
const messageDiv = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const trainData = {
    from: document.getElementById("from").value.trim(),
    to: document.getElementById("to").value.trim(),
    departureTime: document.getElementById("departureTime").value,
    arrivalTime: document.getElementById("arrivalTime").value,
    price: parseFloat(document.getElementById("price").value),
    seatCount: parseInt(document.getElementById("seatCount").value),
    availableSeats: parseInt(document.getElementById("availableSeats").value),
    trainNumber: document.getElementById("trainNumber").value.trim(),
  };

  console.log(trainData)

  try {
    const response = await customAxios.post("/train", trainData);

    messageDiv.style.color = "green";
    messageDiv.textContent = "Poyezd muvaffaqiyatli qo'shildi!";
    form.reset();
  } catch (error) {
    messageDiv.style.color = "red";
    messageDiv.textContent =
      error.response?.data?.message || "Xatolik yuz berdi";
  }
});
