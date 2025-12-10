import React, { useState, useEffect } from 'react';
import { Activity, BarChart2, ShieldAlert } from 'lucide-react';
import { InputSection } from './components/InputSection';
import { RiskResult } from './components/RiskResult';
import { Dashboard } from './components/Dashboard';
import { MonthlyAggregatedData, UserInput, RiskAnalysis } from './types';
import { CRIME_CSV_RAW, WEATHER_CSV_MONTHLY_AGGREGATED } from './constants';
import { parseCrimeCSV, parseWeatherCSV, mergeData } from './utils/csvParser';
import { predictRisk } from './services/analysisEngine';

function App() {
  const [activeTab, setActiveTab] = useState<'prediction' | 'analysis'>('prediction');
  const [data, setData] = useState<MonthlyAggregatedData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Default State
  const [userInput, setUserInput] = useState<UserInput>({
    date: new Date().toISOString().split('T')[0],
    avgTemp: 20,
    minTemp: 15,
    maxTemp: 25,
    precipitation: 0,
    windSpeed: 2.5,
    humidity: 50
  });

  const [results, setResults] = useState<RiskAnalysis[] | null>(null);

  useEffect(() => {
    // Simulate data loading and parsing
    const loadData = () => {
      try {
        const crimeRaw = parseCrimeCSV(CRIME_CSV_RAW);
        const weatherRaw = parseWeatherCSV(WEATHER_CSV_MONTHLY_AGGREGATED);
        const merged = mergeData(crimeRaw, weatherRaw);
        setData(merged);
      } catch (e) {
        console.error("Failed to parse data", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAnalyze = () => {
    if (data.length === 0) return;
    const predictions = predictRisk(userInput, data);
    setResults(predictions);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-8 h-8 text-blue-400" />
              <span className="font-bold text-xl tracking-tight">CrimeCast AI</span>
            </div>
            <nav className="flex space-x-1">
              <button
                onClick={() => setActiveTab('prediction')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'prediction' 
                    ? 'bg-gray-800 text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Activity className="w-4 h-4" /> 예측
                </span>
              </button>
              <button
                onClick={() => setActiveTab('analysis')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'analysis' 
                    ? 'bg-gray-800 text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4" /> 데이터 분석
                </span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'prediction' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                날씨 기반 범죄 위험도 분석
              </h1>
              <p className="mt-3 text-lg text-gray-500">
                현재 또는 예보된 날씨 조건을 입력하여 과거 데이터 패턴 기반의 범죄 위험도를 분석합니다.
              </p>
            </div>

            <InputSection 
              input={userInput} 
              onChange={setUserInput} 
              onAnalyze={handleAnalyze} 
            />

            {results && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-blue-600 pl-4">
                  분석 결과
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.map((risk, idx) => (
                    <RiskResult 
                      key={idx} 
                      risk={risk} 
                    />
                  ))}
                </div>
                
                <div className="mt-8 bg-blue-50 border border-blue-100 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 flex items-start gap-2">
                    <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                    <span>
                      <strong>주의:</strong> 이 도구는 과거 통계적 상관관계를 사용하여 위험 추세를 추정합니다. 미래 사건에 대한 확정적인 예측이 아니며, 실제 범죄율은 날씨 외에도 복합적인 사회적 요인에 따라 달라질 수 있습니다.
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="animate-fade-in">
             <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-gray-900">과거 데이터 대시보드</h1>
              <p className="mt-2 text-gray-500">
                2008년부터 2013년까지의 기상 변수와 범죄 발생 간의 관계를 탐색합니다.
              </p>
            </div>
            <Dashboard data={data} />
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
