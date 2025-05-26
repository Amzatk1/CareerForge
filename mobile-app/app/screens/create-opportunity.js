import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button, Appbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme } from '../../utils/theme';

export default function CreateOpportunityScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Create Opportunity" />
      </Appbar.Header>
      
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <MaterialCommunityIcons 
              name="plus-circle" 
              size={64} 
              color={theme.colors.primary} 
              style={styles.icon}
            />
            <Title style={styles.title}>Create Opportunity</Title>
            <Paragraph style={styles.description}>
              This feature is coming soon! You'll be able to create and share job opportunities, 
              courses, events, and mentorship offerings with the CareerForge community.
            </Paragraph>
            <Button 
              mode="contained" 
              onPress={() => router.back()}
              style={styles.button}
            >
              Go Back
            </Button>
          </Card.Content>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    elevation: 4,
    borderRadius: theme.roundness,
  },
  cardContent: {
    alignItems: 'center',
    padding: 32,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    paddingHorizontal: 24,
  },
}); 