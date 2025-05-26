import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, Appbar, Divider } from 'react-native-paper';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme } from '../../utils/theme';

export default function PrivacyPolicyScreen() {
  return (
    <View style={styles.container}>
      
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <Card style={styles.headerCard}>
          <Card.Content style={styles.headerContent}>
            <MaterialCommunityIcons 
              name="shield-check" 
              size={48} 
              color={theme.colors.primary} 
            />
            <Title style={styles.headerTitle}>Privacy Policy</Title>
            <Paragraph style={styles.headerDescription}>
              Last updated: January 2024
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Introduction */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Introduction</Title>
            <Paragraph style={styles.paragraph}>
              CareerForge AI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and services.
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              By using CareerForge AI, you agree to the collection and use of information in accordance with this policy.
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Information We Collect */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Information We Collect</Title>
            
            <Title style={styles.subsectionTitle}>Personal Information</Title>
            <Paragraph style={styles.paragraph}>
              We collect information you provide directly to us, including:
            </Paragraph>
            <View style={styles.bulletList}>
              <Paragraph style={styles.bulletItem}>• Name and contact information</Paragraph>
              <Paragraph style={styles.bulletItem}>• Email address and phone number</Paragraph>
              <Paragraph style={styles.bulletItem}>• Professional background and career goals</Paragraph>
              <Paragraph style={styles.bulletItem}>• Skills and experience level</Paragraph>
              <Paragraph style={styles.bulletItem}>• Resume and portfolio information</Paragraph>
            </View>

            <Title style={styles.subsectionTitle}>Usage Information</Title>
            <Paragraph style={styles.paragraph}>
              We automatically collect certain information about your use of our services:
            </Paragraph>
            <View style={styles.bulletList}>
              <Paragraph style={styles.bulletItem}>• App usage patterns and preferences</Paragraph>
              <Paragraph style={styles.bulletItem}>• Device information and identifiers</Paragraph>
              <Paragraph style={styles.bulletItem}>• Log data and analytics</Paragraph>
              <Paragraph style={styles.bulletItem}>• Location data (with your permission)</Paragraph>
            </View>
          </Card.Content>
        </Card>

        {/* How We Use Your Information */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>How We Use Your Information</Title>
            <Paragraph style={styles.paragraph}>
              We use the information we collect to:
            </Paragraph>
            <View style={styles.bulletList}>
              <Paragraph style={styles.bulletItem}>• Provide personalized career recommendations</Paragraph>
              <Paragraph style={styles.bulletItem}>• Generate AI-powered roadmaps and insights</Paragraph>
              <Paragraph style={styles.bulletItem}>• Match you with relevant job opportunities</Paragraph>
              <Paragraph style={styles.bulletItem}>• Improve our services and user experience</Paragraph>
              <Paragraph style={styles.bulletItem}>• Send you notifications and updates</Paragraph>
              <Paragraph style={styles.bulletItem}>• Provide customer support</Paragraph>
              <Paragraph style={styles.bulletItem}>• Ensure security and prevent fraud</Paragraph>
            </View>
          </Card.Content>
        </Card>

        {/* Information Sharing */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Information Sharing and Disclosure</Title>
            <Paragraph style={styles.paragraph}>
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
            </Paragraph>
            
            <Title style={styles.subsectionTitle}>With Your Consent</Title>
            <Paragraph style={styles.paragraph}>
              We may share your information when you explicitly consent, such as when applying for jobs through our platform.
            </Paragraph>

            <Title style={styles.subsectionTitle}>Service Providers</Title>
            <Paragraph style={styles.paragraph}>
              We may share information with trusted third-party service providers who assist us in operating our platform, subject to confidentiality agreements.
            </Paragraph>

            <Title style={styles.subsectionTitle}>Legal Requirements</Title>
            <Paragraph style={styles.paragraph}>
              We may disclose information if required by law or to protect our rights, property, or safety, or that of our users.
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Data Security */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Data Security</Title>
            <Paragraph style={styles.paragraph}>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </Paragraph>
            <View style={styles.bulletList}>
              <Paragraph style={styles.bulletItem}>• End-to-end encryption for sensitive data</Paragraph>
              <Paragraph style={styles.bulletItem}>• Regular security audits and assessments</Paragraph>
              <Paragraph style={styles.bulletItem}>• Secure data storage and transmission</Paragraph>
              <Paragraph style={styles.bulletItem}>• Access controls and authentication</Paragraph>
            </View>
          </Card.Content>
        </Card>

        {/* Your Rights */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Your Rights and Choices</Title>
            <Paragraph style={styles.paragraph}>
              You have the following rights regarding your personal information:
            </Paragraph>
            
            <Title style={styles.subsectionTitle}>Access and Portability</Title>
            <Paragraph style={styles.paragraph}>
              You can access and download your personal data through your account settings.
            </Paragraph>

            <Title style={styles.subsectionTitle}>Correction and Updates</Title>
            <Paragraph style={styles.paragraph}>
              You can update your personal information at any time through the app.
            </Paragraph>

            <Title style={styles.subsectionTitle}>Deletion</Title>
            <Paragraph style={styles.paragraph}>
              You can request deletion of your account and personal data by contacting our support team.
            </Paragraph>

            <Title style={styles.subsectionTitle}>Opt-out</Title>
            <Paragraph style={styles.paragraph}>
              You can opt out of marketing communications and adjust notification preferences in your settings.
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Data Retention */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Data Retention</Title>
            <Paragraph style={styles.paragraph}>
              We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. When you delete your account, we will delete your personal information within 30 days, except where we are required to retain it for legal purposes.
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Children's Privacy */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Children's Privacy</Title>
            <Paragraph style={styles.paragraph}>
              Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </Paragraph>
          </Card.Content>
        </Card>

        {/* International Transfers */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>International Data Transfers</Title>
            <Paragraph style={styles.paragraph}>
              Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards.
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Changes to Policy */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Changes to This Privacy Policy</Title>
            <Paragraph style={styles.paragraph}>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Contact Information */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Contact Us</Title>
            <Paragraph style={styles.paragraph}>
              If you have any questions about this Privacy Policy or our privacy practices, please contact us:
            </Paragraph>
            <View style={styles.contactInfo}>
              <Paragraph style={styles.contactItem}>Email: privacy@careerforge.ai</Paragraph>
              <Paragraph style={styles.contactItem}>Address: CareerForge AI Privacy Team</Paragraph>
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