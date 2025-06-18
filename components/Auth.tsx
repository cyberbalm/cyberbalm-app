'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (url && key) {
      const client = createBrowserClient(url, key);
      setSupabase(client);

      client.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          saveUserToDatabase(client, user);
        }
      });

      client.auth.onAuthStateChange((_event, session) => {
        const user = session?.user;
        if (user) {
          saveUserToDatabase(client, user);
        }
      });
    } else {
      console.error('Supabase env variables are missing!');
    }
  }, []);

  const saveUserToDatabase = async (client: SupabaseClient, user: any) => {
    const { id, email } = user;

    const { error } = await client.from('users').upsert({ id, email });

    if (error) {
      console.error('Error saving user:', error.message);
    } else {
      console.log('✅ User saved to Supabase');
    }
  };

  const handleLogin = async () => {
    if (!supabase || !email) return;

    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      alert('Login error: ' + error.message);
    } else {
      alert('✅ Check your email for the login link!');
    }

    setIsLoading(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">Login to CyberBalm</h2>

      <input
        className="border p-2 w-full mb-4"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {supabase ? (
        <button
          className="bg-blue-600 text-white px-4 py-2 w-full rounded hover:bg-blue-700 transition"
          onClick={handleLogin}
          disabled={isLoading || !email}
        >
          {isLoading ? 'Sending...' : 'Send Login Link'}
        </button>
      ) : (
        <div className="text-center text-gray-500">Loading login system...</div>
      )}
    </div>
  );
}
