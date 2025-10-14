'use client';

import { useParams } from 'next/navigation';

export default function LeadDetailsPage() {
  const params = useParams();
  const leadId = params.id;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lead Details</h1>
      <p>Lead ID: {leadId}</p>
      <p>This page is under construction.</p>
    </div>
  );
}