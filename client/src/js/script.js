import customAxios from "../config/axios.config.js";

const translations = {
  uz: {
    from: "Qayerdan",
    to: "Qayerga",
    search: "Qidirish",
    searchFlights: "✈️ Aviareyslarni qidirish",
    searchTrains: "🚄 Poyezdlarni qidirish",
  },
  en: {
    from: "From",
    to: "To",
    search: "Search",
    searchFlights: "✈️ Search Flights",
    searchTrains: "🚄 Search Trains",
  },
  ru: {
    from: "Откуда",
    to: "Куда",
    search: "Поиск",
    searchFlights: "✈️ Поиск авиарейсов",
    searchTrains: "🚄 Поиск поездов",
  },
};

let currentLang = "uz";

function translateUI() {
  document.getElementById("search-title").textContent =
    translations[currentLang].searchFlights;
  document.getElementById("from-label").textContent =
    translations[currentLang].from;
  document.getElementById("to-label").textContent =
    translations[currentLang].to;
  document.getElementById("dete-label").textContent =
    translations[currentLang].date;
  document.getElementById("search-btn").textContent =
    translations[currentLang].search;
}

const toggle = document.getElementById("lang-toggle");
const dropdown = document.getElementById("lang-dropdown");

toggle.addEventListener("click", (e) => {
  e.preventDefault();
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
});

document.querySelectorAll(".lang-option").forEach((option) => {
  option.addEventListener("click", () => {
    const selectedLang = option.dataset.lang;
    currentLang = selectedLang;
    translateUI();
    dropdown.style.display = "none";
  });
});

const menuBtn = document.getElementById("menuBtn");
const customMenu = document.getElementById("customMenu");
const trainModeBtn = document.getElementById("trainModeBtn");
const aviaModeBtn = document.getElementById("aviaModeBtn");
const formContainer = document.getElementById("dynamicFormContainer");
const resultsDiv = document.getElementById("searchResults");
const ticketDiv = document.getElementById("flightResults");

function getCookie(name) {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const accessToken = getCookie("accessToken");
  if (accessToken) {
    const payload = parseJwt(accessToken);
    localStorage.setItem("user", payload?.id);
    if (payload?.role?.toLowerCase() === "admin") {
      const adminFlight = document.getElementById("adminFlight");
      const adminTrain = document.getElementById("adminTrain");
      const adminUser = document.getElementById("adminUser");
      const adminTicket = document.getElementById("adminTicket");

      if (adminFlight) adminFlight.classList.remove("hidden");
      if (adminTrain) adminTrain.classList.remove("hidden");
      if (adminUser) adminUser.classList.remove("hidden");
      if (adminTicket) adminTicket.classList.remove("hidden");
    }
  }

  if (aviaModeBtn) {
    aviaModeBtn.click();
  }
});

document.getElementById("myPageLink").addEventListener("click", (e) => {
  e.preventDefault();
  const token = getCookie("accessToken");

  if (!token) {
    alert("Siz hali royxatdan otmagansiz!");
  } else {
    window.location.href = "./pages/me.html";
  }
});

let currentMode = "avia";

menuBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (customMenu.style.display === "block") {
    customMenu.style.display = "none";
  } else {
    customMenu.style.display = "block";
  }
});

window.addEventListener("click", (e) => {
  if (!menuBtn.contains(e.target) && !customMenu.contains(e.target)) {
    customMenu.style.display = "none";
  }
});

function createSearchForm(fromPlaceholder, toPlaceholder, includeDate = false) {
  formContainer.innerHTML = "";
  const form = document.createElement("form");
  form.className = "search-form";

  const fromInput = document.createElement("input");
  fromInput.type = "text";
  fromInput.placeholder = fromPlaceholder;
  fromInput.required = true;

  const toInput = document.createElement("input");
  toInput.type = "text";
  toInput.placeholder = toPlaceholder;
  toInput.required = true;

  form.append(fromInput, toInput);

  let dateInput = null;
  if (includeDate) {
    dateInput = document.createElement("input");
    dateInput.type = "date";
    form.append(dateInput);
  }

  if (currentMode === "avia") {
    const classSelect = document.createElement("select");
    classSelect.id = "ticketClassSelect";
    classSelect.className = "ticket-class";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "✈️ Klassni tanlang";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    classSelect.appendChild(defaultOption);

    const options = [
      { value: "econom", text: "Econom" },
      { value: "business", text: "Biznes" },
      { value: "premium", text: "Premium" },
    ];

    options.forEach((opt) => {
      const option = document.createElement("option");
      option.value = opt.value;
      option.textContent = opt.text;
      classSelect.appendChild(option);
    });

    form.append(classSelect);
  }
  if (currentMode === "train") {
  const classSelect = document.createElement("select");
  classSelect.id = "trainClassSelect";
  classSelect.className = "ticket-class";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "🚆 Klassni tanlang";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  classSelect.appendChild(defaultOption);

  const options = [
    { value: "kupe", text: "Kupe" },
    { value: "platskart", text: "Platskart" },
    { value: "lyuks", text: "Lyuks" },
  ];

  options.forEach((opt) => {
    const option = document.createElement("option");
    option.value = opt.value;
    option.textContent = opt.text;
    classSelect.appendChild(option);
  });

  form.append(classSelect);
}


  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = "Qidirish";
  form.appendChild(submitBtn);

  formContainer.appendChild(form);
  resultsDiv.innerHTML = "";
  ticketDiv.innerHTML = "";

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const from = fromInput.value.trim();
    const to = toInput.value.trim();
    const date = dateInput ? dateInput.value || null : null;
    showResults(from, to, date);
  });
}

