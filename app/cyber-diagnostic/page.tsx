'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js';

const QUESTIONS = [
  // Cyber Essentials
  { id: 1, text: 'Do you use a firewall?', category: 'Cyber Essentials', weight: 15 },
  { id: 2, text: 'Are default passwords changed?', category: 'Cyber Essentials', weight: 10 },
  { id: 3, text: 'Do you have antivirus/antimalware?', category: 'Cyber Essentials', weight: 10 },
  { id: 4, text: 'Are software updates installed within 14 days?', category: 'Cyber Essentials', weight: 10 },
  { id: 5, text: 'Are staff given only necessary access?', category: 'Cyber Essentials', weight: 5 },
  // CIS Controls
  { id: 6, text: 'Inventory of authorized devices/software?', category: 'CIS Controls', weight: 10 },
  { id: 7, text: 'Secure configuration baselines applied?', category: 'CIS Controls', weight: 10 },
  { id: 8, text: 'Is sensitive data encrypted?', category: 'CIS Controls', weight: 15 },
  { id: 9, text: 'Are admin/user accounts separate?', category: 'CIS Controls', weight: 5 },
  { id: 10, text: 'System and security event logs reviewed?', category: 'CIS Controls', weight: 10 },
  // NIST CSF
  { id: 11, text: 'Key business risks identified?', category: 'NIST CSF', weight: 10 },
  { id: 12, text: 'Cybersecurity training for staff?', category: 'NIST CSF', weight: 10 },
  { id: 13, text: 'Detection tools for abnormal activity?', category: 'NIST CSF', weight: 10 },
  { id: 14, text: 'Incident response plan in place?', category: 'NIST CSF', weight: 20 },
  { id: 15, text: 'Tested data recovery plan?', category: 'NIST CSF', weight: 20 }
];

const RISK_MULTIPLIERS: { [sector: string]: number } = {
  healthcare: 1.3,
  finance: 1.3,
  legal: 1.2,
  education: 1.1,
  retail: 1.0,
  other: 1.0,
};

export default function DiagnosticForm() {
  const [answers, setAnswers] = useState<{ [id: number]: boolean }>({});
  const [score, setScore] = useState<number | null>(null);
  const [sector, setSector] = useState<string>('other');
  const [services, setServices] = useState<string>('');
  const [size, setSize] = useState<string>('small');
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (url && key) {
      const client = createBrowserClient(url, key);
      setSupabase(client);
      client.auth.getUser().then(({ data }) => {
        if (data?.user?.id) setUserId(data.user.id);
      });
    }
  }, []);

  const handleChange = (id: number, value: boolean) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const multiplier = RISK_MULTIPLIERS[sector] || 1;
    let total = 0;

    for (const q of QUESTIONS) {
      if (answers[q.id]) total += q.weight;
    }

    const finalScore = Math.round(total * multiplier);
    setScore(finalScore);

    if (supabase && userId) {
      const { error } = await supabase.from('assessments').insert({
        user_id: userId,
        score: finalScore,
        responses: answers,
        sector,
        services,
        size,
      });

      if (error) console.error('Failed to save assessment:', error.message);
      else console.log('✅ Assessment saved!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 shadow-md rounded">
      <h2 className="text-2xl font-bold mb-6 text-center">Cyber Risk Diagnostic</h2>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Business Sector</label>
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
        <label className="block font-semibold mb-1">Business Size</label>
        <select value={size} onChange={e => setSize(e.target.value)} className="w-full border p-2">
          <option value="small">Small (1–10)</option>
          <option value="medium">Medium (11–50)</option>
          <option value="large">Large (51+)</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Services Offered</label>
        <textarea value={services} onChange={e => setServices(e.target.value)} className="w-full border p-2" />
      </div>

      {QUESTIONS.map(q => (
        <div key={q.id} className="mb-4">
          <label className="block font-semibold mb-1">{q.text}</label>
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

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
      >
        Submit
      </button>

      {score !== null && (
        <div className="mt-6 text-center">
          <p className="text-xl font-semibold">Risk Score: {score} / 200</p>
          <p className="text-gray-600">
            {score >= 160 ? 'Low Risk' : score >= 120 ? 'Moderate Risk' : 'High Risk'}
          </p>
        </div>
      )}
    </form>
  );
}
