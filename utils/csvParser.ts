import { MonthlyCrime, MonthlyAggregatedData } from '../types';

export const parseCrimeCSV = (csv: string): MonthlyCrime[] => {
  const lines = csv.trim().split('\n');
  const data: MonthlyCrime[] = [];
  
  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const parts = line.split(',');
    // Format: Date, Type, Count
    if (parts.length >= 3) {
      data.push({
        date: parts[0].substring(0, 7), // YYYY-MM
        type: parts[1] as any,
        count: parseInt(parts[2], 10)
      });
    }
  }
  return data;
};

export const parseWeatherCSV = (csv: string): any[] => {
  const lines = csv.trim().split('\n');
  const data: any[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const parts = line.split(',');
    if (parts.length >= 5) {
      data.push({
        month: parts[0],
        avgTemp: parseFloat(parts[1]),
        avgPrecip: parseFloat(parts[2]),
        avgWind: parseFloat(parts[3]),
        avgHumid: parseFloat(parts[4]),
      });
    }
  }
  return data;
};

export const mergeData = (crimeData: MonthlyCrime[], weatherData: any[]): MonthlyAggregatedData[] => {
  const result: MonthlyAggregatedData[] = [];

  weatherData.forEach(w => {
    const crimesInMonth = crimeData.filter(c => c.date === w.month);
    
    const theft = crimesInMonth.find(c => c.type === '절도')?.count || 0;
    const assault = crimesInMonth.find(c => c.type === '폭행')?.count || 0;
    const sexual = crimesInMonth.find(c => c.type === '성범죄')?.count || 0;
    const homicide = crimesInMonth.find(c => c.type === '살인')?.count || 0;

    if (theft > 0 || assault > 0) { // Only add if we have crime data
      result.push({
        month: w.month,
        avgTemp: w.avgTemp,
        avgPrecip: w.avgPrecip,
        avgWind: w.avgWind,
        avgHumid: w.avgHumid,
        theftCount: theft,
        assaultCount: assault,
        sexualCount: sexual,
        homicideCount: homicide
      });
    }
  });

  return result;
};
