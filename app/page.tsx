'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center bg-gray-50 text-gray-800 px-4 py-10">
      <Image
        src="/cyberbalm-logo.png" // Ensure this file is in /public
        alt="CyberBalm Logo"
        width={100}
        height={100}
        className="mb-4"
      />
      <h1 className="text-4xl font-extrabold text-indigo-800 mb-3">Welcome to CyberBalm</h1>
      <p className="text-lg max-w-xl mb-6">
        Your intelligent cybersecurity diagnostic platform for SMEs. Diagnose cyber risk, get tailored recommendations,
        and stay compliant with Cyber Essentials, NIST, and CIS Controls.
      </p>

      <div className="flex gap-4">
        <Link href="/cyber-diagnostic">
          <a className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded shadow-md transition">
            Start Risk Assessment
          </a>
        </Link>
        <Link href="/dashboard">
          <a className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded shadow-md transition">
            View Dashboard
          </a>
        </Link>
      </div>

      <footer className="mt-12 text-sm text-gray-500">
        © {new Date().getFullYear()} CyberBalm. All rights reserved.
      </footer>
    </main>
  );
}
