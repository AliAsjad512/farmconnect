import { useState, useEffect } from "react";

const API = "http://18.116.170.141:5000";

const theme = {
  bg: "#0f1a0f",
  card: "#162416",
  border: "#2a3d2a",
  accent: "#5cad4a",
  accentDim: "#3d7a2e",
  text: "#e8f5e0",
  muted: "#7a9e72",
  danger: "#c0392b",
  dangerDim: "#922b21",
};

const styles = {
  app: {
    minHeight: "100vh",
    background: theme.bg,
    fontFamily: "'Georgia', serif",
    color: theme.text,
    padding: "0",
  },
  header: {
    background: `linear-gradient(135deg, #0a120a 0%, #1a2e1a 100%)`,
    borderBottom: `1px solid ${theme.border}`,
    padding: "32px 48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  logoIcon: {
    fontSize: "40px",
  },
  logoText: {
    fontSize: "28px",
    fontWeight: "bold",
    color: theme.accent,
    letterSpacing: "2px",
    textTransform: "uppercase",
  },
  logoSub: {
    fontSize: "12px",
    color: theme.muted,
    letterSpacing: "4px",
    textTransform: "uppercase",
    marginTop: "2px",
  },
  statusBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#1a2e1a",
    border: `1px solid ${theme.border}`,
    borderRadius: "20px",
    padding: "8px 16px",
    fontSize: "13px",
    color: theme.muted,
  },
  statusDot: (online) => ({
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: online ? theme.accent : theme.danger,
    boxShadow: online ? `0 0 6px ${theme.accent}` : `0 0 6px ${theme.danger}`,
  }),
  main: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "48px 32px",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    marginBottom: "48px",
  },
  statCard: {
    background: theme.card,
    border: `1px solid ${theme.border}`,
    borderRadius: "12px",
    padding: "24px",
    textAlign: "center",
  },
  statNumber: {
    fontSize: "42px",
    fontWeight: "bold",
    color: theme.accent,
    lineHeight: 1,
  },
  statLabel: {
    fontSize: "12px",
    color: theme.muted,
    textTransform: "uppercase",
    letterSpacing: "2px",
    marginTop: "8px",
  },
  section: {
    marginBottom: "40px",
  },
  sectionTitle: {
    fontSize: "18px",
    color: theme.muted,
    textTransform: "uppercase",
    letterSpacing: "3px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  sectionLine: {
    flex: 1,
    height: "1px",
    background: theme.border,
  },
  form: {
    background: theme.card,
    border: `1px solid ${theme.border}`,
    borderRadius: "12px",
    padding: "28px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr auto",
    gap: "16px",
    alignItems: "end",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "11px",
    color: theme.muted,
    textTransform: "uppercase",
    letterSpacing: "2px",
  },
  input: {
    background: "#0f1a0f",
    border: `1px solid ${theme.border}`,
    borderRadius: "8px",
    padding: "12px 16px",
    color: theme.text,
    fontSize: "14px",
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 0.2s",
  },
  btnAdd: {
    background: theme.accent,
    color: "#0a120a",
    border: "none",
    borderRadius: "8px",
    padding: "12px 24px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    letterSpacing: "1px",
    textTransform: "uppercase",
    fontFamily: "inherit",
    transition: "background 0.2s",
    whiteSpace: "nowrap",
  },
  farmsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  farmCard: {
    background: theme.card,
    border: `1px solid ${theme.border}`,
    borderRadius: "12px",
    padding: "24px",
    position: "relative",
    transition: "border-color 0.2s, transform 0.2s",
    cursor: "default",
  },
  farmId: {
    position: "absolute",
    top: "16px",
    right: "16px",
    fontSize: "11px",
    color: theme.border,
    fontFamily: "monospace",
  },
  farmName: {
    fontSize: "20px",
    fontWeight: "bold",
    color: theme.text,
    marginBottom: "12px",
  },
  farmTag: (color) => ({
    display: "inline-block",
    background: color + "22",
    border: `1px solid ${color}44`,
    color: color,
    borderRadius: "4px",
    padding: "3px 10px",
    fontSize: "12px",
    marginRight: "8px",
    marginBottom: "8px",
  }),
  farmDate: {
    fontSize: "11px",
    color: theme.muted,
    marginTop: "12px",
    borderTop: `1px solid ${theme.border}`,
    paddingTop: "12px",
  },
  deleteBtn: {
    position: "absolute",
    bottom: "16px",
    right: "16px",
    background: "transparent",
    border: `1px solid ${theme.border}`,
    color: theme.muted,
    borderRadius: "6px",
    padding: "4px 10px",
    fontSize: "12px",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.2s",
  },
  empty: {
    textAlign: "center",
    padding: "60px",
    color: theme.muted,
    fontSize: "15px",
    background: theme.card,
    border: `1px dashed ${theme.border}`,
    borderRadius: "12px",
  },
  toast: (type) => ({
    position: "fixed",
    bottom: "32px",
    right: "32px",
    background: type === "success" ? theme.accentDim : theme.dangerDim,
    color: theme.text,
    padding: "14px 24px",
    borderRadius: "8px",
    fontSize: "14px",
    zIndex: 1000,
    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
    animation: "slideUp 0.3s ease",
  }),
};

