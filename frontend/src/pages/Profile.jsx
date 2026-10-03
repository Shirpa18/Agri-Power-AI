import React from "react";
import { useFarm } from "../context/FarmContext";

function Profile() {
  const {
    farm,
    backendOnline,
  } = useFarm();

  const farmName =
    farm?.name || "Green Valley Farm";

  const location =
    farm?.location || "Karnataka, India";

  return (
    <div className="profile-page">
      <section className="profile-header">
        <div>
          <div className="profile-overline">
            SYSTEM PROFILE
          </div>

          <h1>Profile & system</h1>

          <p>
            Manage the AgriPower AI workspace and
            review the current system configuration.
          </p>
        </div>

        <div className="profile-system-status">
          <span
            className={`profile-status-dot ${
              backendOnline ? "online" : ""
            }`}
          />

          <div>
            <span>Backend status</span>

            <strong>
              {backendOnline
                ? "Connected"
                : "Disconnected"}
            </strong>
          </div>
        </div>
      </section>

      <section className="profile-main-grid">
        <div className="profile-panel">
          <div className="profile-panel-header">
            <div className="profile-user-avatar">
              GV
            </div>

            <div>
              <h2>Farm Administrator</h2>

              <p>
                Green Valley Farm
              </p>
            </div>
          </div>

          <div className="profile-information">
            <div>
              <span>Role</span>
              <strong>Farm Administrator</strong>
            </div>

            <div>
              <span>Farm</span>
              <strong>{farmName}</strong>
            </div>

            <div>
              <span>Location</span>
              <strong>{location}</strong>
            </div>

            <div>
              <span>Access level</span>
              <strong>Full system access</strong>
            </div>
          </div>
        </div>

        <div className="profile-panel">
          <div className="profile-panel-heading">
            <h2>System overview</h2>

            <p>
              Current AgriPower AI configuration.
            </p>
          </div>

          <div className="profile-system-list">
            <div>
              <span>Frontend</span>
              <strong>Operational</strong>
            </div>

            <div>
              <span>Decision engine</span>
              <strong>Active</strong>
            </div>

            <div>
              <span>Farm database</span>
              <strong>
                {backendOnline
                  ? "Connected"
                  : "Offline"}
              </strong>
            </div>

            <div>
              <span>AI assistant</span>
              <strong>Available</strong>
            </div>

            <div>
              <span>Hardware integration</span>
              <strong>Prototype mode</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="profile-panel">
        <div className="profile-panel-heading">
          <h2>AgriPower AI capabilities</h2>

          <p>
            Intelligent services available in the
            current prototype.
          </p>
        </div>

        <div className="profile-capability-grid">
          <div className="profile-capability">
            <div className="profile-capability-icon">
              AI
            </div>

            <div>
              <h3>Farm intelligence</h3>

              <p>
                Combines farm conditions to generate
                irrigation and energy recommendations.
              </p>
            </div>

            <span>Active</span>
          </div>

          <div className="profile-capability">
            <div className="profile-capability-icon">
              W
            </div>

            <div>
              <h3>Water optimization</h3>

              <p>
                Uses soil moisture and water
                availability to support irrigation
                decisions.
              </p>
            </div>

            <span>Active</span>
          </div>

          <div className="profile-capability">
            <div className="profile-capability-icon">
              E
            </div>

            <div>
              <h3>Energy optimization</h3>

              <p>
                Coordinates solar, battery and farm
                energy demand.
              </p>
            </div>

            <span>Active</span>
          </div>

          <div className="profile-capability">
            <div className="profile-capability-icon">
              S
            </div>

            <div>
              <h3>Sensor integration</h3>

              <p>
                Supports live sensor data ingestion
                from the physical farm system.
              </p>
            </div>

            <span>Prototype</span>
          </div>
        </div>
      </section>

      <section className="profile-panel">
        <div className="profile-panel-heading">
          <h2>System architecture</h2>

          <p>
            Current flow of information through the
            platform.
          </p>
        </div>

        <div className="profile-architecture">
          <div className="profile-architecture-step">
            <span>01</span>

            <div>
              <strong>Farm sensors</strong>
              <p>
                Collect soil, water, energy and
                equipment data.
              </p>
            </div>
          </div>

          <div className="profile-architecture-arrow">
            →
          </div>

          <div className="profile-architecture-step">
            <span>02</span>

            <div>
              <strong>Decision engine</strong>
              <p>
                Evaluates conditions and determines
                operating recommendations.
              </p>
            </div>
          </div>

          <div className="profile-architecture-arrow">
            →
          </div>

          <div className="profile-architecture-step">
            <span>03</span>

            <div>
              <strong>AI assistant</strong>
              <p>
                Explains decisions and provides
                farmer-friendly guidance.
              </p>
            </div>
          </div>

          <div className="profile-architecture-arrow">
            →
          </div>

          <div className="profile-architecture-step">
            <span>04</span>

            <div>
              <strong>Farm action</strong>
              <p>
                Pump and energy systems respond to
                approved operating decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="profile-footer-card">
        <div>
          <strong>AgriPower AI</strong>

          <p>
            Sustainable agriculture through
            intelligent energy and water management.
          </p>
        </div>

        <span>
          Prototype v1.0
        </span>
      </section>
    </div>
  );
}

export default Profile;