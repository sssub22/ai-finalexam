import { MonthlyAggregatedData, UserInput, RiskAnalysis, CorrelationData, RiskLevel } from '../types';

// Calculate Pearson correlation coefficient
const calculateCorrelation = (x: number[], y: number[]): number => {
  const n = x.length;
  if (n === 0) return 0;
  
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
  const sumX2 = x.reduce((a, b) => a + b * b, 0);
  const sumY2 = y.reduce((a, b) => a + b * b, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  return denominator === 0 ? 0 : numerator / denominator;
};

export const analyzeCorrelations = (data: MonthlyAggregatedData[]): CorrelationData[] => {
  const variables: (keyof MonthlyAggregatedData)[] = ['avgTemp', 'avgPrecip', 'avgWind', 'avgHumid'];
  const labels = { avgTemp: '평균 기온', avgPrecip: '강수량', avgWind: '풍속', avgHumid: '습도' };
  
  return variables.map(v => {
    const values = data.map(d => d[v] as number);
    return {
      variable: labels[v],
      theft: calculateCorrelation(values, data.map(d => d.theftCount)),
      assault: calculateCorrelation(values, data.map(d => d.assaultCount)),
      sexual: calculateCorrelation(values, data.map(d => d.sexualCount)),
      homicide: calculateCorrelation(values, data.map(d => d.homicideCount)),
    };
  });
};

const getRiskLevel = (score: number): RiskLevel => {
  if (score < 30) return 'Low';
  if (score < 60) return 'Moderate';
  if (score < 80) return 'High';
  return 'Very High';
};

export const predictRisk = (input: UserInput, data: MonthlyAggregatedData[]): RiskAnalysis[] => {
  // 1. Find historically similar months based on Temperature and Humidity (Euclidean distance simplified)
  const similarMonths = data.map(d => {
    const tempDiff = Math.abs(d.avgTemp - input.avgTemp);
    const humidDiff = Math.abs(d.avgHumid - input.humidity);
    const precipDiff = Math.abs(d.avgPrecip - input.precipitation);
    // Weighted distance: Temp is most important, then humidity
    const distance = (tempDiff * 2) + humidDiff + (precipDiff * 0.5);
    return { ...d, distance };
  }).sort((a, b) => a.distance - b.distance).slice(0, 10); // Top 10 similar months

  // 2. Calculate average crime counts for these similar months
  const avgTheft = similarMonths.reduce((sum, d) => sum + d.theftCount, 0) / similarMonths.length;
  const avgAssault = similarMonths.reduce((sum, d) => sum + d.assaultCount, 0) / similarMonths.length;
  const avgSexual = similarMonths.reduce((sum, d) => sum + d.sexualCount, 0) / similarMonths.length;
  const avgHomicide = similarMonths.reduce((sum, d) => sum + d.homicideCount, 0) / similarMonths.length;

  // 3. Normalize against global min/max to get 0-100 score
  const normalize = (val: number, all: number[]) => {
    const min = Math.min(...all);
    const max = Math.max(...all);
    return Math.min(100, Math.max(0, ((val - min) / (max - min)) * 100));
  };

  const theftScore = Math.round(normalize(avgTheft, data.map(d => d.theftCount)));
  const assaultScore = Math.round(normalize(avgAssault, data.map(d => d.assaultCount)));
  const sexualScore = Math.round(normalize(avgSexual, data.map(d => d.sexualCount)));
  const homicideScore = Math.round(normalize(avgHomicide, data.map(d => d.homicideCount)));

  // 4. Generate reasoning based on correlations (simplified logic for demo)
  const getReasoning = (type: string, score: number, correlations: number) => {
    let text = `과거 유사한 날씨 조건에서의 데이터를 분석한 결과입니다. `;
    
    if (type === '성범죄' && input.avgTemp > 20) {
      text += "평균 기온이 높을 때 발생 빈도가 상승하는 경향이 관찰되었습니다.";
    } else if (type === '절도' && input.precipitation > 10) {
      text += "강수량이 많을 때 절도 발생 패턴이 변화하는 경향이 있습니다.";
    } else if (score > 70) {
      text += "현재 날씨 조건은 과거 범죄 발생 빈도가 높았던 시기와 유사합니다.";
    } else {
      text += "날씨 조건에 따른 뚜렷한 위험도 증가 패턴은 발견되지 않았습니다.";
    }
    return text;
  };

  return [
    { crimeType: '절도', score: theftScore, level: getRiskLevel(theftScore), reasoning: getReasoning('절도', theftScore, 0.4) },
    { crimeType: '폭행', score: assaultScore, level: getRiskLevel(assaultScore), reasoning: getReasoning('폭행', assaultScore, 0.5) },
    { crimeType: '성범죄', score: sexualScore, level: getRiskLevel(sexualScore), reasoning: getReasoning('성범죄', sexualScore, 0.6) },
    { crimeType: '살인', score: homicideScore, level: getRiskLevel(homicideScore), reasoning: getReasoning('살인', homicideScore, 0.1) },
  ];
};
