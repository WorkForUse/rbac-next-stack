'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';

interface Lead {
  id: string;
  name: string;
  email: string;
  status: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axiosInstance.get('/api/leads');
        setLeads(response.data);
      } catch (error) {
        console.error('Failed to fetch leads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  if (loading) return <div className="p-8">Loading leads...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Leads</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">ID</th>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Email</th>
              <th className="px-4 py-2 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td className="px-4 py-2 border-b">{lead.id}</td>
                <td className="px-4 py-2 border-b">{lead.name}</td>
                <td className="px-4 py-2 border-b">{lead.email}</td>
                <td className="px-4 py-2 border-b">
                  <span className={`px-2 py-1 rounded text-xs ${lead.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {lead.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
