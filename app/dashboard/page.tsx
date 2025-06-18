'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { complianceMap } from '../../utils/complianceMap';
import { recommendationsMap } from '../../utils/recommendationsMap';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import FrameworkModal from '@/components/FrameworkModal';

interface Assessment {
  id: string;
  user_id: string;
  industry: string;
  company_size: string;
  score: number;
  risk_level: string;
  answers: Record<string, boolean>;
  created_at: string;
}

const industryLabels: Record<string, string> = {
  finance: 'Financial Services',
  healthcare: 'Healthcare',
  retail: 'Retail & E-commerce',
  education: 'Education',
  manufacturing: 'Manufacturing',
  professional: 'Professional Services',
  transportation: 'Transportation & Logistics',
  other: 'Other',
};

export default function DashboardPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [filtered, setFiltered] = useState<Assessment[]>([]);
  const [latest, setLatest] = useState<Assessment | null>(null);
  const [industryFilter, setIndustryFilter] = useState('');
  const [scoreRange, setScoreRange] = useState<[number, number]>([0, 105]);
  const [showFrameworkModal, setShowFrameworkModal] = useState(false);

  useEffect(() => {
    const fetchAssessments = async () => {
      const { data, error } = await supabase.from('assessments').select('*').order('created_at', { ascending: false });
      if (data) {
        setAssessments(data);
        setFiltered(data);
        setLatest(data[0]);
      } else {
        console.error('Error fetching assessments:', error?.message);
      }
    };
    fetchAssessments();
  }, []);

  useEffect(() => {
    const filteredData = assessments.filter((a) => {
      const matchesIndustry = industryFilter ? a.industry === industryFilter : true;
      const withinRange = a.score >= scoreRange[0] && a.score <= scoreRange[1];
      return matchesIndustry && withinRange;
    });
    setFiltered(filteredData);
  }, [industryFilter, scoreRange, assessments]);

  const exportComplianceToPDF = () => {
    if (!latest?.answers) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('CyberBalm Compliance Mapping Report', 14, 20);
    doc.setFontSize(12);
    doc.text(`User ID: ${latest.user_id}`, 14, 30);
    doc.text(`Score: ${latest.score} | Risk Level: ${latest.risk_level}`, 14, 37);
    doc.text(`Submitted: ${new Date(latest.created_at).toLocaleString()}`, 14, 44);

    const tableData = Object.entries(latest.answers)
      .map(([key, value]) => {
        const item = complianceMap[key];
        if (!item) return null;
        return [
          item.label,
          value ? '✅' : '❌',
          item.cyberEssentials.join(', '),
          item.cis.join(', '),
          item.nist.join(', '),
        ];
      })
      .filter((row): row is string[] => row !== null); // ✅ Type-safe filtering

    autoTable(doc, {
      startY: 50,
      head: [['Control', 'Compliant', 'Cyber Essentials', 'CIS', 'NIST']],
      body: tableData,
      styles: { fontSize: 9 },
    });

    doc.save(`cyberbalm_compliance_${latest.user_id}.pdf`);
  };

  const exportComplianceToCSV = () => {
    if (!latest?.answers) return;

    const csvData = Object.entries(latest.answers).map(([key, value]) => {
      const item = complianceMap[key];
      return {
        Control: item?.label || key,
        Compliant: value ? 'Yes' : 'No',
        'Cyber Essentials': item?.cyberEssentials.join('; ') || '',
        'CIS Controls': item?.cis.join('; ') || '',
        'NIST CSF': item?.nist.join('; ') || '',
      };
    });

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `cyberbalm_compliance_${latest.user_id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Assessment Dashboard</h1>

      <div className="mb-4 flex justify-between">
        <button
          onClick={() => setShowFrameworkModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          View Framework Documentation
        </button>

        <button
          onClick={() => {
            const csv = Papa.unparse(
              filtered.map((a) => ({
                'User ID': a.user_id,
                Industry: industryLabels[a.industry] || a.industry || 'Unknown',
                'Company Size': a.company_size || 'N/A',
                Score: a.score,
                Risk: a.risk_level,
                Submitted: new Date(a.created_at).toLocaleString(),
              }))
            );
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'cyber-risk-assessments.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Export All Assessments (CSV)
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <label className="block mb-1 font-semibold">Filter by Industry</label>
          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="border p-2 w-full md:w-64"
          >
            <option value="">All Industries</option>
            {Object.entries(industryLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-96">
          <label className="block mb-1 font-semibold">
            Score Range: {scoreRange[0]}–{scoreRange[1]}
          </label>
          <input
            type="range"
            min="0"
            max="105"
            step="5"
            value={scoreRange[1]}
            onChange={(e) => setScoreRange([scoreRange[0], Number(e.target.value)])}
            className="w-full"
          />
        </div>
      </div>

      <table className="w-full border text-sm shadow-md mb-12">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">User ID</th>
            <th className="border p-2 text-left">Industry</th>
            <th className="border p-2 text-left">Company Size</th>
            <th className="border p-2 text-left">Score</th>
            <th className="border p-2 text-left">Risk</th>
            <th className="border p-2 text-left">Submitted</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((a) => (
            <tr key={a.id} className="hover:bg-gray-50">
              <td className="border p-2">{a.user_id}</td>
              <td className="border p-2">{industryLabels[a.industry] || a.industry || 'Unknown'}</td>
              <td className="border p-2">{a.company_size || 'N/A'}</td>
              <td className="border p-2">{a.score}</td>
              <td className="border p-2">{a.risk_level}</td>
              <td className="border p-2">{a.created_at ? new Date(a.created_at).toLocaleDateString() : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-2xl font-semibold mb-2">Compliance Mapping (Latest Assessment)</h2>

      <div className="mb-4 flex gap-2">
        <button onClick={exportComplianceToPDF} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Download PDF
        </button>
        <button onClick={exportComplianceToCSV} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
          Download CSV
        </button>
      </div>

      {latest?.answers ? (
        <>
          <table className="min-w-full border border-gray-300 text-sm shadow-md">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="p-2 border">Control</th>
                <th className="p-2 border">Compliant</th>
                <th className="p-2 border">Cyber Essentials</th>
                <th className="p-2 border">CIS Controls</th>
                <th className="p-2 border">NIST CSF</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(latest.answers).map(([key, value]) => {
                const item = complianceMap[key];
                if (!item) return null;
                return (
                  <tr key={key} className="border-t">
                    <td className="p-2 border">{item.label}</td>
                    <td className="p-2 border">{value ? '✅' : '❌'}</td>
                    <td className="p-2 border">{item.cyberEssentials.join(', ')}</td>
                    <td className="p-2 border">{item.cis.join(', ')}</td>
                    <td className="p-2 border">{item.nist.join(', ')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <h3 className="text-xl font-semibold mt-8 mb-2">Recommendations</h3>
          <div className="space-y-4">
            {Object.entries(latest.answers).map(([key, value]) => {
              if (value === true || !recommendationsMap[key]) return null;
              const rec = recommendationsMap[key];
              const frameworks = complianceMap[key];
              return (
                <div key={key} className="p-4 border rounded bg-red-50 shadow-sm">
                  <h4 className="font-bold text-red-800">{rec.label}</h4>
                  <p className="text-sm mt-1">{rec.recommendation}</p>
                  <p className="text-xs text-gray-600 mt-1 italic">
                    Relevant: CE: {frameworks.cyberEssentials.join(', ')} | CIS: {frameworks.cis.join(', ')} | NIST: {frameworks.nist.join(', ')}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <p className="text-gray-500">No recent assessment data available.</p>
      )}

      {showFrameworkModal && <FrameworkModal onClose={() => setShowFrameworkModal(false)} />}
    </div>
  );
}
