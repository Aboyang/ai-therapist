import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Cloud, Users, Sparkles, Moon, Flame, Leaf, Brain } from 'lucide-react';
import './ConcernsStep.css';

const concernsList = [
  { id: 'anxiety', label: 'Anxiety', icon: Cloud },
  { id: 'depression', label: 'Depression', icon: Moon },
  { id: 'stress', label: 'Stress', icon: Flame },
  { id: 'relationships', label: 'Relationships', icon: Users },
  { id: 'self_esteem', label: 'Self-esteem', icon: Sparkles },
  { id: 'grief', label: 'Grief & Loss', icon: Heart },
  { id: 'trauma', label: 'Trauma', icon: Brain },
  { id: 'general_wellness', label: 'General Wellness', icon: Leaf },
];

export default function ConcernsStep({ data, onChange }) {
  const toggleConcern = (id) => {
    const current = data.concerns || [];
    const updated = current.includes(id)
      ? current.filter(c => c !== id)
      : [...current, id];
    onChange({ ...data, concerns: updated });
  };

  const handleContextChange = (e) => {
    onChange({ ...data, additional_context: e.target.value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="concerns-step"
    >
      {/* Header */}
      <div className="concerns-header">
        <h2>What brings you here today?</h2>
        <p>Select all that apply</p>
      </div>

      {/* Concerns grid */}
      <div className="concerns-grid">
        {concernsList.map((concern, index) => {
          const isSelected = (data.concerns || []).includes(concern.id);
          const Icon = concern.icon;

          return (
            <motion.button
              key={concern.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => toggleConcern(concern.id)}
              className={`concern-button ${isSelected ? 'selected' : ''}`}
            >
              <div className="concern-icon-wrapper">
                <Icon className="concern-icon" />
              </div>
              <span className="concern-label">{concern.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
