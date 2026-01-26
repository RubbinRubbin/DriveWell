# DriveWell - Insurance Risk Assessment System

DriveWell è un sistema di valutazione del rischio assicurativo basato sui dati di guida. Analizza 15 parametri di guida, li raggruppa in 4 aree di competenza, e genera un profilo completo del guidatore con raccomandazioni personalizzate per migliorare il premio assicurativo.

## Caratteristiche Principali

- **15 Parametri di Guida**: Analisi completa del comportamento di guida
- **4 Aree di Competenza**: Safety, Efficiency, Behavior, Experience
- **Scoring Trasparente**: Algoritmo basato su soglie configurabili
- **Raccomandazioni Personalizzate**: Consigli azionabili per migliorare il profilo
- **API REST**: Endpoint per creare assessment e simulare modifiche
- **Type-Safe**: Completamente implementato in TypeScript

## Installazione

### Prerequisiti

- Node.js >= 18.x
- npm >= 9.x

### Setup

```bash
# Clona il repository
git clone <repository-url>
cd DriveWell

# Installa le dipendenze
npm install

# Crea file .env dalla template
cp .env.example .env

# Compila TypeScript
npm run build

# Avvia il server in development mode
npm run dev
```

## Utilizzo

### Avvio Server

```bash
# Development mode (con hot reload)
npm run dev

# Production mode
npm run build
npm start
```

Il server sarà disponibile su `http://localhost:3000`

### Endpoint API

#### 1. Health Check

```bash
GET /api/v1/health
```

Verifica che l'API sia in esecuzione.

**Response:**
```json
{
  "success": true,
  "message": "DriveWell API is running",
  "timestamp": "2025-01-26T10:30:00.000Z"
}
```

#### 2. Crea Assessment

```bash
POST /api/v1/assessments
Content-Type: application/json
```

Crea una nuova valutazione del rischio basata sui dati di guida.

**Request Body:** Vedi [excellent-driver.json](tests/fixtures/excellent-driver.json)

**Response:**
```json
{
  "success": true,
  "data": {
    "driverId": "DR-2024-001",
    "timestamp": "2025-01-26T10:30:00.000Z",
    "overallScore": 91.5,
    "overallGrade": "A",
    "riskLevel": "very-low",
    "premiumModifier": 0.80,
    "competencyScores": [...],
    "recommendations": [...]
  }
}
```

#### 3. Simula Modifiche

```bash
POST /api/v1/assessments/simulate
Content-Type: application/json
```

Simula come modifiche ai parametri influenzerebbero il profilo.

**Request Body:**
```json
{
  "baseDriverData": { /* dati driver corrente */ },
  "modifications": {
    "harshBrakingEventsPerHundredKm": 0.2,
    "speedingViolationsPerHundredKm": 0.05
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "current": { /* profilo corrente */ },
    "simulated": { /* profilo simulato */ },
    "diff": {
      "scoreChange": 3.5,
      "premiumChange": -0.10,
      "gradeChange": "B → A",
      "riskChange": "low → very-low"
    }
  }
}
```

## Esempi di Utilizzo

### Test con Driver Eccellente

```bash
curl -X POST http://localhost:3000/api/v1/assessments \
  -H "Content-Type: application/json" \
  -d @tests/fixtures/excellent-driver.json
```

**Risultato Atteso:**
- Overall Score: ~91-95
- Grade: A
- Risk Level: very-low
- Premium Modifier: 0.80 (20% di sconto)

### Test con Driver ad Alto Rischio

```bash
curl -X POST http://localhost:3000/api/v1/assessments \
  -H "Content-Type: application/json" \
  -d @tests/fixtures/high-risk-driver.json
```

**Risultato Atteso:**
- Overall Score: ~40-50
- Grade: F
- Risk Level: very-high
- Premium Modifier: 1.50 (50% di aumento)
- Raccomandazioni: Multiple CRITICAL priority

## Sistema di Scoring

### Parametri di Guida (15 totali)

#### Safety (40% del punteggio totale)
- **Harsh Braking Events**: Frenate brusche per 100km
- **Harsh Acceleration Events**: Accelerazioni brusche per 100km
- **Speeding Violations**: Violazioni velocità per 100km
- **Average Speeding Magnitude**: Media km/h oltre il limite

