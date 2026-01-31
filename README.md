# DriveWell - Sistema Intelligente di Valutazione del Rischio Assicurativo

> Piattaforma avanzata di risk assessment per compagnie assicurative con AI Coach integrato per guidatori

DriveWell è un sistema completo di valutazione del rischio assicurativo che combina analisi avanzata dei dati di guida con intelligenza artificiale conversazionale. Analizza 15 parametri di guida, genera profili di rischio dettagliati e fornisce coaching personalizzato attraverso un'interfaccia AI powered by GPT-4.

## Caratteristiche Principali

### Core Features
- ** Analisi Completa**: 15 parametri di guida raggruppati in 4 aree di competenza (Sicurezza, Efficienza, Comportamento, Esperienza)
- ** AI Driving Coach**: Assistente conversazionale basato su OpenAI GPT-4 per consulenza personalizzata
- ** Scoring Trasparente**: Algoritmo configurabile basato su soglie e pesi personalizzabili
- ** Raccomandazioni Intelligenti**: Consigli azionabili con stima impatto su punteggio e premio
- ** Dashboard Interattivo**: Frontend professionale con stile corporate banking/insurance
- ** Chat Persistente**: Sistema di sessioni chat con storico conversazioni
- ** Completamente Localizzato**: Interfaccia e AI rispondono in italiano
- ** Type-Safe**: Implementazione completa in TypeScript
- ** Database Persistente**: PostgreSQL con Prisma ORM per storico valutazioni e sessioni AI

### Tech Highlights
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **AI/ML**: OpenAI GPT-4 con prompt engineering avanzato
- **Frontend**: HTML5 + TailwindCSS + Vanilla JS
- **Architettura**: RESTful API + Service Layer Pattern

---

##  Demo

### Dashboard Principale
Il dashboard presenta uno stile professionale da istituto bancario/assicurativo con:
- Header corporate blu navy con gradient
- Sezione punteggio con ring progress animato
- Cards per livello di rischio e impatto sul premio
- Breakdown per area di competenza (Sicurezza, Efficienza, Comportamento, Esperienza)
- Raccomandazioni prioritizzate con impact metrics

### AI Coach Integrato
- **Icona floating**: Macchinina (car-front icon) in basso a destra
- **Chat panel**: Interfaccia pulita con header professionale
- **Quick actions**: Bottoni per domande frequenti
- **Typing indicator**: Animazione durante elaborazione AI
- **Storico persistente**: Le conversazioni vengono salvate e ripristinate

---

##  Architettura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND LAYER                         │
│  (Dashboard HTML + TailwindCSS + Vanilla JS)               │
│  - Interfaccia utente corporate                            │
│  - Chat UI per AI Coach                                    │
│  - Visualizzazioni dati real-time                          │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/REST
┌────────────────────▼────────────────────────────────────────┐
│                    API LAYER (Express)                      │
│  Routes:                                                    │
│  - /api/v1/assessments    → Valutazione rischio           │
│  - /api/v1/coach          → AI Coaching endpoints          │
│  - /api/v1/health         → Health check                   │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                   SERVICE LAYER                             │
│  • RiskAssessmentService   → Calcolo scoring              │
│  • ProfileScoringService   → Algoritmi scoring             │
│  • RecommendationService   → Generazione consigli          │
│  • AICoachService          → Orchestrazione AI             │
│  • PromptBuilderService    → Prompt engineering            │
│  • AssessmentRepository    → Data access valutazioni       │
│  • CoachingRepository      → Data access sessioni chat     │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
┌────────▼──────────┐   ┌────────▼─────────┐
│   PostgreSQL      │   │  OpenAI API      │
│   (Prisma ORM)    │   │  (GPT-4)         │
│                   │   │                  │
│  • drivers        │   │  • Chat          │
│  • assessments    │   │  • Completions   │
│  • sessions       │   │                  │
│  • messages       │   │                  │
└───────────────────┘   └──────────────────┘
```

---

##  Installazione e Setup

### Prerequisiti

- **Node.js** >= 18.x
- **npm** >= 9.x
- **PostgreSQL** >= 14.x
- **OpenAI API Key** (per AI Coach)

### 1. Clone e Installazione Dipendenze

```bash
# Clone repository
git clone https://github.com/RubbinRubbin/DriveWell.git
cd DriveWell

