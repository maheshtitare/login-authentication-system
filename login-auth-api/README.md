# Login Authentication API

A secure and scalable authentication backend built using **Spring Boot**, **Spring Security**, **JWT**, **BCrypt**, and **MySQL**. This project provides user authentication and password management with an OTP-based password reset workflow.

---

## Features

- User Registration
- User Login
- JWT Authentication
- Password Encryption using BCrypt
- Forgot Password
- OTP Generation
- OTP Verification
- Reset Password
- Global Exception Handling
- Layered Architecture (Controller → Service → Repository)
- MySQL Database Integration
- RESTful APIs

---

## Tech Stack

### Backend

- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- Maven

### Database

- MySQL

### Security

- JWT (JSON Web Token)
- BCrypt Password Encoder

### API Testing

- Postman

---

## Project Structure

```
login-auth-api
│
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com.mahesh.login_auth_api
│   │   │       ├── config
│   │   │       ├── controller
│   │   │       ├── dto
│   │   │       ├── entity
│   │   │       ├── exception
│   │   │       ├── repository
│   │   │       ├── service
│   │   │       └── util
│   │   └── resources
│   │       └── application.properties
│   └── test
│
├── pom.xml
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate user and return JWT |
| POST | `/api/auth/forgot-password` | Generate OTP |
| POST | `/api/auth/verify-otp` | Verify OTP |
| POST | `/api/auth/reset-password` | Reset password |

---

## Authentication Flow

```
Register
        │
        ▼
Password Encrypted (BCrypt)
        │
        ▼
Saved in MySQL
        │
        ▼
Login
        │
        ▼
Password Verification
        │
        ▼
JWT Token Generated
        │
        ▼
Authenticated User
```

---

## Password Reset Flow

```
Forgot Password
        │
        ▼
Generate OTP
        │
        ▼
Save OTP in Database
        │
        ▼
Verify OTP
        │
        ▼
Reset Password
        │
        ▼
BCrypt Password Encoding
        │
        ▼
Password Updated Successfully
```

---

## Database

### User Entity

- id
- fullName
- email
- phoneNumber
- password
- otp
- verified
- createdAt
- updatedAt

---

## Getting Started

### Clone Repository

```bash
git clone https://github.com/<your-username>/login-auth-api.git
```

### Open Project

```bash
cd login-auth-api
```

### Configure Database

Update `application.properties` with your MySQL configuration.

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/login_auth_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### Run Project

```bash
mvn spring-boot:run
```

Application will start on:

```
http://localhost:8080
```

---

## Testing

The APIs can be tested using:

- Postman

---

## Future Improvements

- Email-based OTP Delivery
- Refresh Token Support
- Role-Based Authorization
- Docker Support
- Unit & Integration Testing
- API Documentation using Swagger

---

## Author

**Mahesh Titare**

Java Full Stack Developer

Tech Stack:
Java • Spring Boot • Spring Security • React.js • MySQL • REST APIs