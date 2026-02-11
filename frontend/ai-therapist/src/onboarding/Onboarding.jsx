import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import './Onboarding.css';

import StepIndicator from './StepIndicator';
import PersonalInfoStep from './PersonalInfoStep';
import ConcernsStep from './ConcernsStep';
import AgentStyleStep from './AgentStyleStep';

const stepsConfig = [
  { component: PersonalInfoStep, key: 'userInfo', requiredFields: ['age', 'gender'] },
  { component: ConcernsStep, key: 'userInfo', requiredFields: ['concerns'] },
  { component: AgentStyleStep, key: 'agentPreferences', requiredFields: ['voice_type', 'style'] }
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Context for AI tuning
  const [userInfo, setUserInfo] = useState({ age: '', gender: '', concerns: [], additional_context: '' });
  const [agentPreferences, setAgentPreferences] = useState({ voice_type: 'female', style: 'soothing' });

  const stateMap = { userInfo, agentPreferences };
  const setStateMap = { userInfo: setUserInfo, agentPreferences: setAgentPreferences };

  const CurrentStep = stepsConfig[currentStep].component;
  const currentData = stateMap[stepsConfig[currentStep].key];
  const setCurrentData = setStateMap[stepsConfig[currentStep].key];

  const canProceed = () => {
    const required = stepsConfig[currentStep].requiredFields;
    return required.every(field => {
      const val = currentData[field];
      return Array.isArray(val) ? val.length > 0 : !!val;
    });
  };

  const handleNext = async () => {
    if (currentStep < stepsConfig.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsLoading(true);
      // Finalize onboarding and navigate to ConvoAI, passing context
      const query = new URLSearchParams({
        user: JSON.stringify(userInfo),
        agent: JSON.stringify(agentPreferences)
      }).toString();

      navigate(`/convo?${query}`);
    }
  };

  const handleBack = () => currentStep > 0 ? setCurrentStep(prev => prev - 1) : navigate('/');

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <StepIndicator currentStep={currentStep} totalSteps={stepsConfig.length} />

        <AnimatePresence mode="wait">
          <CurrentStep key={currentStep} data={currentData} onChange={setCurrentData} />
        </AnimatePresence>

        <div className="navigation-buttons">
          {/* Back Button */}
          <button onClick={handleBack} className="button-back">
            <ArrowLeft className="button-icon" />
            Back
          </button>

          {/* Next / Start Button */}
          <button
            onClick={handleNext}
            disabled={!canProceed() || isLoading}
            className={`button-next ${
              isLoading
                ? 'disabled'
                : currentStep === stepsConfig.length - 1
                ? 'last'
                : 'default'
            }`}
          >
            {isLoading ? (
              <motion.div
                className="loader"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="button-icon" />
              </motion.div>
            ) : currentStep === stepsConfig.length - 1 ? (
              <>
                <Sparkles className="button-icon" />
                Begin Session
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="button-icon" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>

  );
}
