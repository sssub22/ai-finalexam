export interface DailyWeather {
  date: string;
  avgTemp: number;
  minTemp: number;
  maxTemp: number;
  precipitation: number;
  windSpeed: number;
  humidity: number;
}

export interface MonthlyCrime {
  date: string; // YYYY-MM-01
  type: '살인' | '성범죄' | '절도' | '폭행';
  count: number;
}

export interface MonthlyAggregatedData {
  month: string; // YYYY-MM
  avgTemp: number;
  avgPrecip: number;
  avgWind: number;
  avgHumid: number;
  theftCount: number;
  assaultCount: number;
  sexualCount: number;
  homicideCount: number;
}

export interface UserInput {
  date: string;
  avgTemp: number;
  minTemp: number;
  maxTemp: number;
  precipitation: number;
  windSpeed: number;
  humidity: number;
}

export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Very High';

export interface RiskAnalysis {
  crimeType: string;
  score: number; // 0-100
  level: RiskLevel;
  reasoning: string;
}

export interface CorrelationData {
  variable: string;
  theft: number;
  assault: number;
  sexual: number;
  homicide: number;
}
