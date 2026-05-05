import React, { useState, useEffect, useRef, useCallback } from 'react';

const { useState, useEffect, useRef, useCallback, useMemo } = React;

const meetings = [
  {
    id: 1,
    title: "Q3 Product Roadmap Review",
    date: "2024-07-15",
    time: "10:00 AM",
    duration: "52 min",
    attendees: ["Sarah K.", "James T.", "Priya M.", "Alex R."],
    status: "processed",
    summary: "Discussed prioritization of AI features for Q3. Decided to push analytics dashboard to Q4. Team aligned on shipping mobile app by end of August.",
    actions: [
      { id: 101, text: "Finalize mobile app spec doc", owner: "Priya M.", due: "Jul 19", priority: "high", done: false },
      { id: 102, text: "Move analytics dashboard to Q4 backlog", owner: "James T.", due: "Jul 17", priority: "medium", done: false },
      { id: 103, text: "Share updated roadmap with stakeholders", owner: "Sarah K.", due: "Jul 18", priority: "high", done: true },
    ],
    tags: ["Product", "Roadmap"],
  },
  {
    id: 2,
    title: "Investor Update Call — Series A",
    date: "2024-07-14",
    time: "2:00 PM",
    duration: "38 min",
    attendees: ["Sarah K.", "Marcus D.", "Lena V."],
    status: "processed",
    summary: "Presented July metrics. ARR at $1.2M. Investors bullish on enterprise expansion. Follow-up deck requested with customer case studies.",
    actions: [
      { id: 201, text: "Prepare 3 customer case studies for deck", owner: "Sarah K.", due: "Jul 22", priority: "high", done: false },
      { id: 202, text: "Send updated financial model to Marcus", owner: "Sarah K.", due: "Jul 16", priority: "high", done: true },
      { id: 203, text: "Schedule follow-up call for Aug 5", owner: "Lena V.", due: "Jul 15", priority: "medium", done: true },
    ],
    tags: ["Investors", "Finance"],
  },
  {
    id: 3,
    title: "Engineering Sprint Planning — Sprint 24",
    date: "2024-07-12",
    time: "9:30 AM",
    duration: "45 min",
    attendees: ["James T.", "Priya M.", "Dev P.", "Mei L."],
    status: "processed",
    summary: "Committed to 18 story points. Auth refactor is top priority. Bug backlog reviewed — 4 critical issues assigned.",
    actions: [
      { id: 301, text: "Complete auth refactor PR", owner: "Dev P.", due: "Jul 19", priority: "high", done: false },
      { id: 302, text: "Fix critical payment bug #442", owner: "Mei L.", due: "Jul 16", priority: "high", done: true },
      { id: 303, text: "Write unit tests for API layer", owner: "Priya M.", due: "Jul 22", priority: "medium", done: false },
      { id: 304, text: "Update CI/CD pipeline docs", owner: "James T.", due: "Jul 24", priority: "low", done: false },
    ],
    tags: ["Engineering", "Sprint"],
  },
  {
    id: 4,
    title: "Customer Success — Acme Corp Onboarding",
    date: "2024-07-11",
    time: "11:00 AM",
    duration: "30 min",
    attendees: ["Alex R.", "Tom H.", "Priya M."],
    status: "processed",
    summary: "Walked Acme through enterprise dashboard. They need SSO integration before full rollout. Positive feedback on reporting features.",
    actions: [
      { id: 401, text: "Ship SSO integration for Acme", owner: "Priya M.", due: "Jul 25", priority: "high", done: false },
      { id: 402, text: "Send onboarding guide PDF", owner: "Alex R.", due: "Jul 12", priority: "low", done: true },
      { id: 403, text: "Schedule check-in call in 2 weeks", owner: "Alex R.", due: "Jul 25", priority: "medium", done: false },
    ],
    tags: ["Customer", "Onboarding"],
  },
  {
    id: 5,
    title: "Marketing — Launch Campaign Kickoff",
    date: "2024-07-10",
    time: "3:00 PM",
    duration: "40 min",
    attendees: ["Lena V.", "Sarah K.", "Tom H."],
    status: "processed",
    summary: "Aligned on launch date of Aug 1. Three content pillars confirmed. Influencer outreach list to be finalized by Friday.",
    actions: [
      { id: 501, text: "Finalize influencer outreach list", owner: "Lena V.", due: "Jul 14", priority: "high", done: true },
      { id: 502, text: "Draft launch email sequence (5 emails)", owner: "Tom H.", due: "Jul 20", priority: "medium", done: false },
      { id: 503, text: "Book paid ads budget approval", owner: "Sarah K.", due: "Jul 17", priority: "medium", done: false },
    ],
    tags: ["Marketing", "Launch"],
  },
  {
    id: 6,
    title: "Design Review — New Onboarding Flow",
    date: "2024-07-09",
    time: "1:00 PM",
    duration: "28 min",
    attendees: ["Mei L.", "Priya M.", "Alex R."],
    status: "processed",
    summary: "Reviewed 3 onboarding flow variants. Variant B selected. Two rounds of iteration needed before dev handoff.",
    actions: [
      { id: 601, text: "Iterate on Variant B — address feedback", owner: "Mei L.", due: "Jul 15", priority: "high", done: true },
      { id: 602, text: "Prepare dev handoff Figma file", owner: "Mei L.", due: "Jul 19", priority: "medium", done: false },
      { id: 603, text: "Get final sign-off from Sarah", owner: "Priya M.", due: "Jul 20", priority: "medium", done: false },
    ],
    tags: ["Design", "UX"],
  },
  {
    id: 7,
    title: "Weekly All-Hands",
    date: "2024-07-08",
    time: "10:00 AM",
    duration: "25 min",
    attendees: ["Sarah K.", "James T.", "Priya M.", "Alex R.", "Lena V.", "Dev P.", "Mei L.", "Tom H."],
    status: "processed",
    summary: "Company OKRs reviewed. Team morale high. Two new hires joining next month. New Slack channels for async updates announced.",
    actions: [
      { id: 701, text: "Post OKR tracker to Notion", owner: "Sarah K.", due: "Jul 9", priority: "medium", done: true },
      { id: 702, text: "Set up onboarding docs for new hires", owner: "Alex R.", due: "Jul 22", priority: "medium", done: false },
    ],
    tags: ["All-Hands", "Internal"],
  },
];

