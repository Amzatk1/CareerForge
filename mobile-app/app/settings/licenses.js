import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, Appbar, Chip } from 'react-native-paper';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme } from '../../utils/theme';

const LICENSES = [
  {
    name: 'React Native',
    version: '0.72.x',
    license: 'MIT',
    description: 'A framework for building native apps using React',
    url: 'https://github.com/facebook/react-native'
  },
  {
    name: 'Expo',
    version: '49.x',
    license: 'MIT',
    description: 'An open-source platform for making universal native apps',
    url: 'https://github.com/expo/expo'
  },
  {
    name: 'React Navigation',
    version: '6.x',
    license: 'MIT',
    description: 'Routing and navigation for React Native apps',
    url: 'https://github.com/react-navigation/react-navigation'
  },
  {
    name: 'React Native Paper',
    version: '5.x',
    license: 'MIT',
    description: 'Material Design for React Native',
    url: 'https://github.com/callstack/react-native-paper'
  },
  {
    name: 'React Native Vector Icons',
    version: '10.x',
    license: 'MIT',
    description: 'Customizable Icons for React Native',
    url: 'https://github.com/oblador/react-native-vector-icons'
  },
  {
    name: 'React Native Safe Area Context',
    version: '4.x',
    license: 'MIT',
    description: 'A flexible way to handle safe area insets',
    url: 'https://github.com/th3rdwave/react-native-safe-area-context'
  },
  {
    name: 'React Native Toast Message',
    version: '2.x',
    license: 'MIT',
    description: 'Animated toast message component for React Native',
    url: 'https://github.com/calintamas/react-native-toast-message'
  },
  {
    name: 'Django',
    version: '4.x',
    license: 'BSD-3-Clause',
    description: 'A high-level Python web framework',
    url: 'https://github.com/django/django'
  },
  {
    name: 'Django REST Framework',
    version: '3.x',
    license: 'BSD-2-Clause',
    description: 'Web APIs for Django',
    url: 'https://github.com/encode/django-rest-framework'
  },
  {
    name: 'PostgreSQL',
    version: '15.x',
    license: 'PostgreSQL License',
    description: 'Advanced open source relational database',
    url: 'https://www.postgresql.org/'
  },
  {
    name: 'Docker',
    version: '24.x',
    license: 'Apache 2.0',
    description: 'Platform for developing, shipping, and running applications',
    url: 'https://github.com/docker/docker-ce'
  },
  {
    name: 'OpenAI Python',
    version: '1.x',
    license: 'MIT',
    description: 'Python client library for the OpenAI API',
    url: 'https://github.com/openai/openai-python'
  }
];

const LICENSE_TYPES = {
  'MIT': {
    color: theme.colors.success,
    description: 'Permissive license with minimal restrictions'
  },
  'BSD-3-Clause': {
    color: theme.colors.primary,
    description: 'Permissive license similar to MIT with attribution requirement'
  },
  'BSD-2-Clause': {
    color: theme.colors.primary,
    description: 'Simplified BSD license'
  },
  'Apache 2.0': {
    color: theme.colors.accent,
    description: 'Permissive license with patent protection'
  },
  'PostgreSQL License': {
    color: theme.colors.secondary,
    description: 'Liberal open source license similar to MIT'
  }
};