# Installa dipendenze
npm install
```

### 2. Configurazione Database

```bash
# Crea database PostgreSQL
createdb drivewell

# Configura connection string in .env (vedi passo successivo)

# Esegui migrations Prisma
npx prisma migrate dev

# (Opzionale) Seed database
npx prisma db seed
```

### 3. Configurazione Environment Variables

Crea file `.env` nella root del progetto:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/drivewell?schema=public"

# OpenAI Configuration
OPENAI_API_KEY=sk-proj-your-api-key-here
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=800
OPENAI_TEMPERATURE=0.7

# AI Coach Settings
AI_COACH_SYSTEM_ROLE=driving_coach
AI_COACH_MAX_HISTORY=10
```

### 4. Build e Avvio

```bash
# Compila TypeScript
npm run build

# Avvia server in development (con hot reload)
npm run dev

# Oppure avvia in production
npm start
```

Il server sarà disponibile su:
- **Dashboard**: http://localhost:3000
- **API Base**: http://localhost:3000/api/v1

---

##  Utilizzo

### Dashboard Web

1. Apri browser su http://localhost:3000
2. Scegli un profilo di test dalla sidebar:
   - **Guidatore Eccellente**: Score ~91-95, Grade A, Premio -20%
   - **Guidatore Moderato**: Score ~70-79, Grade C, Premio standard
   - **Guidatore ad Alto Rischio**: Score ~40-50, Grade F, Premio +50%
3. Oppure personalizza i 15 parametri manualmente
4. Clicca "Calcola Profilo" per vedere risultati
5. Usa l'AI Coach (icona macchinina) per domande personalizzate

### AI Coach - Esempi di Utilizzo

Domande che puoi fare all'AI Coach:

- *"Perché il mio punteggio è basso?"*
- *"Come posso migliorare il mio premio?"*
- *"Su cosa devo concentrarmi per prima cosa?"*
- *"Quanto potrei risparmiare migliorando le frenate brusche?"*
- *"Quali sono i miei punti di forza?"*
- *"Spiegami come viene calcolato il punteggio di sicurezza"*

L'AI fornisce risposte personalizzate basate sul tuo profilo di guida reale.

---

##  API Endpoints

### Health Check

```bash
GET /api/v1/health
```

**Response:**
```json
{
  "success": true,
  "message": "DriveWell API is running",
  "timestamp": "2026-01-26T18:30:00.000Z"
}
```

### Crea Assessment

```bash
POST /api/v1/assessments
Content-Type: application/json
```

**Request Body:**
```json
{
  "driverId": "DR-2024-001",
  "drivingData": {
    "harshBrakingEventsPerHundredKm": 0.3,
    "harshAccelerationEventsPerHundredKm": 0.8,
    "speedingViolationsPerHundredKm": 0.1,
    "averageSpeedingMagnitudeKmh": 2.5,
    "smoothAccelerationPercentage": 92,
    "idlingTimePercentage": 4,
    "optimalGearUsagePercentage": 88,
    "fuelEfficiencyScore": 87,
    "nightDrivingPercentage": 8,
    "weekendDrivingPercentage": 28,
    "phoneUsageEventsPerHundredKm": 0.05,
    "fatigueIndicatorsPerHundredKm": 0.1,
    "totalMileageKm": 120000,
    "yearsLicenseHeld": 12,
    "routeVarietyScore": 75
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "driverId": "DR-2024-001",
    "timestamp": "2026-01-26T18:30:00.000Z",
    "overallScore": 91.5,
    "overallGrade": "A",
    "riskLevel": "very-low",
    "premiumModifier": 0.80,
    "competencyScores": [
      {
        "area": "safety",
        "name": "Sicurezza",
        "score": 92.3,
        "grade": "A",
        "weight": 0.40
      },
      // ... altre aree
    ],
    "recommendations": [
      {
        "priority": "MEDIUM",
        "issue": "Tempo al minimo elevato rilevato (4% del tempo di guida)",
        "advice": "Spegni il motore quando sei fermo per più di 30 secondi...",
        "expectedImpact": {
          "scoreImprovement": 5,
          "premiumReduction": 3
        }
      }
    ]
  }
}
```

