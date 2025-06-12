import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useAppState } from '@/contexts/AppStateContext';
import { MessageCircle, Send, Mic, Lightbulb, Zap } from 'lucide-react-native';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  suggestions?: string[];
}

export default function ChatScreen() {
  const { isDarkMode, currentConsumption, devices } = useAppState();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bonjour ! 👋 Je suis votre assistant énergétique personnel. Comment puis-je vous aider à optimiser votre consommation électrique aujourd\'hui ?',
      isUser: false,
      timestamp: new Date(),
      suggestions: [
        'Pourquoi ma facture est-elle élevée ?',
        'Comment réduire ma consommation ?',
        'Quels appareils consomment le plus ?'
      ]
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const generateResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    
    let response = '';
    let suggestions: string[] = [];

    if (lowerMessage.includes('facture') || lowerMessage.includes('élevée') || lowerMessage.includes('cher')) {
      response = `Votre consommation actuelle est de ${currentConsumption}W. Les principales causes d'une facture élevée sont souvent :

• La climatisation (utilise 60-70% de l'énergie)
• Les appareils en veille (jusqu'à 15% de perte)
• L'éclairage inefficace
• Un réfrigérateur mal réglé

Je vois que vous avez ${devices.filter(d => d.status === 'on').length} appareils allumés actuellement.`;
      
      suggestions = [
        'Comment optimiser ma climatisation ?',
        'Quels appareils éteindre en priorité ?',
        'Calculer mes économies potentielles'
      ];
    } else if (lowerMessage.includes('réduire') || lowerMessage.includes('économiser') || lowerMessage.includes('conseils')) {
      response = `Voici mes conseils personnalisés pour réduire votre consommation :

💡 **Actions immédiates :**
• Réglez votre climatisation à 25°C (au lieu de 18°C)
• Éteignez les appareils en veille
• Utilisez l'éclairage LED
• Dégivrez régulièrement votre réfrigérateur

📊 **Potentiel d'économie : 30-40% sur votre facture**`;
      
      suggestions = [
        'Programmer mes appareils',
        'Heures creuses en Côte d\'Ivoire',
        'Changer mes habitudes'
      ];
    } else if (lowerMessage.includes('appareils') || lowerMessage.includes('consomment')) {
      const activeDevices = devices.filter(d => d.status === 'on');
      const sortedDevices = activeDevices.sort((a, b) => b.consumption - a.consumption);
      
      response = `Voici vos appareils qui consomment le plus actuellement :

${sortedDevices.map((device, index) => 
  `${index + 1}. **${device.name}** : ${device.consumption}W (${device.room})`
).join('\n')}

**Total actuel : ${currentConsumption}W**

Le climatiseur est généralement votre plus gros consommateur !`;
      
      suggestions = [
        'Comment optimiser ces appareils ?',
        'Programmer l\'extinction automatique',
        'Alternatives économiques'
      ];
    } else if (lowerMessage.includes('climatisation') || lowerMessage.includes('clim')) {
      response = `🌡️ **Optimisation de la climatisation :**

• **Température idéale : 25°C** (chaque degré en moins = +8% de consommation)
• Fermez portes et fenêtres
• Utilisez des ventilateurs pour brasser l'air
• Nettoyez les filtres mensuellement
• Programmez des plages horaires

**Économie possible : 40-50% sur la climatisation**`;
      
      suggestions = [
        'Programmer ma climatisation',
        'Alternatives au climatiseur',
        'Isolation de ma maison'
      ];
    } else if (lowerMessage.includes('heures creuses') || lowerMessage.includes('tarif')) {
      response = `⚡ **Optimisation tarifaire en Côte d'Ivoire :**

La CIE applique un tarif progressif :
• **0-110 kWh** : ~67 FCFA/kWh
• **111-300 kWh** : ~79 FCFA/kWh  
• **300+ kWh** : ~87 FCFA/kWh

**Conseils :**
• Utilisez gros électroménagers tôt le matin (6h-8h)
• Évitez les pics de 18h-22h
• Étalez votre consommation`;
      
      suggestions = [
        'Programmer mes appareils',
        'Calculer mes économies',
        'Planning optimal de consommation'
      ];
    } else {
      response = `Je comprends votre question sur l'énergie ! 🔌

Je peux vous aider avec :
• L'analyse de votre consommation
• Des conseils d'économie personnalisés  
• La programmation d'appareils
• L'optimisation de votre facture
• Les pannes et incidents

Que souhaitez-vous savoir précisément ?`;
      
      suggestions = [
        'Analyser ma consommation',
        'Conseils d\'économie',
        'Optimiser ma facture'
      ];
    }

    return {
      id: Date.now().toString(),
      text: response,
      isUser: false,
      timestamp: new Date(),
      suggestions
    };
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse = generateResponse(userMessage.text);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionPress = (suggestion: string) => {
    setInputText(suggestion);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#111827' : '#f8fafc' }]}>
      <View style={styles.header}>
        <MessageCircle size={32} color="#2563eb" />
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: isDarkMode ? '#ffffff' : '#1f2937' }]}>
            Assistant Énergétique
          </Text>
          <Text style={[styles.subtitle, { color: isDarkMode ? '#9ca3af' : '#6b7280' }]}>
            Votre conseiller personnel en énergie
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {messages.map(message => (
            <View key={message.id} style={styles.messageWrapper}>
              <View style={[
                styles.messageBubble,
                message.isUser ? styles.userBubble : styles.aiBubble,
                {
                  backgroundColor: message.isUser 
                    ? '#2563eb' 
                    : (isDarkMode ? '#1f2937' : '#ffffff')
                }
              ]}>
                {!message.isUser && (
                  <View style={styles.aiIcon}>
                    <Lightbulb size={16} color="#f59e0b" />
                  </View>
                )}
                
                <Text style={[
                  styles.messageText,
                  {
                    color: message.isUser 
                      ? '#ffffff' 
                      : (isDarkMode ? '#ffffff' : '#1f2937')
                  }
                ]}>
                  {message.text}
                </Text>
                
                <Text style={[
                  styles.messageTime,
                  {
                    color: message.isUser 
                      ? 'rgba(255, 255, 255, 0.7)' 
                      : (isDarkMode ? '#9ca3af' : '#6b7280')
                  }
                ]}>
                  {formatTime(message.timestamp)}
                </Text>
              </View>

              {message.suggestions && !message.isUser && (
                <View style={styles.suggestionsContainer}>
                  {message.suggestions.map((suggestion, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.suggestionBubble, { 
                        backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
                        borderColor: isDarkMode ? '#4b5563' : '#e5e7eb'
                      }]}
                      onPress={() => handleSuggestionPress(suggestion)}
                    >
                      <Text style={[styles.suggestionText, {
                        color: isDarkMode ? '#ffffff' : '#1f2937'
                      }]}>
                        {suggestion}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}

          {isTyping && (
            <View style={styles.messageWrapper}>
              <View style={[
                styles.messageBubble,
                styles.aiBubble,
                { backgroundColor: isDarkMode ? '#1f2937' : '#ffffff' }
              ]}>
                <View style={styles.aiIcon}>
                  <Lightbulb size={16} color="#f59e0b" />
                </View>
                <View style={styles.typingIndicator}>
                  <Text style={[styles.typingText, { color: isDarkMode ? '#9ca3af' : '#6b7280' }]}>
                    Assistant écrit...
                  </Text>
                  <View style={styles.typingDots}>
                    <View style={[styles.dot, styles.dot1]} />
                    <View style={[styles.dot, styles.dot2]} />
                    <View style={[styles.dot, styles.dot3]} />
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={[styles.inputContainer, { 
          backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
          borderTopColor: isDarkMode ? '#374151' : '#e5e7eb'
        }]}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.textInput, {
                backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
                color: isDarkMode ? '#ffffff' : '#1f2937',
                borderColor: isDarkMode ? '#4b5563' : '#d1d5db'
              }]}
              placeholder="Tapez votre question sur l'énergie..."
              placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSend}
              multiline
              maxLength={500}
            />
            
            <TouchableOpacity 
              style={styles.micButton}
              onPress={() => console.log('Voice input')}
            >
              <Mic size={20} color={isDarkMode ? '#9ca3af' : '#6b7280'} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[styles.sendButton, { 
              backgroundColor: inputText.trim() ? '#2563eb' : (isDarkMode ? '#374151' : '#e5e7eb'),
              opacity: inputText.trim() ? 1 : 0.5
            }]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Send size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerText: {
    marginLeft: 12,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messageWrapper: {
    marginVertical: 4,
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  aiIcon: {
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
  messageTime: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  suggestionsContainer: {
    marginTop: 8,
    marginLeft: 8,
  },
  suggestionBubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  suggestionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginRight: 8,
  },
  typingDots: {
    flexDirection: 'row',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9ca3af',
    marginHorizontal: 1,
  },
  dot1: {
    animationDelay: '0s',
  },
  dot2: {
    animationDelay: '0.2s',
  },
  dot3: {
    animationDelay: '0.4s',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  micButton: {
    padding: 8,
    marginLeft: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});