const tagColors = {
  Product: { bg: "#7C5CFC22", color: "#7C5CFC" },
  Roadmap: { bg: "#7C5CFC22", color: "#7C5CFC" },
  Investors: { bg: "#00E5A022", color: "#00E5A0" },
  Finance: { bg: "#00E5A022", color: "#00E5A0" },
  Engineering: { bg: "#FC5C5C22", color: "#FC7C7C" },
  Sprint: { bg: "#FC5C5C22", color: "#FC7C7C" },
  Customer: { bg: "#5CC8FC22", color: "#5CC8FC" },
  Onboarding: { bg: "#5CC8FC22", color: "#5CC8FC" },
  Marketing: { bg: "#FCC95C22", color: "#FCC95C" },
  Launch: { bg: "#FCC95C22", color: "#FCC95C" },
  Design: { bg: "#FC5CF022", color: "#FC5CF0" },
  UX: { bg: "#FC5CF022", color: "#FC5CF0" },
  "All-Hands": { bg: "#FFFFFF11", color: "rgba(255,255,255,0.6)" },
  Internal: { bg: "#FFFFFF11", color: "rgba(255,255,255,0.6)" },
};

const priorityColors = {
  high: { bg: "#FC5C5C22", color: "#FC7C7C" },
  medium: { bg: "#FCC95C22", color: "#FCC95C" },
  low: { bg: "#FFFFFF11", color: "rgba(255,255,255,0.5)" },
};

