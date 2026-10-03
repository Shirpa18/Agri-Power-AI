
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();

  const [email, setEmail] = useState("admin@agripower.ai");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setSubmitting(true);

    try {
      await login(email, password);
    } catch (loginError) {
      setError(loginError?.message || "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-background-shape login-shape-one" />
        <div className="login-background-shape login-shape-two" />
      </div>

      <main className="login-container">
        <section className="login-brand-panel">
          <div className="login-brand">
            <div className="login-brand-mark">AP</div>

            <div>
              <div className="login-brand-title">
                AgriPower AI
              </div>

              <div className="login-brand-subtitle">
                Sustainable farm intelligence
              </div>
            </div>
          </div>

          <div className="login-brand-content">
            <div className="login-overline">
              FARM INTELLIGENCE PLATFORM
            </div>

            <h1>
              Smarter energy.
              <br />
              Smarter water.
              <br />
              Smarter farming.
            </h1>

            <p>
              Manage irrigation, energy, sensors and farm
              intelligence from one connected platform.
            </p>
          </div>

          <div className="login-brand-footer">
            <span>Water optimization</span>
            <span>Energy intelligence</span>
            <span>AI assistance</span>
          </div>
        </section>

        <section className="login-form-panel">
          <div className="login-form-wrapper">
            <div className="login-form-header">
              <div className="login-mobile-brand">
                <div className="login-brand-mark">AP</div>

                <div>
                  <strong>AgriPower AI</strong>
                  <span>Farm intelligence</span>
                </div>
              </div>

              <div className="login-form-overline">
                WELCOME BACK
              </div>

              <h2>
                Sign in to your farm
              </h2>

              <p>
                Access your AgriPower AI management dashboard.
              </p>
            </div>

            <form
              className="login-form"
              onSubmit={handleSubmit}
            >
              <div className="login-field">
                <label htmlFor="login-email">
                  Email address
                </label>

                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="Enter your email"
                  autoComplete="email"
                />
              </div>

              <div className="login-field">
                <div className="login-field-label-row">
                  <label htmlFor="login-password">
                    Password
                  </label>
                </div>

                <div className="login-password-wrapper">
                  <input
                    id="login-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="login-password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (previous) => !previous
                      )
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="login-options">
                <label className="login-checkbox">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) =>
                      setRememberMe(
                        event.target.checked
                      )
                    }
                  />

                  <span>
                    Remember me
                  </span>
                </label>
              </div>

              {error && (
                <div className="login-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="login-submit"
                disabled={submitting}
              >
                {submitting
                  ? "Signing in..."
                  : "Sign in"}
              </button>
            </form>

            <div className="login-demo-note">
              <strong>
                Prototype access
              </strong>

              <span>
                Use the demo credentials provided
                for this hackathon prototype.
              </span>
            </div>

            <div className="login-footer">
              <span>
                AgriPower AI
              </span>

              <span>
                Prototype v1.0
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Login;
