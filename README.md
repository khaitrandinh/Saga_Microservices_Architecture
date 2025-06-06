# Microservices Example

## Kiến trúc tổng quan

```
+----------------+         +------------------+         +-------------------+
|                |         |                  |         |                   |
|  user-service  +<------->+  order-service   +<------->+  product-service  |
| (port 3001)    |   JWT   |  (port 3003)     |   HTTP  |  (port 3002)      |
|                |  Auth   |                  |         |                   |
+----------------+         +------------------+         +-------------------+
                                   |
                                   | HTTP
                                   v
                         +-------------------+
                         |                   |
                         | payment-service   |
                         |   (port 3004)     |
                         +-------------------+

        (Mỗi service kết nối MongoDB riêng biệt)
```

**Giải thích:**
- **user-service**: Xác thực, quản lý người dùng, phát hành JWT.
- **order-service**: Trung tâm xử lý đơn hàng, xác thực JWT, gọi sang product-service để kiểm tra/trừ kho, gọi sang payment-service để thanh toán.
- **product-service**: Quản lý sản phẩm, tồn kho.
- **payment-service**: Xử lý thanh toán, cập nhật trạng thái đơn hàng.
- **Tất cả các service** đều sử dụng MongoDB riêng biệt (có thể dùng chung 1 instance nhưng khác database).

---
##  Technology Stack
Node.js / Express.js

MongoDB

Kafka (event-driven communication)

Docker / Docker Compose

JWT for authenticatio
## 🗂️ Cấu trúc thư mục dự án

```
micro/
├── docker-compose.yml
├── init-kafka.sh
├── .env.example
├── README.md
├── LICENSE
├── .gitignore
├── .dockerignore
├── user-service/
│   ├── app.js
│   ├── package.json
│   ├── Dockerfile
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── validators/
│   ├── kafka/
│   │   └── comsumer.js
│   │   └── kafkaClient.js
│   │   └── producer.js
│   │   └── productConsumer.js
├── product-service/
│   ├── app.js
│   ├── package.json
│   ├── Dockerfile
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── validators/
│   ├── kafka/
│   │   └── comsumer.js
│   │   └── kafkaClient.js
│   │   └── producer.js
├── order-service/
│   ├── app.js
│   ├── package.json
│   ├── Dockerfile
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── validators/
│   ├── kafka/
│   │   └── comsumer.js
│   │   └── kafkaClient.js
│   │   └── producer.js
├── payment-service/
│   ├── app.js
│   ├── package.json
│   ├── Dockerfile
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── kafka/
│   │   └── comsumer.js
│   │   └── kafkaClient.js
│   │   └── producer.js

```

---

##  Cách cài đặt & chạy hệ thống

### 1. Yêu cầu
- Đã cài đặt Docker và Docker Compose trên máy.

### 2. Clone source code
```bash
git clone <repo-url>
cd micro
```

### 3. Cấu hình biến môi trường
- Nếu có file `.env.example`, copy thành `.env` và chỉnh sửa thông tin kết nối MongoDB, JWT_SECRET, v.v. nếu cần.
```bash
cp .env.example .env
```

### 4. Chạy toàn bộ hệ thống
```bash
docker-compose up --build
```
- Lệnh này sẽ build và chạy tất cả các service cùng MongoDB.

### 5. Truy cập các service
- user-service: http://localhost:3001
- product-service: http://localhost:3002
- order-service: http://localhost:3003
- payment-service: http://localhost:3004

### 6. Dừng hệ thống
```bash
docker-compose down
```

## Các endpoint chính

### user-service
- `POST /api/users/register` — Đăng ký
- `POST /api/users/login` — Đăng nhập (trả về JWT)

### product-service
- `GET /api/products` — Lấy danh sách sản phẩm
- `POST /api/products` — Thêm sản phẩm (cần JWT)


### order-service
- `POST /api/orders` — Tạo đơn hàng (cần JWT)
- `PATCH /api/orders/:id/status` — Cập nhật trạng thái đơn hàng

### payment-service
- `POST /api/payments` — Tạo thanh toán
- `GET /api/payments` — Lịch sử thanh toán của user

## Ghi chú
- Tất cả các API (trừ đăng ký/đăng nhập) đều yêu cầu header `Authorization: Bearer <token>`
- Các service sử dụng MongoDB riêng biệt để đảm bảo tính độc lập dữ liệu.

## Liên hệ
- Tác giả: JamesTran
- Email: khaidinhtran0312@gmail.com
