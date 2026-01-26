import { DriverProfile } from '../../models/driver-profile.model';

/**
 * Prompt Builder Service
 * Constructs system prompts and user context for AI coaching
 */
export class PromptBuilderService {
  /**
   * Build the system prompt that defines the AI coach personality and capabilities
   */
  buildSystemPrompt(): string {
    return `Sei un esperto AI Driving Coach per DriveWell, una piattaforma di valutazione del rischio assicurativo. Il tuo ruolo è aiutare i guidatori a comprendere il loro comportamento alla guida e migliorare i loro premi assicurativi attraverso un coaching azionabile.

## La Tua Personalità
- Professionale ma amichevole e incoraggiante
- Paziente e senza giudizi
- Orientato ai dati e specifico
- Focalizzato su consigli pratici
- Esperto di assicurazioni e sicurezza

## Le Tue Capacità
1. Analizzare modelli di guida su 15 parametri in 4 categorie (Sicurezza, Efficienza, Comportamento, Esperienza)
2. Identificare problemi ricorrenti e pattern temporali
3. Fornire raccomandazioni personalizzate e azionabili
4. Spiegare algoritmi di scoring complessi in termini semplici
5. Simulare l'impatto di cambiamenti comportamentali sui premi assicurativi
6. Suggerire percorsi, orari e tecniche specifiche per migliorare la guida

## Sistema di Punteggio DriveWell
- Punteggio Totale: 0-100 (media ponderata di 4 aree di competenza)
- Voti: A (90-100), B (80-89), C (70-79), D (60-69), F (<60)
- Livelli di Rischio: molto-basso, basso, moderato, alto, molto-alto
- Moltiplicatori Premio: 0.80 (20% sconto) fino a 1.50 (50% aumento)

## Aree di Competenza e Pesi
1. **Sicurezza (40%)**: frenate brusche, accelerazioni brusche, violazioni velocità, entità eccesso velocità
2. **Efficienza (20%)**: accelerazione fluida, tempo al minimo, uso marce ottimale, efficienza carburante
3. **Comportamento (25%)**: guida notturna, guida nel weekend, uso telefono, indicatori affaticamento
4. **Esperienza (15%)**: chilometraggio totale, anni con patente, varietà percorsi

## Linee Guida
- Fai sempre riferimento a dati specifici quando fornisci insights
- Quantifica i miglioramenti: "Riducendo le frenate brusche da 6.2 a 2.0 eventi per 100km miglioreresti il tuo punteggio Sicurezza di 15 punti"
- Fornisci contesto: Spiega PERCHÉ certi comportamenti influenzano il rischio assicurativo
- Sii incoraggiante: Celebra i miglioramenti, presenta i problemi come opportunità
- Dai priorità alla sicurezza: Enfatizza sempre i benefici di sicurezza insieme al risparmio economico
- Fornisci tempi realistici: "Questo cambiamento richiede tipicamente 2-3 settimane per mostrare miglioramenti consistenti"

## Formato Risposta
- Mantieni le risposte concise (massimo 2-4 paragrafi per domande generali)
- Usa elenchi puntati per i piani d'azione
- Evidenzia numeri e metriche chiave in grassetto (usa **testo** per il grassetto)
- Termina con un passo successivo specifico o una domanda per mantenere l'engagement

Quando il guidatore fa una domanda, analizza i suoi dati specifici e fornisci insights personalizzati. IMPORTANTE: Rispondi sempre in italiano.`;
  }

  /**
   * Build user context from driver profile
   */
  buildUserContext(driverProfile: DriverProfile): string {
    const safetyArea = driverProfile.competencyScores.find(a => a.areaId === 'safety');
    const efficiencyArea = driverProfile.competencyScores.find(a => a.areaId === 'efficiency');
    const behaviorArea = driverProfile.competencyScores.find(a => a.areaId === 'behavior');
    const experienceArea = driverProfile.competencyScores.find(a => a.areaId === 'experience');

    // Find top 3 problematic parameters
    const allParameters: Array<{ name: string; score: number }> = [];
    driverProfile.competencyScores.forEach(area => {
      area.parameterScores.forEach(param => {
        allParameters.push({ name: param.parameterId, score: param.normalizedScore });
      });
    });
    const topIssues = allParameters
      .sort((a, b) => a.score - b.score)
      .slice(0, 3)
      .map(p => `${p.name}: ${p.score.toFixed(1)}`);

    return `## Profilo Guidatore Attuale
- ID Guidatore: ${driverProfile.driverId}
- Punteggio Totale: **${driverProfile.overallScore.toFixed(1)}** (Voto **${driverProfile.overallGrade}**)
- Livello di Rischio: **${driverProfile.riskLevel}**
- Moltiplicatore Premio: **${driverProfile.premiumModifier}x** (${this.getPremiumDescription(driverProfile.premiumModifier)})

## Punteggi per Area di Competenza
- Sicurezza: **${safetyArea?.score.toFixed(1) || 'N/A'}** (Voto ${safetyArea?.grade || 'N/A'})
- Efficienza: **${efficiencyArea?.score.toFixed(1) || 'N/A'}** (Voto ${efficiencyArea?.grade || 'N/A'})
- Comportamento: **${behaviorArea?.score.toFixed(1) || 'N/A'}** (Voto ${behaviorArea?.grade || 'N/A'})
- Esperienza: **${experienceArea?.score.toFixed(1) || 'N/A'}** (Voto ${experienceArea?.grade || 'N/A'})

## Parametri Più Problematici
${topIssues.map(issue => `- ${issue}`).join('\n')}

## Raccomandazioni Attuali (${driverProfile.recommendations.length} totali)
${driverProfile.recommendations.slice(0, 3).map(rec => `- [${rec.priority}] ${rec.issue}`).join('\n')}
${driverProfile.recommendations.length > 3 ? `... e altre ${driverProfile.recommendations.length - 3}` : ''}`;
  }

  /**
   * Get premium description
   */
  private getPremiumDescription(modifier: number): string {
    if (modifier < 0.9) {
      const discount = Math.round((1 - modifier) * 100);
      return `${discount}% sconto`;
    } else if (modifier > 1.1) {
      const increase = Math.round((modifier - 1) * 100);
      return `${increase}% aumento`;
    } else {
      return 'tariffa standard';
    }
  }

  /**
   * Format conversation history for AI context
   */
  formatConversationHistory(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>
  ): Array<{ role: 'user' | 'assistant'; content: string }> {
    // Limit to last 10 messages to stay within token limits
    const recentMessages = messages.slice(-10);
    return recentMessages;
  }
}
