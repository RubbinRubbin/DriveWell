# DriveWell

## Piattaforma di Valutazione del Rischio Assicurativo con AI Driving Coach

DriveWell e' un sistema completo di valutazione del rischio per guidatori, progettato per compagnie assicurative. La piattaforma analizza 15 parametri di guida attraverso 4 aree di competenza, genera profili di rischio dettagliati e fornisce coaching personalizzato tramite un assistente AI basato su OpenAI GPT-4.

Il sistema dispone di dashboard separate per operatori assicurativi e clienti individuali, con autenticazione basata su ruoli e calcolo dei profili in tempo reale.

---

## Indice

1. [Funzionalita](#funzionalita)
2. [Architettura](#architettura)
3. [Stack Tecnologico](#stack-tecnologico)
4. [Installazione](#installazione)
5. [Configurazione](#configurazione)
6. [Utilizzo](#utilizzo)
7. [Riferimento API](#riferimento-api)
8. [Schema Database](#schema-database)
9. [Algoritmo di Scoring](#algoritmo-di-scoring)
10. [Struttura del Progetto](#struttura-del-progetto)
11. [Deployment](#deployment)
12. [Licenza](#licenza)

---

## Funzionalita

### Funzionalita Principali

- **Analisi a 15 Parametri**: Valutazione completa del comportamento di guida attraverso metriche di sicurezza, efficienza, comportamento ed esperienza
- **Profilazione del Rischio**: Calcolo automatico dei livelli di rischio (da molto basso a molto alto) con relativi modificatori di premio
- **Assegnazione Voti**: Sistema di valutazione da A a F basato sulla performance complessiva di guida
- **Raccomandazioni Attuabili**: Suggerimenti di miglioramento prioritizzati con stima dell'impatto su punteggio e premio

### Sistema a Doppia Dashboard

- **Dashboard Aziendale**: Interfaccia di gestione clienti per operatori assicurativi
  - Visualizzazione di tutti i clienti registrati con i relativi punteggi di guida
  - Inserimento dati di guida per singoli clienti
  - Monitoraggio statistiche (clienti totali, punteggio medio, conteggio alto rischio)
  - Funzionalita di eliminazione soft per i record dei clienti

- **Dashboard Cliente**: Portale self-service per gli assicurati
  - Visualizzazione del profilo di guida personale e valutazione del rischio
  - Accesso alla suddivisione delle competenze per area
  - Consultazione delle raccomandazioni personalizzate
  - Interazione con l'AI Driving Coach

### Sistema di Autenticazione

- Controllo accessi basato su ruoli (utenti aziendali vs clienti)
- Autenticazione JWT tramite Supabase Auth
- Auto-registrazione clienti con verifica codice aziendale
- Gestione sessioni sicura

### AI Driving Coach

- Interfaccia conversazionale basata su GPT-4
- Risposte contestualizzate basate sul profilo di guida individuale
- Persistenza della sessione per conversazioni continue
- Supporto completo in lingua italiana

---

## Architettura

```
                                    LIVELLO FRONTEND
    +------------------------------------------------------------------+
    |                                                                  |
    |   /login.html          /company/           /customer/            |
    |   Autenticazione       Dashboard Azienda   Dashboard Cliente     |
    |                                                                  |
    +------------------------------------------------------------------+
                                      |
                                      | HTTP/REST + JWT
                                      v
    +------------------------------------------------------------------+
    |                         LIVELLO API (Express.js)                 |
    |                                                                  |
    |   /api/v1/auth/*        Endpoint autenticazione                  |
    |   /api/v1/company/*     Endpoint gestione aziendale              |
    |   /api/v1/customer/*    Profilo cliente + AI Coach               |
    |                                                                  |
    +------------------------------------------------------------------+
                                      |
                    +-----------------+-----------------+
                    |                                   |
                    v                                   v
    +---------------------------+       +---------------------------+
    |      LIVELLO SERVIZI      |       |     SERVIZI ESTERNI       |
    |                           |       |                           |
    | - RiskAssessmentService   |       |   Supabase                |
    | - ProfileScoringService   |       |   - Autenticazione        |
    | - RecommendationService   |       |   - Database PostgreSQL   |
    | - AICoachService          |       |                           |
    | - PromptBuilderService    |       |   OpenAI API              |
    |                           |       |   - GPT-4 Chat            |
    +---------------------------+       +---------------------------+
```

---

## Stack Tecnologico

| Livello | Tecnologia |
|---------|------------|
| Runtime | Node.js 18+ |
| Linguaggio | TypeScript 5.x |
| Framework | Express.js 4.x |
| Database | PostgreSQL (Supabase) |
| Autenticazione | Supabase Auth (JWT) |
| Integrazione AI | OpenAI GPT-4 |
| Frontend | HTML5, TailwindCSS, Vanilla JavaScript |

---

## Installazione

### Prerequisiti

- Node.js >= 18.x
- npm >= 9.x
- Account Supabase con progetto configurato
- Chiave API OpenAI

### Passaggi di Setup

1. Clonare il repository:

```bash
git clone https://github.com/yourusername/DriveWell.git
cd DriveWell
```

2. Installare le dipendenze:

```bash
npm install
```

3. Configurare le variabili d'ambiente (vedi [Configurazione](#configurazione))

4. Inizializzare lo schema del database in Supabase usando gli script SQL in `/supabase/migrations/`

5. Avviare il server di sviluppo:

```bash
npm run dev
```

L'applicazione sara disponibile su `http://localhost:3000`

---

## Configurazione

Creare un file `.env` nella root del progetto con le seguenti variabili:

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

# Registrazione Clienti
CUSTOMER_REGISTRATION_CODE=DRIVEWELL2026
```

### Riferimento Variabili d'Ambiente

| Variabile | Obbligatoria | Descrizione |
|-----------|--------------|-------------|
| `PORT` | No | Porta del server (default: 3000) |
| `NODE_ENV` | No | Modalita ambiente (development/production) |
| `SUPABASE_URL` | Si | URL del progetto Supabase |
| `SUPABASE_ANON_KEY` | Si | Chiave anonima/pubblica Supabase |
| `SUPABASE_SERVICE_KEY` | Si | Chiave service role Supabase |
| `OPENAI_API_KEY` | Si | Chiave API OpenAI per GPT-4 |
| `OPENAI_MODEL` | No | Identificatore del modello (default: gpt-4) |
| `CUSTOMER_REGISTRATION_CODE` | Si | Codice richiesto per l'auto-registrazione clienti |

---

## Utilizzo

### Flusso di Lavoro Aziendale

1. Accedere all'applicazione su `http://localhost:3000`
2. Effettuare il login con le credenziali aziendali
3. Visualizzare i clienti registrati nella dashboard
4. Cliccare l'icona impostazioni per inserire i dati di guida di un cliente
5. Inviare i 14 parametri di guida per calcolare il profilo di rischio
6. Verificare i punteggi e i livelli di rischio dei clienti nella tabella principale

### Flusso di Lavoro Cliente

1. Navigare alla pagina di login
2. Nuovi clienti: Registrarsi usando email, password e codice di registrazione aziendale
3. Clienti esistenti: Effettuare il login con le proprie credenziali
4. Visualizzare il profilo di guida con punteggio complessivo, voto e livello di rischio
5. Consultare i punteggi di competenza in tutte e quattro le aree
6. Leggere le raccomandazioni personalizzate
7. Utilizzare l'AI Coach (icona chat in basso a destra) per ricevere consigli

### Esempi di Interazione con l'AI Coach

L'AI Coach risponde a domande come:

- "Perche il mio punteggio e basso?"
- "Come posso ridurre il mio premio assicurativo?"
- "Su cosa dovrei concentrarmi per migliorare?"
- "Spiega come viene calcolato il punteggio di sicurezza"
- "Quali sono i miei punti di forza come guidatore?"

---

## Riferimento API

### Autenticazione

#### POST /api/v1/auth/login

Autenticazione utente (aziendale o cliente).

**Richiesta:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Risposta:**
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

Registrazione nuovo account cliente.

**Richiesta:**
```json
{
  "email": "customer@example.com",
  "password": "password123",
  "fullName": "Mario Rossi",
  "registrationCode": "DRIVEWELL2026"
}
```

### Endpoint Aziendali

Tutti gli endpoint aziendali richiedono autenticazione con token utente aziendale.

#### GET /api/v1/company/customers

Recupera tutti i clienti con i riepiloghi dei profili.

#### GET /api/v1/company/statistics

Ottiene le statistiche della dashboard.

**Risposta:**
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

#### GET /api/v1/company/customers/:id/driving-data

Recupera i parametri di guida esistenti di un cliente.

#### POST /api/v1/company/customers/:id/driving-data

Invia i dati di guida e calcola il profilo.

**Richiesta:**
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

### Endpoint Cliente

Tutti gli endpoint cliente richiedono autenticazione con token cliente.

#### GET /api/v1/customer/profile

Recupera il profilo di guida del cliente corrente.

#### POST /api/v1/customer/coach/chat

Invia un messaggio all'AI Coach.

**Richiesta:**
```json
{
  "message": "Come posso migliorare il mio punteggio di guida?",
  "sessionId": "optional-session-id"
}
```

**Risposta:**
```json
{
  "success": true,
  "data": {
    "sessionId": "session-uuid",
    "response": "In base al tuo profilo, ti consiglio di concentrarti su..."
  }
}
```

---

## Schema Database

### Tabelle

#### company_users
Memorizza gli account degli operatori assicurativi.

| Colonna | Tipo | Descrizione |
|---------|------|-------------|
| id | UUID | Chiave primaria |
| auth_user_id | UUID | Riferimento auth Supabase |
| email | VARCHAR | Email utente |
| full_name | VARCHAR | Nome visualizzato |
| created_at | TIMESTAMPTZ | Timestamp creazione |

#### customers
Memorizza i record dei clienti.

| Colonna | Tipo | Descrizione |
|---------|------|-------------|
| id | UUID | Chiave primaria |
| auth_user_id | UUID | Riferimento auth Supabase |
| email | VARCHAR | Email cliente |
| full_name | VARCHAR | Nome cliente |
| phone | VARCHAR | Numero di telefono |
| driver_license_number | VARCHAR | Numero patente |
| driver_license_years | INTEGER | Anni di possesso patente |
| is_active | BOOLEAN | Flag eliminazione soft |
| created_at | TIMESTAMPTZ | Timestamp creazione |
| updated_at | TIMESTAMPTZ | Timestamp ultimo aggiornamento |

#### driver_profiles
Memorizza i profili di guida calcolati.

| Colonna | Tipo | Descrizione |
|---------|------|-------------|
| id | UUID | Chiave primaria |
| customer_id | UUID | Chiave esterna verso customers |
| overall_score | DECIMAL | Punteggio complessivo calcolato (0-100) |
| overall_grade | VARCHAR | Voto in lettere (A-F) |
| risk_level | VARCHAR | Classificazione del rischio |
| premium_modifier | DECIMAL | Moltiplicatore premio assicurativo |
| competency_scores | JSONB | Punteggi per area di competenza |
| recommendations | JSONB | Raccomandazioni generate |
| [14 colonne parametri] | DECIMAL | Metriche di guida individuali |
| created_at | TIMESTAMPTZ | Timestamp creazione |
| updated_at | TIMESTAMPTZ | Timestamp ultimo aggiornamento |

---

## Algoritmo di Scoring

### Aree di Competenza e Pesi

| Area | Peso | Parametri |
|------|------|-----------|
| Sicurezza | 40% | Frenate brusche, accelerazioni brusche, violazioni velocita, entita eccesso velocita |
| Efficienza | 20% | Accelerazione fluida, tempo al minimo, uso ottimale marce, efficienza carburante |
| Comportamento | 25% | Guida notturna, guida weekend, uso telefono, indicatori affaticamento |
| Esperienza | 15% | Chilometraggio totale, anni di patente, varieta percorsi |

### Calcolo del Punteggio

1. Ogni parametro viene valutato 0-100 in base a soglie configurate
2. I punteggi di area sono calcolati come medie ponderate dei loro parametri
3. Il punteggio complessivo e la media ponderata dei punteggi di area
4. Il voto viene assegnato in base alle soglie del punteggio complessivo

### Mappatura Voti e Rischio

| Range Punteggio | Voto | Livello Rischio | Modificatore Premio |
|-----------------|------|-----------------|---------------------|
| 90-100 | A | Molto Basso | 0.80x (-20%) |
| 80-89 | B | Basso | 0.90x (-10%) |
| 70-79 | C | Moderato | 1.00x (base) |
| 60-69 | D | Alto | 1.25x (+25%) |
| 0-59 | F | Molto Alto | 1.50x (+50%) |

---

## Struttura del Progetto

```
DriveWell/
├── public/
│   ├── login.html                 # Pagina autenticazione
│   ├── js/
│   │   └── auth.js               # Logica autenticazione
│   ├── company/
│   │   ├── index.html            # Dashboard aziendale
│   │   └── js/
│   │       └── company-dashboard.js
│   └── customer/
│       ├── index.html            # Dashboard cliente
│       └── js/
│           └── customer-dashboard.js
│
├── src/
│   ├── app.ts                    # Entry point applicazione Express
│   ├── config/
│   │   ├── supabase.config.ts    # Setup client Supabase
│   │   ├── parameters.config.ts  # Definizioni parametri guida
│   │   ├── competency-areas.config.ts
│   │   └── recommendations.config.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── company.controller.ts
│   │   └── customer.controller.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts    # Verifica JWT
│   │   ├── role.middleware.ts    # Accesso basato su ruoli
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

### Variabili d'Ambiente di Produzione

```env
NODE_ENV=production
PORT=3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
OPENAI_API_KEY=sk-your-production-key
CUSTOMER_REGISTRATION_CODE=YOUR-SECURE-CODE
```

### Build e Avvio

```bash
# Build TypeScript
npm run build

# Avvia server di produzione
npm start
```

### Piattaforme Consigliate

- **Railway**: Deployment semplice con gestione variabili d'ambiente
- **Render**: Supporto nativo Node.js con build automatiche
- **Heroku**: PaaS tradizionale con configurazione diretta

Nota: Supabase gestisce l'hosting del database separatamente dall'hosting dell'applicazione.

---

## Licenza

Licenza ISC

---

## Repository

https://github.com/RubbinRubbin/DriveWell
