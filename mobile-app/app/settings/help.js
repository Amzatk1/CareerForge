import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Linking } from 'react-native';
import { Card, Title, Paragraph, Button, Appbar, List, Divider, Searchbar, Chip, Text } from 'react-native-paper';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme } from '../../utils/theme';

const HELP_CATEGORIES = [
  { id: 'all', name: 'All', icon: 'help-circle' },
  { id: 'getting-started', name: 'Getting Started', icon: 'rocket-launch' },
  { id: 'roadmaps', name: 'Roadmaps', icon: 'map-marker-path' },
  { id: 'opportunities', name: 'Opportunities', icon: 'briefcase-search' },
  { id: 'account', name: 'Account', icon: 'account-cog' },
  { id: 'technical', name: 'Technical', icon: 'cog' },
];

const FAQ_DATA = [
  {
    id: 1,
    category: 'getting-started',
    question: 'How do I get started with CareerForge AI?',
    answer: 'After creating your account, complete the onboarding process by selecting your career interests, experience level, and skills. This helps our AI create personalized recommendations for you.',
  },
  {
    id: 2,
    category: 'getting-started',
    question: 'What information do I need to provide during onboarding?',
    answer: 'You\'ll need to select your career fields of interest, current experience level (Entry to Lead/Manager), and your existing skills. This takes about 5 minutes and can be updated anytime in Settings.',
  },
  {
    id: 3,
    category: 'roadmaps',
    question: 'How are career roadmaps generated?',
    answer: 'Our AI analyzes your current skills, career goals, and industry trends to create personalized learning paths. Roadmaps include recommended courses, skills to develop, and milestone tracking.',
  },
  {
    id: 4,
    category: 'roadmaps',
    question: 'Can I customize my roadmap?',
    answer: 'Yes! You can modify your roadmap by updating your career preferences in Settings. The AI will automatically adjust recommendations based on your new goals and interests.',
  },
  {
    id: 5,
    category: 'opportunities',
    question: 'How does job matching work?',
    answer: 'Our AI compares your skills and experience with job requirements to calculate match percentages. Higher matches indicate better alignment with your profile and career goals.',
  },
  {
    id: 6,
    category: 'opportunities',
    question: 'Where do job opportunities come from?',
    answer: 'We partner with leading companies and job boards to provide curated opportunities. All listings are verified and matched to your specific career interests and skill level.',
  },
  {
    id: 7,
    category: 'account',
    question: 'How do I update my career preferences?',
    answer: 'Go to Settings > Career Interests & Skills to update your career fields, experience level, and skills. Changes will immediately affect your recommendations.',
  },
  {
    id: 8,
    category: 'account',
    question: 'Is my data secure and private?',
    answer: 'Yes, we use industry-standard encryption and never share your personal information without consent. Your career data is used only to improve your experience within the app.',
  },
  {
    id: 9,
    category: 'technical',
    question: 'The app is running slowly. What can I do?',
    answer: 'Try closing and reopening the app, ensure you have a stable internet connection, and make sure you\'re running the latest version. Contact support if issues persist.',
  },
  {
    id: 10,
    category: 'technical',
    question: 'I\'m not receiving notifications. How do I fix this?',
    answer: 'Check your notification settings in Settings > Notifications. Also verify that notifications are enabled for CareerForge AI in your device settings.',
  },
];

const QUICK_ACTIONS = [
  {
    title: 'Contact Support',
    description: 'Get help from our support team',
    icon: 'email',
    action: () => Linking.openURL('mailto:support@careerforge.ai'),
  },
  {
    title: 'Video Tutorials',
    description: 'Watch step-by-step guides',
    icon: 'play-circle',
    action: () => Linking.openURL('https://youtube.com/careerforgeai'),
  },
  {
    title: 'Community Forum',
    description: 'Connect with other users',
    icon: 'forum',
    action: () => Linking.openURL('https://community.careerforge.ai'),
  },
  {
    title: 'Feature Requests',
    description: 'Suggest new features',
    icon: 'lightbulb',
    action: () => Linking.openURL('https://feedback.careerforge.ai'),
  },
];

