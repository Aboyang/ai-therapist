import React from 'react';
import { Check } from 'lucide-react';
import './StepIndicator.css';

export default function StepIndicator({ currentStep, totalSteps }) {
  return (
    <div className="step-indicator">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        let circleClass = 'step-circle';
        if (isCompleted) circleClass += ' completed';
        else if (isCurrent) circleClass += ' current';
        else circleClass += ' upcoming';

        return (
          <React.Fragment key={index}>
            <div className={circleClass}>
              {isCompleted ? <Check className="w-5 h-5 text-white" /> : index + 1}
              {isCurrent && <div className="active-ring" />}
            </div>

            {index < totalSteps - 1 && (
              <div className={`connector ${isCompleted ? 'completed' : 'upcoming'}`} style={{ width: '3rem' }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
