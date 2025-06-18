'use client';
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-4">Welcome to Cyber Balm</h1>
      <p className="mb-6 text-lg">Diagnose your cyber risks and get tailored compliance help for your SME.</p>
      <a
        href="/dashboard"
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded"
      >
        Go to Dashboard
      </a>
    </main>
  );
}
