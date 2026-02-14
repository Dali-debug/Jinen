# JINEN - Web Application (Angular + Spring Boot + MongoDB)

## 📋 Overview

This is the modernized web version of the JINEN Nursery Management System, migrated from Flutter/Node.js/PostgreSQL to **Angular + Spring Boot + MongoDB**.

## 🛠 Technology Stack

### Frontend
- **Angular 17** - Modern TypeScript-based web framework
- **Angular Router** - Client-side routing
- **RxJS** - Reactive programming
- **CSS3** - Responsive styling

### Backend
- **Spring Boot 3.2** - Java-based REST API framework
- **Spring Data MongoDB** - Database integration
- **Spring Security** - JWT-based authentication
- **Lombok** - Reduce boilerplate code

### Database
- **MongoDB 7.0** - NoSQL document database

## 🚀 Getting Started

### Prerequisites

- Docker & Docker Compose
- Java 17 (for local development)
- Node.js 20+ (for local development)
- Maven 3.9+ (for local development)

### Quick Start with Docker

1. **Create environment file:**
```bash
cp .env.newstack.example .env.newstack
# Edit .env.newstack and change the passwords and JWT secret
```

2. **Start all services:**
```bash
docker-compose -f docker-compose-new-stack.yml --env-file .env.newstack up -d
```

3. **Access the application:**
- Frontend: http://localhost:4200
- Backend API: http://localhost:8080
- MongoDB: localhost:27017

4. **Stop all services:**
```bash
docker-compose -f docker-compose-new-stack.yml down
```

**⚠️ Security Note:** Always change the default passwords and JWT secret in the `.env.newstack` file before deploying to production!

### Local Development

#### Backend (Spring Boot)

```bash
cd backend-spring-boot
mvn clean install
mvn spring-boot:run
```

The backend will start on http://localhost:8080

#### Frontend (Angular)

```bash
cd frontend-angular
npm install
npm start
```

The frontend will start on http://localhost:4200

## 📁 Project Structure

```
.
├── backend-spring-boot/          # Spring Boot REST API
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/jinen/nursery/
│   │   │   │   ├── model/          # MongoDB entities
│   │   │   │   ├── repository/     # Data access layer
│   │   │   │   ├── service/        # Business logic
│   │   │   │   ├── controller/     # REST endpoints
│   │   │   │   ├── dto/            # Data transfer objects
│   │   │   │   ├── security/       # JWT utilities
│   │   │   │   └── config/         # Configuration
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
│
├── frontend-angular/             # Angular Web Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/      # UI components
│   │   │   ├── services/        # API services
│   │   │   ├── models/          # TypeScript interfaces
│   │   │   ├── interceptors/    # HTTP interceptors
│   │   │   └── app.routes.ts    # Routing configuration
│   │   ├── assets/
│   │   └── styles.css
│   ├── angular.json
│   └── package.json
│
├── docker-compose-new-stack.yml  # Docker orchestration
└── README-NEW-STACK.md          # This file
```

## 🔐 Authentication

The application uses JWT (JSON Web Token) for authentication:

1. User logs in with email/password
2. Backend generates a JWT token
3. Token is stored in browser localStorage
4. Token is sent with every API request via HTTP interceptor
5. Backend validates token for protected endpoints

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Nurseries
- `GET /api/nurseries` - Get all nurseries
- `GET /api/nurseries/{id}` - Get nursery by ID
- `GET /api/nurseries/owner/{ownerId}` - Get nursery by owner
- `POST /api/nurseries` - Create nursery
- `PUT /api/nurseries/{id}` - Update nursery
- `DELETE /api/nurseries/{id}` - Delete nursery

### Children
- `GET /api/children` - Get all children
- `GET /api/children/{id}` - Get child by ID
- `GET /api/children/parent/{parentId}` - Get children by parent
- `POST /api/children` - Create child
- `PUT /api/children/{id}` - Update child
- `DELETE /api/children/{id}` - Delete child

### Enrollments
- `GET /api/enrollments` - Get all enrollments
- `GET /api/enrollments/{id}` - Get enrollment by ID
- `GET /api/enrollments/child/{childId}` - Get enrollments by child
- `GET /api/enrollments/nursery/{nurseryId}` - Get enrollments by nursery
- `POST /api/enrollments` - Create enrollment
- `PUT /api/enrollments/{id}` - Update enrollment
- `DELETE /api/enrollments/{id}` - Delete enrollment

### Reviews
- `GET /api/reviews` - Get all reviews
- `GET /api/reviews/{id}` - Get review by ID
- `GET /api/reviews/nursery/{nurseryId}` - Get reviews by nursery
- `GET /api/reviews/parent/{parentId}` - Get reviews by parent
- `POST /api/reviews` - Create review
- `PUT /api/reviews/{id}` - Update review
- `DELETE /api/reviews/{id}` - Delete review

### Conversations
- `GET /api/conversations/parent/{parentId}` - Get conversations by parent
- `GET /api/conversations/nursery/{nurseryId}` - Get conversations by nursery
- `POST /api/conversations` - Create or get conversation
- `GET /api/conversations/{id}/messages` - Get messages
- `POST /api/conversations/messages` - Send message
- `PUT /api/conversations/messages/{id}/read` - Mark message as read

## 🗄 Database Schema (MongoDB)

### Collections

- **users** - User accounts (parents and nursery owners)
- **children** - Child profiles
- **nurseries** - Nursery information
- **enrollments** - Child-nursery registrations
- **reviews** - Parent reviews and ratings
- **conversations** - Chat conversations
- **messages** - Chat messages

## 🔧 Configuration

### Backend Configuration (application.properties)

```properties
# Server
server.port=8080

# MongoDB (loaded from environment variables in Docker)
spring.data.mongodb.uri=mongodb://localhost:27017/nursery_db
spring.data.mongodb.database=nursery_db

# JWT - CRITICAL: Generate a strong 256-bit secret
# Generate with: openssl rand -base64 32
jwt.secret=${JWT_SECRET}
jwt.expiration=86400000

# CORS
cors.allowed-origins=http://localhost:4200
```

**⚠️ JWT Security:** The JWT secret must be a cryptographically strong random value of at least 256 bits (32+ bytes). Generate one using:
```bash
openssl rand -base64 32
```
Never use example values or simple strings in production!

### Frontend Configuration

Update API URL in services:
```typescript
private apiUrl = 'http://localhost:8080/api';
```

## 🧪 Testing

### Backend Tests
```bash
cd backend-spring-boot
mvn test
```

### Frontend Tests
```bash
cd frontend-angular
npm test
```

## 📦 Building for Production

### Backend
```bash
cd backend-spring-boot
mvn clean package
java -jar target/nursery-management-1.0.0.jar
```

### Frontend
```bash
cd frontend-angular
npm run build
# Deploy dist/frontend-angular to web server
```

## 🔄 Migration from Old Stack

To migrate data from PostgreSQL to MongoDB:

1. Export data from PostgreSQL
2. Transform data to MongoDB format
3. Import into MongoDB

Migration scripts coming soon...

## 🤝 Contributing

This is a private project. For questions or issues, contact the development team.

## 📝 License

Private - All rights reserved

---

**Note:** This is the new web-based version. For the original Flutter mobile app, see the main README.md file.
