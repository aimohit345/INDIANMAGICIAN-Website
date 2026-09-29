import React, { useState } from 'react';
import { useSiteData } from '../../../context/SiteDataContext';
import { markInquiryAsRead, deleteInquiry } from '../../../utils/api';
import { Mail, Trash2, CheckCircle2, Clock, User, Reply, Inbox } from 'lucide-react';

export default function InquiriesTab() {
  const { data, refreshData } = useSiteData();
  const inquiries = data?.inquiries || [];
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const handleMarkRead = async (id) => {
    try {
      await markInquiryAsRead(id);
      await refreshData();
      if (selectedInquiry?.id === id) {
        setSelectedInquiry((prev) => ({ ...prev, read: true }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inquiry message?')) return;
    try {
      await deleteInquiry(id);
      await refreshData();
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = inquiries.filter((i) => !i.read).length;

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-serif text-white font-medium">
            Contact Inquiries Inbox ({inquiries.length})
          </h2>
          <p className="text-xs text-white/50 font-sans mt-1">
            Real-time messages submitted by visitors and event planners via the /contact form.
          </p>
        </div>
        {unreadCount > 0 && (
          <span className="px-3.5 py-1.5 rounded-full bg-[#FFD700] text-[#050807] font-sans font-bold text-xs uppercase tracking-wider">
            {unreadCount} Unread
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Message List */}
        <div className="lg:col-span-5 space-y-3">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              onClick={() => {
                setSelectedInquiry(inq);
                if (!inq.read) handleMarkRead(inq.id);
              }}
              className={`p-4 rounded-xl cursor-pointer border transition-all ${
                selectedInquiry?.id === inq.id
                  ? 'bg-[#0e271e] border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.15)]'
                  : inq.read
                  ? 'bg-[#091712] border-white/5 opacity-75 hover:opacity-100 hover:border-white/20'
                  : 'bg-[#0b1f18] border-[#00e599]/40 hover:border-[#00e599]'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  {!inq.read && (
                    <span className="w-2 h-2 rounded-full bg-[#00e599] shadow-[0_0_6px_#00e599]" />
                  )}
                  {inq.name}
                </span>
                <span className="text-[11px] text-white/40 font-mono">
                  {new Date(inq.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <h4 className="text-xs font-serif text-[#FFD700] line-clamp-1 mb-1">{inq.subject}</h4>
              <p className="text-xs text-white/60 line-clamp-2 font-sans">{inq.message}</p>
            </div>
          ))}

          {inquiries.length === 0 && (
            <div className="p-12 text-center text-white/40 rounded-2xl glass-panel border border-white/10">
              <Inbox className="w-10 h-10 mx-auto text-white/20 mb-3" />
              <p className="text-sm">No contact inquiries yet.</p>
            </div>
          )}
        </div>

        {/* Message Detail View */}
        <div className="lg:col-span-7">
          {selectedInquiry ? (
            <div className="glass-panel rounded-2xl p-6 md:p-8 border border-white/15 shadow-xl flex flex-col justify-between min-h-[420px]">
              <div>
                <div className="flex items-start justify-between gap-4 pb-6 border-b border-white/10">
                  <div>
                    <span className="text-[11px] font-sans uppercase tracking-widest text-[#FFD700] font-semibold block mb-1">
                      Inquiry Details
                    </span>
                    <h3 className="text-2xl font-serif text-white font-medium">
                      {selectedInquiry.subject}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleDelete(selectedInquiry.id)}
                    className="p-2 rounded-lg bg-red-950/30 text-red-400 hover:text-red-300 transition-colors"
                    title="Delete Message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 text-xs font-sans border-b border-white/5">
                  <div>
                    <span className="text-white/40 block mb-0.5">Sender</span>
                    <span className="text-white font-medium text-sm">{selectedInquiry.name}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block mb-0.5">Email Address</span>
                    <a
                      href={`mailto:${selectedInquiry.email}`}
                      className="text-[#FFD700] hover:underline"
                    >
                      {selectedInquiry.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-white/40 block mb-0.5">Received Date</span>
                    <span className="text-white/70">
                      {new Date(selectedInquiry.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/40 block mb-0.5">Status</span>
                    <span className="text-[#00e599]">Verified Database Record</span>
                  </div>
                </div>

                <div className="py-6">
                  <span className="text-xs uppercase tracking-wider text-white/40 font-sans block mb-3">
                    Message Body
                  </span>
                  <div className="p-4 rounded-xl bg-[#050807] border border-white/5 text-sm text-white/90 font-sans leading-relaxed whitespace-pre-wrap">
                    {selectedInquiry.message || 'No additional message text provided.'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=${encodeURIComponent(
                    'Re: ' + selectedInquiry.subject
                  )}`}
                  className="px-6 py-2.5 rounded-xl bg-[#FFD700] text-[#050807] font-bold text-xs uppercase tracking-wider hover:bg-[#ffe566] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Reply className="w-4 h-4" />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-12 border border-white/10 text-center flex flex-col items-center justify-center min-h-[420px] text-white/40">
              <Mail className="w-12 h-12 text-white/20 mb-3" />
              <p className="text-sm">Select an inquiry from the inbox to read its full contents.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