function Toast({ message, type }) {
  if (!message) return null;
  return <div style={styles.toast(type)}>{message}</div>;
}

export default function FarmConnect() {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(false);
  const [form, setForm] = useState({ name: "", location: "", crop: "" });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [dbTime, setDbTime] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchHealth = async () => {
    try {
      const res = await fetch(`${API}/health`);
      const data = await res.json();
      setOnline(data.status === "ok");
      setDbTime(data.db_time);
    } catch {
      setOnline(false);
    }
  };

  const fetchFarms = async () => {
    try {
      const res = await fetch(`${API}/farms`);
      const data = await res.json();
      setFarms(data);
    } catch {
      showToast("Failed to load farms", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    fetchFarms();
  }, []);

  const handleAdd = async () => {
    if (!form.name || !form.location || !form.crop) {
      showToast("Please fill in all fields", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/farms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const newFarm = await res.json();
      setFarms([...farms, newFarm]);
      setForm({ name: "", location: "", crop: "" });
      showToast(`✅ ${newFarm.name} added!`);
    } catch {
      showToast("Failed to add farm", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    try {
      await fetch(`${API}/farms/${id}`, { method: "DELETE" });
      setFarms(farms.filter((f) => f.id !== id));
      showToast(`🗑️ ${name} removed`);
    } catch {
      showToast("Failed to delete farm", "error");
    }
  };

  const cropColors = {
    Corn: "#f1c40f",
    Strawberries: "#e74c3c",
    Apples: "#e67e22",
    Wheat: "#d4a017",
    default: theme.accent,
  };

  return (
    <div style={styles.app}>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus { border-color: #5cad4a !important; }
        .farm-card:hover { border-color: #3d7a2e !important; transform: translateY(-2px); }
        .delete-btn:hover { background: #922b21 !important; border-color: #922b21 !important; color: #fff !important; }
        .btn-add:hover { background: #4a9a3a !important; }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>🌾</span>
          <div>
            <div style={styles.logoText}>FarmConnect</div>
            <div style={styles.logoSub}>Farm Management Network</div>
          </div>
        </div>
        <div style={styles.statusBadge}>
          <div style={styles.statusDot(online)} />
          {online ? "API Connected" : "API Offline"}
          {dbTime && (
            <span style={{ marginLeft: "8px", fontSize: "11px", color: "#5cad4a" }}>
              · DB {new Date(dbTime).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      <div style={styles.main}>
        {/* Stats */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{farms.length}</div>
            <div style={styles.statLabel}>Total Farms</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>
              {new Set(farms.map((f) => f.location)).size}
            </div>
            <div style={styles.statLabel}>Locations</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>
              {new Set(farms.map((f) => f.crop)).size}
            </div>
            <div style={styles.statLabel}>Crop Types</div>
          </div>
        </div>

        {/* Add Farm */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>
            Add New Farm <div style={styles.sectionLine} />
          </div>
          <div style={styles.form}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Farm Name</label>
              <input
                style={styles.input}
                placeholder="e.g. Green Acres"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Location</label>
              <input
                style={styles.input}
                placeholder="e.g. Iowa"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Crop</label>
              <input
                style={styles.input}
                placeholder="e.g. Corn"
                value={form.crop}
                onChange={(e) => setForm({ ...form, crop: e.target.value })}
              />
            </div>
            <button
              className="btn-add"
              style={{ ...styles.btnAdd, opacity: submitting ? 0.6 : 1 }}
              onClick={handleAdd}
              disabled={submitting}
            >
              {submitting ? "Adding..." : "+ Add Farm"}
            </button>
          </div>
        </div>

        {/* Farms List */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>
            All Farms <div style={styles.sectionLine} />
          </div>

          {loading ? (
            <div style={styles.empty}>Loading farms...</div>
          ) : farms.length === 0 ? (
            <div style={styles.empty}>
              🌱 No farms yet. Add your first farm above!
            </div>
          ) : (
            <div style={styles.farmsGrid}>
              {farms.map((farm) => (
                <div
                  key={farm.id}
                  className="farm-card"
                  style={styles.farmCard}
                >
                  <div style={styles.farmId}>#{farm.id}</div>
                  <div style={styles.farmName}>🏡 {farm.name}</div>
                  <div>
                    <span style={styles.farmTag("#7ecef4")}>
                      📍 {farm.location}
                    </span>
                    <span
                      style={styles.farmTag(
                        cropColors[farm.crop] || cropColors.default
                      )}
                    >
                      🌿 {farm.crop}
                    </span>
                  </div>
                  {farm.created_at && (
                    <div style={styles.farmDate}>
                      Added {new Date(farm.created_at).toLocaleDateString()}
                    </div>
                  )}
                  <button
                    className="delete-btn"
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(farm.id, farm.name)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
