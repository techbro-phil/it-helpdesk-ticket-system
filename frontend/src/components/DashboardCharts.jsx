import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line
} from 'recharts';

const DashboardCharts = ({ tickets }) => {

  // --- Data Builders ---

  // Tickets by Status
  const statusData = [
    { name: 'Open', value: tickets.filter(t => t.status === 'Open').length },
    { name: 'In Progress', value: tickets.filter(t => t.status === 'In Progress').length },
    { name: 'Resolved', value: tickets.filter(t => t.status === 'Resolved').length },
  ].filter(d => d.value > 0);

  const STATUS_COLORS = ['#2563EB', '#f59e0b', '#22c55e'];

  // Tickets by Category
  const categories = ['Hardware', 'Software', 'Network', 'Account Access', 'Other'];
  const categoryData = categories.map(cat => ({
    name: cat,
    tickets: tickets.filter(t => t.category === cat).length
  })).filter(d => d.tickets > 0);

  // Tickets by Priority
  const priorities = ['Low', 'Medium', 'High', 'Critical'];
  const priorityData = priorities.map(p => ({
    name: p,
    tickets: tickets.filter(t => t.priority === p).length
  })).filter(d => d.tickets > 0);

  const PRIORITY_COLORS = {
    Low: '#22c55e',
    Medium: '#2563EB',
    High: '#f59e0b',
    Critical: '#ef4444'
  };

  if (tickets.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

      {/* PIE CHART — Tickets by Status */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">
          Tickets by Status
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={index} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px' }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '12px', fontWeight: '600' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* BAR CHART — Tickets by Category */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">
          Tickets by Category
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={categoryData} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px' }}
              cursor={{ fill: '#f8fafc' }}
            />
            <Bar dataKey="tickets" fill="#2563EB" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* BAR CHART — Tickets by Priority */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">
          Tickets by Priority
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={priorityData} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px' }}
              cursor={{ fill: '#f8fafc' }}
            />
            <Bar dataKey="tickets" radius={[6, 6, 0, 0]}>
              {priorityData.map((entry, index) => (
                <Cell key={index} fill={PRIORITY_COLORS[entry.name]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default DashboardCharts;