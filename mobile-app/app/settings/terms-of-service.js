import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, Appbar } from 'react-native-paper';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme } from '../../utils/theme';

export default function TermsOfServiceScreen() {
  return (
    <View style={styles.container}>
      
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <Card style={styles.headerCard}>
          <Card.Content style={styles.headerContent}>
            <MaterialCommunityIcons 
              name="gavel" 
              size={48} 
              color={theme.colors.primary} 
            />
            <Title style={styles.headerTitle}>Terms of Service</Title>
            <Paragraph style={styles.headerDescription}>
              Last updated: January 2024
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Acceptance of Terms */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>1. Acceptance of Terms</Title>
            <Paragraph style={styles.paragraph}>
              By accessing and using CareerForge AI ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              These Terms of Service ("Terms") govern your use of our mobile application and services provided by CareerForge AI ("Company," "we," "our," or "us").
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Description of Service */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>2. Description of Service</Title>
            <Paragraph style={styles.paragraph}>
              CareerForge AI is an AI-powered career development platform that provides:
            </Paragraph>
            <View style={styles.bulletList}>
              <Paragraph style={styles.bulletItem}>• Personalized career roadmaps and recommendations</Paragraph>
              <Paragraph style={styles.bulletItem}>• Job matching and opportunity discovery</Paragraph>
              <Paragraph style={styles.bulletItem}>• Resume analysis and optimization</Paragraph>
              <Paragraph style={styles.bulletItem}>• Skill assessment and development tracking</Paragraph>
              <Paragraph style={styles.bulletItem}>• Learning resources and course recommendations</Paragraph>
              <Paragraph style={styles.bulletItem}>• Career mentorship and networking opportunities</Paragraph>
            </View>
          </Card.Content>
        </Card>

        {/* User Accounts */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>3. User Accounts</Title>
            
            <Title style={styles.subsectionTitle}>Account Creation</Title>
            <Paragraph style={styles.paragraph}>
              To use our Service, you must create an account by providing accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials.
            </Paragraph>

            <Title style={styles.subsectionTitle}>Account Responsibilities</Title>
            <Paragraph style={styles.paragraph}>
              You are responsible for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account or any other breach of security.
            </Paragraph>

            <Title style={styles.subsectionTitle}>Account Termination</Title>
            <Paragraph style={styles.paragraph}>
              We reserve the right to terminate or suspend your account at any time for violations of these Terms or for any other reason at our sole discretion.
            </Paragraph>
          </Card.Content>
        </Card>

        {/* User Conduct */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>4. User Conduct</Title>
            <Paragraph style={styles.paragraph}>
              You agree not to use the Service to:
            </Paragraph>
            <View style={styles.bulletList}>
              <Paragraph style={styles.bulletItem}>• Violate any applicable laws or regulations</Paragraph>
              <Paragraph style={styles.bulletItem}>• Infringe on the rights of others</Paragraph>
              <Paragraph style={styles.bulletItem}>• Upload false, misleading, or fraudulent information</Paragraph>
              <Paragraph style={styles.bulletItem}>• Attempt to gain unauthorized access to our systems</Paragraph>
              <Paragraph style={styles.bulletItem}>• Interfere with or disrupt the Service</Paragraph>
              <Paragraph style={styles.bulletItem}>• Use the Service for commercial purposes without permission</Paragraph>
              <Paragraph style={styles.bulletItem}>• Harass, abuse, or harm other users</Paragraph>
            </View>
          </Card.Content>
        </Card>

        {/* Content and Intellectual Property */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>5. Content and Intellectual Property</Title>
            
            <Title style={styles.subsectionTitle}>Your Content</Title>
            <Paragraph style={styles.paragraph}>
              You retain ownership of any content you submit to the Service. By submitting content, you grant us a non-exclusive, worldwide, royalty-free license to use, modify, and display your content for the purpose of providing our services.
            </Paragraph>

            <Title style={styles.subsectionTitle}>Our Content</Title>
            <Paragraph style={styles.paragraph}>
              The Service and its original content, features, and functionality are owned by CareerForge AI and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </Paragraph>

            <Title style={styles.subsectionTitle}>AI-Generated Content</Title>
            <Paragraph style={styles.paragraph}>
              Our AI-generated recommendations, roadmaps, and insights are provided for informational purposes only. While we strive for accuracy, we do not guarantee the completeness or reliability of AI-generated content.
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Privacy and Data Protection */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>6. Privacy and Data Protection</Title>
            <Paragraph style={styles.paragraph}>
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our Service. By using our Service, you agree to the collection and use of information in accordance with our Privacy Policy.
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Disclaimers */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>7. Disclaimers</Title>
            
            <Title style={styles.subsectionTitle}>Service Availability</Title>
            <Paragraph style={styles.paragraph}>
              We strive to maintain the Service, but we do not guarantee that it will be available at all times. The Service may be temporarily unavailable due to maintenance, updates, or technical issues.
            </Paragraph>

            <Title style={styles.subsectionTitle}>Career Advice</Title>
            <Paragraph style={styles.paragraph}>
              The career advice, recommendations, and insights provided by our Service are for informational purposes only and should not be considered as professional career counseling or guaranteed outcomes.
            </Paragraph>

            <Title style={styles.subsectionTitle}>Third-Party Content</Title>
            <Paragraph style={styles.paragraph}>
              Our Service may contain links to third-party websites or services. We are not responsible for the content, privacy policies, or practices of third-party sites.
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Limitation of Liability */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>8. Limitation of Liability</Title>
            <Paragraph style={styles.paragraph}>
              To the maximum extent permitted by law, CareerForge AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              In no event shall our total liability to you for all damages exceed the amount you paid us in the twelve (12) months preceding the claim.
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Indemnification */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>9. Indemnification</Title>
            <Paragraph style={styles.paragraph}>
              You agree to defend, indemnify, and hold harmless CareerForge AI and its officers, directors, employees, and agents from and against any claims, damages, obligations, losses, liabilities, costs, or debt, and expenses (including attorney's fees) arising from your use of the Service or violation of these Terms.
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Subscription and Payments */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>10. Subscription and Payments</Title>
            
            <Title style={styles.subsectionTitle}>Free and Paid Services</Title>
            <Paragraph style={styles.paragraph}>
              We offer both free and paid subscription plans. Paid features are clearly marked and require a valid payment method.
            </Paragraph>

            <Title style={styles.subsectionTitle}>Billing</Title>
            <Paragraph style={styles.paragraph}>
              Subscription fees are billed in advance on a recurring basis. You authorize us to charge your payment method for all fees incurred.
            </Paragraph>

            <Title style={styles.subsectionTitle}>Cancellation</Title>
            <Paragraph style={styles.paragraph}>
              You may cancel your subscription at any time through your account settings. Cancellation will take effect at the end of your current billing period.
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Governing Law */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>11. Governing Law</Title>
            <Paragraph style={styles.paragraph}>
              These Terms shall be interpreted and governed by the laws of the State of California, United States, without regard to its conflict of law provisions. Any disputes arising from these Terms shall be resolved in the courts of California.
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Changes to Terms */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>12. Changes to Terms</Title>
            <Paragraph style={styles.paragraph}>
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. Your continued use of the Service after such changes constitutes acceptance of the new Terms.
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Contact Information */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>13. Contact Information</Title>
            <Paragraph style={styles.paragraph}>
              If you have any questions about these Terms of Service, please contact us:
            </Paragraph>
            <View style={styles.contactInfo}>
              <Paragraph style={styles.contactItem}>Email: legal@careerforge.ai</Paragraph>
              <Paragraph style={styles.contactItem}>Address: CareerForge AI Legal Department</Paragraph>
              <Paragraph style={styles.contactItem}>123 Innovation Drive, Tech City, TC 12345</Paragraph>
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
    fontStyle: 'italic',
  },
  
  // Sections
  sectionCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
    borderRadius: theme.roundness,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: theme.colors.primary,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: theme.colors.onSurface,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
    color: theme.colors.onSurface,
  },
  
  // Lists
  bulletList: {
    marginLeft: 8,
    marginBottom: 12,
  },
  bulletItem: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
    color: theme.colors.onSurface,
  },
  
  // Contact
  contactInfo: {
    marginTop: 8,
    padding: 16,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 8,
  },
  contactItem: {
    fontSize: 14,
    marginBottom: 4,
    color: theme.colors.onSurface,
  },
}); 