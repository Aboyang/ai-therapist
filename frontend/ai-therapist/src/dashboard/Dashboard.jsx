import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

import { useState, useEffect } from "react";
import { FileText, ChevronDown, ChevronUp } from "lucide-react";
import Chat from "../chat/Chat";
import "./Dashboard.css";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("appointments");
  const [expandedAppointments, setExpandedAppointments] = useState({});
  const [expandedPatients, setExpandedPatients] = useState({});
  const [filterText, setFilterText] = useState("");
  const [apptSortAsc, setApptSortAsc] = useState(true);
  const [patientSortAsc, setPatientSortAsc] = useState(true);

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchAppointments();
    fetchPatientsHistory();
  }, []);

  const fetchAppointments = async () => {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("appointment")
      .select(`
        appointment_id,
        appointment_date,
        summary_url,
        patient ( name )
      `)
      .gt("appointment_date", now);

    if (!error && data) {
      const formatted = data.map(appt => ({
        id: appt.appointment_id,
        patient: appt.patient?.name,
        date: appt.appointment_date,
        summary: appt.summary_url
      }));
      setAppointments(formatted);
    }
  };

  const fetchPatientsHistory = async () => {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("patient")
      .select(`
        email,
        name,
        date_joined,
        appointment (
          appointment_id,
          appointment_date,
          summary_url
        )
      `);

    if (!error && data) {
      const formatted = data.map(p => ({
        id: p.email,
        name: p.name,
        email: p.email,
        date_joined: p.date_joined,
        appointments: (p.appointment || [])
          .filter(a => new Date(a.appointment_date) < new Date())
          .map(a => ({
            id: a.appointment_id,
            date: a.appointment_date,
            summary: a.summary_url
          }))
      }));

      setPatients(formatted);
    }
  };


  const toggleAppointment = (id) => {
    setExpandedAppointments(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const togglePatient = (id) => {
    setExpandedPatients(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredAppointments = appointments
    .filter(a => a.patient?.toLowerCase().includes(filterText.toLowerCase()))
    .sort((a, b) =>
      apptSortAsc
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date)
    );

  const filteredPatients = patients
    .filter(p => p.name.toLowerCase().includes(filterText.toLowerCase()))
    .sort((a, b) =>
      patientSortAsc
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

  return (
    <div className="dashboard">
      <div className="dashboard-left">
        <h2 className="dashboard-title">Dashboard</h2>

        <div className="tabs">
          <button
            className={activeTab === "appointments" ? "active" : ""}
            onClick={() => setActiveTab("appointments")}
          >
            Appointments
            {appointments.length > 0 && (
              <span className="tab-badge">{appointments.length}</span>
            )}
          </button>
          <button
            className={activeTab === "patients" ? "active" : ""}
            onClick={() => setActiveTab("patients")}
          >
            My Patients
          </button>
        </div>

        <div className="filter-sort">
          <input
            type="text"
            placeholder="Search by name..."
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
          />
          {activeTab === "appointments" && (
            <button onClick={() => setApptSortAsc(!apptSortAsc)}>
              Sort by Date {apptSortAsc ? "↑" : "↓"}
            </button>
          )}
          {activeTab === "patients" && (
            <button onClick={() => setPatientSortAsc(!patientSortAsc)}>
              Sort by Name {patientSortAsc ? "↑" : "↓"}
            </button>
          )}
        </div>

        {activeTab === "appointments" && (
          <ul className="list">
            {filteredAppointments.map(appt => (
              <li key={appt.id} className="list-item">
                <div className="list-header" onClick={() => toggleAppointment(appt.id)}>
                  <span>{appt.patient} - {new Date(appt.date).toLocaleString()}</span>
                  {expandedAppointments[appt.id]
                    ? <ChevronUp size={18} />
                    : <ChevronDown size={18} />}
                </div>
                {expandedAppointments[appt.id] && (
                  <div className="list-body">
                    <p><strong>Date:</strong> {new Date(appt.date).toLocaleString()}</p>
                    <FileText
                      className="pdf-icon"
                      size={18}
                      onClick={() => window.open(appt.summary, "_blank")}
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        {activeTab === "patients" && (
          <ul className="list">
            {filteredPatients.map(patient => (
              <li key={patient.id} className="list-item">
                <div className="list-header" onClick={() => togglePatient(patient.id)}>
                  <span>{patient.name}</span>
                  {expandedPatients[patient.id]
                    ? <ChevronUp size={18} />
                    : <ChevronDown size={18} />}
                </div>
                {expandedPatients[patient.id] && (
                  <div className="list-body">
                    <p><strong>Email:</strong> {patient.email}</p>
                    <p><strong>Date Joined:</strong> {new Date(patient.date_joined).toLocaleDateString()}</p>

                    <ul className="patient-appointments">
                      {patient.appointments.map(appt => (
                        <li key={appt.id}>
                          <span>{new Date(appt.date).toLocaleDateString()}</span>
                          <FileText
                            className="pdf-icon"
                            size={18}
                            onClick={() => window.open(appt.summary, "_blank")}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="dashboard-right">
        <Chat />
      </div>
    </div>
  );
}
