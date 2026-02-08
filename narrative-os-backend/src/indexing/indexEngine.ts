import { NarrativeUnit } from '@prisma/client';

export interface IndexMetrics {
  strength: number;
  sentiment_score: number;
  velocity: number;
  media_coverage: number;
  social_heat: number;
  consistency: number;
  lifecycle: string;
}

export function calculateIndex(units: NarrativeUnit[]): IndexMetrics {
  if (units.length === 0) {
    return {
      strength: 0, sentiment_score: 0, velocity: 0, media_coverage: 0, social_heat: 0, consistency: 0, lifecycle: 'Emerging'
    };
  }

  // 1. Velocity (Growth Rate)
  // Simplified: just count of units (assuming units passed are from a specific recent window)
  // Real implementation would compare T(now) vs T(previous)
  const velocity = Math.min(units.length * 2, 100); // Mock normalization

  // 2. Media Coverage vs Social Heat
  const mediaUnits = units.filter(u => u.source_type === 'news');
  const socialUnits = units.filter(u => u.source_type === 'social');
  
  const media_coverage = Math.min(mediaUnits.length * 5, 100);
  const social_heat = Math.min(socialUnits.length * 5, 100);

  // 3. Sentiment Score
  let sentimentSum = 0;
  units.forEach(u => {
    if (u.sentiment === 'Bullish') sentimentSum += 1;
    else if (u.sentiment === 'Bearish') sentimentSum -= 1;
  });
  // Normalize to -100 to 100 or 0-100? Let's keep it simple -1 to 1 float then scaled
  const sentiment_score = (sentimentSum / units.length) * 100;

  // 4. Consistency (Mock)
  const consistency = 80; // Placeholder

  // 5. Strength Calculation (Weighted Average)
  // Strength = 40% Velocity + 30% Media + 30% Social
  const strength = (velocity * 0.4) + (media_coverage * 0.3) + (social_heat * 0.3);

  // 6. Lifecycle Determination
  let lifecycle = 'Emerging';
  if (strength > 80) lifecycle = 'Consensus';
  else if (strength > 50) lifecycle = 'Hyped';
  else if (velocity < 10 && strength < 30) lifecycle = 'Fading';

  return {
    strength,
    sentiment_score,
    velocity,
    media_coverage,
    social_heat,
    consistency,
    lifecycle
  };
}