export default function LicensesScreen() {
  const getLicenseColor = (license) => {
    return LICENSE_TYPES[license]?.color || theme.colors.outline;
  };

  const groupedLicenses = LICENSES.reduce((acc, lib) => {
    if (!acc[lib.license]) {
      acc[lib.license] = [];
    }
    acc[lib.license].push(lib);
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <Card style={styles.headerCard}>
          <Card.Content style={styles.headerContent}>
            <MaterialCommunityIcons 
              name="code-tags" 
              size={48} 
              color={theme.colors.primary} 
            />
            <Title style={styles.headerTitle}>Open Source Licenses</Title>
            <Paragraph style={styles.headerDescription}>
              CareerForge AI is built with amazing open source libraries. 
              We're grateful to the developers and communities behind these projects.
            </Paragraph>
          </Card.Content>
        </Card>

        {/* License Summary */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>License Summary</Title>
            <Paragraph style={styles.paragraph}>
              This application uses {LICENSES.length} open source libraries under various licenses:
            </Paragraph>
            <View style={styles.licenseSummary}>
              {Object.entries(LICENSE_TYPES).map(([license, info]) => {
                const count = groupedLicenses[license]?.length || 0;
                if (count === 0) return null;
                
                return (
                  <View key={license} style={styles.licenseTypeItem}>
                    <Chip 
                      style={[styles.licenseChip, { backgroundColor: info.color + '20' }]}
                      textStyle={[styles.licenseChipText, { color: info.color }]}
                    >
                      {license} ({count})
                    </Chip>
                    <Paragraph style={styles.licenseDescription}>
                      {info.description}
                    </Paragraph>
                  </View>
                );
              })}
            </View>
          </Card.Content>
        </Card>

        {/* Libraries by License */}
        {Object.entries(groupedLicenses).map(([license, libraries]) => (
          <Card key={license} style={styles.sectionCard}>
            <Card.Content>
              <View style={styles.licenseHeader}>
                <Title style={styles.sectionTitle}>{license} License</Title>
                <Chip 
                  style={[styles.countChip, { backgroundColor: getLicenseColor(license) + '20' }]}
                  textStyle={[styles.countChipText, { color: getLicenseColor(license) }]}
                >
                  {libraries.length} libraries
                </Chip>
              </View>
              
              {libraries.map((library, index) => (
                <View key={library.name} style={styles.libraryItem}>
                  <View style={styles.libraryHeader}>
                    <Title style={styles.libraryName}>{library.name}</Title>
                    <Chip style={styles.versionChip} textStyle={styles.versionChipText}>
                      v{library.version}
                    </Chip>
                  </View>
                  <Paragraph style={styles.libraryDescription}>
                    {library.description}
                  </Paragraph>
                  <Paragraph style={styles.libraryUrl}>
                    {library.url}
                  </Paragraph>
                  {index < libraries.length - 1 && <View style={styles.libraryDivider} />}
                </View>
              ))}
            </Card.Content>
          </Card>
        ))}

        {/* MIT License Text */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>MIT License (Most Common)</Title>
            <Paragraph style={styles.paragraph}>
              Most of our dependencies use the MIT License. Here's the full text:
            </Paragraph>
            <View style={styles.licenseText}>
              <Paragraph style={styles.licenseTextContent}>
                Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
              </Paragraph>
              <Paragraph style={styles.licenseTextContent}>
                The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
              </Paragraph>
              <Paragraph style={styles.licenseTextContent}>
                THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
              </Paragraph>
            </View>
          </Card.Content>
        </Card>

        {/* Acknowledgments */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Acknowledgments</Title>
            <Paragraph style={styles.paragraph}>
              We extend our heartfelt gratitude to all the open source contributors and maintainers who make projects like CareerForge AI possible. The open source community's dedication to sharing knowledge and building tools that benefit everyone is truly inspiring.
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              Special thanks to:
            </Paragraph>
            <View style={styles.bulletList}>
              <Paragraph style={styles.bulletItem}>• The React Native team at Meta for the amazing framework</Paragraph>
              <Paragraph style={styles.bulletItem}>• The Expo team for simplifying React Native development</Paragraph>
              <Paragraph style={styles.bulletItem}>• The Django Software Foundation for the robust web framework</Paragraph>
              <Paragraph style={styles.bulletItem}>• All the individual contributors to the libraries we use</Paragraph>
            </View>
          </Card.Content>
        </Card>

        {/* Contact */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Questions About Licenses</Title>
            <Paragraph style={styles.paragraph}>
              If you have any questions about the open source licenses used in CareerForge AI, please contact our legal team:
            </Paragraph>
            <View style={styles.contactInfo}>
              <Paragraph style={styles.contactItem}>Email: legal@careerforge.ai</Paragraph>
              <Paragraph style={styles.contactItem}>Subject: Open Source License Inquiry</Paragraph>
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
    lineHeight: 20,
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
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
    color: theme.colors.onSurface,
  },
  
  // License Summary
  licenseSummary: {
    marginTop: 8,
  },
  licenseTypeItem: {
    marginBottom: 16,
  },
  licenseChip: {
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  licenseChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  licenseDescription: {
    fontSize: 12,
    color: theme.colors.outline,
    marginLeft: 4,
  },
  
  // License Headers
  licenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  countChip: {
    height: 28,
  },
  countChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  
  // Libraries
  libraryItem: {
    marginBottom: 16,
  },
  libraryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  libraryName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
    flex: 1,
  },
  versionChip: {
    backgroundColor: theme.colors.surfaceVariant,
    height: 24,
  },
  versionChipText: {
    fontSize: 10,
    color: theme.colors.onSurface,
  },
  libraryDescription: {
    fontSize: 14,
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  libraryUrl: {
    fontSize: 12,
    color: theme.colors.primary,
    fontFamily: 'monospace',
  },
  libraryDivider: {
    height: 1,
    backgroundColor: theme.colors.outline + '30',
    marginTop: 16,
  },
  
  // License Text
  licenseText: {
    backgroundColor: theme.colors.surfaceVariant,
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  licenseTextContent: {
    fontSize: 12,
    lineHeight: 18,
    color: theme.colors.onSurface,
    marginBottom: 12,
    fontFamily: 'monospace',
  },
  
  // Lists
  bulletList: {
    marginLeft: 8,
    marginTop: 8,
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