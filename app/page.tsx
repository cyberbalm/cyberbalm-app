// app/page.tsx
'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-8">
      <h1 className="text-4xl font-bold text-blue-800 mb-4">Welcome to CyberBalm</h1>
      <p className="text-center max-w-xl text-gray-700 mb-6">
        Your intelligent cybersecurity diagnostic platform for SMEs. Diagnose cyber risk, get tailored recommendations, and stay compliant with major frameworks like Cyber Essentials, NIST, and CIS Controls.
      </p>

      <div className="flex gap-4">
        <Link href="/cyber-diagnostic">
          <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
            Start Risk Assessment
          </button>
        </Link>
        <Link href="/dashboard">
          <button className="bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-900 transition">
            View Dashboard
          </button>
        </Link>
      </div>
    </main>
  );
}
