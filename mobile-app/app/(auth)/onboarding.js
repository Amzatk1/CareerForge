import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Button, Card, Title, Paragraph, Chip, Searchbar, ProgressBar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../utils/theme';
import { CAREER_CATEGORIES, EXPERIENCE_LEVELS, ADDITIONAL_SKILLS } from '../../data/careerData';

// Use shared career data to maintain consistency across the app

export default function OnboardingScreen() {
  const { tokens } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCareers, setSelectedCareers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [experienceLevel, setExperienceLevel] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const totalSteps = 4;
  const progress = currentStep / totalSteps;

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleCareerSelect = (job) => {
    const careerWithCategory = {
      ...job,
      categoryId: selectedCategory.id,
      categoryName: selectedCategory.name
    };
    
    if (selectedCareers.find(c => c.id === job.id)) {
      setSelectedCareers(selectedCareers.filter(c => c.id !== job.id));
    } else {
      setSelectedCareers([...selectedCareers, careerWithCategory]);
    }
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  const handleSkillSelect = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const getRecommendedSkills = () => {
    const careerSkills = selectedCareers.flatMap(career => career.skills || []);
    return [...new Set(careerSkills)];
  };

  const getFilteredSkills = () => {
    const recommended = getRecommendedSkills();
    const filtered = ADDITIONAL_SKILLS.filter(skill => 
      skill.toLowerCase().includes(skillSearch.toLowerCase()) &&
      !selectedSkills.includes(skill)
    );
    
    // Prioritize recommended skills
    const recommendedFiltered = filtered.filter(skill => recommended.includes(skill));
    const otherFiltered = filtered.filter(skill => !recommended.includes(skill));
    
    return [...recommendedFiltered, ...otherFiltered].slice(0, 20);
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    
    try {
      const onboardingData = {
        careers: selectedCareers,
        experienceLevel,
        skills: selectedSkills,
      };
      
      const response = await fetch('http://10.77.108.42:8000/api/auth/onboarding/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens?.access}`,
        },
        body: JSON.stringify(onboardingData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('Onboarding completed:', data);
        router.replace('/(main)/dashboard');
      } else {
        console.error('Onboarding failed:', data);
        // Still redirect to dashboard even if onboarding fails
        router.replace('/(main)/dashboard');
      }
    } catch (error) {
      console.error('Onboarding error:', error);
      // Still redirect to dashboard even if there's an error
      router.replace('/(main)/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return true; // Welcome step
      case 2: return selectedCareers.length > 0;
      case 3: return experienceLevel !== '';
      case 4: return selectedSkills.length >= 3;
      default: return false;
    }
  };

  const renderWelcomeStep = () => (
    <Card style={styles.stepCard}>
      <Card.Content style={styles.welcomeContent}>
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons 
            name="trending-up" 
            size={64} 
            color={theme.colors.primary} 
          />
          <Title style={styles.welcomeTitle}>Welcome to CareerForge AI!</Title>
        </View>
        <Paragraph style={styles.welcomeDescription}>
          Let's personalize your career journey with AI-powered insights. We'll ask you a few questions to create the perfect roadmap for your professional growth.
        </Paragraph>
        <View style={styles.benefitsList}>
          <View style={styles.benefitItem}>
            <MaterialCommunityIcons name="robot" size={20} color={theme.colors.accent} />
            <Text style={styles.benefitText}>AI-powered career recommendations</Text>
          </View>
          <View style={styles.benefitItem}>
            <MaterialCommunityIcons name="map-marker-path" size={20} color={theme.colors.accent} />
            <Text style={styles.benefitText}>Personalized learning roadmaps</Text>
          </View>
          <View style={styles.benefitItem}>
            <MaterialCommunityIcons name="briefcase-search" size={20} color={theme.colors.accent} />
            <Text style={styles.benefitText}>Smart job matching</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderCareerStep = () => {
    if (!selectedCategory) {
      // Show categories first
      return (
        <Card style={styles.stepCard}>
          <Card.Content>
            <Title style={styles.stepTitle}>Choose your career field</Title>
            <Paragraph style={styles.stepDescription}>
              Select an industry or field that interests you:
            </Paragraph>
            
            <View style={styles.categoryGrid}>
              {CAREER_CATEGORIES.map((category) => (
                <Card 
                  key={category.id} 
                  style={[styles.categoryCard, { borderColor: category.color }]}
                  onPress={() => handleCategorySelect(category)}
                >
                  <Card.Content style={styles.categoryCardContent}>
                    <MaterialCommunityIcons 
                      name={category.icon} 
                      size={40} 
                      color={category.color} 
                    />
                    <Text style={styles.categoryCardTitle}>
                      {category.name}
                    </Text>
                    <Text style={styles.categoryJobCount}>
                      {category.jobs.length} jobs
                    </Text>
                  </Card.Content>
                </Card>
              ))}
            </View>
          </Card.Content>
        </Card>
      );
    } else {
      // Show jobs within selected category
      return (
        <Card style={styles.stepCard}>
          <Card.Content>
            <View style={styles.categoryHeader}>
              <Button 
                mode="text" 
                onPress={handleBackToCategories}
                icon="arrow-left"
                style={styles.backButton}
              >
                Back to Categories
              </Button>
              <View style={styles.categoryInfo}>
                <MaterialCommunityIcons 
                  name={selectedCategory.icon} 
                  size={24} 
                  color={selectedCategory.color} 
                />
                <Text style={styles.categoryTitle}>{selectedCategory.name}</Text>
              </View>
            </View>
            
            <Title style={styles.stepTitle}>Select specific roles</Title>
            <Paragraph style={styles.stepDescription}>
              Choose the jobs that interest you in {selectedCategory.name}:
            </Paragraph>
            
            <View style={styles.jobGrid}>
              {selectedCategory.jobs.map((job) => {
                const isSelected = selectedCareers.find(c => c.id === job.id);
                return (
                  <Card 
                    key={job.id} 
                    style={[
                      styles.jobCard, 
                      isSelected && styles.selectedJobCard
                    ]}
                    onPress={() => handleCareerSelect(job)}
                  >
                    <Card.Content style={styles.jobCardContent}>
                      <Text style={[
                        styles.jobCardTitle,
                        { color: isSelected ? theme.colors.surface : theme.colors.onSurface }
                      ]}>
                        {job.name}
                      </Text>
                      <View style={styles.skillsPreview}>
                        {job.skills.slice(0, 3).map((skill, index) => (
                          <Chip 
                            key={index}
                            style={[
                              styles.skillPreviewChip,
                              { backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : theme.colors.surfaceVariant }
                            ]}
                            textStyle={{ 
                              fontSize: 10, 
                              color: isSelected ? theme.colors.surface : theme.colors.onSurface 
                            }}
                          >
                            {skill}
                          </Chip>
                        ))}
                        {job.skills.length > 3 && (
                          <Text style={[
                            styles.moreSkills,
                            { color: isSelected ? theme.colors.surface : theme.colors.outline }
                          ]}>
                            +{job.skills.length - 3} more
                          </Text>
                        )}
                      </View>
                    </Card.Content>
                  </Card>
                );
              })}
            </View>
            
            {selectedCareers.length > 0 && (
              <View style={styles.selectedCareersContainer}>
                <Text style={styles.selectedCareersTitle}>Selected ({selectedCareers.length}):</Text>
                <View style={styles.selectedCareersChips}>
                  {selectedCareers.map((career) => (
                    <Chip 
                      key={career.id}
                      onClose={() => handleCareerSelect(career)}
                      style={styles.selectedCareerChip}
                    >
                      {career.name}
                    </Chip>
                  ))}
                </View>
              </View>
            )}
          </Card.Content>
        </Card>
      );
    }
  };

  const renderExperienceStep = () => (
    <Card style={styles.stepCard}>
      <Card.Content>
        <Title style={styles.stepTitle}>What's your experience level?</Title>
        <Paragraph style={styles.stepDescription}>
          This helps us recommend the right learning path and opportunities:
        </Paragraph>
        
        <View style={styles.experienceList}>
          {EXPERIENCE_LEVELS.map((level) => {
            const isSelected = experienceLevel === level.id;
            return (
              <Card 
                key={level.id}
                style={[
                  styles.experienceCard,
                  isSelected && styles.selectedExperienceCard
                ]}
                onPress={() => setExperienceLevel(level.id)}
              >
                <Card.Content style={styles.experienceCardContent}>
                  <View style={styles.experienceHeader}>
                    <MaterialCommunityIcons 
                      name={level.icon} 
                      size={24} 
                      color={isSelected ? theme.colors.primary : theme.colors.outline} 
                    />
                    <View style={styles.experienceInfo}>
                      <Text style={[
                        styles.experienceName,
                        isSelected && styles.selectedExperienceName
                      ]}>
                        {level.name}
                      </Text>
                      <Text style={styles.experienceDescription}>
                        {level.description}
                      </Text>
                    </View>
                    {isSelected && (
                      <MaterialCommunityIcons 
                        name="check-circle" 
                        size={20} 
                        color={theme.colors.primary} 
                      />
                    )}
                  </View>
                </Card.Content>
              </Card>
            );
          })}
        </View>
      </Card.Content>
    </Card>
  );

  const renderSkillsStep = () => (
    <Card style={styles.stepCard}>
      <Card.Content>
        <Title style={styles.stepTitle}>What skills do you have?</Title>
        <Paragraph style={styles.stepDescription}>
          Select at least 3 skills you currently possess. We'll recommend more based on your career interests:
        </Paragraph>
        
        <Searchbar
          placeholder="Search for skills..."
          onChangeText={setSkillSearch}
          value={skillSearch}
          style={styles.searchBar}
        />
        
        {selectedSkills.length > 0 && (
          <View style={styles.selectedSkillsContainer}>
            <Text style={styles.selectedSkillsTitle}>Selected Skills ({selectedSkills.length}):</Text>
            <View style={styles.skillsRow}>
              {selectedSkills.map((skill, index) => (
                <Chip 
                  key={index}
                  style={styles.selectedSkillChip}
                  textStyle={styles.selectedSkillChipText}
                  onClose={() => handleSkillSelect(skill)}
                >
                  {skill}
                </Chip>
              ))}
            </View>
          </View>
        )}
        
        <View style={styles.skillsContainer}>
          <Text style={styles.skillsTitle}>
            {skillSearch ? 'Search Results:' : 'Recommended for your career interests:'}
          </Text>
          <View style={styles.skillsRow}>
            {getFilteredSkills().map((skill, index) => {
              const isRecommended = getRecommendedSkills().includes(skill);
              return (
                <Chip 
                  key={index}
                  style={[
                    styles.skillChip,
                    isRecommended && styles.recommendedSkillChip
                  ]}
                  textStyle={[
                    styles.skillChipText,
                    isRecommended && styles.recommendedSkillChipText
                  ]}
                  onPress={() => handleSkillSelect(skill)}
                  icon={isRecommended ? "star" : undefined}
                >
                  {skill}
                </Chip>
              );
            })}
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderWelcomeStep();
      case 2: return renderCareerStep();
      case 3: return renderExperienceStep();
      case 4: return renderSkillsStep();
      default: return renderWelcomeStep();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Progress Header */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>Step {currentStep} of {totalSteps}</Text>
            <Text style={styles.progressPercentage}>{Math.round(progress * 100)}%</Text>
          </View>
          <ProgressBar progress={progress} color={theme.colors.primary} style={styles.progressBar} />
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {renderCurrentStep()}
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          {currentStep > 1 && (
            <Button 
              mode="outlined" 
              onPress={handleBack}
              style={styles.backButton}
            >
              Back
            </Button>
          )}
          
          {currentStep < totalSteps ? (
            <Button 
              mode="contained" 
              onPress={handleNext}
              disabled={!canProceed()}
              style={styles.nextButton}
            >
              Next
            </Button>
          ) : (
            <Button 
              mode="contained" 
              onPress={handleComplete}
              disabled={!canProceed()}
              loading={loading}
              style={styles.nextButton}
            >
              Complete Setup
            </Button>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  progressContainer: {
    padding: 16,
    backgroundColor: theme.colors.surface,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: theme.colors.onSurface,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  stepCard: {
    elevation: 4,
    borderRadius: theme.roundness,
  },
  
  // Welcome Step
  welcomeContent: {
    alignItems: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginTop: 16,
    textAlign: 'center',
  },
  welcomeDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    color: theme.colors.onSurface,
  },
  benefitsList: {
    width: '100%',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  benefitText: {
    fontSize: 16,
    marginLeft: 12,
    color: theme.colors.onSurface,
  },
  
  // Step Content
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: theme.colors.onSurface,
    marginBottom: 24,
    lineHeight: 22,
  },
  
  // Career Step - Categories
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  categoryCard: {
    width: '47%',
    elevation: 2,
    borderRadius: 12,
    borderWidth: 2,
  },
  categoryCardContent: {
    alignItems: 'center',
    padding: 16,
  },
  categoryCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
    color: theme.colors.onSurface,
  },
  categoryJobCount: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    color: theme.colors.outline,
  },
  
  // Career Step - Jobs
  categoryHeader: {
    marginBottom: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  jobGrid: {
    gap: 12,
    marginBottom: 16,
  },
  jobCard: {
    elevation: 2,
    borderRadius: 12,
  },
  selectedJobCard: {
    backgroundColor: theme.colors.primary,
  },
  jobCardContent: {
    padding: 16,
  },
  jobCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  skillsPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    alignItems: 'center',
  },
  skillPreviewChip: {
    height: 24,
  },
  moreSkills: {
    fontSize: 10,
    fontStyle: 'italic',
  },
  selectedCareersContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 8,
  },
  selectedCareersTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: theme.colors.onSurface,
  },
  selectedCareersChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedCareerChip: {
    backgroundColor: theme.colors.primary,
  },
  
  // Experience Step
  experienceList: {
    gap: 12,
  },
  experienceCard: {
    elevation: 2,
    borderRadius: 12,
  },
  selectedExperienceCard: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
    elevation: 4,
  },
  experienceCardContent: {
    padding: 16,
  },
  experienceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  experienceInfo: {
    flex: 1,
    marginLeft: 12,
  },
  experienceName: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.onSurface,
  },
  selectedExperienceName: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  experienceDescription: {
    fontSize: 14,
    color: theme.colors.outline,
    marginTop: 2,
  },
  
  // Skills Step
  searchBar: {
    marginBottom: 16,
    elevation: 2,
  },
  selectedSkillsContainer: {
    marginBottom: 20,
  },
  selectedSkillsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.onSurface,
    marginBottom: 8,
  },
  skillsContainer: {
    marginTop: 8,
  },
  skillsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.onSurface,
    marginBottom: 12,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    backgroundColor: theme.colors.surfaceVariant,
    marginBottom: 4,
  },
  skillChipText: {
    fontSize: 12,
    color: theme.colors.onSurface,
  },
  recommendedSkillChip: {
    backgroundColor: theme.colors.primaryContainer,
  },
  recommendedSkillChipText: {
    color: theme.colors.primary,
    fontWeight: '500',
  },
  selectedSkillChip: {
    backgroundColor: theme.colors.primary,
  },
  selectedSkillChipText: {
    color: theme.colors.surface,
    fontSize: 12,
  },
  
  // Navigation
  navigationContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: theme.colors.surface,
    elevation: 4,
    gap: 12,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
}); 