import "./index.css";
import Logo from "../../img/Logo.svg";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  function navigateToLogin() {
    navigate("/login");
  }

  return (
    <div className="home">
      <header data-aos="fade-down">
        <div className="logo-container">
          <img src={Logo} alt="Title Munke Logo" className="logo" />
        </div>
        <div className="nav-buttons">
          <button onClick={navigateToLogin}>
            <i className="fa-solid fa-door-open"></i>
          </button>
          {/* <button>
            <i className="fa-solid fa-user-plus"></i>
          </button>
          <button>
            <i className="fa-solid fa-door-open"></i>
          </button> */}
        </div>
      </header>

      <div className="wrapper">
        <section className="section overview-section" data-aos="fade-up">
          <h2>About Title Munke</h2>
          <p>
            Title Munke transforms the title search process with cutting‑edge
            AI, providing fast, accurate, and comprehensive reports. Designed
            for brokers and agents, our service ensures you make informed and
            secure property decisions.
          </p>
        </section>

        <section className="section process-section" data-aos="fade-up">
          <h2>
            <i className="fa-solid fa-cogs"></i> How It Works
          </h2>
          <div className="process-steps">
            <div className="process-step" data-aos="zoom-in">
              <span className="step-number">1</span>
              <i className="fa-solid fa-location-dot"></i>
              <h3>Input Details</h3>
              <p>Enter the property address, PIN, or PARNUM.</p>
            </div>
            <div
              className="process-step"
              data-aos="zoom-in"
              data-aos-delay="100"
            >
              <span className="step-number">2</span>
              <i className="fa-solid fa-magnifying-glass"></i>
              <h3>Automated Search</h3>
              <p>Our AI scans public records to gather relevant documents.</p>
            </div>
            <div
              className="process-step"
              data-aos="zoom-in"
              data-aos-delay="200"
            >
              <span className="step-number">3</span>
              <i className="fa-solid fa-chart-line"></i>
              <h3>Data Analysis</h3>
              <p>We interpret key data to generate a comprehensive report.</p>
            </div>
            <div
              className="process-step"
              data-aos="zoom-in"
              data-aos-delay="300"
            >
              <span className="step-number">4</span>
              <i className="fa-solid fa-clock"></i>
              <h3>Instant Delivery</h3>
              <p>Your title report is delivered in minutes.</p>
            </div>
          </div>
          <div className="view-sample" data-aos="fade-up" data-aos-delay="350">
            <button>
              <i className="fa-solid fa-file-alt"></i> View a Sample Report
            </button>
          </div>
        </section>

        <section className="section key-features" data-aos="fade-up">
          <h2>Our Key Features</h2>
          <div className="features-container">
            <div className="feature">
              <i className="fa-solid fa-tags"></i>
              <h3>Transparent Pricing</h3>
              <p>Honest, upfront fees with no hidden costs.</p>
            </div>
            <div className="feature">
              <i className="fa-solid fa-graduation-cap"></i>
              <h3>Expert Insights</h3>
              <p>
                Guidance from seasoned professionals to simplify complex
                searches.
              </p>
            </div>
            <div className="feature">
              <i className="fa-solid fa-bolt"></i>
              <h3>Rapid Reports</h3>
              <p>
                Get detailed, accurate title reports quickly and efficiently.
              </p>
            </div>
          </div>
        </section>

        <section className="section learn-more" data-aos="fade-up">
          <h2>Why Choose Title Munke?</h2>
          <div className="content">
            <h3>Secure Your Investment</h3>
            <p>
              Our comprehensive searches uncover all pertinent property details,
              ensuring you invest with confidence.
            </p>

            <h3>Clarity &amp; Simplicity</h3>
            <p>
              We deliver clear, concise reports that make complex property data
              easy to understand.
            </p>

            <h3>Efficiency &amp; Expertise</h3>
            <p>
              Leveraging AI and industry experience, we provide swift, reliable
              results so you can move forward without delay.
            </p>
          </div>
        </section>

        <section className="section contact-section" data-aos="fade-up">
          <h2>
            <i className="fa-solid fa-envelope"></i> Contact Us
          </h2>
          <p>
            If you have any questions or need further assistance, our team is
            here to help you every step of the way.
          </p>
          <button>Get in Touch</button>
        </section>
      </div>
      <footer className="footer" data-aos="fade-up">
        <p>&copy; 2025 Title Munke. All rights reserved.</p>
      </footer>
    </div>
  );
}
