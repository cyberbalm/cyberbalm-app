'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const topicData = {
  'what-is-a-firewall': {
    title: 'What is a Firewall?',
    videoUrl: 'https://www.youtube.com/embed/8VnAmU6jJPo',
    content:
      'A firewall monitors and filters incoming and outgoing traffic on your network based on predetermined security rules.',
    quiz: [
      {
        question: 'What does a firewall primarily do?',
        options: [
          'Encrypts data',
          'Manages passwords',
          'Filters network traffic',
          'Backs up files',
        ],
        answer: 'Filters network traffic',
      },
    ],
  },
  // Add more topics as needed...
};

export default function LearnTopicPage() {
  const { slug } = useParams();
  const topic = topicData[slug as keyof typeof topicData];
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    setSelectedAnswers(Array(topic?.quiz?.length || 0).fill(''));
  }, [topic]);

  const handleSubmit = async () => {
    let calculatedScore = 0;
    topic.quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);
    setSubmitted(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && user.id) {
      await supabase.from('quiz_results').insert([
        {
          user_id: user.id,
          topic_slug: slug,
          score: calculatedScore,
          total: topic.quiz.length,
        },
      ]);
    }
  };

  if (!topic) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Topic not found.</p>
        <Link href="/learn" className="text-indigo-600 hover:underline block mt-4">
          ← Back to Learn
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">{topic.title}</h1>

      <div className="aspect-video mb-6">
        <iframe
          className="w-full h-full rounded"
          src={topic.videoUrl}
          title={topic.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      <p className="mb-6 text-gray-700 text-sm">{topic.content}</p>

      <h2 className="text-xl font-semibold mb-4">Quiz</h2>
      {topic.quiz.map((q, idx) => (
        <div key={idx} className="mb-6">
          <p className="font-medium mb-2">{q.question}</p>
          <div className="space-y-1">
            {q.options.map((opt) => (
              <label key={opt} className="block">
                <input
                  type="radio"
                  name={`question-${idx}`}
                  value={opt}
                  checked={selectedAnswers[idx] === opt}
                  onChange={() => {
                    const updated = [...selectedAnswers];
                    updated[idx] = opt;
                    setSelectedAnswers(updated);
                  }}
                  className="mr-2"
                />
                {opt}
              </label>
            ))}
          </div>
          {submitted && (
            <p
              className={`mt-2 text-sm font-semibold ${
                selectedAnswers[idx] === q.answer ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {selectedAnswers[idx] === q.answer ? 'Correct!' : `Incorrect. Correct answer: ${q.answer}`}
            </p>
          )}
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Submit Quiz
        </button>
      ) : (
        <p className="text-green-700 mt-4 font-medium">
          Quiz submitted. You scored {score}/{topic.quiz.length}. Results saved.
        </p>
      )}

      <div className="mt-10 text-center">
        <Link href="/learn" className="text-indigo-600 hover:underline">
          ← Back to Learning Hub
        </Link>
      </div>
    </div>
  );
}