export default function HelpScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const getFilteredFAQs = () => {
    let filtered = FAQ_DATA;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <View style={styles.container}>
      
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <Card style={styles.headerCard}>
          <Card.Content style={styles.headerContent}>
            <MaterialCommunityIcons 
              name="help-circle" 
              size={48} 
              color={theme.colors.primary} 
            />
            <Title style={styles.headerTitle}>How can we help you?</Title>
            <Paragraph style={styles.headerDescription}>
              Find answers to common questions or get in touch with our support team.
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Search */}
        <Searchbar
          placeholder="Search help articles..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />

        {/* Quick Actions */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Quick Actions</Title>
            <View style={styles.quickActionsGrid}>
              {QUICK_ACTIONS.map((action, index) => (
                <Button
                  key={index}
                  mode="outlined"
                  onPress={action.action}
                  style={styles.quickActionButton}
                  icon={action.icon}
                  contentStyle={styles.quickActionContent}
                >
                  {action.title}
                </Button>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {HELP_CATEGORIES.map((category) => (
            <Chip
              key={category.id}
              selected={selectedCategory === category.id}
              onPress={() => setSelectedCategory(category.id)}
              style={[
                styles.categoryChip,
                selectedCategory === category.id && styles.selectedCategoryChip
              ]}
              textStyle={[
                styles.categoryChipText,
                selectedCategory === category.id && styles.selectedCategoryChipText
              ]}
              icon={category.icon}
            >
              {category.name}
            </Chip>
          ))}
        </ScrollView>

        {/* FAQs */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>
              Frequently Asked Questions
              {searchQuery && ` (${getFilteredFAQs().length} results)`}
            </Title>
            
            {getFilteredFAQs().length === 0 ? (
              <View style={styles.noResults}>
                <MaterialCommunityIcons 
                  name="magnify" 
                  size={48} 
                  color={theme.colors.outline} 
                />
                <Paragraph style={styles.noResultsText}>
                  No help articles found for "{searchQuery}"
                </Paragraph>
                <Button 
                  mode="outlined" 
                  onPress={() => setSearchQuery('')}
                  style={styles.clearSearchButton}
                >
                  Clear Search
                </Button>
              </View>
            ) : (
              getFilteredFAQs().map((faq, index) => (
                <View key={faq.id}>
                  <List.Item
                    title={faq.question}
                    titleNumberOfLines={2}
                    left={props => <List.Icon {...props} icon="help-circle-outline" />}
                    right={props => (
                      <List.Icon 
                        {...props} 
                        icon={expandedFAQ === faq.id ? "chevron-up" : "chevron-down"} 
                      />
                    )}
                    onPress={() => toggleFAQ(faq.id)}
                    style={styles.faqItem}
                  />
                  
                  {expandedFAQ === faq.id && (
                    <View style={styles.faqAnswer}>
                      <Paragraph style={styles.answerText}>{faq.answer}</Paragraph>
                    </View>
                  )}
                  
                  {index < getFilteredFAQs().length - 1 && <Divider />}
                </View>
              ))
            )}
          </Card.Content>
        </Card>

        {/* Contact Support */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.supportHeader}>
              <MaterialCommunityIcons 
                name="headset" 
                size={32} 
                color={theme.colors.primary} 
              />
              <View style={styles.supportInfo}>
                <Title style={styles.supportTitle}>Still need help?</Title>
                <Paragraph style={styles.supportDescription}>
                  Our support team is here to help you succeed.
                </Paragraph>
              </View>
            </View>
            
            <View style={styles.supportActions}>
              <Button 
                mode="contained" 
                onPress={() => router.push('/settings/contact-support')}
                style={styles.supportButton}
                icon="email"
              >
                Contact Support
              </Button>
              
              <Button 
                mode="outlined" 
                onPress={() => Linking.openURL('https://careerforge.ai/help')}
                style={styles.supportButton}
                icon="web"
              >
                Visit Help Center
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  
  // Header
  headerCard: {
    margin: 16,
    elevation: 4,
    borderRadius: theme.roundness,
  },
  headerContent: {
    alignItems: 'center',
    padding: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  headerDescription: {
    textAlign: 'center',
    color: theme.colors.outline,
  },
  
  // Search
  searchBar: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  
  // Quick Actions
  sectionCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
    borderRadius: theme.roundness,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: theme.colors.onSurface,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionButton: {
    width: '47%',
    borderColor: theme.colors.primary,
  },
  quickActionContent: {
    paddingVertical: 8,
  },
  
  // Categories
  categoryScroll: {
    marginBottom: 16,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  selectedCategoryChip: {
    backgroundColor: theme.colors.primary,
  },
  categoryChipText: {
    color: theme.colors.onSurface,
  },
  selectedCategoryChipText: {
    color: theme.colors.surface,
  },
  
  // FAQs
  faqItem: {
    paddingVertical: 12,
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: theme.colors.surfaceVariant,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  answerText: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.onSurface,
  },
  
  // No Results
  noResults: {
    alignItems: 'center',
    padding: 32,
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 16,
    color: theme.colors.outline,
  },
  clearSearchButton: {
    borderColor: theme.colors.primary,
  },
  
  // Support
  supportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  supportInfo: {
    flex: 1,
    marginLeft: 16,
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  supportDescription: {
    color: theme.colors.outline,
  },
  supportActions: {
    gap: 12,
  },
  supportButton: {
    paddingVertical: 4,
  },
}); 