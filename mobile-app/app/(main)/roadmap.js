import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Dimensions } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, ProgressBar, FAB, Text, Portal, Modal } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../utils/theme';
import RoadmapCard from '../../components/RoadmapCard';

const { width } = Dimensions.get('window');

export default function RoadmapScreen() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [quickActionsVisible, setQuickActionsVisible] = useState(false);

  // Mock data - in real app, fetch from API
  const [stats, setStats] = useState({
    activeRoadmaps: 2,
    completedSteps: 47,
    averageProgress: 68,
    weeklyGoal: 5,
    completedThisWeek: 3
  });

  const [activeRoadmaps, setActiveRoadmaps] = useState([
    {
      id: 1,
      title: "Full-Stack Developer Path",
      description: "Master modern web development with React, Node.js, and cloud deployment",
      domain: "Software",
      difficulty: "Intermediate",
      duration: "16 weeks",
      completedSteps: 13,
      totalSteps: 20,
      nextMilestone: "Deploy React App",
      skills: ["React", "Node.js", "MongoDB", "Express", "AWS", "Docker", "Git"],
      steps: [
        { name: "JavaScript Fundamentals", description: "ES6+ and modern concepts", duration: "1 week", completed: true },
        { name: "React Basics", description: "Components and hooks", duration: "2 weeks", completed: true },
        { name: "Node.js Backend", description: "RESTful APIs", duration: "2 weeks", completed: false }
      ]
    },
    {
      id: 2,
      title: "AWS Cloud Architect",
      description: "Design and deploy scalable cloud infrastructure on Amazon Web Services",
      domain: "Cloud",
      difficulty: "Advanced",
      duration: "12 weeks",
      completedSteps: 5,
      totalSteps: 20,
      nextMilestone: "EC2 Instance Setup",
      skills: ["AWS", "CloudFormation", "Lambda", "S3", "VPC", "IAM"],
      steps: [
        { name: "AWS Fundamentals", description: "Core services overview", duration: "1 week", completed: true },
        { name: "IAM & Security", description: "Identity management", duration: "1 week", completed: false }
      ]
    }
  ]);

  const [suggestedRoadmaps, setSuggestedRoadmaps] = useState([
    {
      id: 3,
      title: "Data Science with Python",
      description: "Learn data analysis, machine learning, and visualization with Python",
      domain: "Data",
      difficulty: "Intermediate",
      duration: "14 weeks",
      match: 85,
      skills: ["Python", "Pandas", "NumPy", "Scikit-learn", "Matplotlib", "Jupyter"]
    },
    {
      id: 4,
      title: "Mobile App Development",
      description: "Build cross-platform mobile apps with React Native",
      domain: "Mobile",
      difficulty: "Intermediate",
      duration: "10 weeks",
      match: 92,
      skills: ["React Native", "Expo", "JavaScript", "Mobile UI", "API Integration"]
    },
    {
      id: 5,
      title: "DevOps Engineering",
      description: "Master CI/CD, containerization, and infrastructure automation",
      domain: "DevOps",
      difficulty: "Advanced",
      duration: "18 weeks",
      match: 78,
      skills: ["Docker", "Kubernetes", "Jenkins", "Terraform", "Monitoring", "Linux"]
    }
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleStartRoadmap = (roadmap) => {
    // Add to active roadmaps
    setActiveRoadmaps(prev => [...prev, { ...roadmap, completedSteps: 0, totalSteps: 15 }]);
    setSuggestedRoadmaps(prev => prev.filter(r => r.id !== roadmap.id));
  };

  const handleViewDetails = (roadmap) => {
    router.push(`/screens/roadmap-details?roadmapId=${roadmap.id}`);
  };

  const SmartInsightBanner = () => {
    const totalProgress = Math.round(stats.averageProgress);
    let message = '';
    let icon = 'lightbulb';
    let bgColor = theme.colors.primaryContainer;

    if (totalProgress >= 80) {
      message = `Outstanding! You're ${totalProgress}% through your roadmaps. Keep this momentum!`;
      icon = 'trophy';
      bgColor = theme.colors.successContainer;
    } else if (totalProgress >= 60) {
      message = `Great progress! Complete ${stats.weeklyGoal - stats.completedThisWeek} more steps this week to hit your goal.`;
      icon = 'trending-up';
    } else if (totalProgress >= 30) {
      message = `You're building momentum! Focus on your next milestone to accelerate progress.`;
      icon = 'rocket-launch';
    } else {
      message = `Ready to start your journey? Pick a roadmap that matches your career goals.`;
      icon = 'map-marker-path';
    }

    return (
      <Card style={[styles.insightBanner, { backgroundColor: bgColor }]}>
        <Card.Content style={styles.insightContent}>
          <MaterialCommunityIcons name={icon} size={24} color={theme.colors.primary} />
          <Text style={styles.insightText}>{message}</Text>
        </Card.Content>
      </Card>
    );
  };

  const StatsOverview = () => (
    <Card style={styles.statsCard}>
      <Card.Content>
        <Title style={styles.statsTitle}>Your Learning Journey</Title>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.activeRoadmaps}</Text>
            <Text style={styles.statLabel}>Active Roadmaps</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.completedSteps}</Text>
            <Text style={styles.statLabel}>Steps Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.averageProgress}%</Text>
            <Text style={styles.statLabel}>Avg Progress</Text>
          </View>
        </View>
        
        <View style={styles.weeklyGoalSection}>
          <View style={styles.weeklyGoalHeader}>
            <Text style={styles.weeklyGoalTitle}>Weekly Goal</Text>
            <Text style={styles.weeklyGoalProgress}>{stats.completedThisWeek}/{stats.weeklyGoal}</Text>
          </View>
          <ProgressBar 
            progress={stats.completedThisWeek / stats.weeklyGoal} 
            color={theme.colors.success} 
            style={styles.weeklyProgressBar} 
          />
        </View>
      </Card.Content>
    </Card>
  );

  const QuickActionsModal = () => (
    <Portal>
      <Modal
        visible={quickActionsVisible}
        onDismiss={() => setQuickActionsVisible(false)}
        contentContainerStyle={styles.modalContainer}
      >
        <Card style={styles.modalCard}>
          <Card.Content>
            <View style={styles.modalHeader}>
              <Title style={styles.modalTitle}>Quick Actions</Title>
              <MaterialCommunityIcons 
                name="close" 
                size={24} 
                color={theme.colors.outline}
                onPress={() => setQuickActionsVisible(false)}
              />
            </View>
            
            <View style={styles.quickActionsGrid}>
              <Button
                mode="contained"
                icon="robot"
                onPress={() => {
                  setQuickActionsVisible(false);
                  router.push('/screens/ai-roadmap-generator');
                }}
                style={[styles.quickActionButton, { backgroundColor: theme.colors.primary }]}
              >
                AI Roadmap Generator
              </Button>
              
              <Button
                mode="contained"
                icon="file-document-edit"
                onPress={() => {
                  setQuickActionsVisible(false);
                  router.push('/screens/resume-analyzer');
                }}
                style={[styles.quickActionButton, { backgroundColor: theme.colors.secondary }]}
              >
                Resume Analyzer
              </Button>
              
              <Button
                mode="contained"
                icon="quiz"
                onPress={() => {
                  setQuickActionsVisible(false);
                  router.push('/screens/career-quiz');
                }}
                style={[styles.quickActionButton, { backgroundColor: theme.colors.accent }]}
              >
                Career Quiz
              </Button>
              
              <Button
                mode="contained"
                icon="brain"
                style={styles.quickActionButton}
                onPress={() => {
                  setQuickActionsVisible(false);
                  // Navigate to AI quiz
                }}
              >
                AI Career Quiz
              </Button>
              
              <Button
                mode="contained"
                icon="file-document-outline"
                style={styles.quickActionButton}
                onPress={() => {
                  setQuickActionsVisible(false);
                  // Navigate to resume upload
                }}
              >
                Upload Resume
              </Button>
              
              <Button
                mode="contained"
                icon="school-outline"
                style={styles.quickActionButton}
                onPress={() => {
                  setQuickActionsVisible(false);
                  // Navigate to courses
                }}
              >
                Browse Courses
              </Button>
              
              <Button
                mode="contained"
                icon="plus-circle-outline"
                style={styles.quickActionButton}
                onPress={() => {
                  setQuickActionsVisible(false);
                  // Navigate to custom roadmap creator
                }}
              >
                Create Custom
              </Button>
            </View>
          </Card.Content>
        </Card>
      </Modal>
    </Portal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Title style={styles.headerTitle}>Career Roadmaps</Title>
          <Paragraph style={styles.headerSubtitle}>
            Your personalized learning paths to career success
          </Paragraph>
        </View>

        {/* Stats Overview */}
        <StatsOverview />

        {/* Smart Insight Banner */}
        <SmartInsightBanner />

        {/* Active Roadmaps */}
        {activeRoadmaps.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Title style={styles.sectionTitle}>Active Roadmaps</Title>
              <Chip icon="trending-up" style={styles.sectionChip} textStyle={styles.sectionChipText}>
                {activeRoadmaps.length} active
              </Chip>
            </View>
            {activeRoadmaps.map((roadmap) => (
              <RoadmapCard
                key={roadmap.id}
                roadmap={roadmap}
                isActive={true}
                onViewDetails={() => handleViewDetails(roadmap)}
                showExpandableSteps={true}
              />
            ))}
          </View>
        )}

        {/* AI Recommended Roadmaps */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>AI Recommended for You</Title>
            <Chip icon="robot" style={styles.aiChip} textStyle={styles.aiChipText}>
              AI Powered
            </Chip>
          </View>
          <Paragraph style={styles.sectionDescription}>
            Based on your skills, interests, and career goals
          </Paragraph>
          {suggestedRoadmaps.map((roadmap) => (
            <RoadmapCard
              key={roadmap.id}
              roadmap={roadmap}
              isActive={false}
              onStartRoadmap={handleStartRoadmap}
              onViewDetails={() => handleViewDetails(roadmap)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Enhanced FAB Group */}
      <FAB.Group
        open={fabOpen}
        visible
        icon={fabOpen ? 'close' : 'plus'}
        actions={[
          {
            icon: 'lightning-bolt',
            label: 'Quick Actions',
            onPress: () => {
              setFabOpen(false);
              setQuickActionsVisible(true);
            },
          },
          {
            icon: 'brain',
            label: 'AI Career Quiz',
            onPress: () => {
              setFabOpen(false);
              // Navigate to AI quiz
            },
          },
          {
            icon: 'plus-circle',
            label: 'Create Roadmap',
            onPress: () => {
              setFabOpen(false);
              router.push('/screens/create-opportunity');
            },
          },
        ]}
        onStateChange={({ open }) => setFabOpen(open)}
        onPress={() => {
          if (fabOpen) {
            // Do nothing, let the group handle it
          }
        }}
        style={styles.fabGroup}
        fabStyle={styles.fab}
        color={theme.colors.surface}
      />

      <QuickActionsModal />
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
  header: {
    paddingHorizontal: 12,
    paddingTop: 0,
    paddingBottom: 6,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.outline,
    lineHeight: 20,
  },

  // Stats Card
  statsCard: {
    margin: 12,
    marginTop: 6,
    elevation: 4,
    borderRadius: theme.roundness,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.outline,
    marginTop: 4,
    textAlign: 'center',
  },
  weeklyGoalSection: {
    marginTop: 8,
  },
  weeklyGoalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  weeklyGoalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  weeklyGoalProgress: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.success,
  },
  weeklyProgressBar: {
    height: 8,
    borderRadius: 4,
  },

  // Smart Insight Banner
  insightBanner: {
    margin: 12,
    marginTop: 0,
    elevation: 3,
    borderRadius: theme.roundness,
  },
  insightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
    lineHeight: 20,
  },

  // Sections
  section: {
    margin: 12,
    marginTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
  },
  sectionChip: {
    backgroundColor: theme.colors.success,
    height: 28,
  },
  sectionChipText: {
    fontSize: 11,
    color: theme.colors.surface,
  },
  aiChip: {
    backgroundColor: theme.colors.tertiary,
    height: 28,
  },
  aiChipText: {
    fontSize: 11,
    color: theme.colors.surface,
  },
  sectionDescription: {
    fontSize: 14,
    color: theme.colors.outline,
    marginBottom: 16,
    lineHeight: 20,
  },

  // FAB
  fabGroup: {
    paddingBottom: 12,
  },
  fab: {
    backgroundColor: theme.colors.primary,
  },

  // Modal
  modalContainer: {
    margin: 20,
  },
  modalCard: {
    borderRadius: theme.roundness,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  quickActionsGrid: {
    gap: 12,
  },
  quickActionButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
  },
}); 