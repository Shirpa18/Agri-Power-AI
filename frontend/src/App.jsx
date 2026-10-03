import { useState } from "react";

import Dashboard from "./pages/Dashboard";
import Farm from "./pages/Farm";
import Irrigation from "./pages/irrigation";
import Energy from "./pages/Energy";
import AIAssistant from "./pages/AIAssistant";
import Analytics from "./pages/Analytics";
import Alerts from "./pages/Alerts";
import Profile from "./pages/Profile";
import SensorSimulator from "./pages/SensorSimulator";
import Login from "./pages/Login";

import { useFarm } from "./context/FarmContext";
import { useAuth } from "./context/AuthContext";

function App() {
  const [currentPage, setCurrentPage] =
    useState("Dashboard");

  const {
    backendOnline,
  } = useFarm();

  const {
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  const navigationGroups = [
    {
      title: "Overview",
      items: [
        {
          label: "Dashboard",
          page: "Dashboard",
        },
      ],
    },
    {
      title: "Farm",
      items: [
        {
          label: "Farm Setup",
          page: "Farm",
        },
        {
          label: "Irrigation",
          page: "Irrigation",
        },
        {
          label: "Sensor Simulator",
          page: "SensorSimulator",
        },
      ],
    },
    {
      title: "Energy",
      items: [
        {
          label: "Energy Management",
          page: "Energy",
        },
      ],
    },
    {
      title: "Intelligence",
      items: [
        {
          label: "AI Farm Assistant",
          page: "AIAssistant",
        },
        {
          label: "Analytics",
          page: "Analytics",
        },
        {
          label: "Alerts",
          page: "Alerts",
        },
      ],
    },
    {
      title: "System",
      items: [
        {
          label: "Profile",
          page: "Profile",
        },
      ],
    },
  ];

  const pageTitles = {
    Dashboard: "Dashboard",
    Farm: "Farm Setup",
    Irrigation: "Irrigation",
    SensorSimulator: "Sensor Simulator",
    Energy: "Energy Management",
    AIAssistant: "AI Farm Assistant",
    Analytics: "Analytics",
    Alerts: "Alerts",
    Profile: "Profile",
  };

  const renderPage = () => {
    switch (currentPage) {
      case "Dashboard":
        return <Dashboard />;

      case "Farm":
        return <Farm />;

      case "Irrigation":
        return <Irrigation />;

      case "SensorSimulator":
        return <SensorSimulator />;

      case "Energy":
        return <Energy />;

      case "AIAssistant":
        return <AIAssistant />;

      case "Analytics":
        return <Analytics />;

      case "Alerts":
        return <Alerts />;

      case "Profile":
        return <Profile />;

      default:
        return <Dashboard />;
    }
  };

  if (authLoading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-card">
          <div className="auth-loading-mark">
            AP
          </div>

          <div>
            <strong>
              AgriPower AI
            </strong>

            <span>
              Loading secure workspace...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-brand-mark">
              AP
            </div>

            <div className="sidebar-brand-text">
              <div className="sidebar-brand-title">
                AgriPower AI
              </div>

              <div className="sidebar-brand-subtitle">
                Sustainable farm intelligence
              </div>
            </div>
          </div>
        </div>

        <div className="farm-mini-card">
          <div className="farm-mini-label">
            ACTIVE FARM
          </div>

          <div className="farm-mini-name">
            Green Valley Farm
          </div>

          <div className="farm-mini-location">
            Karnataka, India
          </div>

          <div className="farm-mini-status">
            <span
              className={`status-dot ${
                backendOnline ? "online" : ""
              }`}
            />

            <span>
              {backendOnline
                ? "System Online"
                : "System Offline"}
            </span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navigationGroups.map((group) => (
            <div
              className="nav-section"
              key={group.title}
            >
              <div className="nav-section-title">
                {group.title}
              </div>

              {group.items.map((item) => {
                const isActive =
                  currentPage === item.page;

                return (
                  <button
                    key={item.page}
                    type="button"
                    className={`nav-item ${
                      isActive ? "active" : ""
                    }`}
                    onClick={() =>
                      setCurrentPage(item.page)
                    }
                  >
                    <span className="nav-indicator" />

                    <span>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="system-health">
            <div className="system-health-top">
              <span>
                System Health
              </span>

              <span className="health-value">
                {backendOnline
                  ? "Healthy"
                  : "Offline"}
              </span>
            </div>

            <div className="health-bar">
              <span
                style={{
                  width: backendOnline
                    ? "100%"
                    : "25%",
                }}
              />
            </div>

            <div className="system-health-meta">
              <span>
                Backend
              </span>

              <span>
                {backendOnline
                  ? "Connected"
                  : "Disconnected"}
              </span>
            </div>
          </div>

          <div className="sidebar-version">
            AgriPower AI v1.0
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <div className="breadcrumb">
              <span>
                Farm Intelligence
              </span>

              <span className="breadcrumb-divider">
                /
              </span>

              <strong>
                {pageTitles[currentPage]}
              </strong>
            </div>
          </div>

          <div className="topbar-right">
            <div className="live-indicator">
              <span
                className={`status-dot ${
                  backendOnline
                    ? "online"
                    : ""
                }`}
              />

              <span>
                {backendOnline
                  ? "System Online"
                  : "System Offline"}
              </span>
            </div>

            <button
              type="button"
              className="topbar-button"
              onClick={() =>
                setCurrentPage("Alerts")
              }
              aria-label="Open alerts"
            >
              <span className="notification-icon">
                !
              </span>

              <span className="notification-badge">
                3
              </span>
            </button>

            <button
              type="button"
              className="topbar-button profile-chip"
              onClick={() =>
                setCurrentPage("Profile")
              }
              aria-label="Open profile"
            >
              <span className="profile-avatar">
                GV
              </span>

              <span className="profile-chip-info">
                <strong>
                  Farm Admin
                </strong>

                <span>
                  Green Valley
                </span>
              </span>
            </button>
          </div>
        </header>

        <div className="content-wrapper">
          <div className="page-container">
            {renderPage()}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;