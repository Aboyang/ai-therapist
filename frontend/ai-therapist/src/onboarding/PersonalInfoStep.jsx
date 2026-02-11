import { User, Calendar } from 'lucide-react';
import './PersonalInfoStep.css';

export default function PersonalInfoStep({ data, onChange }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  return (
    <div className="personal-info-step">
      {/* Age */}
      <div className="field-group">
        <label className="field-label">
          <Calendar className="field-icon" />
          Age
        </label>
        <input
          type="number"
          name="age"
          value={data.age}
          onChange={handleInputChange}
          placeholder="Enter your age"
          className="field-input"
          min={0}
        />
      </div>

      {/* Gender */}
      <div className="field-group">
        <label className="field-label">
          <User className="field-icon" />
          Gender
        </label>
        <select
          name="gender"
          value={data.gender}
          onChange={handleInputChange}
          className="field-select"
        >
          <option value="">Select your gender</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="non-binary">Non-binary</option>
          <option value="prefer-not-to-say">Prefer not to say</option>
        </select>
      </div>

      {/* Optional: Additional context */}
      <div className="field-group">
        <label className="field-label">Additional context (optional)</label>
        <textarea
          name="additional_context"
          value={data.additional_context}
          onChange={handleInputChange}
          placeholder="Anything you'd like the AI agent to know?"
          className="field-textarea"
          rows={3}
        />
      </div>
    </div>
  );
}
