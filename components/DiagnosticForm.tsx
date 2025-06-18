'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const QUESTIONS = [
  { id: 1, text: 'Do you use a firewall?', weight: 15 },
  { id: 2, text: 'Are default passwords changed?', weight: 10 },
  { id: 3, text: 'Do you have antivirus/antimalware?', weight: 10 },
  { id: 4, text: 'Are software updates installed within 14 days?', weight: 10 },
  { id: 5, text: 'Are staff given only necessary access?', weight: 5 },
  { id: 6, text: 'Inventory of authorized devices/software?', weight: 10 },
  { id: 7, text: 'Secure configuration baselines applied?', weight: 10 },
  { id: 8, text: 'Is sensitive data encrypted?', weight: 15 },
  { id: 9, text: 'Are admin/user accounts separate?', weight: 5 },
  { id: 10, text: 'System and security event logs reviewed?', weight: 10 },
  { id: 11, text: 'Key business risks identified?', weight: 10 },
  { id: 12, text: 'Cybersecurity training for staff?', weight: 10 },
  { id: 13, text: 'Detection tools for abnormal activity?', weight: 10 },
  { id: 14, text: 'Incident response plan in place?', weight: 20 },
  { id: 15, text: 'Tested data recovery plan?', weight: 20 },
];

const RISK_MULTIPLIERS: { [key: string]: number } = {
  healthcare: 1.3,
  finance: 1.3,
  legal: 1.2,
  education: 1.1,
  retail: 1.0,
  other: 1.0,
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function DiagnosticForm() {
  const [answers, setAnswers] = useState<{ [id: number]: boolean }>({});
  const [sector, setSector] = useState('other');
  const [services, setServices] = useState('');
  const [size, setSize] = useState('small');
  const [score, setScore] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUserId(data.user.id);
      }
    });
  }, []);

  const handleChange = (id: number, value: boolean) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const multiplier = RISK_MULTIPLIERS[sector] || 1;
    const totalScore = QUESTIONS.reduce(
      (acc, q) => acc + (answers[q.id] ? q.weight : 0),
      0
    );
    const finalScore = Math.round(totalScore * multiplier);
    setScore(finalScore);

    if (userId) {
      const { error } = await supabase.from('assessments').insert({
        user_id: userId,
        score: finalScore,
        responses: answers,
        sector,
        services,
        size,
      });

      if (error) console.error('Failed to save assessment:', error.message);
      else console.log('✅ Saved!');
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Cyber Risk Report', 14, 20);
    doc.setFontSize(12);
    doc.text(`User ID: ${userId}`, 14, 30);
    doc.text(`Sector: ${sector}`, 14, 36);
    doc.text(`Score: ${score}`, 14, 42);
    doc.text(`Date: ${new Date().toLocaleString()}`, 14, 48);

    const tableData = QUESTIONS.map(q => [
      q.text,
      answers[q.id] ? '✅' : '❌',
      q.weight,
    ]);

    autoTable(doc, {
      startY: 55,
      head: [['Question', 'Answer', 'Weight']],
      body: tableData,
      styles: { fontSize: 9 },
    });

    doc.save(`cyber_risk_report_${userId}.pdf`);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 shadow rounded">
      <h2 className="text-xl font-bold mb-4 text-center">Cyber Risk Diagnostic</h2>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Sector</label>
        <select value={sector} onChange={e => setSector(e.target.value)} className="w-full border p-2">
          <option value="healthcare">Healthcare</option>
          <option value="finance">Finance</option>
          <option value="legal">Legal</option>
          <option value="education">Education</option>
          <option value="retail">Retail</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Company Size</label>
        <select value={size} onChange={e => setSize(e.target.value)} className="w-full border p-2">
          <option value="small">Small (1-10)</option>
          <option value="medium">Medium (11-50)</option>
          <option value="large">Large (51+)</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Services Offered</label>
        <textarea value={services} onChange={e => setServices(e.target.value)} className="w-full border p-2" />
      </div>

      {QUESTIONS.map(q => (
        <div key={q.id} className="mb-3">
          <label className="block font-medium">{q.text}</label>
          <select
            className="w-full border p-2"
            value={answers[q.id] === undefined ? '' : answers[q.id] ? 'yes' : 'no'}
            onChange={e => handleChange(q.id, e.target.value === 'yes')}
          >
            <option value="">Select answer</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      ))}

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded mt-4 hover:bg-blue-700">
        Submit Assessment
      </button>

      {score !== null && (
        <div className="mt-6 text-center">
          <p className="text-lg font-bold">Risk Score: {score} / 200</p>
          <p className="text-sm text-gray-600">
            {score >= 160 ? '✅ Low Risk' : score >= 120 ? '⚠️ Moderate Risk' : '❌ High Risk'}
          </p>
          <button onClick={generatePDF} type="button" className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Download PDF Report
          </button>
        </div>
      )}
    </form>
  );
}
