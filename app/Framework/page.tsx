'use client';

import Link from 'next/link';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const frameworks = {
  'Cyber Essentials': [
    'firewall',
    'secureConfig',
    'accessControl',
    'antivirus',
    'patchManagement',
  ],
  'CIS Controls (v8)': [
    'assetInventory',
    'training',
    'dataBackup',
    'logging',
    'accessControl',
    'firewall',
    'patchManagement',
    'secureConfig',
    'thirdPartyRisk',
    'endpointDetection',
    'incidentPlan',
    'emailSecurity',
    'remoteAccess',
    'accountLockout',
    'antivirus',
    'secureConfig',
    'vulnerabilityMgmt',
    'auditLogs',
  ],
  'NIST CSF': [
    'assetInventory',
    'riskAssessment',
    'accessControl',
    'training',
    'logging',
    'incidentPlan',
    'dataBackup',
    'emailSecurity',
    'endpointDetection',
    'firewall',
  ],
};

const faqs = [
  {
    question: 'What is Cyber Essentials?',
    answer:
      'Cyber Essentials is a UK government-backed certification that helps you guard against the most common cyber threats and demonstrate your commitment to cybersecurity.',
  },
  {
    question: 'What are CIS Controls?',
    answer:
      'The Center for Internet Security (CIS) Controls are a prioritized set of best practices to help organizations improve their cybersecurity posture.',
  },
  {
    question: 'What is NIST CSF?',
    answer:
      'The NIST Cybersecurity Framework (CSF) provides guidance based on existing standards, guidelines, and practices for organizations to better manage and reduce cybersecurity risk.',
  },
  {
    question: 'How does CyberBalm use these frameworks?',
    answer:
      'CyberBalm maps SME risk assessment responses against these frameworks to evaluate security posture and offer tailored recommendations for improvement.',
  },
];

function FrameworkValidation({ answers }: { answers: Record<string, boolean> }) {
  if (!answers) return null;

  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold mb-4">Live Compliance Validation</h3>
      <table className="w-full border text-sm shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">Framework</th>
            <th className="border p-2 text-left">Controls Required</th>
            <th className="border p-2 text-left">Controls Met</th>
            <th className="border p-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(frameworks).map(([name, required]) => {
            const met = required.filter((key) => answers[key] === true).length;
            const status = met === required.length ? '✅ Pass' : met > 0 ? '⚠️ Partial' : '❌ Fail';
            return (
              <tr key={name}>
                <td className="border p-2">{name}</td>
                <td className="border p-2">{required.length}</td>
                <td className="border p-2">{met}</td>
                <td className="border p-2">{status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function FrameworksPage() {
  const [latestAnswers, setLatestAnswers] = useState<Record<string, boolean> | null>(null);
  const [search, setSearch] = useState('');
  const [frameworkFilter, setFrameworkFilter] = useState('All');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatest = async () => {
      const { data } = await supabase
        .from('assessments')
        .select('answers')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (data?.answers) setLatestAnswers(data.answers);
    };
    fetchLatest();
  }, []);

  function downloadPDF() {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('CyberBalm Security Frameworks', 14, 20);
    doc.setFontSize(12);

    let startY = 30;
    Object.entries(frameworks).forEach(([title, items]) => {
      doc.text(title, 14, startY);
      startY += 6;
      items.forEach((item) => {
        doc.text(`• ${item}`, 18, startY);
        startY += 6;
      });
      startY += 4;
    });

    doc.save('cyberbalm_frameworks.pdf');
  }

  function downloadCSV() {
    const csvData = Object.entries(frameworks).flatMap(([framework, controls]) =>
      controls.map((control) => ({ Framework: framework, Control: control }))
    );
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'cyberbalm_frameworks.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const filteredFrameworks = Object.entries(frameworks).filter(([frameworkName]) =>
    frameworkFilter === 'All' || frameworkName === frameworkFilter
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-900">
        Cybersecurity Frameworks Reference for SMEs
      </h1>

      <p className="text-sm text-gray-600 text-center mb-8 max-w-2xl mx-auto">
        This public resource hub outlines the core cybersecurity frameworks used to assess SME risk postures in CyberBalm: Cyber Essentials, CIS Controls, and NIST CSF. Downloadable control sets are provided to assist with awareness, training, and compliance.
      </p>

      <div className="flex justify-center gap-4 mb-6">
        <button onClick={downloadPDF} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Download PDF
        </button>
        <button onClick={downloadCSV} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Download CSV
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search controls..."
          className="border p-2 w-full md:w-1/2"
        />
        <select
          value={frameworkFilter}
          onChange={(e) => setFrameworkFilter(e.target.value)}
          className="border p-2"
        >
          <option value="All">All Frameworks</option>
          {Object.keys(frameworks).map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {filteredFrameworks.map(([title, items]) => (
          <div key={title} className="bg-white p-5 rounded shadow">
            <h2 className="text-xl font-semibold mb-3 text-indigo-700">{title}</h2>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
              {items.filter((item) => item.toLowerCase().includes(search.toLowerCase())).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {latestAnswers && <FrameworkValidation answers={latestAnswers} />}

      <div className="mt-12 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">📘 Cybersecurity Glossary & FAQ</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.question} className="border p-4 rounded shadow">
              <button
                onClick={() => setExpanded(expanded === faq.question ? null : faq.question)}
                className="font-semibold text-left w-full text-indigo-700 hover:underline"
              >
                {faq.question}
              </button>
              {expanded === faq.question && (
                <p className="text-sm mt-2 text-gray-800">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 text-center text-sm text-gray-500">
        📎 Official Sources:{' '}
        <a
          href="https://www.ncsc.gov.uk/cyberessentials/overview"
          className="text-blue-600 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Cyber Essentials
        </a>{' | '}
        <a
          href="https://www.cisecurity.org/controls/cis-controls-list"
          className="text-blue-600 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          CIS Controls
        </a>{' | '}
        <a
          href="https://www.nist.gov/cyberframework"
          className="text-blue-600 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          NIST CSF
        </a>
      </div>

      <div className="mt-6 text-center">
        <Link href="/dashboard">
          <span className="text-indigo-600 hover:underline">← Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
