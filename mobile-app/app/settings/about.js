import React from 'react';
import { View, StyleSheet, ScrollView, Linking } from 'react-native';
import { Card, Title, Paragraph, Button, Appbar, Divider, List, Chip, Text } from 'react-native-paper';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme } from '../../utils/theme';

export default function AboutScreen() {
  const handleLinkPress = (url) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      
      <ScrollView style={styles.scrollView}>
        {/* Hero Section */}
        <Card style={styles.heroCard}>
          <Card.Content style={styles.heroContent}>
            <View style={styles.logoContainer}>
              <MaterialCommunityIcons 
                name="trending-up" 
                size={64} 
                color={theme.colors.primary} 
              />
              <Title style={styles.appTitle}>CareerForge AI</Title>
            </View>
            <Paragraph style={styles.tagline}>
              Forge Your Future with AI-Powered Career Intelligence
            </Paragraph>
            <View style={styles.versionContainer}>
              <Chip icon="information" style={styles.versionChip}>
                Version 1.0.0
              </Chip>
            </View>
          </Card.Content>
        </Card>

        {/* Mission Statement */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="target" size={24} color={theme.colors.primary} />
              <Title style={styles.sectionTitle}>Our Mission</Title>
            </View>
            <Paragraph style={styles.missionText}>
              CareerForge AI empowers professionals to take control of their career journey through 
              intelligent, personalized guidance. We believe that everyone deserves access to 
              world-class career development tools, regardless of their background or current position.
            </Paragraph>
            <Paragraph style={styles.missionText}>
              Our AI-driven platform transforms the way people discover opportunities, develop skills, 
              and advance their careers by providing data-driven insights and personalized recommendations 
              that adapt to each user's unique goals and circumstances.
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Key Features */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="star" size={24} color={theme.colors.primary} />
              <Title style={styles.sectionTitle}>Key Features</Title>
            </View>
            
            <List.Item
              title="AI-Powered Career Roadmaps"
              description="Personalized learning paths based on your goals and current skills"
              left={props => <List.Icon {...props} icon="map-marker-path" />}
              style={styles.featureItem}
            />
            <Divider />
            
            <List.Item
              title="Smart Job Matching"
              description="AI algorithms match you with opportunities that fit your profile"
              left={props => <List.Icon {...props} icon="briefcase-search" />}
              style={styles.featureItem}
            />
            <Divider />
            
            <List.Item
              title="Resume Analysis & Optimization"
              description="Get AI-powered feedback to improve your resume effectiveness"
              left={props => <List.Icon {...props} icon="file-document-edit" />}
              style={styles.featureItem}
            />
            <Divider />
            
            <List.Item
              title="Skill Gap Analysis"
              description="Identify missing skills and get recommendations for improvement"
              left={props => <List.Icon {...props} icon="chart-line" />}
              style={styles.featureItem}
            />
            <Divider />
            
            <List.Item
              title="Learning Recommendations"
              description="Curated courses and resources tailored to your career path"
              left={props => <List.Icon {...props} icon="school" />}
              style={styles.featureItem}
            />
            <Divider />
            
            <List.Item
              title="Progress Tracking"
              description="Monitor your career development with detailed analytics"
              left={props => <List.Icon {...props} icon="trending-up" />}
              style={styles.featureItem}
            />
          </Card.Content>
        </Card>

        {/* Technology Stack */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="code-tags" size={24} color={theme.colors.primary} />
              <Title style={styles.sectionTitle}>Technology</Title>
            </View>
            <Paragraph style={styles.description}>
              CareerForge AI is built with cutting-edge technology to deliver a seamless, 
              intelligent user experience:
            </Paragraph>
            
            <View style={styles.techStack}>
              <View style={styles.techCategory}>
                <Title style={styles.techCategoryTitle}>Frontend</Title>
                <View style={styles.techChips}>
                  <Chip style={styles.techChip}>React Native</Chip>
                  <Chip style={styles.techChip}>Expo</Chip>
                  <Chip style={styles.techChip}>Material Design 3</Chip>
                </View>
              </View>
              
              <View style={styles.techCategory}>
                <Title style={styles.techCategoryTitle}>Backend</Title>
                <View style={styles.techChips}>
                  <Chip style={styles.techChip}>Django REST Framework</Chip>
                  <Chip style={styles.techChip}>PostgreSQL</Chip>
                  <Chip style={styles.techChip}>Docker</Chip>
                </View>
              </View>
              
              <View style={styles.techCategory}>
                <Title style={styles.techCategoryTitle}>AI & Machine Learning</Title>
                <View style={styles.techChips}>
                  <Chip style={styles.techChip}>OpenAI GPT-4</Chip>
                  <Chip style={styles.techChip}>Natural Language Processing</Chip>
                  <Chip style={styles.techChip}>Recommendation Algorithms</Chip>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Company Values */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="heart" size={24} color={theme.colors.primary} />
              <Title style={styles.sectionTitle}>Our Values</Title>
            </View>
            
            <View style={styles.valueItem}>
              <MaterialCommunityIcons name="account-group" size={20} color={theme.colors.accent} />
              <View style={styles.valueContent}>
                <Title style={styles.valueTitle}>Accessibility</Title>
                <Paragraph style={styles.valueDescription}>
                  Career development should be accessible to everyone, regardless of background or resources.
                </Paragraph>
              </View>
            </View>
            
            <View style={styles.valueItem}>
              <MaterialCommunityIcons name="lightbulb" size={20} color={theme.colors.accent} />
              <View style={styles.valueContent}>
                <Title style={styles.valueTitle}>Innovation</Title>
                <Paragraph style={styles.valueDescription}>
                  We continuously push the boundaries of what's possible with AI and career technology.
                </Paragraph>
              </View>
            </View>
            
            <View style={styles.valueItem}>
              <MaterialCommunityIcons name="shield-check" size={20} color={theme.colors.accent} />
              <View style={styles.valueContent}>
                <Title style={styles.valueTitle}>Privacy</Title>
                <Paragraph style={styles.valueDescription}>
                  Your career data is private and secure. We never share personal information without consent.
                </Paragraph>
              </View>
            </View>
            
            <View style={styles.valueItem}>
              <MaterialCommunityIcons name="chart-line" size={20} color={theme.colors.accent} />
              <View style={styles.valueContent}>
                <Title style={styles.valueTitle}>Results</Title>
                <Paragraph style={styles.valueDescription}>
                  We measure success by the career advancement and satisfaction of our users.
                </Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Statistics */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="chart-box" size={24} color={theme.colors.primary} />
              <Title style={styles.sectionTitle}>Impact</Title>
            </View>
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Title style={styles.statNumber}>50K+</Title>
                <Paragraph style={styles.statLabel}>Active Users</Paragraph>
              </View>
              <View style={styles.statItem}>
                <Title style={styles.statNumber}>1M+</Title>
                <Paragraph style={styles.statLabel}>Career Roadmaps</Paragraph>
              </View>
              <View style={styles.statItem}>
                <Title style={styles.statNumber}>85%</Title>
                <Paragraph style={styles.statLabel}>Success Rate</Paragraph>
              </View>
              <View style={styles.statItem}>
                <Title style={styles.statNumber}>200+</Title>
                <Paragraph style={styles.statLabel}>Partner Companies</Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Contact & Links */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="link" size={24} color={theme.colors.primary} />
              <Title style={styles.sectionTitle}>Connect With Us</Title>
            </View>
            
            <Button 
              mode="outlined" 
              onPress={() => handleLinkPress('https://careerforge.ai')}
              style={styles.linkButton}
              icon="web"
            >
              Visit Our Website
            </Button>
            
            <Button 
              mode="outlined" 
              onPress={() => handleLinkPress('mailto:support@careerforge.ai')}
              style={styles.linkButton}
              icon="email"
            >
              Contact Support
            </Button>
            
            <Button 
              mode="outlined" 
              onPress={() => handleLinkPress('https://twitter.com/careerforgeai')}
              style={styles.linkButton}
              icon="twitter"
            >
              Follow on Twitter
            </Button>
            
            <Button 
              mode="outlined" 
              onPress={() => handleLinkPress('https://linkedin.com/company/careerforge-ai')}
              style={styles.linkButton}
              icon="linkedin"
            >
              LinkedIn
            </Button>
          </Card.Content>
        </Card>

        {/* Legal */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="gavel" size={24} color={theme.colors.primary} />
              <Title style={styles.sectionTitle}>Legal</Title>
            </View>
            
            <Button 
              mode="text" 
              onPress={() => router.push('/settings/privacy-policy')}
              style={styles.legalButton}
            >
              Privacy Policy
            </Button>
            
            <Button 
              mode="text" 
              onPress={() => router.push('/settings/terms-of-service')}
              style={styles.legalButton}
            >
              Terms of Service
            </Button>
            
            <Button 
              mode="text" 
              onPress={() => router.push('/settings/licenses')}
              style={styles.legalButton}
            >
              Open Source Licenses
            </Button>
          </Card.Content>
        </Card>

        {/* Footer */}
        <View style={styles.footer}>
          <Paragraph style={styles.footerText}>
            © 2024 CareerForge AI. All rights reserved.
          </Paragraph>
          <Paragraph style={styles.footerText}>
            Made with ❤️ for career growth
          </Paragraph>
        </View>
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
  
  // Hero Section
  heroCard: {
    margin: 16,
    elevation: 4,
    borderRadius: theme.roundness,
  },
  heroContent: {
    alignItems: 'center',
    padding: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginTop: 12,
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
    color: theme.colors.onSurface,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  versionContainer: {
    marginTop: 8,
  },
  versionChip: {
    backgroundColor: theme.colors.primaryContainer,
  },
  
  // Section Cards
  sectionCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
    borderRadius: theme.roundness,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
    color: theme.colors.onSurface,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
    color: theme.colors.onSurface,
  },
  
  // Mission
  missionText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
    color: theme.colors.onSurface,
  },
  
  // Features
  featureItem: {
    paddingVertical: 8,
  },
  
  // Technology
  techStack: {
    marginTop: 16,
  },
  techCategory: {
    marginBottom: 20,
  },
  techCategoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: theme.colors.primary,
  },
  techChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  techChip: {
    backgroundColor: theme.colors.surfaceVariant,
    marginBottom: 4,
  },
  
  // Values
  valueItem: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  valueContent: {
    flex: 1,
    marginLeft: 12,
  },
  valueTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  valueDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.onSurface,
  },
  
  // Statistics
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  
  // Links
  linkButton: {
    marginBottom: 12,
    borderColor: theme.colors.primary,
  },
  legalButton: {
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  
  // Footer
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: theme.colors.outline,
    textAlign: 'center',
    marginBottom: 4,
  },
}); 