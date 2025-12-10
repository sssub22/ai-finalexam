import React, { useMemo, useState } from 'react';
import { MonthlyAggregatedData } from '../types';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, ScatterChart, Scatter, ZAxis, ReferenceLine
} from 'recharts';
import { analyzeCorrelations } from '../services/analysisEngine';

interface Props {
  data: MonthlyAggregatedData[];
}

const CRIME_COLORS = {
  theft: '#8884d8',   // Purple
  assault: '#82ca9d', // Green
  sexual: '#ff7300',  // Orange
  homicide: '#ef4444' // Red
};

const CRIME_LABELS = {
  theftCount: '절도',
  assaultCount: '폭행',
  sexualCount: '성범죄',
  homicideCount: '살인'
};

export const Dashboard: React.FC<Props> = ({ data }) => {
  const correlations = useMemo(() => analyzeCorrelations(data), [data]);
  const sortedData = useMemo(() => [...data].sort((a, b) => a.month.localeCompare(b.month)), [data]);

  // State for interactive charts
  const [scatterType, setScatterType] = useState<keyof typeof CRIME_LABELS>('assaultCount');

  return (
    <div className="space-y-8 pb-10">
      
      {/* 1. Correlation Heatmap Table */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">날씨 변수와 범죄 간 상관관계 분석 (전체)</h3>
        <p className="text-sm text-gray-500 mb-6">값이 1.0 또는 -1.0에 가까울수록 강한 상관관계를 의미합니다.</p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">날씨 요인</th>
                <th className="px-6 py-3 text-purple-700">절도</th>
                <th className="px-6 py-3 text-green-700">폭행</th>
                <th className="px-6 py-3 text-orange-700">성범죄</th>
                <th className="px-6 py-3 text-red-700">살인</th>
              </tr>
            </thead>
            <tbody>
              {correlations.map((row, idx) => (
                <tr key={idx} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{row.variable}</td>
                  <td className={`px-6 py-4 ${Math.abs(row.theft) > 0.5 ? 'font-bold' : ''}`}>{row.theft.toFixed(2)}</td>
                  <td className={`px-6 py-4 ${Math.abs(row.assault) > 0.5 ? 'font-bold' : ''}`}>{row.assault.toFixed(2)}</td>
                  <td className={`px-6 py-4 ${Math.abs(row.sexual) > 0.5 ? 'font-bold' : ''}`}>{row.sexual.toFixed(2)}</td>
                  <td className={`px-6 py-4 ${Math.abs(row.homicide) > 0.5 ? 'font-bold' : ''}`}>{row.homicide.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 2. Trends Over Time (All Crimes) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">월별 범죄 발생 추이 (전체)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sortedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tickFormatter={(v) => v.substring(2)} />
                <YAxis yAxisId="left" label={{ value: '천 단위 (절도/폭행)', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: '백 단위 (성범죄/살인)', angle: 90, position: 'insideRight' }} />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="theftCount" name="절도" stroke={CRIME_COLORS.theft} dot={false} strokeWidth={2} />
                <Line yAxisId="left" type="monotone" dataKey="assaultCount" name="폭행" stroke={CRIME_COLORS.assault} dot={false} strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="sexualCount" name="성범죄" stroke={CRIME_COLORS.sexual} dot={false} strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="homicideCount" name="살인" stroke={CRIME_COLORS.homicide} dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Temperature vs Crime (Scatter) - Interactive */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">기온과 범죄 발생 관계 (산점도)</h3>
            <select 
              value={scatterType}
              onChange={(e) => setScatterType(e.target.value as any)}
              className="text-sm border-gray-300 rounded-md shadow-sm border p-1"
            >
              {Object.entries(CRIME_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid />
                <XAxis type="number" dataKey="avgTemp" name="기온" unit="°C" />
                <YAxis type="number" dataKey={scatterType} name="발생건수" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter 
                  name={CRIME_LABELS[scatterType]} 
                  data={data} 
                  fill={
                    scatterType === 'theftCount' ? CRIME_COLORS.theft :
                    scatterType === 'assaultCount' ? CRIME_COLORS.assault :
                    scatterType === 'sexualCount' ? CRIME_COLORS.sexual : CRIME_COLORS.homicide
                  } 
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 5. Feature Importance Viz (Grouped Bar for All Crimes) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">날씨 변수 중요도 비교 (전체 범죄)</h3>
        <p className="text-sm text-gray-500 mb-4">각 날씨 변수가 범죄 유형별 미치는 상대적 영향력(상관계수)입니다.</p>
        <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={correlations}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[-1, 1]} />
              <YAxis dataKey="variable" type="category" width={80} />
              <Tooltip />
              <Legend />
              <Bar dataKey="theft" name="절도" fill={CRIME_COLORS.theft} />
              <Bar dataKey="assault" name="폭행" fill={CRIME_COLORS.assault} />
              <Bar dataKey="sexual" name="성범죄" fill={CRIME_COLORS.sexual} />
              <Bar dataKey="homicide" name="살인" fill={CRIME_COLORS.homicide} />
              <ReferenceLine x={0} stroke="#000" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
