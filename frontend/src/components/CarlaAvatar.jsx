import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CarlaAvatar = ({ 
  isActive = false, 
  emotion = 'neutral', 
  isSpeaking = false,
  message = '',
  onAnimationComplete = () => {}
}) => {
  const [currentAnimation, setCurrentAnimation] = useState('idle');
  const [isBlinking, setIsBlinking] = useState(false);
  const [mouthState, setMouthState] = useState('closed');
  const [handGesture, setHandGesture] = useState('idle');
  const [lipSync, setLipSync] = useState(false);
  const speechSynthRef = useRef(null);
  const [isRealSpeaking, setIsRealSpeaking] = useState(false);

  // Carla's image - you provided this beautiful professional avatar
  const carlaImage = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";

  // Speech synthesis function
  const speakText = (text) => {
    if ('speechSynthesis' in window && text) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      
      // Find a French voice
      const voices = window.speechSynthesis.getVoices();
      const frenchVoice = voices.find(voice => voice.lang.includes('fr')) || voices[0];
      if (frenchVoice) {
        utterance.voice = frenchVoice;
      }
      
      utterance.onstart = () => {
        setIsRealSpeaking(true);
        setLipSync(true);
        setHandGesture('talking');
      };
      
      utterance.onend = () => {
        setIsRealSpeaking(false);
        setLipSync(false);
        setHandGesture('idle');
      };
      
      speechSynthRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Hand gesture animations - Plus réalistes
  const handGestures = {
    idle: {
      rotate: 0,
      scale: 1,
      y: 0,
      transition: { duration: 0.5 }
    },
    talking: {
      rotate: [-10, 10, -10],
      scale: [1, 1.2, 1],
      y: [0, -5, 0],
      transition: { duration: 0.7, repeat: Infinity }
    },
    waving: {
      rotate: [0, 25, -25, 0],
      scale: [1, 1.3, 1.3, 1],
      transition: { duration: 0.8, repeat: 2 }
    },
    pointing: {
      rotate: 25,
      scale: 1.4,
      y: -10,
      transition: { duration: 0.3 }
    }
  };

  // Animation states
  const animations = {
    idle: {
      scale: 1,
      y: 0,
      transition: { duration: 2, repeat: Infinity, repeatType: 'reverse' }
    },
    speaking: {
      scale: [1, 1.02, 1],
      y: [0, -2, 0],
      transition: { duration: 0.5, repeat: Infinity }
    },
    happy: {
      scale: 1.05,
      y: -5,
      transition: { duration: 0.3 }
    },
    thinking: {
      x: [-2, 2, -2],
      transition: { duration: 1, repeat: Infinity }
    }
  };

  // Emotional expressions (simulated through CSS filters and transforms)
  const emotionStyles = {
    neutral: { filter: 'brightness(1) contrast(1)' },
    happy: { filter: 'brightness(1.1) contrast(1.1) saturate(1.2)' },
    sad: { filter: 'brightness(0.9) contrast(0.9) saturate(0.8)' },
    surprised: { filter: 'brightness(1.2) contrast(1.2)' },
    thinking: { filter: 'brightness(0.95) contrast(1.05)' }
  };

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Speech animation - Real speech synthesis
  useEffect(() => {
    if (message && isSpeaking) {
      speakText(message);
    } else if (!isSpeaking && speechSynthRef.current) {
      window.speechSynthesis.cancel();
      setIsRealSpeaking(false);
      setLipSync(false);
      setHandGesture('idle');
    }
  }, [message, isSpeaking]);

  // Lip sync animation
  useEffect(() => {
    if (lipSync && isRealSpeaking) {
      const lipSyncInterval = setInterval(() => {
        setMouthState(prev => prev === 'open' ? 'closed' : 'open');
      }, 150);
      return () => clearInterval(lipSyncInterval);
    } else {
      setMouthState('closed');
    }
  }, [lipSync, isRealSpeaking]);

  // Original speech animation fallback
  useEffect(() => {
    if (isSpeaking && !isRealSpeaking) {
      setCurrentAnimation('speaking');
      const speechInterval = setInterval(() => {
        setMouthState(prev => prev === 'open' ? 'closed' : 'open');
      }, 200);
      return () => clearInterval(speechInterval);
    } else {
      setCurrentAnimation('idle');
    }
  }, [isSpeaking, isRealSpeaking]);

  // Emotion-based animation
  useEffect(() => {
    if (emotion !== 'neutral' && !isSpeaking) {
      setCurrentAnimation(emotion);
      const timeout = setTimeout(() => {
        setCurrentAnimation('idle');
        onAnimationComplete();
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [emotion, isSpeaking, onAnimationComplete]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      {/* Main Avatar Container */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Avatar Image with Animations */}
        <motion.div
          className="relative w-96 h-96 rounded-full overflow-hidden shadow-2xl border-4 border-white"
          animate={animations[currentAnimation]}
          style={emotionStyles[emotion]}
        >
          {/* Base Avatar Image - VOTRE Carla */}
          <img 
            src="/carla-avatar.jpg"
            alt="Carla Avatar"
            className="w-full h-full object-cover"
            style={{ 
              filter: `${emotionStyles[emotion].filter}`,
              transform: isSpeaking ? 'scale(1.02)' : 'scale(1)'
            }}
          />

          {/* Mouth Animation Overlay - Animation des lèvres */}
          <AnimatePresence>
            {mouthState === 'open' && (isRealSpeaking || isSpeaking) && (
              <motion.div
                className="absolute"
                style={{
                  bottom: '35%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '8px',
                  height: '4px',
                  background: 'rgba(139, 69, 19, 0.8)',
                  borderRadius: '50%'
                }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                exit={{ scaleY: 0 }}
                transition={{ duration: 0.1 }}
              />
            )}
          </AnimatePresence>

          {/* Hand Animation Overlays - Animation des mains */}
          <AnimatePresence>
            {(isRealSpeaking || isSpeaking) && (
              <>
                {/* Main gauche */}
                <motion.div
                  className="absolute"
                  style={{
                    bottom: '15%',
                    left: '15%',
                    width: '20px',
                    height: '20px',
                    background: '#F3E5AB',
                    borderRadius: '50%',
                    border: '2px solid #DDD'
                  }}
                  animate={{
                    y: [0, -5, 0],
                    rotate: [-10, 10, -10],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
                
                {/* Main droite */}
                <motion.div
                  className="absolute"
                  style={{
                    bottom: '15%',
                    right: '15%',
                    width: '20px',
                    height: '20px',
                    background: '#F3E5AB',
                    borderRadius: '50%',
                    border: '2px solid #DDD'
                  }}
                  animate={{
                    y: [0, -5, 0],
                    rotate: [10, -10, 10],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                />
              </>
            )}
          </AnimatePresence>
          
          {/* Blinking Overlay */}
          <AnimatePresence>
            {isBlinking && (
              <motion.div
                className="absolute inset-0 bg-black bg-opacity-20"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                exit={{ scaleY: 0 }}
                transition={{ duration: 0.1 }}
                style={{ transformOrigin: 'top' }}
              />
            )}
          </AnimatePresence>

          {/* Speaking Indicator */}
          {(isSpeaking || isRealSpeaking) && (
            <motion.div
              className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.3, repeat: Infinity }}
            >
              <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg" />
            </motion.div>
          )}

          {/* Hand Gestures - Supprimés car intégrés dans l'image */}

          {/* Emotion Particles */}
          {emotion === 'happy' && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + i * 10}%`
                  }}
                  animate={{
                    y: [-10, -30, -10],
                    opacity: [1, 0.5, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-20 blur-xl"
          animate={{
            scale: isActive ? [1, 1.1, 1] : 1,
            opacity: isActive ? [0.2, 0.4, 0.2] : 0.1
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* Name Tag */}
      <motion.div
        className="mt-8 bg-white rounded-full px-6 py-3 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gray-800">Carla</h2>
        <p className="text-sm text-gray-600 mt-1">Assistant Virtuel</p>
      </motion.div>

      {/* Speech Bubble */}
      <AnimatePresence>
        {message && (
          <motion.div
            className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl p-4 shadow-lg max-w-xs"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-gray-800 text-sm">{message}</p>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
              <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
        <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
        <div className={`w-3 h-3 rounded-full ${(isSpeaking || isRealSpeaking) ? 'bg-blue-500' : 'bg-gray-400'}`} />
        <div className={`w-3 h-3 rounded-full ${emotion !== 'neutral' ? 'bg-purple-500' : 'bg-gray-400'}`} />
        <div className={`w-3 h-3 rounded-full ${isRealSpeaking ? 'bg-red-500' : 'bg-gray-400'}`} />
      </div>

      {/* Voice Controls */}
      <div className="absolute top-4 right-4 space-x-2">
        <button
          onClick={() => speakText("Bonjour ! Je suis Carla, votre assistante virtuelle.")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          Test Voix
        </button>
        <button
          onClick={() => window.speechSynthesis.cancel()}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          Stop
        </button>
      </div>
    </div>
  );
};

export default CarlaAvatar;