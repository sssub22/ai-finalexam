import React from 'react';
import { RiskAnalysis, RiskLevel } from '../types';
import { AlertTriangle, CheckCircle, AlertOctagon, Info } from 'lucide-react';

interface Props {
  risk: RiskAnalysis;
}

const getRiskColor = (level: RiskLevel) => {
  switch (level) {
    case 'Low': return 'bg-green-100 text-green-800 border-green-200';
    case 'Moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Very High': return 'bg-red-100 text-red-800 border-red-200';
  }
};

const getRiskLabel = (level: RiskLevel) => {
  switch (level) {
    case 'Low': return '낮음 (Low)';
    case 'Moderate': return '보통 (Moderate)';
    case 'High': return '높음 (High)';
    case 'Very High': return '매우 높음 (Very High)';
  }
};

const getRiskIcon = (level: RiskLevel) => {
  switch (level) {
    case 'Low': return <CheckCircle className="w-6 h-6 text-green-600" />;
    case 'Moderate': return <Info className="w-6 h-6 text-yellow-600" />;
    case 'High': return <AlertTriangle className="w-6 h-6 text-orange-600" />;
    case 'Very High': return <AlertOctagon className="w-6 h-6 text-red-600" />;
  }
};

export const RiskResult: React.FC<Props> = ({ risk }) => {
  const colorClass = getRiskColor(risk.level);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800">{risk.crimeType}</h3>
            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded mt-1 ${colorClass}`}>
              {getRiskLabel(risk.level)}
            </span>
          </div>
          {getRiskIcon(risk.level)}
        </div>
        
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-gray-600">
                점수: {risk.score}/100
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-100">
            <div
              style={{ width: `${risk.score}%` }}
              className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                risk.level === 'Very High' ? 'bg-red-500' : 
                risk.level === 'High' ? 'bg-orange-500' : 
                risk.level === 'Moderate' ? 'bg-yellow-500' : 'bg-green-500'
              }`}
            ></div>
          </div>
        </div>

        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
          <span className="font-semibold block mb-1">분석 결과:</span>
          {risk.reasoning}
        </p>
      </div>
    </div>
  );
};
