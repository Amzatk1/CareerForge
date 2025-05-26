import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Avatar,
  IconButton,
  Divider,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../utils/api';

const theme = {
  colors: {
    primary: '#0ea5e9',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    surface: '#ffffff',
    background: '#f8fafc',
    outline: '#64748b',
    onSurface: '#1e293b',
    chart: '#1e293b',
    tertiary: '#ec4899',
  },
  roundness: 12,
};

export default function AIChatScreen() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showConversations, setShowConversations] = useState(true);
  const scrollViewRef = useRef();
  const textInputRef = useRef();

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (currentConversation) {
      loadMessages(currentConversation.id);
    }
  }, [currentConversation]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/ai/chat/conversations/');
      setConversations(response.conversations || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
      Alert.alert('Error', 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/ai/chat/conversations/${conversationId}/`);
      setMessages(response.messages || []);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error loading messages:', error);
      Alert.alert('Error', 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const createNewConversation = async () => {
    try {
      setLoading(true);
      const response = await apiClient.post('/ai/chat/conversations/', {
        title: 'Career Chat',
        initial_message: {
          context: {
            user_profile: {
              name: user?.first_name || 'User',
              career_level: user?.profile?.career_level || 'Not specified',
              industry: user?.profile?.industry || 'Not specified'
            },
            conversation_type: 'career_guidance',
            instructions: 'You are CareerForge AI, a professional career assistant. Provide detailed, helpful, and actionable career advice. Start with a warm welcome and ask how you can help with their career goals today.'
          }
        }
      });
      
      await loadConversations();
      const newConv = conversations.find(c => c.id === response.conversation.id) || response.conversation;
      setCurrentConversation(newConv);
      setShowConversations(false);
    } catch (error) {
      console.error('Error creating conversation:', error);
      Alert.alert('Error', 'Failed to create new conversation');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentConversation) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setSendingMessage(true);

    try {
      // Enhanced payload with better context for AI
      const payload = {
        message: messageText,
        context: {
          user_profile: {
            name: user?.first_name || 'User',
            career_level: user?.profile?.career_level || 'Not specified',
            industry: user?.profile?.industry || 'Not specified'
          },
          conversation_type: 'career_guidance',
          instructions: 'You are CareerForge AI, a professional career assistant. Provide detailed, helpful, and actionable career advice. Always give complete responses with specific examples and actionable steps. Be encouraging and professional.'
        }
      };

      console.log('Sending message payload:', payload);

      const response = await apiClient.post(
        `/ai/chat/conversations/${currentConversation.id}/`,
        payload
      );

      console.log('API Response:', response);

      // Add both user message and AI response to the messages
      if (response.user_message && response.ai_response) {
        setMessages(prev => [
          ...prev,
          response.user_message,
          response.ai_response
        ]);
      } else {
        // Fallback if response structure is different
        console.log('Unexpected response structure, using fallback');
        setMessages(prev => [
          ...prev,
          {
            id: Date.now(),
            content: messageText,
            message_type: 'user',
            created_at: new Date().toISOString()
          },
          {
            id: Date.now() + 1,
            content: response.message || response.response || 'I received your message but had trouble generating a response. Please try again.',
            message_type: 'ai',
            created_at: new Date().toISOString()
          }
        ]);
      }

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
      setNewMessage(messageText); // Restore message on error
    } finally {
      setSendingMessage(false);
    }
  };

  const selectConversation = (conversation) => {
    setCurrentConversation(conversation);
    setShowConversations(false);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const MessageBubble = ({ message }) => {
    // Check multiple possible field names for message type
    const isUser = message.message_type === 'user' || 
                   message.type === 'user' || 
                   message.sender === 'user' ||
                   message.role === 'user';
    
    return (
      <View style={[
        styles.messageBubble,
        isUser ? styles.userMessage : styles.aiMessage
      ]}>
        {!isUser && (
          <View style={styles.aiHeader}>
            <MaterialCommunityIcons 
              name="robot" 
              size={16} 
              color={theme.colors.primary} 
            />
            <Text style={styles.aiLabel}>CareerForge AI</Text>
          </View>
        )}
        <Text style={[
          styles.messageText,
          { color: isUser ? '#ffffff' : theme.colors.onSurface }
        ]}>
          {message.content || message.text || message.message}
        </Text>
        <Text style={[
          styles.messageTime,
          { color: isUser ? 'rgba(255,255,255,0.7)' : theme.colors.outline }
        ]}>
          {formatTime(message.created_at || message.timestamp || new Date())}
        </Text>
      </View>
    );
  };

  const ConversationsList = () => (
    <ScrollView style={styles.conversationsContainer}>
      <View style={styles.conversationsHeader}>
        <Title style={styles.conversationsTitle}>AI Career Assistant</Title>
        <Button
          mode="contained"
          onPress={createNewConversation}
          style={styles.newChatButton}
          icon="plus"
          loading={loading}
        >
          New Chat
        </Button>
      </View>

      <Paragraph style={styles.conversationsSubtitle}>
        Get personalized career advice, skill recommendations, and job search guidance from our AI assistant.
      </Paragraph>

      {loading && conversations.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading conversations...</Text>
        </View>
      ) : conversations.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Card.Content style={styles.emptyContent}>
            <MaterialCommunityIcons 
              name="robot-excited" 
              size={64} 
              color={theme.colors.primary} 
            />
            <Title style={styles.emptyTitle}>Start a New Chat</Title>
            <Paragraph style={styles.emptyText}>
              Ready to get career guidance? Start a conversation with your AI assistant 
              for personalized advice and support.
            </Paragraph>
            <Button
              mode="contained"
              onPress={createNewConversation}
              style={styles.startChatButton}
              icon="chat"
            >
              Start Chatting
            </Button>
          </Card.Content>
        </Card>
      ) : (
        <View>
          {conversations.map((conversation) => (
            <TouchableOpacity
              key={conversation.id}
              onPress={() => selectConversation(conversation)}
              style={styles.conversationItem}
            >
              <Card style={styles.conversationCard}>
                <Card.Content>
                  <View style={styles.conversationHeader}>
                    <Text style={styles.conversationTitle}>{conversation.title}</Text>
                    <Text style={styles.conversationTime}>
                      {formatTime(conversation.last_message_at)}
                    </Text>
                  </View>
                  {conversation.last_message.content && (
                    <Text style={styles.conversationPreview} numberOfLines={2}>
                      {conversation.last_message.content}
                    </Text>
                  )}
                  <View style={styles.conversationFooter}>
                    <Chip 
                      icon="message" 
                      style={styles.messageCountChip}
                      textStyle={styles.messageCountText}
                    >
                      {conversation.message_count} message{conversation.message_count !== 1 ? 's' : ''}
                    </Chip>
                  </View>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          ))}
                </View>
        )}
    </ScrollView>
  );

  const ChatInterface = () => (
    <KeyboardAvoidingView 
      style={styles.chatContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
        <View style={styles.chatHeader}>
          <TouchableOpacity
            onPress={() => setShowConversations(true)}
            style={styles.backButton}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <View style={styles.chatHeaderContent}>
            <Text style={styles.chatTitle}>{currentConversation?.title}</Text>
            <Text style={styles.chatSubtitle}>AI Career Assistant</Text>
          </View>
          <Avatar.Icon 
            size={40} 
            icon="robot" 
            style={{ backgroundColor: theme.colors.primary }}
          />
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
        {loading && messages.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Loading messages...</Text>
          </View>
        ) : (
          messages.map((message, index) => (
            <View key={message.id || index}>
              <MessageBubble message={message} />
              {/* Temporary debug info */}
              <Text style={{ fontSize: 10, color: 'gray', textAlign: 'center', marginBottom: 5 }}>
                Type: {message.message_type || 'unknown'} | ID: {message.id}
              </Text>
            </View>
          ))
        )}
        {sendingMessage && (
          <View style={styles.typingIndicator}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={styles.typingText}>AI is thinking...</Text>
          </View>
        )}
              </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            ref={textInputRef}
            style={styles.messageInput}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Ask me about your career..."
            multiline={true}
            maxLength={1000}
            editable={!sendingMessage}
            textAlignVertical="top"
            autoCorrect={true}
            autoCapitalize="sentences"
            blurOnSubmit={false}
            onSubmitEditing={() => {}}
          />
          <TouchableOpacity
            onPress={sendMessage}
            style={[
              styles.sendButton,
              { opacity: (!newMessage.trim() || sendingMessage) ? 0.5 : 1 }
            ]}
            disabled={!newMessage.trim() || sendingMessage}
          >
            <MaterialCommunityIcons 
              name="send" 
              size={24} 
              color="#ffffff" 
            />
          </TouchableOpacity>
        </View>
    </KeyboardAvoidingView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {showConversations ? <ConversationsList /> : <ChatInterface />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  // Conversations List Styles
  conversationsContainer: {
    flex: 1,
    padding: 12,
  },
  conversationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  conversationsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
  },
  conversationsSubtitle: {
    color: theme.colors.outline,
    marginBottom: 20,
    lineHeight: 20,
  },
  newChatButton: {
    backgroundColor: theme.colors.primary,
  },
  conversationItem: {
    marginBottom: 10,
  },
  conversationCard: {
    elevation: 2,
    borderRadius: theme.roundness,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  conversationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
    flex: 1,
  },
  conversationTime: {
    fontSize: 12,
    color: theme.colors.outline,
  },
  conversationPreview: {
    fontSize: 14,
    color: theme.colors.outline,
    marginBottom: 8,
    lineHeight: 18,
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  messageCountChip: {
    backgroundColor: theme.colors.primary,
    height: 28,
    elevation: 2,
  },
  messageCountText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },

  // Empty State
  emptyCard: {
    marginTop: 40,
    elevation: 4,
  },
  emptyContent: {
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.outline,
    lineHeight: 20,
    marginBottom: 20,
  },
  startChatButton: {
    backgroundColor: theme.colors.primary,
  },

  // Chat Interface Styles
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    marginRight: 12,
  },
  chatHeaderContent: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  chatSubtitle: {
    fontSize: 12,
    color: theme.colors.outline,
  },

  // Messages
  messagesContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  messagesContent: {
    padding: 16,
    flexGrow: 1,
  },
  messageBubble: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 16,
    maxWidth: '85%',
  },
  userMessage: {
    backgroundColor: theme.colors.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiMessage: {
    backgroundColor: theme.colors.surface,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    elevation: 1,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  aiLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
    marginLeft: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
    textAlign: 'right',
  },

  // Input
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    minHeight: 40,
    maxHeight: 100,
    fontSize: 16,
    backgroundColor: theme.colors.background,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Loading & Typing
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    color: theme.colors.outline,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.surface,
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 1,
  },
  typingText: {
    marginLeft: 8,
    color: theme.colors.outline,
    fontStyle: 'italic',
  },
}); 