function Tag({ label }) {
  const style = tagColors[label] || { bg: "#FFFFFF11", color: "rgba(255,255,255,0.5)" };
  return (
    <span style={{
      background: style.bg,
      color: style.color,
      borderRadius: 999,
      padding: "3px 10px",
      fontSize: 11,
      fontFamily: '"DM Mono", monospace',
      fontWeight: 500,
      letterSpacing: 0.3,
    }}>{label}</span>
  );
}

function PriorityBadge({ priority }) {
  const style = priorityColors[priority] || priorityColors.low;
  return (
    <span style={{
      background: style.bg,
      color: style.color,
      borderRadius: 999,
      padding: "2px 8px",
      fontSize: 10,
      fontFamily: '"DM Mono", monospace',
      fontWeight: 600,
      letterSpacing: 0.5,
      textTransform: "uppercase",
    }}>{priority}</span>
  );
}

function Avatar({ name, size = 28 }) {
  const initials = name.split(" ").map(p => p[0]).join("").slice(0, 2);
  const colors = ["#7C5CFC", "#00E5A0", "#FC5C5C", "#5CC8FC", "#FCC95C", "#FC5CF0"];
  const idx = name.charCodeAt(0) % colors.length;
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: 999,
      background: colors[idx],
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: size * 0.38,
      fontWeight: 700,
      color: "#111",
      fontFamily: '"DM Sans", sans-serif',
      flexShrink: 0,
    }}>{initials}</div>
  );
}

function ActionItem({ action, onToggle }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "12px 14px",
        borderRadius: 10,
        background: hovered ? "rgba(255,255,255,0.04)" : "transparent",
        transition: "background 0.15s",
        cursor: "pointer",
      }}
      onClick={() => onToggle(action.id)}
    >
      <div style={{
        width: 18,
        height: 18,
        borderRadius: 5,
        border: action.done ? "none" : "2px solid rgba(255,255,255,0.2)",
        background: action.done ? "#00E5A0" : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        marginTop: 1,
        transition: "all 0.15s",
      }}>
        {action.done && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14,
          color: action.done ? "rgba(255,255,255,0.3)" : "#fff",
          fontFamily: '"DM Sans", sans-serif',
          textDecoration: action.done ? "line-through" : "none",
          lineHeight: 1.4,
          transition: "all 0.15s",
        }}>{action.text}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 5, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Avatar name={action.owner} size={16} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: '"DM Mono", monospace' }}>{action.owner}</span>
          </div>
          <span style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: '"DM Mono", monospace' }}>Due {action.due}</span>
          <PriorityBadge priority={action.priority} />
        </div>
      </div>
    </div>
  );
}

function MeetingRow({ meeting, selected, onClick }) {
  const [hovered, setHovered] = useState(false);
  const doneCount = meeting.actions.filter(a => a.done).length;
  const totalCount = meeting.actions.length;
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        padding: "14px 16px",
        borderRadius: 10,
        background: selected ? "#7C5CFC18" : hovered ? "rgba(255,255,255,0.03)" : "transparent",
        border: selected ? "1px solid #7C5CFC44" : "1px solid transparent",
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div style={{
          fontSize: 13,
          fontFamily: '"DM Sans", sans-serif',
          fontWeight: 600,
          color: selected ? "#fff" : "rgba(255,255,255,0.85)",
          lineHeight: 1.35,
          flex: 1,
        }}>{meeting.title}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
        {meeting.tags.map(t => <Tag key={t} label={t} />)}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: '"DM Mono", monospace' }}>
          {meeting.date} · {meeting.duration}
        </span>
        <span style={{
          fontSize: 11,
          fontFamily: '"DM Mono", monospace',
          color: doneCount === totalCount ? "#00E5A0" : "rgba(255,255,255,0.4)",
        }}>
          {doneCount}/{totalCount} done
        </span>
      </div>
      <div style={{
        marginTop: 8,
        height: 3,
        borderRadius: 999,
        background: "rgba(255,255,255,0.06)",
        overflow: "hidden",
      }}>
        <div style={{
          height: "100%",
          width: `${totalCount > 0 ? (doneCount / totalCount) * 100 : 0}%`,
          background: doneCount === totalCount ? "#00E5A0" : "#7C5CFC",
          borderRadius: 999,
          transition: "width 0.3s",
        }} />
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div style={{
      flex: 1,
      background: "#1E1E1E",
      borderRadius: 12,
      padding: "16px 20px",
      border: "1px solid rgba(255,255,255,0.06)",
    }}>
      <div style={{ fontSize: 24, fontWeight: 700, fontFamily: '"DM Sans", sans-serif', color: accent || "#fff" }}>{value}</div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: '"DM Mono", monospace', marginTop: 3 }}>{label}</div>
    </div>
  );
}