### AI Coach - Chat

```bash
POST /api/v1/coach/chat
Content-Type: application/json
```

**Request Body:**
```json
{
  "driverId": "DR-2024-001",
  "message": "Perché il mio punteggio è basso?",
  "sessionId": "session-uuid-optional",
  "drivingData": { /* dati guida attuali */ }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "response": "Il tuo punteggio è influenzato principalmente da...",
    "metadata": {
      "tokensUsed": 245,
      "model": "gpt-4"
    }
  }
}
```

### AI Coach - Storico Sessione

```bash
GET /api/v1/coach/sessions/:driverId/active
```

Recupera la sessione attiva e lo storico messaggi per un driver.

---

##  Sistema di Scoring Dettagliato

### 15 Parametri di Guida

####  Safety (40% peso totale)
| Parametro | Range Ottimale | Peso Area |
|-----------|----------------|-----------|
| **Frenate Brusche** | < 0.5 eventi/100km | 30% |
| **Accelerazioni Brusche** | < 1.0 eventi/100km | 25% |
| **Violazioni Velocità** | < 0.2 eventi/100km | 30% |
| **Entità Eccesso Velocità** | < 3 km/h | 15% |

####  Efficiency (20% peso totale)
| Parametro | Range Ottimale | Peso Area |
|-----------|----------------|-----------|
| **Accelerazione Fluida** | > 85% | 30% |
| **Tempo al Minimo** | < 5% | 25% |
| **Uso Marcia Ottimale** | > 80% | 20% |
| **Efficienza Carburante** | > 75 | 25% |

#### Behavior (25% peso totale)
| Parametro | Range Ottimale | Peso Area |
|-----------|----------------|-----------|
| **Guida Notturna** | < 15% | 30% |
| **Guida Weekend** | 25-35% | 20% |
| **Uso Telefono** | < 0.5 eventi/100km | 35% |
| **Indicatori Affaticamento** | < 0.5 eventi/100km | 15% |

####  Experience (15% peso totale)
| Parametro | Range Ottimale | Peso Area |
|-----------|----------------|-----------|
| **Chilometraggio Totale** | > 100,000 km | 35% |
| **Anni Patente** | > 10 anni | 40% |
| **Varietà Percorsi** | > 65 | 25% |

### Algoritmo di Calcolo

```typescript
// 1. Score Parametro (0-100)
parameterScore = interpolateLinear(rawValue, thresholds)

// 2. Score Area (media ponderata)
areaScore = Σ(parameterScore × parameterWeight) / Σ(parameterWeight)

// 3. Score Totale (media ponderata aree)
overallScore = (safety × 0.40) + (efficiency × 0.20) +
               (behavior × 0.25) + (experience × 0.15)

// 4. Grade Assignment
grade =
  score >= 90 ? 'A' :
  score >= 80 ? 'B' :
  score >= 70 ? 'C' :
  score >= 60 ? 'D' : 'F'

// 5. Premium Modifier
premiumModifier =
  score >= 85 ? 0.80  // -20% sconto
  score >= 75 ? 0.90  // -10% sconto
  score >= 60 ? 1.00  // tariffa base
  score >= 45 ? 1.25  // +25% aumento
              : 1.50  // +50% aumento
```

### Matrice Risk Level

| Overall Score | Grade | Risk Level | Premium Modifier | Impatto |
|--------------|-------|------------|------------------|---------|
| 90-100 | A | Molto Basso | 0.80x | -20% |
| 80-89 | B | Basso | 0.90x | -10% |
| 70-79 | C | Moderato | 1.00x | ±0% |
| 60-69 | D | Alto | 1.25x | +25% |
| 0-59 | F | Molto Alto | 1.50x | +50% |

---

##  AI Coach - Architettura e Prompt Engineering

### Sistema di Prompt

L'AI Coach utilizza un sistema di prompt strutturato in 3 componenti:

