import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

/* ΓöÇΓöÇ Mock data ΓöÇΓöÇ */
const mockPendingListings = [
  {
    id: 1,
    title: 'Luxury Studio ΓÇö Colombo 7',
    location: 'Colombo 7, Western Province',
    landlord: 'Kasun Perera',
    price: 'LKR 65,000 / mo',
    type: 'Studio',
    submittedDate: 'Mar 20, 2026',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400&h=260',
  },
  {
    id: 2,
    title: '3BR House ΓÇö Negombo',
    location: 'Negombo, Western Province',
    landlord: 'Nimal Silva',
    price: 'LKR 120,000 / mo',
    type: 'House',
    submittedDate: 'Mar 19, 2026',
    image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=400&h=260',
  },
  {
    id: 3,
    title: 'Annex ΓÇö Kandy City',
    location: 'Kandy, Central Province',
    landlord: 'Amali Fernando',
    price: 'LKR 40,000 / mo',
    type: 'Annex',
    submittedDate: 'Mar 18, 2026',
    image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=400&h=260',
  },
];

const mockUsers = [
  { id: 1, name: 'Kasun Perera',  email: 'kasun@mail.com',   role: 'landlord', joined: 'Jan 12, 2026', status: 'active' },
  { id: 2, name: 'Amali Fernando',email: 'amali@mail.com',   role: 'tenant',   joined: 'Feb 3, 2026',  status: 'active' },
  { id: 3, name: 'Nimal Silva',   email: 'nimal@mail.com',   role: 'landlord', joined: 'Dec 8, 2025',  status: 'banned' },
  { id: 4, name: 'Sachini Dias',  email: 'sachini@mail.com', role: 'tenant',   joined: 'Mar 1, 2026',  status: 'active' },
  { id: 5, name: 'Ruwan Gayan',   email: 'ruwan@mail.com',   role: 'tenant',   joined: 'Feb 20, 2026', status: 'active' },
  { id: 6, name: 'Ishara Madhu',  email: 'ishara@mail.com',  role: 'landlord', joined: 'Nov 15, 2025', status: 'banned' },
];

const mockReports = [
  {
    id: 1,
    listingTitle: 'Cheap Room ΓÇö Wellawatte',
    landlord: 'Ruwan Gayan',
    reportCount: 5,
    reason: 'Misleading photos ΓÇö actual room looks completely different',
    reportedBy: 'Amali Fernando',
    date: 'Mar 20, 2026',
  },
  {
    id: 2,
    listingTitle: 'Boarding Room ΓÇö Dehiwala',
    landlord: 'Unknown Landlord',
    reportCount: 3,
    reason: 'Potential scam ΓÇö landlord asked for large deposit upfront and disappeared',
    reportedBy: 'Sachini Dias',
    date: 'Mar 17, 2026',
  },
];

const recentActivity = [
  { id: 1, text: 'New listing submitted by Kasun Perera ΓÇö Colombo 7',    time: '2 min ago',  color: 'blue' },
  { id: 2, text: 'User Nimal Silva was banned by Admin',                   time: '1 hr ago',   color: 'red' },
  { id: 3, text: 'Listing "Annex ΓÇö Galle" was approved',                   time: '3 hr ago',   color: 'green' },
  { id: 4, text: 'New report filed on "Cheap Room ΓÇö Wellawatte"',          time: '5 hr ago',   color: 'amber' },
  { id: 5, text: 'New tenant registered: Sachini Dias',                    time: 'Yesterday',  color: 'blue' },
];

/* ΓöÇΓöÇ Icons (inline SVG) ΓöÇΓöÇ */
const IconGrid = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ad-nav-icon">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const IconCheckCircle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ad-nav-icon">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ad-nav-icon">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconFlag = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ad-nav-icon">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
    <line x1="4" y1="22" x2="4" y2="15"/>
  </svg>
);
const IconLogOut = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }} className="ad-search-icon">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconHome = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

/* ΓöÇΓöÇ Stat Card ΓöÇΓöÇ */
const StatCard = ({ value, label, colorClass, icon }) => (
  <div className="ad-stat-card">
    <div className={`ad-stat-icon-wrap ${colorClass}`}>{icon}</div>
    <div className="ad-stat-info">
      <p className="ad-stat-value">{value}</p>
      <p className="ad-stat-label">{label}</p>
    </div>
  </div>
);

