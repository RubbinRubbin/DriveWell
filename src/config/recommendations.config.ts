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
      issue: 'Excessive harsh braking detected (${value} events/100km)',
      advice: 'Increase following distance and anticipate traffic flow. Practice smooth, gradual braking by observing traffic ahead.'
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
      issue: 'Frequent speeding violations (${value} events/100km)',
      advice: 'Strictly adhere to speed limits. Use cruise control on highways and enable speed limit alerts if available.'
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
      issue: 'Phone usage while driving detected (${value} events/100km)',
      advice: 'Enable Do Not Disturb mode while driving. Use hands-free systems for essential calls only.'
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
      issue: 'High harsh acceleration events (${value} events/100km)',
      advice: 'Practice gradual acceleration. Anticipate speed changes and accelerate smoothly over 5-7 seconds.'
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
      issue: 'High idling time detected (${value}% of driving time)',
      advice: 'Turn off engine when stopped for more than 30 seconds. Plan routes to minimize traffic congestion.'
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
      issue: 'Low smooth acceleration rate (${value}%)',
      advice: 'Practice gradual acceleration. Aim to reach desired speed smoothly over 5-7 seconds.'
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
      issue: 'Low fuel efficiency score (${value})',
      advice: 'Maintain steady speeds, avoid rapid acceleration, and ensure regular vehicle maintenance.'
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
      issue: 'High percentage of night driving (${value}%)',
      advice: 'When possible, schedule trips during daylight hours. Ensure proper rest before night driving.'
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
      issue: 'Fatigue indicators detected (${value} events/100km)',
      advice: 'Take regular breaks every 2 hours. Avoid driving when tired. Get adequate sleep before long trips.'
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
      issue: 'Limited driving experience (${value} years)',
      advice: 'Consider advanced driving courses. Gradually increase exposure to varied driving conditions.'
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
      issue: 'Low route variety (${value} score)',
      advice: 'Gain experience in diverse driving conditions to build comprehensive driving skills.'
    },
    impact: {
      scoreImprovement: 2,
      premiumReduction: 1
    }
  }
];
