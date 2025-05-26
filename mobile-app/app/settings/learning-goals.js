import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Card, Title, Paragraph, Button, Appbar, Chip, ProgressBar, FAB, TextInput } from 'react-native-paper';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../utils/theme';
import Toast from 'react-native-toast-message';

const SKILL_CATEGORIES = [
  { id: 'technical', name: 'Technical Skills', icon: 'code-tags', color: theme.colors.primary },
  { id: 'soft', name: 'Soft Skills', icon: 'account-group', color: theme.colors.secondary },
  { id: 'leadership', name: 'Leadership', icon: 'account-tie', color: theme.colors.accent },
  { id: 'business', name: 'Business', icon: 'briefcase', color: theme.colors.tertiary },
];

const GOAL_TYPES = [
  { id: 'skill', name: 'Learn New Skill', icon: 'school' },
  { id: 'certification', name: 'Get Certification', icon: 'certificate' },
  { id: 'course', name: 'Complete Course', icon: 'book-open' },
  { id: 'project', name: 'Build Project', icon: 'hammer-wrench' },
];

const PRIORITY_LEVELS = [
  { id: 'low', name: 'Low', color: theme.colors.outline },
  { id: 'medium', name: 'Medium', color: theme.colors.secondary },
  { id: 'high', name: 'High', color: theme.colors.accent },
  { id: 'critical', name: 'Critical', color: theme.colors.error },
];