#### Efficiency (20% del punteggio totale)
- **Smooth Acceleration**: Percentuale accelerazioni fluide
- **Idling Time**: Percentuale tempo al minimo
- **Optimal Gear Usage**: Percentuale uso marcia ottimale
- **Fuel Efficiency Score**: Punteggio efficienza carburante

#### Behavior (25% del punteggio totale)
- **Night Driving**: Percentuale guida notturna (22-5)
- **Weekend Driving**: Percentuale guida weekend
- **Phone Usage**: Eventi uso telefono per 100km
- **Fatigue Indicators**: Indicatori fatica per 100km

#### Experience (15% del punteggio totale)
- **Total Mileage**: Chilometraggio totale percorso
- **Years License**: Anni possesso patente
- **Route Variety**: Varietà percorsi (0-100)

### Algoritmo di Scoring

Il sistema utilizza un approccio a 3 livelli:

1. **Livello Parametro**: Ogni parametro grezzo viene convertito in uno score 0-100 usando soglie configurabili e interpolazione lineare.

2. **Livello Area**: Media ponderata dei parametri nell'area.
   ```
   Area Score = Σ(Parameter Score × Parameter Weight) / Σ(Parameter Weight)
   ```

3. **Livello Profilo**: Media ponderata delle 4 aree.
   ```
   Overall Score = (Safety × 0.40) + (Efficiency × 0.20) +
                   (Behavior × 0.25) + (Experience × 0.15)
   ```

### Calcolo Premium Modifier

| Overall Score | Risk Level  | Premium Modifier | Sconto/Aumento |
|--------------|-------------|------------------|----------------|
| ≥ 85         | Very Low    | 0.80             | -20%          |
| 75-84        | Low         | 0.90             | -10%          |
| 60-74        | Moderate    | 1.00             | 0%            |
| 45-59        | High        | 1.25             | +25%          |
| < 45         | Very High   | 1.50             | +50%          |

## Struttura del Progetto

```
DriveWell/
├── src/
│   ├── config/                 # Configurazioni (parametri, aree, regole)
│   ├── models/                 # Interfacce TypeScript
│   ├── services/               # Logica business (scoring, raccomandazioni)
│   ├── controllers/            # API controllers
│   ├── routes/                 # Route definitions
│   ├── middleware/             # Express middleware
│   └── app.ts                  # Entry point
├── tests/
│   └── fixtures/               # Dati di esempio per test
├── package.json
├── tsconfig.json
└── README.md
```

## Configurazione

Tutte le configurazioni sono centralizzate in [src/config/](src/config/):

- **[parameters.config.ts](src/config/parameters.config.ts)**: Definizioni dei 15 parametri con soglie e pesi
- **[competency-areas.config.ts](src/config/competency-areas.config.ts)**: Definizioni delle 4 aree con pesi
- **[recommendations.config.ts](src/config/recommendations.config.ts)**: Regole per generare raccomandazioni

### Personalizzazione

Per modificare i pesi o le soglie, edita i file di configurazione:

```typescript
// src/config/parameters.config.ts
{
  id: 'harsh_braking',
  thresholds: {
    excellent: 0.5,  // Modifica questo valore
    good: 1.5,
    fair: 3.0,
    poor: 5.0
  },
  weight: 0.30  // Modifica il peso nell'area
}
```

## Testing

```bash
# Run all tests (quando implementati)
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## Sviluppo Futuro

Possibili estensioni del sistema:

- [ ] Persistenza database (MongoDB, PostgreSQL)
- [ ] Autenticazione/Autorizzazione API
- [ ] Dashboard web frontend
- [ ] Machine learning per scoring predittivo
- [ ] Integrazione con dispositivi telematics
- [ ] Storico valutazioni per driver
- [ ] Analytics e reporting avanzati
- [ ] Rate limiting e caching (Redis)

## Architettura Tecnica

### Design Principles

1. **Configuration-Driven**: Tutti i pesi, soglie e regole sono configurabili
2. **Type-Safe**: TypeScript garantisce type safety completa
3. **Testabile**: Servizi separati con dependency injection
4. **Estensibile**: Facile aggiungere nuovi parametri o aree
5. **Trasparente**: Algoritmo spiegabile e auditabile

### Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Security**: Helmet, CORS
- **Logging**: Morgan

## Licenza

ISC

## Supporto

Per bug report o feature request, apri una issue su GitHub.

---

**DriveWell** - Guida meglio, paga meno.
