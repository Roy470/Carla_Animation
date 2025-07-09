import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

const CarlaControls = ({ 
  onEmotionChange,
  onSpeechToggle,
  onMessageChange,
  isActive,
  onActiveToggle,
  currentEmotion,
  isSpeaking,
  currentMessage
}) => {
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [customMessage, setCustomMessage] = useState('');

  const emotions = [
    { value: 'neutral', label: 'Neutre', color: 'bg-gray-500' },
    { value: 'happy', label: 'Joyeuse', color: 'bg-yellow-500' },
    { value: 'sad', label: 'Triste', color: 'bg-blue-500' },
    { value: 'surprised', label: 'Surprise', color: 'bg-orange-500' },
    { value: 'thinking', label: 'Réfléchit', color: 'bg-purple-500' }
  ];

  const predefinedMessages = [
    "Bonjour ! Je suis Carla, votre assistante virtuelle.",
    "Comment puis-je vous aider aujourd'hui ?",
    "C'est un plaisir de vous rencontrer !",
    "Avez-vous des questions pour moi ?",
    "Je suis là pour vous accompagner.",
    "Que souhaitez-vous découvrir ?"
  ];

  const handleEmotionSelect = (emotion) => {
    onEmotionChange(emotion);
  };

  const handleSpeechToggle = () => {
    onSpeechToggle(!isSpeaking);
  };

  const handleMessageSend = () => {
    if (customMessage.trim()) {
      onMessageChange(customMessage);
      onSpeechToggle(true);
      // La synthèse vocale se déclenchera automatiquement dans CarlaAvatar
    }
  };

  const handlePredefinedMessage = (message) => {
    onMessageChange(message);
    onSpeechToggle(true);
    // La synthèse vocale se déclenchera automatiquement dans CarlaAvatar
  };

  return (
    <div className="fixed right-4 top-4 bottom-4 w-80 space-y-4 overflow-y-auto">
      {/* Activation Control */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contrôles Carla</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Activation</span>
            <Button
              onClick={onActiveToggle}
              variant={isActive ? "default" : "outline"}
              size="sm"
            >
              {isActive ? 'Activée' : 'Désactivée'}
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Parole</span>
            <Button
              onClick={handleSpeechToggle}
              variant={isSpeaking ? "default" : "outline"}
              size="sm"
              disabled={!isActive}
            >
              {isSpeaking ? 'Parle' : 'Silence'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Emotion Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Émotions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {emotions.map((emotion) => (
              <motion.button
                key={emotion.value}
                onClick={() => handleEmotionSelect(emotion.value)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  currentEmotion === emotion.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!isActive}
              >
                <div className={`w-4 h-4 rounded-full ${emotion.color} mx-auto mb-1`} />
                <span className="text-xs">{emotion.label}</span>
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Message Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Messages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Message personnalisé</label>
            <Textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Tapez votre message..."
              disabled={!isActive}
              rows={3}
            />
            <Button
              onClick={handleMessageSend}
              disabled={!isActive || !customMessage.trim()}
              className="w-full"
            >
              🗣️ Parler avec Carla
            </Button>
          </div>

          {/* Voice Controls */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Contrôles vocaux</label>
            <div className="flex space-x-2">
              <Button
                onClick={() => window.speechSynthesis.cancel()}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                🔇 Stop
              </Button>
              <Button
                onClick={() => setCustomMessage("")}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                🗑️ Effacer
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Messages prédéfinis</label>
            <div className="space-y-1">
              {predefinedMessages.map((message, index) => (
                <button
                  key={index}
                  onClick={() => handlePredefinedMessage(message)}
                  disabled={!isActive}
                  className="w-full text-left p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded border disabled:opacity-50"
                >
                  {message}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Animation Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Paramètres</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Vitesse d'animation</label>
            <Slider
              value={[animationSpeed]}
              onValueChange={(value) => setAnimationSpeed(value[0])}
              max={3}
              min={0.5}
              step={0.1}
              disabled={!isActive}
            />
            <div className="text-xs text-gray-500">
              Vitesse: {animationSpeed.toFixed(1)}x
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">État actuel</label>
            <div className="text-xs space-y-1">
              <div>Émotion: <span className="font-medium">{currentEmotion}</span></div>
              <div>Parole: <span className="font-medium">{isSpeaking ? 'Activée' : 'Désactivée'}</span></div>
              <div>Message: <span className="font-medium">{currentMessage || 'Aucun'}</span></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CarlaControls;