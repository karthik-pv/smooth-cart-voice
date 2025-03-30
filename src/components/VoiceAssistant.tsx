
import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export const VoiceAssistant = () => {
  const [isActive, setIsActive] = useState(false);

  const toggleActive = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="ai-assistant-container">
      <div 
        className={cn("mic-button", isActive && "scale-110")}
        onClick={toggleActive}
      >
        {isActive && (
          <div className="mic-button-ripple opacity-70"></div>
        )}
        
        {isActive ? (
          <div className="mic-wave-container">
            {[...Array(5)].map((_, index) => (
              <div 
                key={index}
                className="mic-wave-bar"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  height: '3px' 
                }}
              />
            ))}
          </div>
        ) : (
          <Mic size={20} />
        )}
      </div>
    </div>
  );
};