export default function LearningGoalsScreen() {
  const { tokens } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: '',
    type: '',
    priority: 'medium',
    targetDate: '',
    progress: 0,
  });

  useEffect(() => {
    fetchLearningGoals();
  }, []);

  const fetchLearningGoals = async () => {
    try {
      // Mock data for demonstration
      const mockGoals = [
        {
          id: 1,
          title: 'Master React Native',
          description: 'Build proficiency in React Native development for mobile apps',
          category: 'technical',
          type: 'skill',
          priority: 'high',
          targetDate: '2024-06-30',
          progress: 65,
          createdAt: '2024-01-15',
          skills: ['React Native', 'JavaScript', 'Mobile Development'],
        },
        {
          id: 2,
          title: 'AWS Cloud Practitioner Certification',
          description: 'Obtain AWS Cloud Practitioner certification to understand cloud fundamentals',
          category: 'technical',
          type: 'certification',
          priority: 'medium',
          targetDate: '2024-05-15',
          progress: 30,
          createdAt: '2024-02-01',
          skills: ['AWS', 'Cloud Computing', 'DevOps'],
        },
        {
          id: 3,
          title: 'Improve Public Speaking',
          description: 'Enhance presentation and communication skills for leadership roles',
          category: 'soft',
          type: 'skill',
          priority: 'medium',
          targetDate: '2024-08-30',
          progress: 20,
          createdAt: '2024-01-20',
          skills: ['Communication', 'Leadership', 'Presentation'],
        },
        {
          id: 4,
          title: 'Complete Machine Learning Course',
          description: 'Finish Stanford\'s Machine Learning course on Coursera',
          category: 'technical',
          type: 'course',
          priority: 'high',
          targetDate: '2024-07-15',
          progress: 45,
          createdAt: '2024-01-10',
          skills: ['Machine Learning', 'Python', 'Data Science'],
        },
      ];
      
      setGoals(mockGoals);
    } catch (error) {
      console.error('Error fetching learning goals:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleAddGoal = async () => {
    if (!newGoal.title.trim() || !newGoal.category || !newGoal.type) {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Please fill in all required fields.',
      });
      return;
    }

    setLoading(true);
    try {
      // Mock API call
      const goalToAdd = {
        id: Date.now(),
        ...newGoal,
        progress: 0,
        createdAt: new Date().toISOString().split('T')[0],
        skills: [],
      };
      
      setGoals(prev => [goalToAdd, ...prev]);
      setNewGoal({
        title: '',
        description: '',
        category: '',
        type: '',
        priority: 'medium',
        targetDate: '',
        progress: 0,
      });
      setShowAddForm(false);
      
      Toast.show({
        type: 'success',
        text1: 'Goal Added',
        text2: 'Your learning goal has been created successfully.',
      });
    } catch (error) {
      console.error('Add goal error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to add goal. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProgress = async (goalId, newProgress) => {
    try {
      setGoals(prev => prev.map(goal => 
        goal.id === goalId ? { ...goal, progress: newProgress } : goal
      ));
      
      Toast.show({
        type: 'success',
        text1: 'Progress Updated',
        text2: `Goal progress updated to ${newProgress}%`,
      });
    } catch (error) {
      console.error('Update progress error:', error);
    }
  };

  const getCategoryInfo = (categoryId) => {
    return SKILL_CATEGORIES.find(cat => cat.id === categoryId) || SKILL_CATEGORIES[0];
  };

  const getTypeInfo = (typeId) => {
    return GOAL_TYPES.find(type => type.id === typeId) || GOAL_TYPES[0];
  };

  const getPriorityInfo = (priorityId) => {
    return PRIORITY_LEVELS.find(priority => priority.id === priorityId) || PRIORITY_LEVELS[1];
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return theme.colors.success;
    if (progress >= 50) return theme.colors.primary;
    if (progress >= 25) return theme.colors.secondary;
    return theme.colors.outline;
  };

  if (initialLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Paragraph>Loading goals...</Paragraph>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Card style={styles.headerCard}>
          <Card.Content style={styles.headerContent}>
            <MaterialCommunityIcons 
              name="target" 
              size={48} 
              color={theme.colors.primary} 
            />
            <Title style={styles.headerTitle}>Learning Goals</Title>
            <Paragraph style={styles.headerDescription}>
              Set and track your learning objectives to advance your career
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Stats Overview */}
        <Card style={styles.statsCard}>
          <Card.Content>
            <Title style={styles.statsTitle}>Your Progress</Title>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Title style={styles.statNumber}>{goals.length}</Title>
                <Paragraph style={styles.statLabel}>Total Goals</Paragraph>
              </View>
              <View style={styles.statItem}>
                <Title style={styles.statNumber}>
                  {goals.filter(g => g.progress >= 100).length}
                </Title>
                <Paragraph style={styles.statLabel}>Completed</Paragraph>
              </View>
              <View style={styles.statItem}>
                <Title style={styles.statNumber}>
                  {goals.filter(g => g.progress > 0 && g.progress < 100).length}
                </Title>
                <Paragraph style={styles.statLabel}>In Progress</Paragraph>
              </View>
              <View style={styles.statItem}>
                <Title style={styles.statNumber}>
                  {Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length) || 0}%
                </Title>
                <Paragraph style={styles.statLabel}>Avg Progress</Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Add Goal Form */}
        {showAddForm && (
          <Card style={styles.addFormCard}>
            <Card.Content>
              <Title style={styles.addFormTitle}>Add New Learning Goal</Title>
              
              <TextInput
                label="Goal Title *"
                value={newGoal.title}
                onChangeText={(value) => setNewGoal(prev => ({ ...prev, title: value }))}
                mode="outlined"
                style={styles.input}
                placeholder="e.g., Learn Python Programming"
              />

              <TextInput
                label="Description"
                value={newGoal.description}
                onChangeText={(value) => setNewGoal(prev => ({ ...prev, description: value }))}
                mode="outlined"
                style={styles.input}
                multiline
                numberOfLines={3}
                placeholder="Describe your learning objective..."
              />

              <View style={styles.selectionSection}>
                <Paragraph style={styles.selectionLabel}>Category *</Paragraph>
                <View style={styles.chipContainer}>
                  {SKILL_CATEGORIES.map((category) => (
                    <Chip
                      key={category.id}
                      selected={newGoal.category === category.id}
                      onPress={() => setNewGoal(prev => ({ ...prev, category: category.id }))}
                      style={[
                        styles.chip,
                        newGoal.category === category.id && { backgroundColor: category.color + '30' }
                      ]}
                      icon={category.icon}
                    >
                      {category.name}
                    </Chip>
                  ))}
                </View>
              </View>

              <View style={styles.selectionSection}>
                <Paragraph style={styles.selectionLabel}>Type *</Paragraph>
                <View style={styles.chipContainer}>
                  {GOAL_TYPES.map((type) => (
                    <Chip
                      key={type.id}
                      selected={newGoal.type === type.id}
                      onPress={() => setNewGoal(prev => ({ ...prev, type: type.id }))}
                      style={[
                        styles.chip,
                        newGoal.type === type.id && styles.selectedChip
                      ]}
                      icon={type.icon}
                    >
                      {type.name}
                    </Chip>
                  ))}
                </View>
              </View>

              <View style={styles.selectionSection}>
                <Paragraph style={styles.selectionLabel}>Priority</Paragraph>
                <View style={styles.chipContainer}>
                  {PRIORITY_LEVELS.map((priority) => (
                    <Chip
                      key={priority.id}
                      selected={newGoal.priority === priority.id}
                      onPress={() => setNewGoal(prev => ({ ...prev, priority: priority.id }))}
                      style={[
                        styles.chip,
                        newGoal.priority === priority.id && { backgroundColor: priority.color + '30' }
                      ]}
                    >
                      {priority.name}
                    </Chip>
                  ))}
                </View>
              </View>

              <TextInput
                label="Target Date (Optional)"
                value={newGoal.targetDate}
                onChangeText={(value) => setNewGoal(prev => ({ ...prev, targetDate: value }))}
                mode="outlined"
                style={styles.input}
                placeholder="YYYY-MM-DD"
              />

              <View style={styles.formActions}>
                <Button
                  mode="outlined"
                  onPress={() => setShowAddForm(false)}
                  style={styles.cancelButton}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleAddGoal}
                  loading={loading}
                  disabled={loading}
                  style={styles.addButton}
                >
                  Add Goal
                </Button>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Goals List */}
        {goals.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <MaterialCommunityIcons 
                name="target" 
                size={64} 
                color={theme.colors.outline} 
              />
              <Title style={styles.emptyTitle}>No Learning Goals Yet</Title>
              <Paragraph style={styles.emptyDescription}>
                Start your learning journey by setting your first goal
              </Paragraph>
              <Button
                mode="contained"
                onPress={() => setShowAddForm(true)}
                style={styles.emptyButton}
                icon="plus"
              >
                Add Your First Goal
              </Button>
            </Card.Content>
          </Card>
        ) : (
          goals.map((goal) => {
            const category = getCategoryInfo(goal.category);
            const type = getTypeInfo(goal.type);
            const priority = getPriorityInfo(goal.priority);
            
            return (
              <Card key={goal.id} style={styles.goalCard}>
                <Card.Content>
                  <View style={styles.goalHeader}>
                    <View style={styles.goalTitleSection}>
                      <Title style={styles.goalTitle}>{goal.title}</Title>
                      <View style={styles.goalMeta}>
                        <Chip 
                          style={[styles.metaChip, { backgroundColor: category.color + '20' }]}
                          textStyle={[styles.metaChipText, { color: category.color }]}
                          icon={category.icon}
                        >
                          {category.name}
                        </Chip>
                        <Chip 
                          style={styles.metaChip}
                          textStyle={styles.metaChipText}
                          icon={type.icon}
                        >
                          {type.name}
                        </Chip>
                        <Chip 
                          style={[styles.metaChip, { backgroundColor: priority.color + '20' }]}
                          textStyle={[styles.metaChipText, { color: priority.color }]}
                        >
                          {priority.name}
                        </Chip>
                      </View>
                    </View>
                  </View>

                  {goal.description && (
                    <Paragraph style={styles.goalDescription}>
                      {goal.description}
                    </Paragraph>
                  )}

                  <View style={styles.progressSection}>
                    <View style={styles.progressHeader}>
                      <Paragraph style={styles.progressLabel}>Progress</Paragraph>
                      <Title style={[styles.progressValue, { color: getProgressColor(goal.progress) }]}>
                        {goal.progress}%
                      </Title>
                    </View>
                    <ProgressBar 
                      progress={goal.progress / 100} 
                      color={getProgressColor(goal.progress)}
                      style={styles.progressBar}
                    />
                  </View>

                  {goal.skills && goal.skills.length > 0 && (
                    <View style={styles.skillsSection}>
                      <Paragraph style={styles.skillsLabel}>Skills:</Paragraph>
                      <View style={styles.skillsContainer}>
                        {goal.skills.map((skill, index) => (
                          <Chip key={index} style={styles.skillChip} textStyle={styles.skillChipText}>
                            {skill}
                          </Chip>
                        ))}
                      </View>
                    </View>
                  )}

                  <View style={styles.goalActions}>
                    {goal.targetDate && (
                      <Paragraph style={styles.targetDate}>
                        Target: {new Date(goal.targetDate).toLocaleDateString()}
                      </Paragraph>
                    )}
                    <View style={styles.actionButtons}>
                      <Button
                        mode="outlined"
                        onPress={() => handleUpdateProgress(goal.id, Math.min(100, goal.progress + 10))}
                        style={styles.actionButton}
                        icon="plus"
                      >
                        +10%
                      </Button>
                      <Button
                        mode="contained"
                        onPress={() => {/* Navigate to goal details */}}
                        style={styles.actionButton}
                        icon="eye"
                      >
                        View
                      </Button>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            );
          })
        )}
      </ScrollView>

      {/* FAB */}
      {!showAddForm && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => setShowAddForm(true)}
        />
      )}
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
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Header
  headerCard: {
    elevation: 4,
    borderRadius: theme.roundness,
    marginBottom: 16,
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
  
  // Stats
  statsCard: {
    elevation: 2,
    borderRadius: theme.roundness,
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: theme.colors.onSurface,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.outline,
    textAlign: 'center',
  },
  
  // Add Form
  addFormCard: {
    elevation: 4,
    borderRadius: theme.roundness,
    marginBottom: 16,
    borderColor: theme.colors.primary,
    borderWidth: 1,
  },
  addFormTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: theme.colors.primary,
  },
  input: {
    marginBottom: 12,
  },
  selectionSection: {
    marginBottom: 16,
  },
  selectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: theme.colors.onSurface,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  selectedChip: {
    backgroundColor: theme.colors.primary,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  addButton: {
    flex: 1,
  },
  
  // Empty State
  emptyCard: {
    elevation: 2,
    borderRadius: theme.roundness,
  },
  emptyContent: {
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    textAlign: 'center',
    color: theme.colors.outline,
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 24,
  },
  
  // Goal Cards
  goalCard: {
    elevation: 2,
    borderRadius: theme.roundness,
    marginBottom: 16,
  },
  goalHeader: {
    marginBottom: 12,
  },
  goalTitleSection: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme.colors.onSurface,
  },
  goalMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  metaChip: {
    backgroundColor: theme.colors.surfaceVariant,
    height: 28,
  },
  metaChipText: {
    fontSize: 11,
    color: theme.colors.onSurface,
  },
  goalDescription: {
    fontSize: 14,
    color: theme.colors.outline,
    marginBottom: 16,
    lineHeight: 20,
  },
  
  // Progress
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: theme.colors.onSurface,
  },
  progressValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  
  // Skills
  skillsSection: {
    marginBottom: 16,
  },
  skillsLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: theme.colors.onSurface,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillChip: {
    backgroundColor: theme.colors.primaryContainer,
    height: 24,
  },
  skillChipText: {
    fontSize: 10,
    color: theme.colors.primary,
  },
  
  // Actions
  goalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  targetDate: {
    fontSize: 12,
    color: theme.colors.outline,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    minWidth: 80,
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