/* ΓöÇΓöÇ Approval Card ΓöÇΓöÇ */
const ApprovalCard = ({ listing, onApprove, onReject }) => (
  <div className="ad-approval-card">
    <img src={listing.image} alt={listing.title} className="ad-approval-img" />
    <div className="ad-approval-body">
      <div className="ad-approval-top">
        <div>
          <p className="ad-approval-title">{listing.title}</p>
          <p className="ad-approval-sub">≡ƒôì {listing.location} ┬╖ by {listing.landlord}</p>
          <p className="ad-approval-sub" style={{ marginTop: '2px' }}>Submitted: {listing.submittedDate}</p>
        </div>
        <span className="ad-badge ad-badge-pending">Pending</span>
      </div>
      <div className="ad-approval-footer">
        <span className="ad-approval-price">{listing.price}</span>
        <span className="ad-approval-meta">{listing.type}</span>
        <div className="ad-approval-actions">
          <button className="ad-btn ad-btn-approve" onClick={() => onApprove(listing.id)}>Γ£ô Approve</button>
          <button className="ad-btn ad-btn-reject"  onClick={() => onReject(listing.id)}>Γ£ò Reject</button>
        </div>
      </div>
    </div>
  </div>
);

/* ΓöÇΓöÇ User Row ΓöÇΓöÇ */
const UserRow = ({ user, onToggleBan }) => {
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="ad-user-row">
      <div className="ad-user-info">
        <div className="ad-user-avatar">{initials}</div>
        <div>
          <p className="ad-user-name">{user.name}</p>
        </div>
      </div>
      <span className="ad-user-email">{user.email}</span>
      <span className={`ad-badge ${user.role === 'landlord' ? 'ad-badge-landlord' : 'ad-badge-tenant'}`}>
        {user.role}
      </span>
      <span className="ad-user-joined">{user.joined}</span>
      <div className="ad-user-actions">
        <span className={`ad-badge ${user.status === 'active' ? 'ad-badge-active' : 'ad-badge-banned'}`} style={{ marginRight: '0.4rem' }}>
          {user.status}
        </span>
        <button
          className={`ad-btn ${user.status === 'active' ? 'ad-btn-ban' : 'ad-btn-unban'}`}
          onClick={() => onToggleBan(user.id)}
        >
          {user.status === 'active' ? 'Ban' : 'Unban'}
        </button>
      </div>
    </div>
  );
};

/* ΓöÇΓöÇ Report Card ΓöÇΓöÇ */
const ReportCard = ({ report, onDismiss, onRemove }) => (
  <div className="ad-report-card">
    <div className="ad-report-header">
      <div className="ad-report-flag">
        <IconFlag />
      </div>
      <div>
        <p className="ad-report-listing-title">{report.listingTitle}</p>
        <p className="ad-report-landlord">by {report.landlord}</p>
      </div>
      <span className="ad-report-count-badge">{report.reportCount} reports</span>
    </div>
    <div className="ad-report-body">
      <p className="ad-report-reason">
        <span>Reason:</span> {report.reason}
      </p>
      <p className="ad-report-reason" style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
        First reported by {report.reportedBy} ┬╖ {report.date}
      </p>
      <div className="ad-report-actions">
        <button className="ad-btn ad-btn-dismiss" onClick={() => onDismiss(report.id)}>Dismiss</button>
        <button className="ad-btn ad-btn-remove"  onClick={() => onRemove(report.id)}>Remove Listing</button>
      </div>
    </div>
  </div>
);

/* ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
   Main Component
ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const [pendingListings, setPendingListings] = useState(mockPendingListings);
  const [users, setUsers] = useState(mockUsers);
  const [reports, setReports] = useState(mockReports);
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState('all');

  /* ΓöÇΓöÇ Approval handlers ΓöÇΓöÇ */
  const handleApprove = (id) => {
    setPendingListings(prev => prev.filter(l => l.id !== id));
  };
  const handleReject = (id) => {
    setPendingListings(prev => prev.filter(l => l.id !== id));
  };

  /* ΓöÇΓöÇ User ban toggle ΓöÇΓöÇ */
  const handleToggleBan = (id) => {
    setUsers(prev => prev.map(u =>
      u.id === id ? { ...u, status: u.status === 'active' ? 'banned' : 'active' } : u
    ));
  };

  /* ΓöÇΓöÇ Report handlers ΓöÇΓöÇ */
  const handleDismiss = (id) => setReports(prev => prev.filter(r => r.id !== id));
  const handleRemove  = (id) => setReports(prev => prev.filter(r => r.id !== id));

  /* ΓöÇΓöÇ Filtered users ΓöÇΓöÇ */
  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesFilter =
      userFilter === 'all' ||
      (userFilter === 'tenants'   && u.role === 'tenant') ||
      (userFilter === 'landlords' && u.role === 'landlord') ||
      (userFilter === 'banned'    && u.status === 'banned');
    return matchesSearch && matchesFilter;
  });

  /* ΓöÇΓöÇ Stats ΓöÇΓöÇ */
  const totalUsers      = users.length;
  const bannedCount     = users.filter(u => u.status === 'banned').length;
  const activeListings  = 24; // mock value
  const pendingCount    = pendingListings.length;

  /* ΓöÇΓöÇ Tab page title ΓöÇΓöÇ */
  const tabMeta = {
    dashboard: { title: 'Admin Dashboard',     subtitle: 'Platform overview' },
    approvals: { title: 'Listings for Approval', subtitle: `${pendingCount} listing${pendingCount !== 1 ? 's' : ''} awaiting review` },
    users:     { title: 'User Management',      subtitle: `${totalUsers} registered users` },
    reports:   { title: 'Flagged Reports',      subtitle: `${reports.length} active report${reports.length !== 1 ? 's' : ''}` },
  };

  const navItems = [
    { id: 'dashboard', label: 'Overview',  icon: <IconGrid /> },
    { id: 'approvals', label: 'Approvals', icon: <IconCheckCircle />, badge: pendingCount || null },
    { id: 'users',     label: 'Users',     icon: <IconUsers /> },
    { id: 'reports',   label: 'Reports',   icon: <IconFlag />, badge: reports.length || null },
  ];

  return (
    <div className="ad-shell">
      {/* ΓöÇΓöÇ Sidebar ΓöÇΓöÇ */}
      <aside className="ad-sidebar">
        <div className="ad-sidebar-brand">
          <div className="ad-logo"><span className="ad-logo-text">RUMI</span></div>
          <div>
            <p className="ad-brand-name">Rumi Rentals</p>
            <p className="ad-brand-tag">Admin Console</p>
          </div>
        </div>

        <span className="ad-admin-badge">Admin Panel</span>

        <nav className="ad-nav" aria-label="Admin navigation">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`ad-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
              aria-current={activeTab === item.id ? 'page' : undefined}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge ? <span className="ad-nav-badge">{item.badge}</span> : null}
            </button>
          ))}
        </nav>

        <div className="ad-sidebar-footer">
          <button className="ad-logout-btn" onClick={() => navigate('/login')}>
            <IconLogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ΓöÇΓöÇ Main ΓöÇΓöÇ */}
      <main className="ad-main">
        {/* Top bar */}
        <div className="ad-topbar">
          <div>
            <h1 className="ad-page-title">{tabMeta[activeTab].title}</h1>
            <p className="ad-page-subtitle">{tabMeta[activeTab].subtitle}</p>
          </div>
          <div className="ad-topbar-right">
            <div className="ad-admin-chip">
              <div className="ad-admin-avatar">AD</div>
              <span className="ad-admin-label">Admin</span>
            </div>
          </div>
        </div>

        {/* ΓöÇΓöÇ Content ΓöÇΓöÇ */}
        <div className="ad-content" key={activeTab}>

          {/* ΓòÉΓòÉ Dashboard Tab ΓòÉΓòÉ */}
          {activeTab === 'dashboard' && (
            <>
              <div className="ad-stats-row">
                <StatCard
                  value={pendingCount}
                  label="Pending Approvals"
                  colorClass="amber"
                  icon={<IconCheckCircle />}
                />
                <StatCard
                  value={totalUsers}
                  label="Total Users"
                  colorClass="blue"
                  icon={<IconUsers />}
                />
                <StatCard
                  value={activeListings}
                  label="Active Listings"
                  colorClass="green"
                  icon={<IconHome />}
                />
                <StatCard
                  value={bannedCount}
                  label="Banned Users"
                  colorClass="red"
                  icon={<IconFlag />}
                />
              </div>

              <div>
                <div className="ad-section-hd">
                  <h2 className="ad-section-title">Recent Activity</h2>
                </div>
                <div className="ad-activity-list">
                  {recentActivity.map(a => (
                    <div className="ad-activity-item" key={a.id}>
                      <span className={`ad-activity-dot ${a.color}`} />
                      <span className="ad-activity-text">{a.text}</span>
                      <span className="ad-activity-time">{a.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {pendingListings.length > 0 && (
                <div>
                  <div className="ad-section-hd">
                    <h2 className="ad-section-title">Needs Approval</h2>
                    <span className="ad-section-count">{pendingListings.length} pending</span>
                  </div>
                  <div className="ad-approval-list">
                    {pendingListings.slice(0, 2).map(l => (
                      <ApprovalCard
                        key={l.id}
                        listing={l}
                        onApprove={handleApprove}
                        onReject={handleReject}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ΓòÉΓòÉ Approvals Tab ΓòÉΓòÉ */}
          {activeTab === 'approvals' && (
            <div>
              <div className="ad-section-hd">
                <h2 className="ad-section-title">Pending Listings</h2>
                <span className="ad-section-count">{pendingListings.length} pending</span>
              </div>
              {pendingListings.length > 0 ? (
                <div className="ad-approval-list">
                  {pendingListings.map(l => (
                    <ApprovalCard
                      key={l.id}
                      listing={l}
                      onApprove={handleApprove}
                      onReject={handleReject}
                    />
                  ))}
                </div>
              ) : (
                <div className="ad-empty">
                  <div className="ad-empty-icon">≡ƒÄë</div>
                  <p className="ad-empty-text">No pending approvals ΓÇö all caught up!</p>
                </div>
              )}
            </div>
          )}

          {/* ΓòÉΓòÉ Users Tab ΓòÉΓòÉ */}
          {activeTab === 'users' && (
            <div>
              <div className="ad-users-toolbar">
                <div className="ad-search-wrap">
                  <IconSearch />
                  <input
                    type="text"
                    className="ad-search-input"
                    placeholder="Search users..."
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                    aria-label="Search users"
                  />
                </div>
                <div className="ad-filter-group">
                  {[
                    { id: 'all',       label: 'All' },
                    { id: 'tenants',   label: 'Tenants' },
                    { id: 'landlords', label: 'Landlords' },
                    { id: 'banned',    label: 'Banned' },
                  ].map(f => (
                    <button
                      key={f.id}
                      className={`ad-filter-btn ${userFilter === f.id ? 'active' : ''}`}
                      onClick={() => setUserFilter(f.id)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {filteredUsers.length > 0 ? (
                <div className="ad-users-list">
                  <div className="ad-users-header" aria-hidden="true">
                    <span>Name</span>
                    <span>Email</span>
                    <span>Role</span>
                    <span>Joined</span>
                    <span>Actions</span>
                  </div>
                  {filteredUsers.map(u => (
                    <UserRow key={u.id} user={u} onToggleBan={handleToggleBan} />
                  ))}
                </div>
              ) : (
                <div className="ad-empty">
                  <div className="ad-empty-icon">≡ƒöì</div>
                  <p className="ad-empty-text">No users match your search.</p>
                </div>
              )}
            </div>
          )}

          {/* ΓòÉΓòÉ Reports Tab ΓòÉΓòÉ */}
          {activeTab === 'reports' && (
            <div>
              <div className="ad-section-hd">
                <h2 className="ad-section-title">Flagged Listings</h2>
                <span className="ad-section-count">{reports.length} active</span>
              </div>
              {reports.length > 0 ? (
                <div className="ad-reports-list">
                  {reports.map(r => (
                    <ReportCard
                      key={r.id}
                      report={r}
                      onDismiss={handleDismiss}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>
              ) : (
                <div className="ad-empty">
                  <div className="ad-empty-icon">Γ£à</div>
                  <p className="ad-empty-text">No active reports ΓÇö platform is clean!</p>
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
