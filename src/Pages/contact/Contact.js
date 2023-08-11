import React, { useState } from "react";
import axios from 'axios';
import "./contact.scss";
import Card from "../../components/Card/Card";
import { FaPhoneAlt, FaEnvelope, FaTwitter } from "react-icons/fa";
import { GoLocation } from "react-icons/go";
import {toast} from 'react-toastify';
import { BACKEND_URL } from "../../services/authService";

const Contact = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const data = {
    subject,
    message,
  };
  const sendEmail = async(e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/contactus`, data
      )
      setSubject("")
      setMessage('')
      toast.success(response.data.message)
    } catch (error) {
      toast.error(error.message)
    }
  };

  return (
    <div className="contact">
      <h3 className="--mt">Contact Us</h3>
      <div className="section">
        <form onSubmit={sendEmail}>
          <Card cardClass="card">
            <label>Subject</label>
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={subject}
              required
              onChange={(e) => setSubject(e.target.value)}
            />
            <label>Message</label>
            <textarea
              cols="30"
              rows="10"
              name="message"
              placeholder="Input your message here"
              value={message}
              required
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <button className="--btn --btn-primary">Send Message</button>
          </Card>
        </form>

        <div className="details">
          <Card cardClass={"card2"}>
            <h3> Our Contact Information</h3>
            <p>Fill the form or contact us via other channels listed below</p>

            <div className="icons">
              <span>
                <FaPhoneAlt />
                <p>011 2345 6789</p>
              </span>
              <span>
                <FaEnvelope/>
                <p>support@invent.com</p>
              </span>
              <span>
                <GoLocation />
                <p>Nakuru, Kenya</p>
              </span>
              <span>
                <FaTwitter />
                <p>@Marindany</p>
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
