'use client';

import { useState } from 'react';

// Step 1: Define the tab labels as a union type
type FrameworkType = 'Cyber Essentials' | 'CIS Controls (v8)' | 'NIST CSF';

// Step 2: Add types to the frameworks object
const frameworks: Record<FrameworkType, string[]> = {
  'Cyber Essentials': [
    'Boundary Firewalls and Internet Gateways',
    'Secure Configuration',
    'User Access Control',
    'Malware Protection',
    'Security Update Management',
  ],
  'CIS Controls (v8)': [
    '1. Inventory and Control of Assets',
    '2. Security Awareness and Training',
    '3. Data Protection',
    '4. Secure Configuration of Enterprise Assets',
    '5. Account Management',
    '6. Access Control Management',
    '7. Continuous Vulnerability Management',
    '8. Audit Log Management',
    '9. Email and Web Browser Protections',
    '10. Malware Defenses',
    '11. Data Recovery',
    '12. Network Infrastructure Management',
    '13. Security Testing',
    '14. Security Operations',
    '15. Incident Response',
    '16. Application Software Security',
    '17. Penetration Testing',
    '18. Service Provider Management',
  ],
  'NIST CSF': [
    'Identify: Asset Management, Business Environment, Risk Assessment',
    'Protect: Access Control, Awareness and Training, Data Security',
    'Detect: Anomalies and Events, Continuous Monitoring',
    'Respond: Response Planning, Mitigation',
    'Recover: Recovery Planning, Improvements, Communications',
  ],
};

export default function FrameworkModal({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<FrameworkType>('Cyber Essentials'); // ⬅ explicitly typed

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white max-w-3xl w-full rounded-lg shadow-lg p-6 overflow-auto max-h-[90vh]">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Framework Documentation</h2>
          <button onClick={onClose} className="text-red-500 font-semibold">Close</button>
        </div>

        <div className="flex gap-2 mb-4">
          {(Object.keys(frameworks) as FrameworkType[]).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-3 py-1 rounded ${
                key === activeTab ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              {key}
            </button>
          ))}
        </div>

        <ul className="list-disc pl-6 space-y-1 text-sm text-gray-800">
          {frameworks[activeTab].map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>

        <div className="mt-6 text-sm text-gray-500">
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
      </div>
    </div>
  );
}