#### 1. System Prompt (Identità e Capacità)
```
Sei un esperto AI Driving Coach per DriveWell...

## La Tua Personalità
- Professionale ma amichevole e incoraggiante
- Paziente e senza giudizi
- Orientato ai dati e specifico
- Focalizzato su consigli pratici

## Le Tue Capacità
1. Analizzare modelli di guida su 15 parametri
2. Identificare problemi ricorrenti
3. Fornire raccomandazioni azionabili
4. Spiegare algoritmi complessi in termini semplici
5. Simulare impatto di cambiamenti comportamentali
```

#### 2. User Context (Dati Driver)
```
## Profilo Guidatore Attuale
- ID: DR-2024-001
- Punteggio Totale: **91.5** (Grade **A**)
- Livello di Rischio: **very-low**
- Moltiplicatore Premio: **0.80x** (20% sconto)

## Punteggi per Area
- Sicurezza: **92.3** (Grade A)
- Efficienza: **88.7** (Grade B)
...

## Parametri Più Problematici
- Tempo al minimo: 4% (soglia ottimale <5%)
- ...

## Raccomandazioni Attuali
- [MEDIUM] Tempo al minimo elevato...
```

#### 3. User Message
```
"Perché il mio punteggio è basso?"
```

### Funzionalità AI Avanzate

- **Context-Aware**: L'AI ha accesso completo al profilo driver corrente
- **Data-Driven**: Cita sempre dati specifici nelle risposte
- **Quantificazione Impatto**: Stima miglioramenti su score e premio
- **Storico Conversazioni**: Mantiene contesto attraverso sessioni
- **Markdown Formatting**: Usa grassetto, bullet points, struttura chiara
- **Italiano Nativo**: Prompt e contesto completamente in italiano

---

##  Struttura del Progetto

```
DriveWell/
├── public/                          # Frontend statico
│   ├── index.html                  # Dashboard principale
│   └── js/
│       └── dashboard.js            # Logica frontend + chat UI
│
├── src/
│   ├── config/                     # Configurazioni
│   │   ├── parameters.config.ts    # 15 parametri con soglie
│   │   ├── competency-areas.config.ts  # 4 aree competenza
│   │   └── recommendations.config.ts   # Regole raccomandazioni
│   │
│   ├── models/                     # TypeScript interfaces
│   │   ├── driver-profile.model.ts
│   │   ├── driving-data.model.ts
│   │   ├── recommendation.model.ts
│   │   └── chat-session.model.ts
│   │
│   ├── services/                   # Business logic
│   │   ├── risk-assessment.service.ts      # Orchestrazione assessment
│   │   ├── profile-scoring.service.ts      # Algoritmi scoring
│   │   ├── recommendation.service.ts       # Generazione consigli
│   │   ├── ai/
│   │   │   ├── ai-coach.service.ts         # Orchestrazione AI
│   │   │   ├── prompt-builder.service.ts   # Prompt engineering
│   │   │   └── openai-client.service.ts    # API client OpenAI
│   │   └── database/
│   │       ├── assessment-repository.service.ts
│   │       └── coaching-repository.service.ts
│   │
│   ├── controllers/                # API controllers
│   │   ├── assessment.controller.ts
│   │   └── ai-coach.controller.ts
│   │
│   ├── routes/                     # Route definitions
│   │   ├── assessment.routes.ts
│   │   └── ai-coach.routes.ts
│   │
│   ├── middleware/                 # Express middleware
│   │   ├── error-handler.middleware.ts
│   │   └── validation.middleware.ts
│   │
│   └── app.ts                      # Entry point Express
│
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── migrations/                # DB migrations
│
├── tests/
│   └── fixtures/                  # Test data
│       ├── excellent-driver.json
│       ├── moderate-driver.json
│       └── high-risk-driver.json
│
├── dist/                          # Build output (gitignored)
├── node_modules/                  # Dependencies (gitignored)
│
├── .env                           # Environment variables (gitignored)
├── .env.example                   # Template environment
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

##  Database Schema (Prisma)

```prisma
model Driver {
  id          String       @id @default(uuid())
  driverId    String       @unique
  createdAt   DateTime     @default(now())
  assessments Assessment[]
  sessions    CoachingSession[]
}

