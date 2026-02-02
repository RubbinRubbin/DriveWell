# DriveWell

## Insurance Risk Assessment Platform with AI-Powered Driving Coach

DriveWell is a comprehensive driver risk assessment system designed for insurance companies. The platform analyzes 15 driving parameters across 4 competency areas, generates detailed risk profiles, and provides personalized coaching through an AI assistant powered by OpenAI GPT-4.

The system features separate dashboards for insurance company operators and individual customers, with role-based authentication and real-time profile calculations.

---

## Table of Contents

1. [Features](#features)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Usage](#usage)
7. [API Reference](#api-reference)
8. [Database Schema](#database-schema)
9. [Scoring Algorithm](#scoring-algorithm)
10. [Project Structure](#project-structure)
11. [Deployment](#deployment)
12. [License](#license)

---

## Features

### Core Functionality

- **15-Parameter Analysis**: Comprehensive driving behavior assessment across safety, efficiency, behavior, and experience metrics
- **Risk Profiling**: Automatic calculation of risk levels (very-low to very-high) with corresponding premium modifiers
- **Grade Assignment**: A through F grading system based on overall driving performance
- **Actionable Recommendations**: Prioritized improvement suggestions with estimated impact on score and premium

### Dual Dashboard System

- **Company Dashboard**: Customer management interface for insurance operators
  - View all registered customers with their driving scores
  - Input driving data for individual customers
  - Monitor statistics (total customers, average score, high-risk count)
  - Soft-delete functionality for customer records

- **Customer Dashboard**: Self-service portal for insured drivers
  - View personal driving profile and risk assessment
  - Access competency breakdown by area
  - Review personalized recommendations
  - Interact with AI Driving Coach

### Authentication System

- Role-based access control (company users vs customers)
- JWT token authentication via Supabase Auth
- Customer self-registration with company code verification
- Secure session management

### AI Driving Coach

- Conversational interface powered by GPT-4
- Context-aware responses based on individual driving profile
- Session persistence for continuous conversations
- Italian language support throughout

---

## Architecture

```
                                    FRONTEND LAYER
    +------------------------------------------------------------------+
    |                                                                  |
    |   /login.html          /company/           /customer/            |
    |   Authentication       Company Dashboard   Customer Dashboard    |
    |                                                                  |
    +------------------------------------------------------------------+
                                      |
                                      | HTTP/REST + JWT
                                      v
    +------------------------------------------------------------------+
    |                         API LAYER (Express.js)                   |
    |                                                                  |
    |   /api/v1/auth/*        Authentication endpoints                 |
    |   /api/v1/company/*     Company management endpoints             |
    |   /api/v1/customer/*    Customer profile + AI Coach              |
    |                                                                  |
    +------------------------------------------------------------------+
                                      |
                    +-----------------+-----------------+
                    |                                   |
                    v                                   v
    +---------------------------+       +---------------------------+
    |      SERVICE LAYER        |       |     EXTERNAL SERVICES     |
    |                           |       |                           |
    | - RiskAssessmentService   |       |   Supabase                |
    | - ProfileScoringService   |       |   - Authentication        |
    | - RecommendationService   |       |   - PostgreSQL Database   |
    | - AICoachService          |       |                           |
    | - PromptBuilderService    |       |   OpenAI API              |
    |                           |       |   - GPT-4 Chat            |
    +---------------------------+       +---------------------------+
```

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 18+ |
| Language | TypeScript 5.x |
| Framework | Express.js 4.x |
| Database | PostgreSQL (Supabase) |
| Authentication | Supabase Auth (JWT) |
| AI Integration | OpenAI GPT-4 |
| Frontend | HTML5, TailwindCSS, Vanilla JavaScript |

---

## Installation

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- Supabase account with project configured
- OpenAI API key

### Setup Steps

1. Clone the repository:

```bash
git clone https://github.com/yourusername/DriveWell.git
cd DriveWell
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables (see [Configuration](#configuration))

4. Initialize database schema in Supabase using the SQL scripts in `/supabase/migrations/`

5. Start development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

---

## Configuration

Create a `.env` file in the project root with the following variables:

```env
# Server
NODE_ENV=development
PORT=3000

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# OpenAI
OPENAI_API_KEY=sk-your-api-key
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=800
OPENAI_TEMPERATURE=0.7

# Customer Registration
CUSTOMER_REGISTRATION_CODE=DRIVEWELL2026
```

### Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 3000) |
| `NODE_ENV` | No | Environment mode (development/production) |
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_ANON_KEY` | Yes | Supabase anonymous/public key |
| `SUPABASE_SERVICE_KEY` | Yes | Supabase service role key |
| `OPENAI_API_KEY` | Yes | OpenAI API key for GPT-4 |
| `OPENAI_MODEL` | No | Model identifier (default: gpt-4) |
| `CUSTOMER_REGISTRATION_CODE` | Yes | Code required for customer self-registration |

---

## Usage

### Company Workflow

1. Access the application at `http://localhost:3000`
2. Log in with company credentials
3. View registered customers in the dashboard
4. Click the settings icon to input driving data for a customer
5. Submit the 14 driving parameters to calculate the risk profile
6. Review customer scores and risk levels in the main table

### Customer Workflow

1. Navigate to the login page
2. New customers: Register using email, password, and company registration code
3. Existing customers: Log in with credentials
4. View driving profile with overall score, grade, and risk level
5. Review competency scores across all four areas
6. Read personalized recommendations
7. Use the AI Coach (bottom-right chat icon) for guidance

### AI Coach Interaction Examples

The AI Coach responds to questions such as:

- "Why is my score low?"
- "How can I reduce my insurance premium?"
- "What should I focus on improving first?"
- "Explain how the safety score is calculated"
- "What are my strengths as a driver?"

---

## API Reference

### Authentication

#### POST /api/v1/auth/login

Authenticate user (company or customer).

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt-token",
    "refreshToken": "refresh-token",
    "userType": "company|customer",
    "user": { ... }
  }
}
```

#### POST /api/v1/auth/register/customer

Register new customer account.

**Request:**
```json
{
  "email": "customer@example.com",
  "password": "password123",
  "fullName": "Mario Rossi",
  "registrationCode": "DRIVEWELL2026"
}
```

### Company Endpoints

All company endpoints require authentication with a company user token.

#### GET /api/v1/company/customers

Retrieve all customers with profile summaries.

#### GET /api/v1/company/statistics

Get dashboard statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalCustomers": 45,
    "averageScore": 72.5,
    "highRiskCount": 8
  }
}
```

#### POST /api/v1/company/customers/:id/driving-data

Submit driving data and calculate profile.

**Request:**
```json
{
  "analysisWindow": {
    "startDate": "2025-01-01T00:00:00Z",
    "endDate": "2025-12-31T23:59:59Z",
    "totalDistanceKm": 15000,
    "totalDrivingHours": 250
  },
  "parameters": {
    "harshBrakingEventsPerHundredKm": 0.5,
    "harshAccelerationEventsPerHundredKm": 0.8,
    "speedingViolationsPerHundredKm": 0.2,
    "averageSpeedingMagnitudeKmh": 5.0,
    "smoothAccelerationPercentage": 85,
    "idlingTimePercentage": 8,
    "optimalGearUsagePercentage": 78,
    "fuelEfficiencyScore": 72,
    "nightDrivingPercentage": 12,
    "weekendDrivingPercentage": 30,
    "phoneUsageEventsPerHundredKm": 0.1,
    "fatigueIndicatorsPerHundredKm": 0.2,
    "totalMileageDriven": 85000,
    "routeVarietyScore": 65
  }
}
```

### Customer Endpoints

All customer endpoints require authentication with a customer token.

#### GET /api/v1/customer/profile

Retrieve current customer's driving profile.

#### POST /api/v1/customer/coach/chat

Send message to AI Coach.

**Request:**
```json
{
  "message": "How can I improve my driving score?",
  "sessionId": "optional-session-id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "session-uuid",
    "response": "Based on your profile, I recommend focusing on..."
  }
}
```

---

## Database Schema

### Tables

#### company_users
Stores insurance company operator accounts.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| auth_user_id | UUID | Supabase auth reference |
| email | VARCHAR | User email |
| full_name | VARCHAR | Display name |
| created_at | TIMESTAMPTZ | Creation timestamp |

#### customers
Stores customer records.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| auth_user_id | UUID | Supabase auth reference |
| email | VARCHAR | Customer email |
| full_name | VARCHAR | Customer name |
| phone | VARCHAR | Phone number |
| driver_license_number | VARCHAR | License number |
| driver_license_years | INTEGER | Years holding license |
| is_active | BOOLEAN | Soft delete flag |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

#### driver_profiles
Stores calculated driving profiles.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| customer_id | UUID | Foreign key to customers |
| overall_score | DECIMAL | Calculated overall score (0-100) |
| overall_grade | VARCHAR | Letter grade (A-F) |
| risk_level | VARCHAR | Risk classification |
| premium_modifier | DECIMAL | Insurance premium multiplier |
| competency_scores | JSONB | Scores by competency area |
| recommendations | JSONB | Generated recommendations |
| [14 parameter columns] | DECIMAL | Individual driving metrics |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

---

## Scoring Algorithm

### Competency Areas and Weights

| Area | Weight | Parameters |
|------|--------|------------|
| Safety | 40% | Harsh braking, harsh acceleration, speeding violations, speeding magnitude |
| Efficiency | 20% | Smooth acceleration, idling time, optimal gear usage, fuel efficiency |
| Behavior | 25% | Night driving, weekend driving, phone usage, fatigue indicators |
| Experience | 15% | Total mileage, years holding license, route variety |

### Score Calculation

1. Each parameter is scored 0-100 based on configured thresholds
2. Area scores are calculated as weighted averages of their parameters
3. Overall score is the weighted average of area scores
4. Grade is assigned based on overall score thresholds

### Grade and Risk Mapping

| Score Range | Grade | Risk Level | Premium Modifier |
|-------------|-------|------------|------------------|
| 90-100 | A | Very Low | 0.80x (-20%) |
| 80-89 | B | Low | 0.90x (-10%) |
| 70-79 | C | Moderate | 1.00x (base) |
| 60-69 | D | High | 1.25x (+25%) |
| 0-59 | F | Very High | 1.50x (+50%) |

---

## Project Structure

```
DriveWell/
├── public/
│   ├── login.html                 # Authentication page
│   ├── js/
│   │   └── auth.js               # Auth logic
│   ├── company/
│   │   ├── index.html            # Company dashboard
│   │   └── js/
│   │       └── company-dashboard.js
│   └── customer/
│       ├── index.html            # Customer dashboard
│       └── js/
│           └── customer-dashboard.js
│
├── src/
│   ├── app.ts                    # Express application entry
│   ├── config/
│   │   ├── supabase.config.ts    # Supabase client setup
│   │   ├── parameters.config.ts  # Driving parameter definitions
│   │   ├── competency-areas.config.ts
│   │   └── recommendations.config.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── company.controller.ts
│   │   └── customer.controller.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts    # JWT verification
│   │   ├── role.middleware.ts    # Role-based access
│   │   └── error-handler.middleware.ts
│   ├── models/
│   │   ├── driver-profile.model.ts
│   │   ├── driving-data.model.ts
│   │   └── recommendation.model.ts
│   ├── routes/
│   │   ├── index.ts
│   │   ├── auth.routes.ts
│   │   ├── company.routes.ts
│   │   └── customer.routes.ts
│   └── services/
│       ├── risk-assessment.service.ts
│       ├── profile-scoring.service.ts
│       ├── recommendation.service.ts
│       ├── ai/
│       │   ├── ai-coach.service.ts
│       │   ├── prompt-builder.service.ts
│       │   └── openai-client.service.ts
│       └── database/
│           ├── customer.repository.ts
│           └── driver-profile.repository.ts
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
│
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## Deployment

### Production Environment Variables

```env
NODE_ENV=production
PORT=3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
OPENAI_API_KEY=sk-your-production-key
CUSTOMER_REGISTRATION_CODE=YOUR-SECURE-CODE
```

### Build and Run

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

### Recommended Platforms

- **Railway**: Simple deployment with environment variable management
- **Render**: Native Node.js support with automatic builds
- **Heroku**: Traditional PaaS with straightforward configuration

Note: Supabase handles database hosting separately from application hosting.

---

## License

ISC License

---

## Repository

https://github.com/RubbinRubbin/DriveWell
