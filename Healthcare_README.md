# 🚀 Healthcare Appointment System

## 📦 Project Overview

Hệ thống quản lý lịch hẹn khám bệnh gồm:

-   Backend: FastAPI + PostgreSQL\
-   Frontend: Next.js\
-   Hỗ trợ 2 vai trò:
    -   🩺 Doctor\
    -   🧑‍⚕️ Patient

------------------------------------------------------------------------

## 🧩 1. Setup Backend

### ▶️ Khởi tạo database + seed data

python -m main

------------------------------------------------------------------------

### ▶️ Chạy API server

python -m uvicorn api:app --reload

------------------------------------------------------------------------

### ▶️ API Documentation (Swagger UI)

http://localhost:8000/docs

------------------------------------------------------------------------

## 💻 2. Setup Frontend

### ▶️ Di chuyển vào thư mục frontend

cd healthcare-fe

------------------------------------------------------------------------

### ⚠️ Lần đầu chạy (BẮT BUỘC)

npm install

👉 Cài đặt toàn bộ dependencies (node_modules)\
👉 Nếu bỏ qua bước này → npm run dev sẽ lỗi

------------------------------------------------------------------------

### ▶️ Chạy frontend

npm run dev

------------------------------------------------------------------------

### ▶️ Truy cập ứng dụng

http://localhost:3000

------------------------------------------------------------------------

## 👤 3. Authentication

-   Login: đăng nhập tài khoản có sẵn\
-   Register: tạo tài khoản mới (tự động login sau khi tạo)

------------------------------------------------------------------------

## 🩺 4. Doctor Features

-   Xem danh sách bệnh nhân đã đặt lịch\
-   Quản lý slot theo ngày:
    -   AVAILABLE\
    -   BLOCKED\
    -   BOOKED\
-   Xem thông tin bệnh nhân theo slot

------------------------------------------------------------------------

## 🧑‍⚕️ 5. Patient Features

-   Đặt lịch khám (Book appointment)\
-   Huỷ lịch khám (Cancel appointment)\
-   Xem lịch sử khám

------------------------------------------------------------------------

## 📌 Notes

-   Backend chạy tại: http://localhost:8000\
-   Frontend chạy tại: http://localhost:3000\
-   Cần chạy backend trước frontend

------------------------------------------------------------------------

## ⚠️ Common Issues

### ❌ Không thấy dữ liệu sau khi insert

👉 Kiểm tra:\
- Đã conn.commit() trong DB chưa\
- Đang kết nối đúng database chưa

------------------------------------------------------------------------

### ❌ 307 Temporary Redirect

👉 Do thiếu dấu / cuối URL

/doctors ❌\
/doctors/ ✅

------------------------------------------------------------------------

### ❌ 404 khi fetch doctor

👉 Kiểm tra:\
- user_id có bị undefined không\
- API endpoint đúng là /doctors/{id}

------------------------------------------------------------------------

## 🚀 Future Improvements

-   Auth middleware (protect routes)\
-   Docker setup\
-   Pagination backend\
-   Global state (Auth Context)
