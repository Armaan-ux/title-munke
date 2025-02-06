import "./index.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../img/Logo.svg";
import axios from "axios";
import { toast } from "react-toastify";

function ContactUs() {
  const [isChecking, setIsChecking] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [detail, setDetail] = useState("");
  const [error, setError] = useState("");

  const handleContactUs = async () => {
    try {
      setError("");
      setIsChecking(true);
      const response = await axios.post(
        "https://xzwq5drkplcldtb5as64ueusgu0pnatz.lambda-url.us-east-1.on.aws/",
        {
          name,
          email,
          subject,
          message: detail,
        }
      );
      toast.success("Message Sent Successfully!");
      setName("");
      setEmail("");
      setSubject("");
      setDetail("");
    } catch (error) {
      setError("Error Sending Message!");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="contactus-main">
      <div className="contactus-container">
        <form className="contactus-form">
          <div className="contactus-logo">
            <img src={logo} alt="logo" />
          </div>
          <div className="form-group">
            <label for="username">Full Name</label>
            <input
              type="text"
              id="username"
              name="username"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label for="username">Email Address</label>
            <input
              type="text"
              id="username"
              name="username"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label for="username">Subject</label>
            <input
              type="text"
              id="username"
              name="username"
              value={subject}
              required
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label for="username">Message</label>
            <textarea
              type="text"
              id="username"
              name="username"
              value={detail}
              required
              onChange={(e) => setDetail(e.target.value)}
            ></textarea>
          </div>
          <button
            disabled={isChecking || !name || !email || !subject || !detail}
            onClick={() => handleContactUs()}
            type="button"
            className="contactusBtn"
          >
            {isChecking ? (
              "Sending mail.."
            ) : (
              <span>
                <i class="fa-solid fa-paper-plane"></i>Send Message
              </span>
            )}
          </button>
          {error && <div className="error">{error}</div>}
        </form>
        <div class="back-link">
          <Link to={"/"}>&larr; Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
