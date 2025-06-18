'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseBrowserClient';

export default function LearnPage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAsk = async () => {
    setIsLoading(true);
    setAnswer('');

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Unknown error occurred');
      }

      setAnswer(data.answer || 'No answer returned.');
    } catch (err: any) {
      console.error('❌ Error:', err.message || err);
      setAnswer(`Assistant: ❌ ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-center text-indigo-800">
        CyberBalm Learning Hub
      </h1>

      <p className="text-sm text-gray-600 mb-8 text-center">
        Type a cybersecurity question below and get instant answers from the CyberBalm Assistant.
      </p>

      <div className="mb-6">
        <textarea
          rows={3}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask me something like 'What is phishing?'"
          className="w-full border p-3 rounded text-sm"
        />
        <button
          onClick={handleAsk}
          disabled={isLoading || !question.trim()}
          className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {isLoading ? 'Thinking...' : 'Ask CyberBalm Assistant'}
        </button>
      </div>

      {answer && (
        <div className="bg-gray-100 p-4 rounded shadow-sm text-sm text-gray-800 whitespace-pre-wrap">
          <strong>Assistant:</strong> {answer}
        </div>
      )}

      <div className="mt-10 text-center text-sm text-gray-500">
        <Link href="/frameworks" className="text-indigo-600 hover:underline">
          ← Back to Frameworks
        </Link>
      </div>
    </div>
  );
}
