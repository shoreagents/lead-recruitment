'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function ResumeDebugPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching resume for slug:', slug);
        const response = await fetch(`/api/get-saved-resume/${slug}`);
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.log('Error data:', errorData);
          throw new Error(errorData.error || 'Failed to load resume');
        }
        
        const result = await response.json();
        console.log('API Result:', result);
        setData(result);
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2 text-red-400">Error</h1>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Resume Debug Page</h1>
      
      <div className="bg-gray-900 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">API Response:</h2>
        <pre className="text-sm text-gray-300 overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
      
      {data?.resume?.data && (
        <div className="bg-gray-900 p-6 rounded-lg mt-6">
          <h2 className="text-xl font-bold mb-4">Resume Data:</h2>
          <pre className="text-sm text-gray-300 overflow-auto">
            {JSON.stringify(data.resume.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
