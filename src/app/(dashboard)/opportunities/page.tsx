'use client';
import { TrendingUp, Target, DollarSign, Calendar, Users, ArrowRight, CheckCircle2, AlertCircle, Filter, Search, MoreVertical } from 'lucide-react';

interface Opportunity {
  id: string;
  name: string;
  client: string;
  amount: number;
  stage: 'negotiation' | 'proposal' | 'closing' | 'won' | 'lost';
  probability: number;
  dueDate: string;
  owner: string;
  lastActivity: string;
}

const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    name: 'Enterprise Software License Renewal',
    client: 'Acme Corporation',
    amount: 250000,
    stage: 'closing',
    probability: 85,
    dueDate: '2026-04-15',
    owner: 'John Smith',
    lastActivity: '2 days ago'
  },
  {
    id: '2',
    name: 'Digital Transformation Initiative',
    client: 'Global Tech Inc',
    amount: 1500000,
    stage: 'proposal',
    probability: 60,
    dueDate: '2026-05-20',
    owner: 'Sarah Johnson',
    lastActivity: '1 day ago'
  },
  {
    id: '3',
    name: 'Cloud Migration Project',
    client: 'Innovation Labs',
    amount: 450000,
    stage: 'negotiation',
    probability: 45,
    dueDate: '2026-06-10',
    owner: 'Michael Chen',
    lastActivity: '3 days ago'
  },
  {
    id: '4',
    name: 'Cybersecurity Assessment & Implementation',
    client: 'Financial Services Ltd',
    amount: 320000,
    stage: 'proposal',
    probability: 70,
    dueDate: '2026-04-30',
    owner: 'Emma Davis',
    lastActivity: 'Today'
  },
  {
    id: '5',
    name: 'Data Analytics Platform Setup',
    client: 'RetailCorp International',
    amount: 600000,
    stage: 'negotiation',
    probability: 55,
    dueDate: '2026-07-15',
    owner: 'John Smith',
    lastActivity: '5 days ago'
  },
  {
    id: '6',
    name: 'AI Implementation Program',
    client: 'Manufacturing Hub',
    amount: 2100000,
    stage: 'negotiation',
    probability: 40,
    dueDate: '2026-08-01',
    owner: 'Sarah Johnson',
    lastActivity: '1 week ago'
  }
];

const stageColors: Record<string, { bg: string; text: string; icon: string }> = {
  negotiation: { bg: 'bg-blue-50', text: 'text-blue-700', icon: '💬' },
  proposal: { bg: 'bg-purple-50', text: 'text-purple-700', icon: '📄' },
  closing: { bg: 'bg-orange-50', text: 'text-orange-700', icon: '🤝' },
  won: { bg: 'bg-green-50', text: 'text-green-700', icon: '🎉' },
  lost: { bg: 'bg-red-50', text: 'text-red-700', icon: '❌' }
};

export default function OpportunitiesPage() {
  const totalOpportunities = mockOpportunities.length;
  const totalValue = mockOpportunities.reduce((sum, opp) => sum + opp.amount, 0);
  const weightedValue = mockOpportunities.reduce((sum, opp) => sum + (opp.amount * opp.probability / 100), 0);
  const highProbability = mockOpportunities.filter(opp => opp.probability >= 70).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Opportunities</h1>
          <p className="text-gray-600 mt-1">Track and manage your sales pipeline</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Pipeline Value */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Pipeline</h3>
            <div className="p-3 bg-blue-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">${(totalValue / 1000000).toFixed(1)}M</p>
          <p className="text-xs text-gray-500 mt-2">across {totalOpportunities} opportunities</p>
        </div>

        {/* Weighted Pipeline */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Expected Revenue</h3>
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">${(weightedValue / 1000000).toFixed(2)}M</p>
          <p className="text-xs text-gray-500 mt-2">based on probability</p>
        </div>

        {/* High Probability Deals */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Hot Deals</h3>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Target className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{highProbability}</p>
          <p className="text-xs text-gray-500 mt-2">≥70% probability to close</p>
        </div>

        {/* Avg Deal Size */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Avg. Deal Size</h3>
            <div className="p-3 bg-purple-50 rounded-lg">
              <MoreVertical className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">${(totalValue / totalOpportunities / 1000).toFixed(0)}K</p>
          <p className="text-xs text-gray-500 mt-2">per opportunity</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
        <div className="flex-1 flex gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search opportunities..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Opportunities Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Opportunity</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stage</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Probability</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Owner</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockOpportunities.map((opportunity) => {
                const stage = stageColors[opportunity.stage];
                return (
                  <tr key={opportunity.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{opportunity.name}</p>
                        <p className="text-xs text-gray-500">{opportunity.lastActivity}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{opportunity.client}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-semibold text-gray-900">${(opportunity.amount / 1000).toFixed(0)}K</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${stage.bg} ${stage.text}`}>
                        {stage.icon} {opportunity.stage.charAt(0).toUpperCase() + opportunity.stage.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              opportunity.probability >= 70 ? 'bg-green-500' :
                              opportunity.probability >= 50 ? 'bg-yellow-500' :
                              'bg-orange-500'
                            }`}
                            style={{ width: `${opportunity.probability}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-700">{opportunity.probability}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{opportunity.owner}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(opportunity.dueDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-600 hover:text-gray-900">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pipeline by Stage - Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {Object.entries(stageColors).map(([stage, color]) => {
          const stageOpps = mockOpportunities.filter(opp => opp.stage === stage);
          const stageValue = stageOpps.reduce((sum, opp) => sum + opp.amount, 0);
          return (
            <div key={stage} className={`rounded-2xl p-4 ${color.bg} border border-current border-opacity-10`}>
              <p className={`text-xs font-semibold uppercase ${color.text} mb-2`}>
                {stage === 'negotiation' ? '💬' : stage === 'proposal' ? '📄' : stage === 'closing' ? '🤝' : stage === 'won' ? '🎉' : '❌'} {stage}
              </p>
              <p className={`text-2xl font-bold ${color.text}`}>{stageOpps.length}</p>
              <p className={`text-xs ${color.text} opacity-75 mt-1`}>${(stageValue / 1000000).toFixed(1)}M</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
