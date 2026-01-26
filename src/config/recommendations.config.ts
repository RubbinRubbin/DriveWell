import { RecommendationRule, RecommendationPriority } from '../models/recommendation.model';

export const RECOMMENDATION_RULES: RecommendationRule[] = [
  // Safety recommendations
  {
    id: 'harsh_braking_critical',
    parameterId: 'harsh_braking',
    condition: {
      operator: '>',
      threshold: 5.0
    },
    priority: RecommendationPriority.CRITICAL,
    template: {
      issue: 'Frenate brusche eccessive rilevate (${value} eventi/100km)',
      advice: 'Aumenta la distanza di sicurezza e anticipa il flusso del traffico. Pratica frenate fluide e graduali osservando il traffico davanti a te.'
    },
    impact: {
      scoreImprovement: 8,
      premiumReduction: 12
    }
  },
  {
    id: 'speeding_critical',
    parameterId: 'speeding_violations',
    condition: {
      operator: '>',
      threshold: 5.0
    },
    priority: RecommendationPriority.CRITICAL,
    template: {
      issue: 'Violazioni di velocità frequenti (${value} eventi/100km)',
      advice: 'Rispetta rigorosamente i limiti di velocità. Usa il cruise control in autostrada e attiva gli avvisi dei limiti di velocità se disponibili.'
    },
    impact: {
      scoreImprovement: 12,
      premiumReduction: 18
    }
  },
  {
    id: 'phone_usage_high',
    parameterId: 'phone_usage',
    condition: {
      operator: '>',
      threshold: 1.5
    },
    priority: RecommendationPriority.CRITICAL,
    template: {
      issue: 'Uso del telefono durante la guida rilevato (${value} eventi/100km)',
      advice: 'Attiva la modalità Non Disturbare durante la guida. Usa sistemi vivavoce solo per chiamate essenziali.'
    },
    impact: {
      scoreImprovement: 10,
      premiumReduction: 15
    }
  },
  {
    id: 'harsh_acceleration_high',
    parameterId: 'harsh_acceleration',
    condition: {
      operator: '>',
      threshold: 4.0
    },
    priority: RecommendationPriority.HIGH,
    template: {
      issue: 'Accelerazioni brusche elevate (${value} eventi/100km)',
      advice: 'Pratica accelerazioni graduali. Anticipa i cambi di velocità e accelera dolcemente nell\'arco di 5-7 secondi.'
    },
    impact: {
      scoreImprovement: 6,
      premiumReduction: 8
    }
  },

  // Efficiency recommendations
  {
    id: 'idling_high',
    parameterId: 'idling_time',
    condition: {
      operator: '>',
      threshold: 12
    },
    priority: RecommendationPriority.MEDIUM,
    template: {
      issue: 'Tempo al minimo elevato rilevato (${value}% del tempo di guida)',
      advice: 'Spegni il motore quando sei fermo per più di 30 secondi. Pianifica percorsi per ridurre al minimo il traffico congestionato.'
    },
    impact: {
      scoreImprovement: 5,
      premiumReduction: 3
    }
  },
  {
    id: 'smooth_acceleration_low',
    parameterId: 'smooth_acceleration',
    condition: {
      operator: '<',
      threshold: 70
    },
    priority: RecommendationPriority.MEDIUM,
    template: {
      issue: 'Tasso di accelerazione fluida basso (${value}%)',
      advice: 'Pratica accelerazioni graduali. Mira a raggiungere la velocità desiderata in modo fluido nell\'arco di 5-7 secondi.'
    },
    impact: {
      scoreImprovement: 6,
      premiumReduction: 5
    }
  },
  {
    id: 'fuel_efficiency_low',
    parameterId: 'fuel_efficiency',
    condition: {
      operator: '<',
      threshold: 55
    },
    priority: RecommendationPriority.MEDIUM,
    template: {
      issue: 'Punteggio di efficienza carburante basso (${value})',
      advice: 'Mantieni velocità costanti, evita accelerazioni brusche e assicurati di effettuare la manutenzione regolare del veicolo.'
    },
    impact: {
      scoreImprovement: 4,
      premiumReduction: 3
    }
  },

  // Behavior recommendations
  {
    id: 'night_driving_high',
    parameterId: 'night_driving',
    condition: {
      operator: '>',
      threshold: 25
    },
    priority: RecommendationPriority.MEDIUM,
    template: {
      issue: 'Percentuale elevata di guida notturna (${value}%)',
      advice: 'Quando possibile, programma i viaggi durante le ore diurne. Assicurati di riposare adeguatamente prima di guidare di notte.'
    },
    impact: {
      scoreImprovement: 4,
      premiumReduction: 6
    }
  },
  {
    id: 'fatigue_indicators_high',
    parameterId: 'fatigue_indicators',
    condition: {
      operator: '>',
      threshold: 1.5
    },
    priority: RecommendationPriority.HIGH,
    template: {
      issue: 'Indicatori di affaticamento rilevati (${value} eventi/100km)',
      advice: 'Fai pause regolari ogni 2 ore. Evita di guidare quando sei stanco. Dormi adeguatamente prima di viaggi lunghi.'
    },
    impact: {
      scoreImprovement: 7,
      premiumReduction: 10
    }
  },

  // Experience recommendations
  {
    id: 'experience_low',
    parameterId: 'years_license',
    condition: {
      operator: '<',
      threshold: 3
    },
    priority: RecommendationPriority.LOW,
    template: {
      issue: 'Esperienza di guida limitata (${value} anni)',
      advice: 'Valuta corsi di guida avanzata. Aumenta gradualmente l\'esposizione a condizioni di guida varie.'
    },
    impact: {
      scoreImprovement: 3,
      premiumReduction: 2
    }
  },
  {
    id: 'route_variety_low',
    parameterId: 'route_variety',
    condition: {
      operator: '<',
      threshold: 40
    },
    priority: RecommendationPriority.LOW,
    template: {
      issue: 'Varietà di percorsi bassa (${value} punteggio)',
      advice: 'Acquisisci esperienza in condizioni di guida diverse per sviluppare competenze di guida complete.'
    },
    impact: {
      scoreImprovement: 2,
      premiumReduction: 1
    }
  }
];