model Assessment {
  id              String   @id @default(uuid())
  driverId        String
  driver          Driver   @relation(fields: [driverId], references: [id])
  overallScore    Float
  overallGrade    String
  riskLevel       String
  premiumModifier Float
  drivingData     Json
  competencyScores Json
  recommendations Json
  createdAt       DateTime @default(now())
}

model CoachingSession {
  id        String    @id @default(uuid())
  driverId  String
  driver    Driver    @relation(fields: [driverId], references: [id])
  active    Boolean   @default(true)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  messages  ChatMessage[]
}

model ChatMessage {
  id        String          @id @default(uuid())
  sessionId String
  session   CoachingSession @relation(fields: [sessionId], references: [id])
  role      String          // 'user' | 'assistant'
  content   String
  metadata  Json?
  createdAt DateTime        @default(now())
}
```

---

##  Configurazione Avanzata

### Personalizzazione Pesi e Soglie

Tutti i parametri sono configurabili in [src/config/parameters.config.ts](src/config/parameters.config.ts):

```typescript
{
  id: 'harsh_braking',
  displayName: 'Frenate Brusche',
  unit: 'eventi/100km',
  thresholds: {
    excellent: 0.5,   // < 0.5 = score 100
    good: 1.5,        // 0.5-1.5 = interpolazione lineare
    fair: 3.0,        // 1.5-3.0 = score 70-50
    poor: 5.0         // > 5.0 = score 0
  },
  weight: 0.30,       // 30% del peso area Safety
  lowerIsBetter: true
}
```

### Personalizzazione Raccomandazioni

Regole in [src/config/recommendations.config.ts](src/config/recommendations.config.ts):

```typescript
{
  id: 'harsh_braking_critical',
  parameterId: 'harsh_braking',
  condition: { operator: '>', threshold: 5.0 },
  priority: 'CRITICAL',
  template: {
    issue: 'Frenate brusche eccessive rilevate (${value} eventi/100km)',
    advice: 'Aumenta la distanza di sicurezza e anticipa il flusso...'
  },
  impact: {
    scoreImprovement: 8,
    premiumReduction: 12
  }
}
```

---

##  Testing

### Test Manuali API

```bash
# Test guidatore eccellente
curl -X POST http://localhost:3000/api/v1/assessments \
  -H "Content-Type: application/json" \
  -d @tests/fixtures/excellent-driver.json

# Test guidatore alto rischio
curl -X POST http://localhost:3000/api/v1/assessments \
  -H "Content-Type: application/json" \
  -d @tests/fixtures/high-risk-driver.json
```

### Test AI Coach

```bash
# Invia messaggio al coach
curl -X POST http://localhost:3000/api/v1/coach/chat \
  -H "Content-Type: application/json" \
  -d '{
    "driverId": "DR-2024-001",
    "message": "Come posso migliorare il mio punteggio?",
    "drivingData": { /* dati completi */ }
  }'
```

---

##  Deployment

### Opzioni Consigliate

#### 1. **Render.com** (Consigliato)
- Supporto nativo per Node.js + PostgreSQL
- Deploy automatico da GitHub
- Free tier disponibile

**Setup:**
1. Crea Web Service su Render collegando repo GitHub
2. Aggiungi PostgreSQL database da Render
3. Configura env variables (DATABASE_URL, OPENAI_API_KEY)
4. Build: `npm install && npm run build`
5. Start: `npm start`

#### 2. **Railway.app**
- Semplicissimo da configurare
- PostgreSQL integrato
- Deploy in 5 minuti

#### 3. **Heroku**
- Classico e affidabile
- Aggiungi Heroku Postgres addon
- Config vars per env

### Environment Variables Produzione

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@host:5432/db
OPENAI_API_KEY=sk-proj-your-key
```

---

##  Decisioni Tecniche e Design Patterns

### 1. **Service Layer Pattern**
Separazione netta tra controller (HTTP logic) e servizi (business logic) per testabilità e riusabilità.

### 2. **Repository Pattern**
Astrazione accesso dati con repository layer per facilitare cambio di database o mock nei test.

### 3. **Configuration-Driven Architecture**
Tutti i pesi, soglie e regole sono configurabili senza modificare codice, permettendo facile tuning.

### 4. **Type Safety Completa**
TypeScript utilizzato in modo rigoroso con interfacce per ogni entità del dominio.

