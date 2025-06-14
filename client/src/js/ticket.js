import customAxios from "../config/axios.config";

const user = JSON.parse(localStorage.getItem("user"));
const msg = document.getElementById("ticketBox");

async function loadTicketData() {
  if (!user) {
    msg.innerHTML =
      "<p>Foydalanuvchi topilmadi. <a href='index.html'>Ortga qayting</a></p>";
    return;
  }

  try {
    const res = await customAxios.get(`/ticket/user/${user}`);
    const tickets = res.data.data;
    console.log(tickets);
    console.log(user);

    if (!tickets || tickets.length === 0) {
      msg.innerHTML = "<p>Chiptalar topilmadi.</p>";
      return;
    }

   const ticketHtml = tickets
  .map((ticket) => {
    const flight = ticket.flight;
    const train = ticket.train;
    const passenger = ticket.passengerInfo;

    if (flight) {
      return `
        <div class="ticket">
          <div class="top">
            <div class="from">
              <div class="code">${flight.from}</div>
              <div class="city">${flight.to}</div>
            </div>
            <div class="plane">✈</div>
            <div class="to">
              <div class="code">${flight.to}</div>
              <div class="city">${flight.to}</div>
            </div>
          </div>
          <div class="bottom">
            <div class="section-title">Yo‘lovchi</div>
            <div class="row">
              <div>
                <span>Ism Familiya</span>
                <strong>${passenger?.fullName || "Noma’lum"}</strong>
              </div>
              <div>
                <span>Orindiq</span>
                <strong>${ticket.seatNumber}</strong>
              </div>
            </div>

            <div class="section-title">Parvoz ma’lumotlari</div>
            <div class="row">
              <div>
                <span>Bilet raqami</span>
                <strong>${ticket.id}</strong>
              </div>
              <div>
                <span>Jo‘nash vaqti</span>
                <strong>${new Date(flight.departureTime).toLocaleString()}</strong>
              </div>
            </div>

            <div class="row">
              <div>
                <span>Avia kompaniya</span>
                <strong>${flight.airline || "Noma’lum"}</strong>
              </div>
              <div>
                <span>Yetib borish vaqti</span>
                <strong>${new Date(flight.arrivalTime).toLocaleString()}</strong>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (train) {
      return `
        <div class="ticket">
          <div class="top-train">
            <div class="from">
              <div class="code">${train.from}</div>
              <div class="city">${train.to}</div>
            </div>
            <div class="plane">🚆</div>
            <div class="to">
              <div class="code">${train.to}</div>
              <div class="city">${train.to}</div>
            </div>
          </div>
          <div class="bottom">
            <div class="section-title">Yo‘lovchi</div>
            <div class="row">
              <div>
                <span>Ism Familiya</span>
                <strong>${passenger?.fullName || "Noma’lum"}</strong>
              </div>
              <div>
                <span>Joy raqami</span>
                <strong>${ticket.seatNumber}</strong>
              </div>
            </div>

            <div class="section-title">Yo‘l ma’lumotlari</div>
            <div class="row">
              <div>
                <span>Bilet raqami</span>
                <strong>${ticket.id}</strong>
              </div>
              <div>
                <span>Jo‘nash vaqti</span>
                <strong>${new Date(train.departureTime).toLocaleString()}</strong>
              </div>
            </div>

            <div class="row">
              <div>
                <span>Poezd raqami</span>
                <strong>${train.trainNumber}</strong>
              </div>
              <div>
                <span>Yetib borish vaqti</span>
                <strong>${new Date(train.arrivalTime).toLocaleString()}</strong>
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      return `<p>Noma'lum chipta turi</p>`;
    }
  })
  .join("");

msg.innerHTML = ticketHtml;

  } catch (error) {
    msg.innerHTML = `<p>Xatolik: ${
      error?.response?.data?.message || "Ma’lumotlarni yuklashda muammo bo‘ldi."
    }</p>`;
  }
}

loadTicketData();