function RecordingModal({ onClose, onProcess }) {
  const [step, setStep] = useState("idle");
  const [title, setTitle] = useState("");
  const [transcript, setTranscript] = useState("");
  const [titleFocused, setTitleFocused] = useState(false);
  const [transcriptFocused, setTranscriptFocused] = useState(false);

  const handleProcess = () => {
    if (!title.trim()) return;
    setStep("processing");
    setTimeout(() => {
      setStep("done");
      setTimeout(() => {
        onProcess();
        onClose();
      }, 1200);
    }, 2000);
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#1E1E1E",
        borderRadius: 16,
        padding: 28,
        width: 480,
        maxWidth: "90vw",
        border: "1px solid rgba(255,255,255,0.08)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ fontSize: 18, fontWeight: 700, fontFamily: '"DM Sans", sans-serif', color: "#fff" }}>
            Add Meeting
          </div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.06)",
            border: "none",
            borderRadius: 8,
            color: "rgba(255,255,255,0.5)",
            cursor: "pointer",
            padding: "6px 10px",
            fontSize: 14,
            fontFamily: '"DM Sans", sans-serif',
          }}>✕</button>
        </div>

        {step === "idle" && (
          <>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              onFocus={() => setTitleFocused(true)}
              onBlur={() => setTitleFocused(false)}
              placeholder="Meeting title..."
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.05)",
                border: titleFocused ? "1px solid #7C5CFC" : "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10,
                padding: "12px 14px",
                color: "#fff",
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
                transition: "border 0.15s",
              }}
            />
            <textarea
              value={transcript}
              onChange={e => setTranscript(e.target.value)}
              onFocus={() => setTranscriptFocused(true)}
              onBlur={() => setTranscriptFocused(false)}
              placeholder="Paste transcript or meeting notes here... (optional)"
              rows={5}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.05)",
                border: transcriptFocused ? "1px solid #7C5CFC" : "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10,
                padding: "12px 14px",
                color: "#fff",
                fontFamily: '"DM Mono", monospace',
                fontSize: 12,
                outline: "none",
                boxSizing: "border-box",
                marginTop: 10,
                resize: "vertical",
                transition: "border 0.15s",
              }}
            />
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button onClick={onClose} style={{
                flex: 1,
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.6)",
                borderRadius: 8,
                border: "none",
                padding: "11px 18px",
                cursor: "pointer",
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 600,
                fontSize: 14,
              }}>Cancel</button>
              <button onClick={handleProcess} style={{
                flex: 2,
                background: title.trim() ? "#7C5CFC" : "rgba(124,92,252,0.3)",
                color: title.trim() ? "#fff" : "rgba(255,255,255,0.3)",
                borderRadius: 8,
                border: "none",
                padding: "11px 18px",
                cursor: title.trim() ? "pointer" : "not-allowed",
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 600,
                fontSize: 14,
                transition: "all 0.15s",
              }}>✦ Process with AI</button>
            </div>
          </>
        )}

        {step === "processing" && (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>⚡</div>
            <div style={{ fontSize: 15, fontFamily: '"DM Sans", sans-serif', color: "#fff", fontWeight: 600 }}>
              AI is analyzing your meeting...
            </div>
            <div style={{ fontSize: 13, fontFamily: '"DM Mono", monospace', color: "rgba(255,255,255,0.4)", marginTop: 8 }}>
              Extracting actions, owners, deadlines
            </div>
            <div style={{ display: "flex", gap: 5, justifyContent: "center", marginTop: 20 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{
                  width: 7,
                  height: 7,
                  borderRadius: 999,
                  background: "#7C5CFC",
                  animation: "none",
                  opacity: 0.4 + i * 0.3,
                }} />
              ))}
            </div>
          </div>
        )}

        {step === "done" && (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 15, fontFamily: '"DM Sans", sans-serif', color: "#00E5A0", fontWeight: 700 }}>
              Meeting processed!
            </div>
            <div style={{ fontSize: 12, fontFamily: '"DM Mono", monospace', color: "rgba(255,255,255,0.4)", marginTop: 6 }}>
              3 actions extracted
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const [meetingData, setMeetingData] = useState(meetings);
  const [selectedId, setSelectedId] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("actions");
  const [searchFocused, setSearchFocused] = useState(false);
  const [filterOwner, setFilterOwner] = useState("All");
  const [addHovered, setAddHovered] = useState(false);
  const [notification, setNotification] = useState(null);

  const selected = useMemo(() => meetingData.find(m => m.id === selectedId), [meetingData, selectedId]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return meetingData;
    const q = searchQuery.toLowerCase();
    return meetingData.filter(m =>
      m.title.toLowerCase().includes(q) ||
      m.tags.some(t => t.toLowerCase().includes(q)) ||
      m.attendees.some(a => a.toLowerCase().includes(q))
    );
  }, [meetingData, searchQuery]);

  const allOwners = useMemo(() => {
    if (!selected) return [];
    const owners = [...new Set(selected.actions.map(a => a.owner))];
    return ["All", ...owners];
  }, [selected]);

  const filteredActions = useMemo(() => {
    if (!selected) return [];
    if (filterOwner === "All") return selected.actions;
    return selected.actions.filter(a => a.owner === filterOwner);
  }, [selected, filterOwner]);

  const totalActions = useMemo(() => meetingData.reduce((acc, m) => acc + m.actions.length, 0), [meetingData]);
  const doneActions = useMemo(() => meetingData.reduce((acc, m) => acc + m.actions.filter(a => a.done).length, 0), [meetingData]);
  const openActions = totalActions - doneActions;

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  const toggleAction = useCallback((actionId) => {
    setMeetingData(prev => prev.map(m => ({
      ...m,
      actions: m.actions.map(a => {
        if (a.id === actionId) {
          const newDone = !a.done;
          if (newDone) showNotification("Action marked complete ✓");
          return { ...a, done: newDone };
        }
        return a;
      }),
    })));
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: "#111111", fontFamily: '"DM Sans", sans-serif' }}>
      {notification && (
        <div style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          background: "#1E1E1E",
          border: "1px solid #00E5A044",
          color: "#00E5A0",
          borderRadius: 10,
          padding: "12px 18px",
          fontSize: 13,
          fontFamily: '"DM Sans", sans-serif',
          fontWeight: 600,
          zIndex: 999,
        }}>{notification}</div>
      )}

      {showModal && (
        <RecordingModal
          onClose={() => setShowModal(false)}
          onProcess={() => showNotification("New meeting added ✦")}
        />
      )}

      {/* Top Nav */}
      <div style={{
        height: 56,
        background: "#1E1E1E",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        paddingLeft: 24,
        paddingRight: 24,
        gap: 16,
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: "#7C5CFC",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
          }}>✦</div>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#fff", fontFamily: '"DM Sans", sans-serif', letterSpacing: -0.3 }}>
            Minutely
          </span>
        </div>

        <div style={{ flex: 1, maxWidth: 360, marginLeft: 24 }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            background: "rgba(255,255,255,0.05)",
            border: searchFocused ? "1px solid #7C5CFC" : "1px solid rgba(255,255,255,0.07)",
            borderRadius: 10,
            padding: "7px 12px",
            gap: 8,
            transition: "border 0.15s",
          }}>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>⌕</span>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search meetings..."
              style={{
                background: "none",
                border: "none",
                outline: "none",
                color: "#fff",
                fontSize: 13,
                fontFamily: '"DM Sans", sans-serif',
                width: "100%",
              }}
            />
          </div>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onMouseEnter={() => setAddHovered(true)}
            onMouseLeave={() => setAddHovered(false)}
            onClick={() => setShowModal(true)}
            style={{
              background: addHovered ? "#6B4EE0" : "#7C5CFC",
              color: "#fff",
              borderRadius: 8,
              border: "none",
              padding: "9px 16px",
              cursor: "pointer",
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 600,
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "background 0.15s",
            }}
          >
            <span>+</span> New Meeting
          </button>
          <Avatar name="Sarah K." size={32} />
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
        {/* Sidebar */}
        <div style={{
          width: 300,
          flexShrink: 0,
          background: "#161616",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}>
          {/* Stats row */}
          <div style={{ padding: "16px 16px 10px", display: "flex", gap: 8, flexShrink: 0 }}>
            <StatCard label="open actions" value={openActions} accent="#FC7C7C" />
            <StatCard label="completed" value={doneActions} accent="#00E5A0" />
          </div>

          <div style={{ padding: "4px 16px 10px", flexShrink: 0 }}>
            <span style={{ fontSize: 11, fontFamily: '"DM Mono", monospace', color: "rgba(255,255,255,0.25)", letterSpacing: 0.8, textTransform: "uppercase" }}>
              {filtered.length} meetings
            </span>
          </div>

          <div style={{ flex: 1, overflowY: "auto", minHeight: 0, padding: "0 8px 16px" }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "rgba(255,255,255,0.25)", fontFamily: '"DM Mono", monospace', fontSize: 12 }}>
                No meetings found
              </div>
            ) : (
              filtered.map(m => (
                <MeetingRow
                  key={m.id}
                  meeting={m}
                  selected={selectedId === m.id}
                  onClick={() => { setSelectedId(m.id); setFilterOwner("All"); }}
                />
              ))
            )}
          </div>
        </div>

        {/* Main */}
        {selected ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 }}>
            {/* Meeting header */}
            <div style={{
              padding: "24px 28px 20px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              flexShrink: 0,
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                <div>
                  <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#fff", fontFamily: '"DM Sans", sans-serif', letterSpacing: -0.4 }}>
                    {selected.title}
                  </h1>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, fontFamily: '"DM Mono", monospace', color: "rgba(255,255,255,0.35)" }}>
                      {selected.date} · {selected.time} · {selected.duration}
                    </span>
                    <span style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
                    {selected.tags.map(t => <Tag key={t} label={t} />)}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: -6, flexShrink: 0 }}>
                  {selected.attendees.slice(0, 5).map((a, i) => (
                    <div key={a} title={a} style={{ marginLeft: i === 0 ? 0 : -8 }}>
                      <Avatar name={a} size={30} />
                    </div>
                  ))}
                  {selected.attendees.length > 5 && (
                    <div style={{
                      width: 30, height: 30, borderRadius: 999,
                      background: "rgba(255,255,255,0.1)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, color: "rgba(255,255,255,0.5)",
                      fontFamily: '"DM Mono", monospace',
                      marginLeft: -8,
                    }}>+{selected.attendees.length - 5}</div>
                  )}
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: "flex", gap: 4, marginTop: 18 }}>
                {["actions", "summary"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      background: activeTab === tab ? "#7C5CFC" : "rgba(255,255,255,0.05)",
                      color: activeTab === tab ? "#fff" : "rgba(255,255,255,0.45)",
                      borderRadius: 8,
                      border: "none",
                      padding: "7px 14px",
                      cursor: "pointer",
                      fontFamily: '"DM Sans", sans-serif',
                      fontWeight: 600,
                      fontSize: 13,
                      transition: "all 0.15s",
                      textTransform: "capitalize",
                    }}
                  >{tab}</button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div style={{ flex: 1, overflowY: "auto", minHeight: 0, padding: "20px 28px" }}>
              {activeTab === "actions" && (
                <>
                  {/* Owner filter */}
                  <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
                    {allOwners.map(owner => (
                      <button
                        key={owner}
                        onClick={() => setFilterOwner(owner)}
                        style={{
                          background: filterOwner === owner ? "#7C5CFC22" : "rgba(255,255,255,0.04)",
                          color: filterOwner === owner ? "#7C5CFC" : "rgba(255,255,255,0.4)",
                          borderRadius: 999,
                          border: filterOwner === owner ? "1px solid #7C5CFC44" : "1px solid rgba(255,255,255,0.06)",
                          padding: "5px 12px",
                          cursor: "pointer",
                          fontFamily: '"DM Mono", monospace',
                          fontSize: 11,
                          fontWeight: 500,
                          transition: "all 0.15s",
                        }}
                      >{owner}</button>
                    ))}
                  </div>

                  {/* Action progress */}
                  <div style={{
                    background: "#1E1E1E",
                    borderRadius: 12,
                    padding: "16px 20px",
                    marginBottom: 16,
                    border: "1px solid rgba(255,255,255,0.06)",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 12, fontFamily: '"DM Sans", sans-serif', color: "rgba(255,255,255,0.5)" }}>
                          Actions progress
                        </span>
                        <span style={{ fontSize: 12, fontFamily: '"DM Mono", monospace', color: "rgba(255,255,255,0.4)" }}>
                          {selected.actions.filter(a => a.done).length} / {selected.actions.length}
                        </span>
                      </div>
                      <div style={{ height: 6, borderRadius: 999, background: "rgba(255,255,255,0.06)" }}>
                        <div style={{
                          height: "100%",
                          width: `${selected.actions.length > 0 ? (selected.actions.filter(a => a.done).length / selected.actions.length) * 100 : 0}%`,
                          background: selected.actions.filter(a => a.done).length === selected.actions.length ? "#00E5A0" : "#7C5CFC",
                          borderRadius: 999,
                          transition: "width 0.4s",
                        }} />
                      </div>
                    </div>
                  </div>

                  <div style={{
                    background: "#1E1E1E",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.06)",
                    overflow: "hidden",
                  }}>
                    {filteredActions.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "36px 20px", color: "rgba(255,255,255,0.25)", fontFamily: '"DM Mono", monospace', fontSize: 12 }}>
                        No actions for this filter
                      </div>
                    ) : (
                      filteredActions.map((action, i) => (
                        <div key={action.id}>
                          {i > 0 && <div style={{ height: 1, background: "rgba(255,255,255,0.04)", marginLeft: 14, marginRight: 14 }} />}
                          <ActionItem action={action} onToggle={toggleAction} />
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}

              {activeTab === "summary" && (
                <div>
                  <div style={{
                    background: "#1E1E1E",
                    borderRadius: 12,
                    padding: "20px 22px",
                    border: "1px solid rgba(255,255,255,0.06)",
                    marginBottom: 16,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#7C5CFC", fontFamily: '"DM Sans", sans-serif' }}>✦ AI Summary</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.8)", fontFamily: '"DM Sans", sans-serif' }}>
                      {selected.summary}
                    </p>
                  </div>

                  <div style={{
                    background: "#1E1E1E",
                    borderRadius: 12,
                    padding: "20px 22px",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.5)", fontFamily: '"DM Mono", monospace', marginBottom: 14, letterSpacing: 0.5, textTransform: "uppercase" }}>
                      Attendees
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                      {selected.attendees.map(a => (
                        <div key={a} style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 12px" }}>
                          <Avatar name={a} size={22} />
                          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontFamily: '"DM Sans", sans-serif' }}>{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center", color: "rgba(255,255,255,0.2)" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✦</div>
              <div style={{ fontSize: 15, fontFamily: '"DM Sans", sans-serif' }}>Select a meeting</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
