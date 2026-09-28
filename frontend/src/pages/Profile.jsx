import { useState } from "react";

function Profile() {
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    name: "Farm Administrator",
    phone: "+91 98765 43210",
    email: "farmer@example.com",
    language: "English",
    notifications: true,
    irrigationAlerts: true,
    energyAlerts: true,
    weatherAlerts: true,
    autoRecommendations: true,
    voiceAssistant: false,
  });

  const updateField = (field, value) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
    setSaved(false);
  };

  const handleSave = (event) => {
    event.preventDefault();
    setSaved(true);
  };

  return (
    <div className="profile-page">
      <div className="page-heading">
        <div>
          <span className="section-label">ACCOUNT & PREFERENCES</span>
          <h2>Profile</h2>
          <p>
            Manage your farmer profile, language, alerts and AI preferences.
          </p>
        </div>

        <div className="setup-status">
          <span className="status-dot"></span>
          Account Active
        </div>
      </div>

      {saved && (
        <div className="save-message">
          Profile preferences saved successfully.
        </div>
      )}

      <form onSubmit={handleSave}>
        <div className="profile-layout">
          <section className="panel profile-card">
            <div className="profile-avatar">FA</div>

            <h3>{profile.name}</h3>
            <p>Farm Administrator</p>

            <div className="profile-location">
              Karnataka, India
            </div>

            <div className="profile-divider"></div>

            <div className="profile-status-row">
              <span>Farm System</span>
              <strong className="online-text">Online</strong>
            </div>

            <div className="profile-status-row">
              <span>Sensor Network</span>
              <strong className="online-text">Connected</strong>
            </div>

            <div className="profile-status-row">
              <span>AI Assistant</span>
              <strong className="online-text">Ready</strong>
            </div>
          </section>

          <div className="profile-main">
            <section className="panel">
              <div className="panel-header">
                <div>
                  <h3>Personal Information</h3>
                  <p>
                    Basic contact information for your AgriPower AI account.
                  </p>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) =>
                      updateField("name", e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) =>
                      updateField("phone", e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      updateField("email", e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Preferred Language</label>
                  <select
                    value={profile.language}
                    onChange={(e) =>
                      updateField("language", e.target.value)
                    }
                  >
                    <option>English</option>
                    <option>Kannada</option>
                    <option>Hindi</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="panel">
              <div className="panel-header">
                <div>
                  <h3>Notification Preferences</h3>
                  <p>
                    Choose which farm events should generate notifications.
                  </p>
                </div>
              </div>

              <div className="preference-list">
                <label className="preference-row">
                  <div>
                    <strong>Farm Notifications</strong>
                    <span>
                      Receive important updates from AgriPower AI.
                    </span>
                  </div>

                  <input
                    type="checkbox"
                    checked={profile.notifications}
                    onChange={(e) =>
                      updateField("notifications", e.target.checked)
                    }
                  />
                </label>

                <label className="preference-row">
                  <div>
                    <strong>Irrigation Alerts</strong>
                    <span>
                      Get notified when irrigation is recommended.
                    </span>
                  </div>

                  <input
                    type="checkbox"
                    checked={profile.irrigationAlerts}
                    onChange={(e) =>
                      updateField(
                        "irrigationAlerts",
                        e.target.checked
                      )
                    }
                  />
                </label>

                <label className="preference-row">
                  <div>
                    <strong>Energy Alerts</strong>
                    <span>
                      Receive solar, battery and grid notifications.
                    </span>
                  </div>

                  <input
                    type="checkbox"
                    checked={profile.energyAlerts}
                    onChange={(e) =>
                      updateField("energyAlerts", e.target.checked)
                    }
                  />
                </label>

                <label className="preference-row">
                  <div>
                    <strong>Weather Alerts</strong>
                    <span>
                      Get notified about rain and weather changes.
                    </span>
                  </div>

                  <input
                    type="checkbox"
                    checked={profile.weatherAlerts}
                    onChange={(e) =>
                      updateField("weatherAlerts", e.target.checked)
                    }
                  />
                </label>
              </div>
            </section>

            <section className="panel">
              <div className="panel-header">
                <div>
                  <h3>AI Preferences</h3>
                  <p>
                    Control how AgriPower AI interacts with your farm.
                  </p>
                </div>
              </div>

              <div className="preference-list">
                <label className="preference-row">
                  <div>
                    <strong>Automatic Recommendations</strong>
                    <span>
                      Allow AI to continuously generate irrigation and energy
                      recommendations.
                    </span>
                  </div>

                  <input
                    type="checkbox"
                    checked={profile.autoRecommendations}
                    onChange={(e) =>
                      updateField(
                        "autoRecommendations",
                        e.target.checked
                      )
                    }
                  />
                </label>

                <label className="preference-row">
                  <div>
                    <strong>Voice Assistant</strong>
                    <span>
                      Enable voice interaction for future farmer assistance.
                    </span>
                  </div>

                  <input
                    type="checkbox"
                    checked={profile.voiceAssistant}
                    onChange={(e) =>
                      updateField(
                        "voiceAssistant",
                        e.target.checked
                      )
                    }
                  />
                </label>
              </div>

              <div className="ai-language-box">
                <div>
                  <span className="section-label">LANGUAGE READY</span>
                  <h4>Farmer-friendly AI</h4>
                  <p>
                    AgriPower AI is designed to support local-language
                    recommendations and simple explanations.
                  </p>
                </div>

                <div className="language-pills">
                  <span className={profile.language === "English" ? "selected" : ""}>
                    English
                  </span>
                  <span className={profile.language === "Kannada" ? "selected" : ""}>
                    ಕನ್ನಡ
                  </span>
                  <span className={profile.language === "Hindi" ? "selected" : ""}>
                    हिन्दी
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="farm-actions">
          <div>
            <strong>Keep your preferences updated</strong>
            <p>
              These settings control how the AgriPower AI interface behaves.
            </p>
          </div>

          <button className="primary-button" type="submit">
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;