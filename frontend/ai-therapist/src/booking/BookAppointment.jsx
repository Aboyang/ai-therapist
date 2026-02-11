import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./BookAppointment.css";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function BookAppointment() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    appointmentDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { name, email, appointmentDate } = formData;

    try {
      // Insert / Upsert patient
      const { error: patientError } = await supabase
        .from("patient")
        .upsert({
          email,
          name,
          date_joined: new Date().toISOString(),
        });

      if (patientError) throw patientError;

      // Insert appointment
      const appointmentUUID = uuidv4();

      const { error: appointmentError } = await supabase
        .from("appointment")
        .insert({
          appointment_id: appointmentUUID,
          email,
          appointment_date: appointmentDate,
          summary_url: "https://bardoqybowxfbdnhhega.supabase.co/storage/v1/object/public/patient-summaries/summary_20260211_222937_4f31472db8ce4556afe536c0a29dc0de.html",
        });

      if (appointmentError) throw appointmentError;

      setMessage("Appointment booked successfully!");
      setFormData({
        name: "",
        email: "",
        appointmentDate: "",
      });

    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-page">
      <div className="glass-card">
        <h2>Book Your Appointment</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Booking..." : "Book Appointment"}
          </button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}