function setActive(button) {
  trainModeBtn.classList.remove("active");
  aviaModeBtn.classList.remove("active");
  button.classList.add("active");
}

function showResults(from, to, date) {
  resultsDiv.innerHTML = "";
  if (currentMode === "avia") {
    fetchFlights(from, to, date);
  } else if (currentMode === "train") {
    fetchTrains(from, to, date);
  }
}

async function fetchFlights(from, to, date) {
  ticketDiv.innerHTML = "<p>⏳ Yuklanmoqda...</p>";
  try {
    const params = { from, to };
    if (date) params.date = date;
    const response = await customAxios.get("/flight/search", { params });
    const flights = response.data;
    console.log(flights);
    if (!flights.length) {
      ticketDiv.innerHTML = `<p style="color:orange;">Hech qanday aviareys topilmadi.</p>`;
      return;
    }
    ticketDiv.innerHTML = "<h3>✈️ Aviareyslar natijasi:</h3>";
    flights.forEach((flight) => {
      const card = document.createElement("div");
      card.classList.add("flight-card");
      card.innerHTML = `
        <h4>${flight.from} ➡️ ${flight.to}</h4>
        <p>✈️ Aviakompaniya: ${flight.airline}</p>
        <p>🕒 Jo'nash: ${new Date(flight.departureTime).toLocaleString()}</p>
        <p>🛬 Yetib borish: ${new Date(flight.arrivalTime).toLocaleString()}</p>
        <p>💰 Narxi: ${flight.price} usd</p>
        <button class="buy-btn" data-id="${flight.id}">Sotib olish</button>
        <hr />
      `;
      ticketDiv.appendChild(card);
    });
  } catch (error) {
    ticketDiv.innerHTML = `<p style="color:red;">Xatolik: ${
      error.response?.data?.message || "Qidiruv amalga oshmadi"
    }</p>`;
  }
}

async function fetchTrains(from, to, date) {
  ticketDiv.innerHTML = "<p>⏳ Po'ezdlar qidirilmoqda...</p>";
  try {
    const params = { from, to };
    if (date) params.date = date;
    const response = await customAxios.get("/train/search", { params });
    const trains = response.data;
    if (!trains.length) {
      ticketDiv.innerHTML = `<p style="color:orange;">Hech qanday po'ezd topilmadi.</p>`;
      return;
    }
    ticketDiv.innerHTML = "<h3>🚄 Po'ezdlar natijasi:</h3>";
    trains.forEach((train) => {
      const card = document.createElement("div");
      card.classList.add("train-card");
      card.innerHTML = `
        <h4>${train.from} ➡️ ${train.to}</h4>
        <p>🚄 Poyezd nomi: ${train.trainNumber}</p>
        <p>🕒 Jo'nash: ${new Date(train.departureTime).toLocaleString()}</p>
        <p>🛬 Yetib borish: ${new Date(train.arrivalTime).toLocaleString()}</p>
        <p>💰 Narxi: ${train.price} so'm</p>
        <button class="buy-btn" data-id="${train.id}">Tanlash</button>
        <hr />
      `;
      ticketDiv.appendChild(card);
    });
  } catch (error) {
    ticketDiv.innerHTML = `<p style="color:red;">Xatolik: ${
      error.response?.data?.message || "Qidiruv amalga oshmadi"
    }</p>`;
  }
}

ticketDiv.addEventListener("click", (e) => {
  const token = getCookie("accessToken");

  if (!token) {
    alert("Iltimos avval royhattan o'ting");
    return;
  }
  if (e.target.classList.contains("buy-btn")) {
    const card = e.target.closest(".flight-card, .train-card");
    console.log("card", card);
    if (card) {
      const fromText = card.querySelector("h4").textContent;
      const departureText = card.querySelector("p:nth-child(3)").textContent;
      const arrivalText = card.querySelector("p:nth-child(4)").textContent;
      const priceText = card.querySelector("p:nth-child(5)").textContent;

      const ticketId = e.target.dataset.id;
      const type = card.classList.contains("flight-card") ? "flight" : "train";

      const selectedInfo = {
        id: ticketId,
        from: fromText,
        departure: departureText,
        arrival: arrivalText,
        price: priceText,
        type: type,
      };

      localStorage.setItem("selectedTicket", JSON.stringify(selectedInfo));
    }
    window.location.href = "../pages/pasport.html";
  }
});

aviaModeBtn.addEventListener("click", () => {
  setActive(aviaModeBtn);
  currentMode = "avia";
  document.body.style.backgroundImage =
    "url('https://vaib.uz/wp-content/uploads/2024/09/778_1648488209.jpg')";
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundPosition = "center";
  createSearchForm("🛫 Qayerdan", "Qayerga 🛬", true);
});

trainModeBtn.addEventListener("click", () => {
  setActive(trainModeBtn);
  currentMode = "train";
  document.body.style.backgroundImage =
    "url('https://inbetweentravels.com/wp-content/uploads/2023/10/20230423-04232856-scaled-e1744708436399.webp')";
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundPosition = "center";
  createSearchForm("🚉 Qayerdan", "Qayerga 🚆", true);
});
