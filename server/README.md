# 🎫  RailAir - Onlayn chipta xarid qilish tizimi

Ushbu loyiha foydalanuvchilarga poezd va avia chiptalarni onlayn qidirish, tanlash va xarid qilish imkoniyatini beradi. Tizim foydalanuvchining qulay interfeysda chiptalarni band qilishi va xarid qilishi uchun ishlab chiqilgan.

---

## 📌 Loyihaning asosiy imkoniyatlari

- Foydalanuvchi ro‘yxatdan o‘tishi va login qilish
- Poezd va avia reyslarini qidirish
- Chiptalarni band qilish va sotib olish
- Xarid qilingan chiptalarni ko‘rish
- Admin tomonidan reyslarni boshqarish (ixtiyoriy)

---
## 🧩 Tizim talablari (shartlari)

### Foydalanuvchi:
- Ro‘yxatdan o‘tish (name, email, password)
- Login qilish va JWT token olish
- Parolni unutgan foydalanuvchilar uchun tiklash tizimi
- Reyslarni shahar va sanaga qarab qidirish
- Chipta tanlash, yo‘lovchi ma’lumotlarini kiritish
- Xarid qilish yoki band qilish
- Xarid qilingan chiptalarni ko‘rish
- Chiptani bekor qilish (agar ruxsat berilsa)

### Admin:
- Admin panel orqali reyslar qo‘shish, tahrirlash, o‘chirish
- Barcha foydalanuvchilarni va ularning chiptalarini boshqarish

---

## 🔐 Xavfsizlik

- Har bir foydalanuvchi uchun parollar **bcrypt** bilan xashlanadi
- Kirish tokeni sifatida **JWT** ishlatiladi
- Faqat login qilingan foydalanuvchilar o‘z chiptalarini ko‘ra oladi
- Admin endpointlari alohida himoyalangan
- Foydalanuvchining login urinishlari cheklangan va loglanadi

---
## 🗃️ Ma'lumotlar bazasi struktura (PostgreSQL + Prisma)

### 1. `User`
```prisma
model User {
  id         String   
  name       String
  email      String   
  password   String
  role       Role     
  isBlocked  Boolean  
  tickets    Ticket[]
  createdAt  DateTime 
}


### 2. `Flight`
model Flight {
  id             String   
  from           String
  to             String
  departureTime  DateTime
  arrivalTime    DateTime
  price          Float
  seatCount      Int
  availableSeats Int
  airline        String
  tickets        Ticket[]
}

 3. `Train`
model Train {
  id             String   
  from           String
  to             String
  departureTime  DateTime
  arrivalTime    DateTime
  price          Float
  seatCount      Int
  availableSeats Int
  trainNumber    String
  tickets        Ticket[]
}

### 4. `Ticket`
model Ticket {
  id        String   
  user      User     
  userId    String
  flight    Flight?  
  flightId  String?
  train     Train?   
  trainId   String?
  seatNumber Int
  status    

  model PassengerInfo {
  id         String   
  fullName   String
  gender     Gender
  birthDate  DateTime
  passport   String
  ticket     Ticket   
  ticketId   String
}
  
}






