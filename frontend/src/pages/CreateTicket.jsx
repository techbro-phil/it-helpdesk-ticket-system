import React, { useState } from 'react';
import { createNewTicket } from '../services/api';
import toast from 'react-hot-toast';

const CreateTicket = () => {
  const [formData, setFormData] = useState({ subject: '', description: '', category: 'Hardware', priority: 'Low' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createNewTicket(formData);
      toast.success('Support ticket dispatched successfully!');
      setFormData({ subject: '', description: '', category: 'Hardware', priority: 'Low' });
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      toast.error(err.response?.data?.error || 'An error occurred while creating the ticket.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-md">
      <h2 className="text-2xl font-black text-slate-900 tracking-tight border-b border-slate-100 pb-5 mb-6">
        📝 Request Technical Support
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
            Issue Summary / Subject:
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="e.g. Accounting printer offline"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-800 placeholder-slate-400"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
            Detailed Problem Description:
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Provide details like error messages or troubleshooting steps already attempted..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-800 placeholder-slate-400 resize-none"
            required
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
              Category:
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-800 cursor-pointer"
            >
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="Network">Network</option>
              <option value="Account Access">Account Access</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
              Priority Tier:
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-800 cursor-pointer"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl font-bold text-sm text-white shadow-md transition-all active:scale-95 ${
            loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#2563EB] hover:bg-blue-700'
          }`}
        >
          {loading ? 'Dispatching...' : 'Dispatch Support Ticket'}
        </button>
      </form>
    </div>
  );
};

export default CreateTicket;