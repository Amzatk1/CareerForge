import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  TextInput,
  Chip,
  ActivityIndicator,
  Appbar,
  Text,
  ProgressBar,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../utils/api';
import { theme } from '../../utils/theme';

export default function AIRoadmapGeneratorScreen() {
  const { user } = useAuth();
  const [goal, setGoal] = useState('');
  const [timeframe, setTimeframe] = useState('6 months');
  const [loading, setLoading] = useState(false);
  const [generatedRoadmap, setGeneratedRoadmap] = useState(null);
  const [step, setStep] = useState(1); // 1: Input, 2: Generating, 3: Results

  const timeframeOptions = ['3 months', '6 months', '12 months', '18 months'];
  const popularGoals = [
    'Full-Stack Developer',
    'Data Scientist',
    'Mobile App Developer',
    'DevOps Engineer',
    'UI/UX Designer',
    'Cloud Architect',
    'Machine Learning Engineer',
    'Cybersecurity Specialist'
  ];

  const generateRoadmap = async () => {
    if (!goal.trim()) {
      Alert.alert('Error', 'Please enter your career goal');
      return;
    }

    setLoading(true);
    setStep(2);

    try {
      const response = await apiClient.post('/ai/generate-roadmap/', {
        goal: goal.trim(),
        timeframe: timeframe
      });

      setGeneratedRoadmap(response.roadmap);
      setStep(3);
    } catch (error) {
      console.error('Error generating roadmap:', error);
      Alert.alert('Error', 'Failed to generate roadmap. Please try again.');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const InputStep = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.headerContent}>
            <MaterialCommunityIcons name="robot" size={48} color={theme.colors.primary} />
            <Title style={styles.headerTitle}>AI Roadmap Generator</Title>
            <Paragraph style={styles.headerSubtitle}>
              Let our AI create a personalized learning path tailored to your career goals and background.
            </Paragraph>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.inputCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>What's your career goal?</Title>
          <TextInput
            label="Enter your target role or career goal"
            value={goal}
            onChangeText={setGoal}
            mode="outlined"
            style={styles.goalInput}
            placeholder="e.g., Full-Stack Developer, Data Scientist, Product Manager"
            multiline
            numberOfLines={2}
          />

          <Text style={styles.popularGoalsTitle}>Popular Goals:</Text>
          <View style={styles.chipsContainer}>
            {popularGoals.map((popularGoal) => (
              <Chip
                key={popularGoal}
                mode={goal === popularGoal ? 'flat' : 'outlined'}
                selected={goal === popularGoal}
                onPress={() => setGoal(popularGoal)}
                style={styles.goalChip}
                textStyle={styles.chipText}
              >
                {popularGoal}
              </Chip>
            ))}
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.inputCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Timeframe</Title>
          <Paragraph style={styles.sectionSubtitle}>
            How long do you want to dedicate to achieving this goal?
          </Paragraph>
          
          <View style={styles.timeframeContainer}>
            {timeframeOptions.map((option) => (
              <Chip
                key={option}
                mode={timeframe === option ? 'flat' : 'outlined'}
                selected={timeframe === option}
                onPress={() => setTimeframe(option)}
                style={styles.timeframeChip}
                textStyle={styles.chipText}
              >
                {option}
              </Chip>
            ))}
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.profileCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Your Profile</Title>
          <Paragraph style={styles.sectionSubtitle}>
            We'll use your profile information to personalize the roadmap.
          </Paragraph>
          
          <View style={styles.profileInfo}>
            <View style={styles.profileItem}>
              <MaterialCommunityIcons name="school" size={20} color={theme.colors.outline} />
              <Text style={styles.profileText}>
                Experience: {user?.profile?.experience_level || 'Not specified'}
              </Text>
            </View>
            
            <View style={styles.profileItem}>
              <MaterialCommunityIcons name="lightbulb" size={20} color={theme.colors.outline} />
              <Text style={styles.profileText}>
                Skills: {user?.profile?.skills?.length || 0} skills
              </Text>
            </View>
            
            <View style={styles.profileItem}>
              <MaterialCommunityIcons name="target" size={20} color={theme.colors.outline} />
              <Text style={styles.profileText}>
                Interests: {user?.profile?.career_interests?.length || 0} areas
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={generateRoadmap}
        style={styles.generateButton}
        icon="robot"
        loading={loading}
        disabled={loading || !goal.trim()}
      >
        Generate My Roadmap
      </Button>
    </ScrollView>
  );

  const GeneratingStep = () => (
    <View style={styles.generatingContainer}>
      <Card style={styles.generatingCard}>
        <Card.Content style={styles.generatingContent}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Title style={styles.generatingTitle}>Creating Your Roadmap</Title>
          <Paragraph style={styles.generatingText}>
            Our AI is analyzing your profile and creating a personalized learning path for "{goal}".
          </Paragraph>
          <Paragraph style={styles.generatingSubtext}>
            This may take a few moments...
          </Paragraph>
        </Card.Content>
      </Card>
    </View>
  );

  const ResultsStep = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {generatedRoadmap && (
        <>
          <Card style={styles.roadmapHeader}>
            <Card.Content>
              <View style={styles.roadmapHeaderContent}>
                <MaterialCommunityIcons name="check-circle" size={32} color={theme.colors.success} />
                <Title style={styles.roadmapTitle}>{generatedRoadmap.title}</Title>
                <Paragraph style={styles.roadmapSubtitle}>
                  {generatedRoadmap.timeframe} • {generatedRoadmap.difficulty} level
                </Paragraph>
              </View>
              
              <View style={styles.roadmapStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{generatedRoadmap.phases?.length || 0}</Text>
                  <Text style={styles.statLabel}>Phases</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{generatedRoadmap.estimated_total_hours || 0}h</Text>
                  <Text style={styles.statLabel}>Est. Hours</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{generatedRoadmap.milestones?.length || 0}</Text>
                  <Text style={styles.statLabel}>Milestones</Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          {generatedRoadmap.phases?.map((phase, index) => (
            <Card key={index} style={styles.phaseCard}>
              <Card.Content>
                <View style={styles.phaseHeader}>
                  <View style={styles.phaseNumber}>
                    <Text style={styles.phaseNumberText}>{phase.phase_number}</Text>
                  </View>
                  <View style={styles.phaseInfo}>
                    <Title style={styles.phaseTitle}>{phase.title}</Title>
                    <Paragraph style={styles.phaseDuration}>{phase.duration}</Paragraph>
                  </View>
                </View>
                
                <Paragraph style={styles.phaseDescription}>{phase.description}</Paragraph>
                
                {phase.skills && (
                  <View style={styles.skillsSection}>
                    <Text style={styles.skillsTitle}>Skills to Learn:</Text>
                    <View style={styles.skillsContainer}>
                      {phase.skills.map((skill, skillIndex) => (
                        <Chip key={skillIndex} style={styles.skillChip} textStyle={styles.skillChipText}>
                          {skill}
                        </Chip>
                      ))}
                    </View>
                  </View>
                )}
                
                {phase.projects && phase.projects.length > 0 && (
                  <View style={styles.projectsSection}>
                    <Text style={styles.projectsTitle}>Key Projects:</Text>
                    {phase.projects.map((project, projectIndex) => (
                      <View key={projectIndex} style={styles.projectItem}>
                        <MaterialCommunityIcons name="folder" size={16} color={theme.colors.primary} />
                        <View style={styles.projectInfo}>
                          <Text style={styles.projectName}>{project.name}</Text>
                          <Text style={styles.projectDescription}>{project.description}</Text>
                          <Text style={styles.projectHours}>{project.estimated_hours}h estimated</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </Card.Content>
            </Card>
          ))}

          <View style={styles.actionButtons}>
            <Button
              mode="contained"
              onPress={() => {
                // TODO: Save roadmap to user's active roadmaps
                Alert.alert('Success', 'Roadmap saved to your active roadmaps!');
                router.back();
              }}
              style={styles.saveButton}
              icon="content-save"
            >
              Save Roadmap
            </Button>
            
            <Button
              mode="outlined"
              onPress={() => {
                setStep(1);
                setGeneratedRoadmap(null);
                setGoal('');
              }}
              style={styles.regenerateButton}
              icon="refresh"
            >
              Generate Another
            </Button>
          </View>
        </>
      )}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="AI Roadmap Generator" />
      </Appbar.Header>

      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {step === 1 && <InputStep />}
        {step === 2 && <GeneratingStep />}
        {step === 3 && <ResultsStep />}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  
  // Header Card
  headerCard: {
    marginBottom: 16,
    elevation: 4,
  },
  headerContent: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  headerTitle: {
    marginTop: 8,
    textAlign: 'center',
    color: theme.colors.onSurface,
  },
  headerSubtitle: {
    textAlign: 'center',
    color: theme.colors.outline,
    marginTop: 4,
  },

  // Input Cards
  inputCard: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 8,
    color: theme.colors.onSurface,
  },
  sectionSubtitle: {
    color: theme.colors.outline,
    marginBottom: 16,
  },
  goalInput: {
    marginBottom: 16,
  },
  popularGoalsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: theme.colors.onSurface,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  goalChip: {
    marginBottom: 8,
  },
  chipText: {
    fontSize: 12,
  },

  // Timeframe
  timeframeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeframeChip: {
    marginBottom: 8,
  },

  // Profile Card
  profileCard: {
    marginBottom: 24,
    elevation: 2,
  },
  profileInfo: {
    marginTop: 8,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileText: {
    marginLeft: 8,
    color: theme.colors.onSurface,
  },

  // Generate Button
  generateButton: {
    marginBottom: 32,
    paddingVertical: 8,
  },

  // Generating Step
  generatingContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  generatingCard: {
    elevation: 4,
  },
  generatingContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  generatingTitle: {
    marginTop: 16,
    textAlign: 'center',
  },
  generatingText: {
    textAlign: 'center',
    marginTop: 8,
    color: theme.colors.outline,
  },
  generatingSubtext: {
    textAlign: 'center',
    marginTop: 4,
    fontSize: 12,
    color: theme.colors.outline,
  },

  // Results Step
  roadmapHeader: {
    marginBottom: 16,
    elevation: 4,
  },
  roadmapHeaderContent: {
    alignItems: 'center',
    marginBottom: 16,
  },
  roadmapTitle: {
    textAlign: 'center',
    marginTop: 8,
  },
  roadmapSubtitle: {
    textAlign: 'center',
    color: theme.colors.outline,
  },
  roadmapStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline + '20',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.outline,
    marginTop: 4,
  },

  // Phase Cards
  phaseCard: {
    marginBottom: 16,
    elevation: 2,
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  phaseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  phaseNumberText: {
    color: 'white',
    fontWeight: 'bold',
  },
  phaseInfo: {
    flex: 1,
  },
  phaseTitle: {
    fontSize: 16,
    marginBottom: 2,
  },
  phaseDuration: {
    fontSize: 12,
    color: theme.colors.outline,
  },
  phaseDescription: {
    marginBottom: 16,
    color: theme.colors.outline,
  },

  // Skills Section
  skillsSection: {
    marginBottom: 16,
  },
  skillsTitle: {
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
    height: 28,
  },
  skillChipText: {
    fontSize: 11,
    color: theme.colors.primary,
  },

  // Projects Section
  projectsSection: {
    marginTop: 8,
  },
  projectsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: theme.colors.onSurface,
  },
  projectItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    padding: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
  },
  projectInfo: {
    flex: 1,
    marginLeft: 8,
  },
  projectName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  projectDescription: {
    fontSize: 12,
    color: theme.colors.outline,
    marginTop: 2,
  },
  projectHours: {
    fontSize: 11,
    color: theme.colors.primary,
    marginTop: 4,
  },

  // Action Buttons
  actionButtons: {
    marginTop: 16,
    marginBottom: 32,
    gap: 12,
  },
  saveButton: {
    paddingVertical: 8,
  },
  regenerateButton: {
    paddingVertical: 8,
  },
}); 