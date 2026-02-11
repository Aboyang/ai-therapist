import { motion } from 'framer-motion';
import { User, Zap, Waves } from 'lucide-react';
import './AgentStyleStep.css';

const voiceOptions = [
  { value: 'female', label: 'Female Voice', desc: 'Warm and nurturing', icon: User },
  { value: 'male', label: 'Male Voice', desc: 'Calm and grounded', icon: User },
];

const styleOptions = [
  { value: 'soothing', label: 'Soothing', desc: 'Gentle, calm, and relaxed pace', icon: Waves },
  { value: 'energetic', label: 'Energetic', desc: 'Uplifting, encouraging, and active', icon: Zap },
];

export default function AgentStyleStep({ data, onChange }) {
  const handleVoiceSelect = (value) => onChange({ ...data, voice_type: value });
  const handleStyleSelect = (value) => onChange({ ...data, style: value });

  const OptionButton = ({ option, selected, onClick, color }) => {
    const Icon = option.icon;
    const selectedClass = selected ? `${color}-selected` : '';

    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`option-button ${selectedClass}`}
      >
        <div className="option-icon-wrapper">
          <Icon className="option-icon" />
        </div>
        <h3 className="option-label">{option.label}</h3>
        <p className="option-desc">{option.desc}</p>
        {selected && (
          <div className="option-indicator" style={{ color: color === 'sage' ? '#4b6654' : '#7f6bbf' }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="option-indicator-inner" />
          </div>
        )}
      </motion.button>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="agent-style-step"
    >
      <div className="agent-style-header">
        <h2>Customize your companion</h2>
        <p>Choose the voice and style that feels right for you</p>
      </div>

      {/* Voice Type */}
      <div className="voice-section">
        <p className="section-title">Voice Type</p>
        <div className="options-grid">
          {voiceOptions.map((option) => (
            <OptionButton
              key={option.value}
              option={option}
              selected={data.voice_type === option.value}
              onClick={() => handleVoiceSelect(option.value)}
              color="sage"
            />
          ))}
        </div>
      </div>

      {/* Conversation Style */}
      <div className="style-section">
        <p className="section-title">Conversation Style</p>
        <div className="options-grid">
          {styleOptions.map((option) => (
            <OptionButton
              key={option.value}
              option={option}
              selected={data.style === option.value}
              onClick={() => handleStyleSelect(option.value)}
              color="lavender"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
