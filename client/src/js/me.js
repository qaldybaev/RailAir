import customAxios from "../config/axios.config.js";

const PUBLIC_URL = process.env.SERVER_BASE_URL;
console.log("Public", PUBLIC_URL);

async function getUserProfile() {
  try {
    const response = await customAxios.get("/users/me");
    const me = response.data.data;

    console.log(`${PUBLIC_URL}/${me.imageUrl}`);

    const container = document.querySelector(".container");

    const imageWrapper = document.createElement("div");
    imageWrapper.classList.add("profile-wrapper");

    const profileImage = document.createElement("img");
    profileImage.src = me.imageUrl
      ? `${PUBLIC_URL}${me.imageUrl}`
      : "https://i.pinimg.com/1200x/c5/07/8e/c5078ec7b5679976947d90e4a19e1bbb.jpg";
    profileImage.classList.add("profile-image");

    const imageForm = document.createElement("form");
    imageForm.classList.add("profile-form");

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*"; // fix: image* -> image/*
    fileInput.style.display = "none";

    const editIcon = document.createElement("button");
    editIcon.type = "button";
    editIcon.innerHTML = `<i class="bi bi-camera"></i>`;
    editIcon.classList.add(
      "btn",
      "btn-sm",
      "btn-outline-primary",
      "edit-photo-btn"
    );

    editIcon.onclick = () => fileInput.click();

    const msgBox = document.querySelector(".meMessage");
    fileInput.onchange = async () => {
      const file = fileInput.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("image", file);

      try {
        await customAxios.patch("/users/me", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        location.reload();
      } catch (err) {
        msgBox.style.display = "block";
        msgBox.style.color = "red";
        msgBox.textContent =
          err?.response?.data?.message || "Rasm yuklashda xatolik!";
        setTimeout(() => {
          msgBox.style.display = "none";
          msgBox.textContent = "";
        }, 3000);
      }
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.innerHTML = `<i class="bi bi-trash3-fill"></i>`;
    deleteBtn.classList.add(
      "btn",
      "btn-sm",
      "btn-outline-danger",
      "ms-2",
      "delete-photo-btn"
    );

    deleteBtn.onclick = async () => {
      if (!confirm("Rostdan ham rasmni ochirmoqchimisiz?")) return;

      try {
        await customAxios.delete("/users/me/photo");
        profileImage.src =
          "https://i.pinimg.com/1200x/c5/07/8e/c5078ec7b5679976947d90e4a19e1bbb.jpg";
      } catch (err) {
        msgBox.textContent = "Rasmni yuklashda xatolik:";
      }
    };

    imageForm.appendChild(fileInput);
    imageForm.appendChild(editIcon);
    imageForm.appendChild(deleteBtn);
    imageWrapper.appendChild(profileImage);
    imageWrapper.appendChild(imageForm);
    container.prepend(imageWrapper);

    const fields = [
      { label: "Ism", key: "name", editable: true },
      { label: "Email", key: "email", editable: true },
      { label: "Telefon raqam", key: "phoneNumber", editable: true },
      { label: "Rol", key: "role", editable: false },
      { label: "Provider", key: "provider", editable: false },
      {
        label: "Holat",
        key: "isBlocked",
        editable: false,
        render: (val) => (val ? "Bloklangan" : "Faol"),
      },
    ];

    fields.forEach(({ label, key, render, editable }) => {
      const value = render ? render(me[key]) : me[key];

      const fieldElement = document.createElement("div");
      fieldElement.classList.add("editable-field");

      fieldElement.innerHTML = `
        <p><strong>${label}:</strong> 
          <span class="value">${value}</span>
          ${
            editable
              ? `
            <input type="${
              key === "email" ? "email" : key === "phoneNumber" ? "tel" : "text"
            }" 
              class="form-control edit-input d-inline-block" 
              value="${me[key]}" 
              style="display:none; width:auto; max-width:200px; margin-left:10px;" />
            <button class="btn btn-sm btn-outline-primary edit-btn ms-2">
              <i class="bi bi-pencil-square"></i>
            </button>
            <button class="btn btn-sm btn-success save-btn ms-2" style="display:none;">
              <i class="bi bi-check2-square"></i>
            </button>
            <button class="btn btn-sm btn-outline-secondary cancel-btn ms-2" style="display:none;">
              <i class="bi bi-x-lg"></i>
            </button>
          `
              : ""
          }
        </p>
      `;

      if (editable) {
        const editBtn = fieldElement.querySelector(".edit-btn");
        const saveBtn = fieldElement.querySelector(".save-btn");
        const cancelBtn = fieldElement.querySelector(".cancel-btn");
        const valueSpan = fieldElement.querySelector(".value");
        const input = fieldElement.querySelector(".edit-input");

        editBtn.onclick = () => {
          valueSpan.style.display = "none";
          input.style.display = "inline";
          editBtn.style.display = "none";
          saveBtn.style.display = "inline";
          cancelBtn.style.display = "inline";
        };

        saveBtn.onclick = async () => {
          try {
            const newValue = input.value;
            if (key === "phoneNumber") {
              const phoneRegex = /^\+998[0-9]{9}$/;
              if (!phoneRegex.test(newValue)) {
                alert("Telefon raqam notogri formatda (+998940123654)");
                return;
              }
            }
            await customAxios.patch("/users/me", { [key]: newValue });

            valueSpan.textContent = newValue;
            valueSpan.style.display = "inline";
            input.style.display = "none";
            editBtn.style.display = "inline";
            saveBtn.style.display = "none";
            cancelBtn.style.display = "none";
          } catch (err) {
            alert("Saqlashda xatolik yuz berdi");
            console.error(err);
          }
        };

        cancelBtn.onclick = () => {
          valueSpan.style.display = "inline";
          input.style.display = "none";
          editBtn.style.display = "inline";
          saveBtn.style.display = "none";
          cancelBtn.style.display = "none";
          input.value = valueSpan.textContent;
        };
      }

      container.appendChild(fieldElement);
    });

    const deleteProfileBtn = document.createElement("button");
    deleteProfileBtn.textContent = "> Profilni o'chirish <";
    deleteProfileBtn.classList.add("btn", "btn-danger", "mt-3");

    deleteProfileBtn.onclick = async () => {
      const confirmDelete = confirm(
        "Rostdan ham profilingizni o‘chirmoqchimisiz?"
      );
      if (!confirmDelete) return;

      try {
        await customAxios.delete("/users/me/profile");
        document.cookie =
          "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
          "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "../pages/login.html";
      } catch (error) {
        msgBox.textContent = "Ochirishda xatolik yuz berdi";
        msgBox.style.color = "red"
        setTimeout(() => {
          msgBox.style.display = "none";
          msgBox.textContent = "";
        }, 3000);
      }
    };

    const createdAt = document.createElement("p");
    createdAt.innerHTML = `<strong>Ro'yxatdan o'tgan vaqt:</strong> ${new Date(
      me.createdAt
    ).toLocaleString()}`;
    container.appendChild(createdAt);
    container.appendChild(deleteProfileBtn);
  } catch (error) {
    console.error("Foydalanuvchi ma'lumotlarini olishda xatolik:", error);
  }
}

getUserProfile();
