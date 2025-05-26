import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, ProgressBar, List, FAB, Text, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { theme } from '../../utils/theme';

export default function RoadmapDetailsScreen() {
  const { roadmapId } = useLocalSearchParams();
  const [roadmap, setRoadmap] = useState({
    id: roadmapId || 1,
    title: "Full-Stack Developer Path",
    description: "Master modern web development with React, Node.js, and cloud deployment. Build real-world projects and gain industry-ready skills.",
    domain: "Software",
    difficulty: "Intermediate",
    duration: "16 weeks",
    completedSteps: 13,
    totalSteps: 20,
    nextMilestone: "Deploy React App",
    match: 92,
    skills: ["React", "Node.js", "MongoDB", "Express", "AWS", "Docker", "Git", "JavaScript", "TypeScript", "REST APIs"],
    steps: [
      {
        id: 1,
        name: "JavaScript Fundamentals",
        description: "Master ES6+ features, async/await, and modern JavaScript concepts",
        duration: "1 week",
        completed: true,
        category: "Foundation",
        resources: ["MDN Documentation", "JavaScript.info", "Practice Exercises"]
      },
      {
        id: 2,
        name: "React Basics",
        description: "Learn components, props, state, and hooks",
        duration: "2 weeks",
        completed: true,
        category: "Frontend",
        resources: ["React Documentation", "Create React App", "Component Exercises"]
      },
      {
        id: 3,
        name: "State Management",
        description: "Context API, Redux, and advanced state patterns",
        duration: "1 week",
        completed: true,
        category: "Frontend",
        resources: ["Redux Toolkit", "Context API Guide", "State Management Patterns"]
      },
      {
        id: 4,
        name: "Node.js Backend",
        description: "Build RESTful APIs with Express and middleware",
        duration: "2 weeks",
        completed: false,
        category: "Backend",
        resources: ["Express.js Guide", "Node.js Documentation", "API Design Best Practices"]
      },
      {
        id: 5,
        name: "Database Integration",
        description: "MongoDB setup, schemas, and data modeling",
        duration: "1 week",
        completed: false,
        category: "Backend",
        resources: ["MongoDB University", "Mongoose Documentation", "Database Design"]
      },
      {
        id: 6,
        name: "Authentication & Security",
        description: "JWT, bcrypt, and security best practices",
        duration: "1 week",
        completed: false,
        category: "Security",
        resources: ["JWT Guide", "Security Checklist", "Auth0 Documentation"]
      },
      {
        id: 7,
        name: "Testing & Quality",
        description: "Unit tests, integration tests, and code quality",
        duration: "1 week",
        completed: false,
        category: "Quality",
        resources: ["Jest Documentation", "Testing Library", "Code Quality Tools"]
      },
      {
        id: 8,
        name: "Deployment & DevOps",
        description: "AWS deployment, CI/CD, and monitoring",
        duration: "2 weeks",
        completed: false,
        category: "DevOps",
        resources: ["AWS Documentation", "GitHub Actions", "Docker Guide"]
      }
    ]
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return theme.colors.success;
      case 'intermediate': return theme.colors.warning;
      case 'advanced': return theme.colors.error;
      default: return theme.colors.outline;
    }
  };

  const getCategoryColor = (category) => {
    const categoryColors = {
      'Foundation': theme.colors.primary,
      'Frontend': theme.colors.secondary,
      'Backend': theme.colors.tertiary,
      'Security': theme.colors.error,
      'Quality': theme.colors.success,
      'DevOps': theme.colors.accent,
    };
    return categoryColors[category] || theme.colors.outline;
  };

  const toggleStepCompletion = (stepId) => {
    setRoadmap(prev => ({
      ...prev,
      steps: prev.steps.map(step => 
        step.id === stepId 
          ? { ...step, completed: !step.completed }
          : step
      ),
      completedSteps: prev.steps.filter(step => 
        step.id === stepId ? !step.completed : step.completed
      ).length
    }));
  };

  const completedSteps = roadmap.steps.filter(step => step.completed).length;
  const progressPercentage = Math.round((completedSteps / roadmap.steps.length) * 100);

  const StepCard = ({ step, index }) => (
    <Card style={[styles.stepCard, step.completed && styles.completedStepCard]}>
      <Card.Content>
        <View style={styles.stepHeader}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>{index + 1}</Text>
          </View>
          <View style={styles.stepInfo}>
            <View style={styles.stepTitleRow}>
              <Title style={[styles.stepTitle, step.completed && styles.completedText]}>
                {step.name}
              </Title>
              <Chip 
                style={[styles.categoryChip, { backgroundColor: getCategoryColor(step.category) + '20' }]}
                textStyle={[styles.categoryText, { color: getCategoryColor(step.category) }]}
              >
                {step.category}
              </Chip>
            </View>
            <Paragraph style={[styles.stepDescription, step.completed && styles.completedText]}>
              {step.description}
            </Paragraph>
            <View style={styles.stepMeta}>
              <Chip icon="clock-outline" style={styles.durationChip} textStyle={styles.durationText}>
                {step.duration}
              </Chip>
              <TouchableOpacity 
                onPress={() => toggleStepCompletion(step.id)}
                style={styles.checkButton}
              >
                <MaterialCommunityIcons 
                  name={step.completed ? "check-circle" : "circle-outline"} 
                  size={24} 
                  color={step.completed ? theme.colors.success : theme.colors.outline} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        {step.resources && (
          <View style={styles.resourcesSection}>
            <Text style={styles.resourcesTitle}>Resources:</Text>
            <View style={styles.resourcesList}>
              {step.resources.map((resource, idx) => (
                <Chip 
                  key={idx} 
                  icon="book-open-variant" 
                  style={styles.resourceChip}
                  textStyle={styles.resourceText}
                  onPress={() => {/* Open resource */}}
                >
                  {resource}
                </Chip>
              ))}
            </View>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <View style={styles.headerTop}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
              <Chip icon="trending-up" style={styles.activeChip} textStyle={styles.activeChipText}>
                Active
              </Chip>
            </View>
            
            <Title style={styles.roadmapTitle}>{roadmap.title}</Title>
            <Paragraph style={styles.roadmapDescription}>{roadmap.description}</Paragraph>
            
            <View style={styles.roadmapMeta}>
              <Chip 
                icon="tag-outline" 
                style={styles.domainChip}
                textStyle={styles.domainText}
              >
                {roadmap.domain}
              </Chip>
              <Chip 
                icon="speedometer" 
                style={[styles.difficultyChip, { backgroundColor: getDifficultyColor(roadmap.difficulty) + '20' }]}
                textStyle={[styles.difficultyText, { color: getDifficultyColor(roadmap.difficulty) }]}
              >
                {roadmap.difficulty}
              </Chip>
              <Chip icon="clock-outline" style={styles.durationChip} textStyle={styles.durationText}>
                {roadmap.duration}
              </Chip>
            </View>
          </Card.Content>
        </Card>

        {/* Progress Overview */}
        <Card style={styles.progressCard}>
          <Card.Content>
            <View style={styles.progressHeader}>
              <Title style={styles.progressTitle}>Your Progress</Title>
              <Text style={styles.progressPercentage}>{progressPercentage}%</Text>
            </View>
            
            <ProgressBar 
              progress={completedSteps / roadmap.steps.length} 
              color={theme.colors.primary} 
              style={styles.progressBar} 
            />
            
            <View style={styles.progressStats}>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatNumber}>{completedSteps}</Text>
                <Text style={styles.progressStatLabel}>Completed</Text>
              </View>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatNumber}>{roadmap.steps.length - completedSteps}</Text>
                <Text style={styles.progressStatLabel}>Remaining</Text>
              </View>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatNumber}>{roadmap.steps.length}</Text>
                <Text style={styles.progressStatLabel}>Total Steps</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Skills Overview */}
        <Card style={styles.skillsCard}>
          <Card.Content>
            <Title style={styles.skillsTitle}>Skills You'll Master</Title>
            <View style={styles.skillsGrid}>
              {roadmap.skills.map((skill, index) => (
                <Chip
                  key={index}
                  icon="school"
                  style={styles.skillChip}
                  textStyle={styles.skillText}
                >
                  {skill}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Learning Path Steps */}
        <View style={styles.stepsSection}>
          <Title style={styles.stepsTitle}>Learning Path</Title>
          {roadmap.steps.map((step, index) => (
            <StepCard key={step.id} step={step} index={index} />
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button 
            mode="outlined" 
            onPress={() => {/* Share roadmap */}}
            style={styles.shareButton}
            icon="share-variant"
          >
            Share Progress
          </Button>
          <Button 
            mode="contained" 
            onPress={() => {/* Continue learning */}}
            style={styles.continueButton}
            icon="play"
          >
            Continue Learning
          </Button>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {/* Add custom step */}}
        label="Add Step"
      />
    </SafeAreaView>
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
    elevation: 6,
    borderRadius: theme.roundness,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  activeChip: {
    backgroundColor: theme.colors.success,
    height: 28,
  },
  activeChipText: {
    fontSize: 12,
    color: theme.colors.surface,
  },
  roadmapTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme.colors.onSurface,
  },
  roadmapDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    color: theme.colors.outline,
  },
  roadmapMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  domainChip: {
    backgroundColor: theme.colors.primaryContainer,
    height: 32,
  },
  domainText: {
    fontSize: 12,
    color: theme.colors.primary,
  },
  difficultyChip: {
    height: 32,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  durationChip: {
    backgroundColor: theme.colors.surfaceVariant,
    height: 32,
  },
  durationText: {
    fontSize: 12,
    color: theme.colors.outline,
  },

  // Progress
  progressCard: {
    margin: 16,
    marginTop: 0,
    elevation: 4,
    borderRadius: theme.roundness,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressStat: {
    alignItems: 'center',
  },
  progressStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  progressStatLabel: {
    fontSize: 12,
    color: theme.colors.outline,
    marginTop: 4,
  },

  // Skills
  skillsCard: {
    margin: 16,
    marginTop: 0,
    elevation: 3,
    borderRadius: theme.roundness,
  },
  skillsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    backgroundColor: theme.colors.secondaryContainer,
    marginBottom: 4,
  },
  skillText: {
    fontSize: 12,
    color: theme.colors.secondary,
  },

  // Steps
  stepsSection: {
    margin: 16,
    marginTop: 0,
  },
  stepsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: theme.colors.onSurface,
  },
  stepCard: {
    marginBottom: 12,
    elevation: 2,
    borderRadius: theme.roundness,
  },
  completedStepCard: {
    backgroundColor: theme.colors.surfaceVariant,
    opacity: 0.8,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 4,
  },
  stepNumberText: {
    color: theme.colors.surface,
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepInfo: {
    flex: 1,
  },
  stepTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  categoryChip: {
    height: 24,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
  },
  stepDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    color: theme.colors.outline,
  },
  stepMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkButton: {
    padding: 4,
  },
  resourcesSection: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline + '20',
  },
  resourcesTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: theme.colors.onSurface,
  },
  resourcesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  resourceChip: {
    backgroundColor: theme.colors.tertiaryContainer,
    height: 28,
  },
  resourceText: {
    fontSize: 11,
    color: theme.colors.tertiary,
  },

  // Actions
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    margin: 16,
    marginTop: 0,
    marginBottom: 80, // Space for FAB
  },
  shareButton: {
    flex: 1,
    borderColor: theme.colors.primary,
  },
  continueButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },

  // FAB
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
}); 