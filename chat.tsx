import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useAppState } from '@/contexts/AppStateContext';
import { MessageCircle, Send, Mic, Lightbulb } from 'lucide-react-native';
import Voice from 'react-native-voice';
import { useTranslation } from 'react-i18next';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  suggestions?: string[];
}

export default function ChatScreen() {
  const { t, i18n } = useTranslation();
  const { isDarkMode, currentConsumption, devices } = useAppState();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: t('greeting'),
      isUser: false,
      timestamp: new Date(),
      suggestions: t('suggestions', { returnObjects: true }) as string[]
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;
    Voice.onSpeechResults = onSpeechResultsHandler;
    Voice.onSpeechError = onSpeechErrorHandler;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStartHandler = (e: any) => {
    setIsRecording(true);
  };

  const onSpeechEndHandler = (e: any) => {
    setIsRecording(false);
  };

  const onSpeechResultsHandler = (e: any) => {
    if (e.value && e.value.length > 0) {
      setInputText(e.value[0]);
    }
  };

  const onSpeechErrorHandler = (e: any) => {
    setIsRecording(false);
    console.error('Voice recognition error:', e.error);
  };

  const startRecording = async () => {
    try {
      await Voice.start(i18n.language);
    } catch (error) {
      console.error('Failed to start voice recognition:', error);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setIsRecording(false);
    } catch (error) {
      console.error('Failed to stop voice recognition:', error);
    }
  };

  const generateResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();

    let response = '';
    let suggestions: string[] = [];

    if (lowerMessage.includes('facture') || lowerMessage.includes('élevée') || lowerMessage.includes('cher')) {
      response = t('response.bill_high', {
        currentConsumption,
        activeDevices: devices.filter(d => d.status === 'on').length
      });
      suggestions = [
        t('response.suggestions.optimize_ac', 'Comment optimiser ma climatisation ?'),
        t('response.suggestions.turn_off_devices', 'Quels appareils éteindre en priorité ?'),
        t('response.suggestions.calculate_savings', 'Calculer mes économies potentielles')
      ];
    } else if (lowerMessage.includes('réduire') || lowerMessage.includes('économiser') || lowerMessage.includes('conseils')) {
      response = t('response.reduce_tips');
      suggestions = [
        t('response.suggestions.schedule_devices', 'Programmer mes appareils'),
        t('response.suggestions.off_peak_hours', 'Heures creuses en Côte d\'Ivoire'),
        t('response.suggestions.change_habits', 'Changer mes habitudes')
      ];
    } else if (lowerMessage.includes('appareils') || lowerMessage.includes('consomment')) {
      const activeDevices = devices.filter(d => d.status === 'on');
      const sortedDevices = activeDevices.sort((a, b) => b.consumption - a.consumption);
      const deviceList = sortedDevices.map((device, index) =>
        `${index + 1}. ${device.name} : ${device.consumption}W (${device.room})`
      ).join('\n');

      response = t('response.device_consumption', {
        deviceList,
        currentConsumption
      });
      suggestions = [
        t('response.suggestions.optimize_devices', 'Comment optimiser ces appareils ?'),
        t('response.suggestions.auto_off', 'Programmer l\'extinction automatique'),
        t('response.suggestions.economic_alternatives', 'Alternatives économiques')
      ];
    } else if (lowerMessage.includes('climatisation') || lowerMessage.includes('clim')) {
      response = t('response.ac_optimization');
      suggestions = [
        t('response.suggestions.schedule_ac', 'Programmer ma climatisation'),
        t('response.suggestions.ac_alternatives', 'Alternatives au climatiseur'),
        t('response.suggestions.home_insulation', 'Isolation de ma maison')
      ];
    } else if (lowerMessage.includes('heures creuses') || lowerMessage.includes('tarif')) {
      response = t('response.tariff_info');
      suggestions = [
        t('response.suggestions.schedule_devices', 'Programmer mes appareils'),
        t('response.suggestions.calculate_savings', 'Calculer mes économies'),
        t('response.suggestions.optimal_planning', 'Planning optimal de consommation')
      ];
    } else {
      response = t('response.default');
      suggestions = t('suggestions', { returnObjects: true }) as string[];
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
    return date.toLocaleTimeString(i18n.language, {
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
            {t('ui.assistant_title')}
          </Text>
          <Text style={[styles.subtitle, { color: isDarkMode ? '#9ca3af' : '#6b7280' }]}>
            {t('ui.assistant_subtitle')}
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
              <View
                style={[
                  styles.messageBubble,
                  message.isUser ? styles.userBubble : styles.aiBubble,
                  {
                    backgroundColor: message.isUser
                      ? '#2563eb'
                      : isDarkMode
                      ? '#1f2937'
                      : '#ffffff'
                  }
                ]}
              >
                {!message.isUser && (
                  <View style={styles.aiIcon}>
                    <Lightbulb size={16} color="#f59e0b" />
                  </View>
                )}

                <Text
                  style={[
                    styles.messageText,
                    {
                      color: message.isUser
                        ? '#ffffff'
                        : isDarkMode
                        ? '#ffffff'
                        : '#1f2937'
                    }
                  ]}
                >
                  {message.text}
                </Text>

                <Text
                  style={[
                    styles.messageTime,
                    {
                      color: message.isUser
                        ? 'rgba(255, 255, 255, 0.7)'
                        : isDarkMode
                        ? '#9ca3af'
                        : '#6b7280'
                    }
                  ]}
                >
                  {formatTime(message.timestamp)}
                </Text>
              </View>

              {message.suggestions && !message.isUser && (
                <View style={styles.suggestionsContainer}>
                  {message.suggestions.map((suggestion, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.suggestionBubble,
                        {
                          backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
                          borderColor: isDarkMode ? '#4b5563' : '#e5e7eb'
                        }
                      ]}
                      onPress={() => handleSuggestionPress(suggestion)}
                    >
                      <Text
                        style={[
                          styles.suggestionText,
                          { color: isDarkMode ? '#ffffff' : '#1f2937' }
                        ]}
                      >
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
              <View
                style={[
                  styles.messageBubble,
                  styles.aiBubble,
                  { backgroundColor: isDarkMode ? '#1f2937' : '#ffffff' }
                ]}
              >
                <View style={styles.aiIcon}>
                  <Lightbulb size={16} color="#f59e0b" />
                </View>
                <View style={styles.typingIndicator}>
                  <Text
                    style={[styles.typingText, { color: isDarkMode ? '#9ca3af' : '#6b7280' }]}
                  >
                    {t('ui.assistant_typing')}
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

        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
              borderTopColor: isDarkMode ? '#374151' : '#e5e7eb'
            }
          ]}
        >
          <View style={styles.inputWrapper}>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
                  color: isDarkMode ? '#ffffff' : '#1f2937',
                  borderColor: isDarkMode ? '#4b5563' : '#d1d5db'
                }
              ]}
              placeholder={t('ui.input_placeholder')}
              placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSend}
              multiline
              maxLength={500}
            />

            <TouchableOpacity
              style={styles.micButton}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <Mic size={20} color={isRecording ? '#2563eb' : (isDarkMode ? '#9ca3af' : '#6b7280')} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor: inputText.trim() ? '#2563eb' : isDarkMode ? '#374151' : '#e5e7eb',
                opacity: inputText.trim() ? 1 : 0.5
              }
            ]}
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
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16
  },
  headerText: {
    marginLeft: 12
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold'
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 2
  },
  chatContainer: {
    flex: 1
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16
  },
  messageWrapper: {
    marginVertical: 4
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4
  },
  aiBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4
  },
  aiIcon: {
    marginBottom: 4
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 22
  },
  messageTime: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
    alignSelf: 'flex-end'
  },
  suggestionsContainer: {
    marginTop: 8,
    marginLeft: 8
  },
  suggestionBubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 6,
    alignSelf: 'flex-start'
  },
  suggestionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular'
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  typingText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginRight: 8
  },
  typingDots: {
    flexDirection: 'row'
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9ca3af',
    marginHorizontal: 1
  },
  dot1: {
    animationDelay: '0s'
  },
  dot2: {
    animationDelay: '0.2s'
  },
  dot3: {
    animationDelay: '0.4s'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 8
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
    fontFamily: 'Inter-Regular'
  },
  micButton: {
    padding: 8,
    marginLeft: 8
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
