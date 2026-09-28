import { useState } from "react";

import Dashboard from "./pages/Dashboard.jsx";
import Farm from "./pages/Farm.jsx";
import Irrigation from "./pages/Irrigation.jsx";
import Energy from "./pages/Energy.jsx";
import AIAssistant from "./pages/AIAssistant.jsx";
import Analytics from "./pages/Analytics.jsx";
import Alerts from "./pages/Alerts.jsx";
import Profile from "./pages/Profile.jsx";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  const menuItems = [
    "Dashboard",
    "Farm Setup",
    "Irrigation",
    "Energy Management",
    "AI Farm Assistant",
    "Analytics",
    "Alerts",
    "Profile",
  ];

  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard />;

      case "Farm Setup":
        return <Farm />;

      case "Irrigation":
        return <Irrigation />;

      case "Energy Management":
        return <Energy />;

      case "AI Farm Assistant":
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

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <h2>AgriPower AI</h2>
          <p>Farm Intelligence</p>
        </div>

        <nav>
          {menuItems.map((item) => (
            <button
              key={item}
              type="button"
              className={
                activePage === item
                  ? "nav-button active"
                  : "nav-button"
              }
              onClick={() => setActivePage(item)}
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>{activePage}</h1>
            <p>
              Energy and water intelligence for sustainable farming
            </p>
          </div>

          <div className="status">
            System Online
          </div>
        </header>

        <section className="page-content">
          {renderPage()}
        </section>
      </main>
    </div>
  );
}

export default App;