### 5. **Dependency Injection**
Servizi progettati per dependency injection manuale, facilitando test unitari.

### 6. **Prompt Engineering Strutturato**
System prompt separato da user context per permettere A/B testing e ottimizzazione AI senza toccare codice.

### 7. **Stateless API + Stateful Chat**
API di assessment completamente stateless, mentre chat mantiene stato in DB per UX ottimale.

---

##  Metriche e Performance

### Benchmark Tipici

- **Assessment Calculation**: ~5-10ms
- **Recommendation Generation**: ~2-5ms
- **Database Query**: ~20-50ms
- **OpenAI API Call**: ~3-15 secondi (dipende da token count)
- **Full Request (con AI)**: ~3-16 secondi

### Ottimizzazioni Implementate

- Caching configurazioni in memoria
- Lazy loading servizi AI
- Connection pooling PostgreSQL (Prisma)
- Algoritmi scoring ottimizzati (O(n) complexity)

---

##  Roadmap Future

### Short-term
- [ ] Unit tests completi (Jest + Supertest)
- [ ] Rate limiting API (express-rate-limit)
- [ ] Caching Redis per sessioni AI
- [ ] Export PDF report profilo driver

### Medium-term
- [ ] Autenticazione JWT per API
- [ ] Dashboard admin per configurazione pesi
- [ ] Analytics e grafici storici per driver
- [ ] Integrazione Stripe per pagamenti

### Long-term
- [ ] Machine Learning predittivo (TensorFlow.js)
- [ ] Mobile app (React Native)
- [ ] Integrazione dispositivi telematics IoT
- [ ] Sistema multi-tenant per multiple compagnie

---

## 🛠️ Troubleshooting

### Server non si avvia

```bash
# Verifica Node.js version
node --version  # deve essere >= 18

# Pulisci e reinstalla
rm -rf node_modules dist
npm install
npm run build
```

### Database connection error

```bash
# Verifica PostgreSQL running
psql -U postgres -c "SELECT version();"

# Verifica DATABASE_URL in .env
# Esegui migrations
npx prisma migrate dev
```

### OpenAI API errors

```bash
# Verifica API key valida
echo $OPENAI_API_KEY

# Test API key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### Chat non funziona

1. Verifica OPENAI_API_KEY configurata
2. Controlla console browser per errori JS
3. Verifica network tab - endpoint `/api/v1/coach/chat` deve rispondere 200
4. Controlla server logs per errori backend

---

##  Developer Notes

### Code Style
- **Indentation**: 2 spazi
- **Naming**: camelCase per variabili/funzioni, PascalCase per classi/interfaces
- **Comments**: JSDoc per funzioni pubbliche
- **Imports**: Raggruppati (Node.js core → 3rd party → local)

### Git Workflow
```bash
# Feature branch
git checkout -b feature/nome-feature

# Commit message format
git commit -m "feat: aggiunge funzionalità X"
git commit -m "fix: risolve bug Y"
git commit -m "docs: aggiorna README"

# Push e PR
git push origin feature/nome-feature
```

### Debugging
```bash
# Run con debugger
node --inspect dist/app.js

# Oppure usa VS Code launch config
# .vscode/launch.json già configurato
```

---

##  Risorse Utili

### Documentazione
- [Express.js](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma ORM](https://www.prisma.io/docs)
- [OpenAI API](https://platform.openai.com/docs)
- [TailwindCSS](https://tailwindcss.com/)

### Tools
- [Postman Collection](docs/DriveWell-API.postman_collection.json) (se disponibile)
- [Database Diagram](docs/database-schema.png) (se disponibile)

---

##  Contributing

Questo è un progetto portfolio, ma suggerimenti e feedback sono sempre benvenuti!

Per contribuire:
1. Fork del repository
2. Crea feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit delle modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri Pull Request

---

##  Licenza

ISC License - vedi [LICENSE](LICENSE) file per dettagli.

---

##  Contatti

**Repository**: [github.com/RubbinRubbin/DriveWell](https://github.com/RubbinRubbin/DriveWell)

---

** DriveWell - Guida meglio, paga meno.**

*Developed with ❤️ and TypeScript*

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)

</div>
