import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CarlaAvatar from './components/CarlaAvatar';
import CarlaControls from './components/CarlaControls';
import './App.css';

const CarlaAnimationApp = () => {
  const [isActive, setIsActive] = useState(true);
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');

  const handleEmotionChange = (emotion) => {
    setCurrentEmotion(emotion);
  };

  const handleSpeechToggle = (speaking) => {
    setIsSpeaking(speaking);
  };

  const handleMessageChange = (message) => {
    setCurrentMessage(message);
  };

  const handleActiveToggle = () => {
    setIsActive(!isActive);
    if (!isActive) {
      // Reset states when deactivating
      setCurrentEmotion('neutral');
      setIsSpeaking(false);
      setCurrentMessage('');
    }
  };

  const handleAnimationComplete = () => {
    // Reset to neutral after emotion animation
    if (currentEmotion !== 'neutral') {
      setTimeout(() => {
        setCurrentEmotion('neutral');
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.15)_1px,transparent_0)] bg-[size:20px_20px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex">
        {/* Avatar Section */}
        <div className="flex-1 flex items-center justify-center">
          <CarlaAvatar
            isActive={isActive}
            emotion={currentEmotion}
            isSpeaking={isSpeaking}
            message={currentMessage}
            onAnimationComplete={handleAnimationComplete}
          />
        </div>

        {/* Controls Section */}
        <CarlaControls
          onEmotionChange={handleEmotionChange}
          onSpeechToggle={handleSpeechToggle}
          onMessageChange={handleMessageChange}
          isActive={isActive}
          onActiveToggle={handleActiveToggle}
          currentEmotion={currentEmotion}
          isSpeaking={isSpeaking}
          currentMessage={currentMessage}
        />
      </div>

      {/* Title */}
      <div className="absolute top-8 left-8 z-20">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          🗣️ Carla - Assistant Vocal Animé
        </h1>
        <p className="text-gray-600">
          Synthèse vocale • Mouvements labiaux • Gestes des mains
        </p>
      </div>

      {/* Status Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-20">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm">
              {isActive ? 'Carla est active' : 'Carla est en pause'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Émotion: {currentEmotion}</span>
            <span>•</span>
            <span>{isSpeaking ? 'Synthèse vocale active' : 'Silencieuse'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CarlaAnimationApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;