import React from 'react';
import { UserInput } from '../types';
import { Calendar, CloudRain, Thermometer, Wind, Droplets } from 'lucide-react';

interface Props {
  input: UserInput;
  onChange: (input: UserInput) => void;
  onAnalyze: () => void;
}

export const InputSection: React.FC<Props> = ({ input, onChange, onAnalyze }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({
      ...input,
      [name]: name === 'date' ? value : parseFloat(value) || 0
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Thermometer className="w-5 h-5 text-blue-600" />
        날씨 조건 입력
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> 날짜
          </label>
          <input
            type="date"
            name="date"
            value={input.date}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Thermometer className="w-4 h-4" /> 평균 기온 (°C)
          </label>
          <input
            type="number"
            name="avgTemp"
            value={input.avgTemp}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
             <Droplets className="w-4 h-4" /> 습도 (%)
          </label>
          <input
            type="number"
            name="humidity"
            value={input.humidity}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <CloudRain className="w-4 h-4" /> 강수량 (mm)
          </label>
          <input
            type="number"
            name="precipitation"
            value={input.precipitation}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Wind className="w-4 h-4" /> 풍속 (m/s)
          </label>
          <input
            type="number"
            name="windSpeed"
            value={input.windSpeed}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={onAnalyze}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl active:scale-95 transform duration-150"
        >
          위험도 분석
        </button>
      </div>
    </div>
  );
};
