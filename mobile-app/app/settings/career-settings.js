import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Button, Appbar, Searchbar, Chip, List, Divider, Text, Banner, Modal, Portal } from 'react-native-paper';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../utils/theme';
import apiClient from '../../utils/api';
import Toast from 'react-native-toast-message';
import { CAREER_CATEGORIES, ALL_CAREER_JOBS, EXPERIENCE_LEVELS, ADDITIONAL_SKILLS } from '../../data/careerData';

// Career compatibility matrix - defines which careers can be realistically combined
const CAREER_COMPATIBILITY = {
  // Technology careers are compatible with each other and some business roles
  'software-engineer': ['frontend-developer', 'backend-developer', 'fullstack-developer', 'data-analyst', 'data-scientist', 'web-developer', 'mobile-developer', 'ai-ml-engineer', 'devops-engineer', 'business-analyst', 'project-manager', 'product-manager-tech'],
  'frontend-developer': ['backend-developer', 'fullstack-developer', 'web-developer', 'ux-ui-designer', 'web-designer', 'software-engineer'],
  'backend-developer': ['frontend-developer', 'fullstack-developer', 'software-engineer', 'data-engineer', 'devops-engineer', 'cloud-engineer'],
  'fullstack-developer': ['frontend-developer', 'backend-developer', 'software-engineer', 'web-developer', 'mobile-developer'],
  'data-analyst': ['data-scientist', 'data-engineer', 'business-analyst', 'financial-analyst', 'software-engineer', 'ai-ml-engineer', 'economist'],
  'data-scientist': ['data-analyst', 'data-engineer', 'ai-ml-engineer', 'software-engineer', 'business-analyst', 'financial-analyst'],
  'data-engineer': ['data-analyst', 'data-scientist', 'software-engineer', 'cloud-engineer', 'devops-engineer'],
  'web-developer': ['frontend-developer', 'mobile-developer', 'software-engineer', 'ux-ui-designer', 'web-designer'],
  'mobile-developer': ['web-developer', 'software-engineer', 'ux-ui-designer', 'frontend-developer'],
  'ai-ml-engineer': ['data-scientist', 'data-analyst', 'software-engineer', 'data-engineer'],
  'cloud-engineer': ['devops-engineer', 'software-engineer', 'data-engineer', 'network-engineer'],
  'devops-engineer': ['cloud-engineer', 'software-engineer', 'systems-analyst', 'network-engineer'],
  'cybersecurity-analyst': ['network-engineer', 'systems-analyst', 'it-support'],
  'product-manager-tech': ['business-analyst', 'project-manager', 'software-engineer', 'ux-ui-designer'],
  
  // Business & Finance careers
  'business-analyst': ['data-analyst', 'project-manager', 'financial-analyst', 'software-engineer', 'product-manager-tech'],
  'financial-analyst': ['data-analyst', 'business-analyst', 'accountant', 'economist', 'investment-banker'],
  'investment-banker': ['financial-analyst', 'cpa', 'financial-advisor'],
  'project-manager': ['business-analyst', 'software-engineer', 'operations-manager', 'product-manager-tech'],
  'accountant': ['financial-analyst', 'business-analyst', 'cpa'],
  'cpa': ['accountant', 'financial-analyst', 'investment-banker'],
  'marketing-manager': ['digital-marketer', 'sales-manager', 'graphic-designer', 'ux-ui-designer', 'social-media-manager'],
  'digital-marketer': ['marketing-manager', 'social-media-manager', 'content-writer', 'copywriter'],
  'sales-manager': ['sales-representative', 'marketing-manager', 'business-analyst', 'business-development'],
  'sales-representative': ['sales-manager', 'business-development'],
  'hr-manager': ['hr-generalist', 'training-specialist'],
  'hr-generalist': ['hr-manager', 'training-specialist'],
  'operations-manager': ['project-manager', 'supply-chain-manager', 'logistics-manager'],
  'supply-chain-manager': ['operations-manager', 'logistics-manager'],
  'business-development': ['sales-manager', 'marketing-manager', 'management-consultant'],
  
  // Creative careers
  'graphic-designer': ['web-designer', 'ux-ui-designer', 'art-director', 'photographer', 'marketing-manager'],
  'web-designer': ['graphic-designer', 'ux-ui-designer', 'frontend-developer', 'web-developer'],
  'ux-ui-designer': ['graphic-designer', 'web-designer', 'web-developer', 'mobile-developer', 'product-manager-tech'],
  'photographer': ['videographer', 'graphic-designer', 'video-editor'],
  'videographer': ['photographer', 'video-editor', 'journalist', 'animator'],
  'video-editor': ['videographer', 'photographer', 'animator'],
  'animator': ['video-editor', 'videographer', 'graphic-designer', 'game-developer'],
  'journalist': ['content-writer', 'copywriter', 'author', 'videographer'],
  'content-writer': ['copywriter', 'journalist', 'digital-marketer', 'social-media-manager'],
  'copywriter': ['content-writer', 'marketing-manager', 'digital-marketer'],
  'author': ['journalist', 'content-writer', 'translator'],
  'translator': ['interpreter', 'author', 'content-writer'],
  'interpreter': ['translator'],
  'social-media-manager': ['digital-marketer', 'marketing-manager', 'content-writer'],
  'art-director': ['graphic-designer', 'ux-ui-designer', 'marketing-manager'],
  'interior-designer': ['architect', 'graphic-designer'],
  
  // Healthcare (generally exclusive due to licensing requirements)
  'medical-doctor': ['specialist-doctor'],
  'specialist-doctor': ['medical-doctor'],
  'surgeon': [],
  'nurse': ['nurse-practitioner', 'healthcare-admin'],
  'nurse-practitioner': ['nurse'],
  'pharmacist': [],
  'dentist': ['dental-hygienist'],
  'dental-hygienist': ['dentist'],
  'physical-therapist': ['occupational-therapist', 'athletic-trainer'],
  'occupational-therapist': ['physical-therapist'],
  'psychologist': ['psychiatrist', 'social-worker', 'art-therapist'],
  'psychiatrist': ['psychologist'],
  'veterinarian': ['veterinary-technician'],
  'healthcare-admin': ['nurse', 'business-analyst'],
  
  // Education
  'elementary-teacher': ['high-school-teacher', 'special-education-teacher', 'tutor'],
  'high-school-teacher': ['elementary-teacher', 'professor', 'tutor'],
  'special-education-teacher': ['elementary-teacher', 'school-counselor'],
  'professor': ['high-school-teacher', 'research-scientist'],
  'school-counselor': ['special-education-teacher', 'psychologist', 'social-worker'],
  'librarian': ['education-administrator'],
  'instructional-designer': ['training-specialist', 'education-administrator'],
  'training-specialist': ['instructional-designer', 'hr-manager', 'hr-generalist'],
  'tutor': ['elementary-teacher', 'high-school-teacher'],
  
  // Engineering
  'civil-engineer': ['architect', 'project-manager', 'construction-manager', 'environmental-engineer'],
  'mechanical-engineer': ['electrical-engineer', 'aerospace-engineer'],
  'electrical-engineer': ['mechanical-engineer', 'software-engineer', 'embedded-systems'],
  'chemical-engineer': ['environmental-engineer'],
  'aerospace-engineer': ['mechanical-engineer'],
  'biomedical-engineer': ['electrical-engineer'],
  'environmental-engineer': ['civil-engineer', 'chemical-engineer'],
  'architect': ['civil-engineer', 'interior-designer', 'landscape-architect'],
  'construction-manager': ['civil-engineer', 'project-manager'],
  'embedded-systems': ['electrical-engineer', 'software-engineer'],
  
  // Science & Research
  'research-scientist': ['biologist', 'chemist', 'physicist', 'professor'],
  'biologist': ['marine-biologist', 'environmental-scientist', 'research-scientist'],
  'chemist': ['food-scientist', 'research-scientist'],
  'physicist': ['astronomer', 'research-scientist'],
  'astronomer': ['physicist'],
  'geologist': ['environmental-scientist'],
  'environmental-scientist': ['biologist', 'geologist', 'conservation-scientist'],
  'marine-biologist': ['biologist', 'environmental-scientist'],
  'meteorologist': ['environmental-scientist'],
  'forensic-scientist': ['chemist'],
  'food-scientist': ['chemist', 'nutritionist'],
  
  // Legal & Public Service
  'lawyer': ['corporate-lawyer', 'criminal-lawyer', 'paralegal'],
  'corporate-lawyer': ['lawyer', 'business-analyst'],
  'criminal-lawyer': ['lawyer'],
  'paralegal': ['lawyer'],
  'judge': [],
  'police-officer': ['detective', 'probation-officer'],
  'detective': ['police-officer', 'forensic-scientist'],
  'firefighter': ['paramedic'],
  'paramedic': ['firefighter', 'nurse'],
  'social-worker': ['school-counselor', 'psychologist'],
  'probation-officer': ['police-officer', 'social-worker'],
  'urban-planner': ['architect', 'government-analyst'],
  'government-analyst': ['urban-planner', 'economist'],
  
  // Sports & Fitness
  'personal-trainer': ['fitness-instructor', 'athletic-trainer', 'nutritionist'],
  'athletic-trainer': ['personal-trainer', 'physical-therapist'],
  'sports-coach': ['physical-education-teacher', 'athletic-trainer'],
  'fitness-instructor': ['personal-trainer'],
  'nutritionist': ['personal-trainer', 'food-scientist'],
  'physical-education-teacher': ['sports-coach', 'elementary-teacher'],
  'sports-analyst': ['data-analyst'],
  
  // Agriculture & Environment
  'farmer': ['agricultural-engineer', 'horticulturist'],
  'agricultural-engineer': ['farmer', 'environmental-engineer'],
  'veterinary-technician': ['veterinarian'],
  'forest-ranger': ['conservation-scientist', 'environmental-scientist'],
  'conservation-scientist': ['forest-ranger', 'environmental-scientist'],
  'landscape-architect': ['architect', 'horticulturist'],
  'horticulturist': ['farmer', 'landscape-architect'],
  'environmental-consultant': ['environmental-scientist', 'environmental-engineer'],
  
  // Arts & Culture
  'museum-curator': ['art-teacher', 'gallery-manager'],
  'art-teacher': ['museum-curator', 'elementary-teacher'],
  'musician': ['music-teacher'],
  'music-teacher': ['musician', 'elementary-teacher'],
  'actor': ['theater-director'],
  'theater-director': ['actor'],
  'dancer': ['fitness-instructor'],
  'art-therapist': ['psychologist', 'art-teacher'],
  'gallery-manager': ['museum-curator', 'art-director'],
     'cultural-anthropologist': ['research-scientist'],
   
   // Hospitality & Service
  'chef': ['sous-chef', 'pastry-chef', 'restaurant-manager'],
  'sous-chef': ['chef', 'pastry-chef'],
  'pastry-chef': ['chef', 'sous-chef'],
  'restaurant-manager': ['chef', 'hotel-manager'],
  'hotel-manager': ['restaurant-manager', 'event-planner'],
  'event-planner': ['wedding-planner', 'hotel-manager'],
  'wedding-planner': ['event-planner'],
  'travel-agent': ['tour-guide'],
  'tour-guide': ['travel-agent'],
  'flight-attendant': [],
  'concierge': ['hotel-manager'],
  'bartender': ['restaurant-manager'],
  
  // Transportation & Logistics
  'pilot': ['air-traffic-controller'],
  'air-traffic-controller': ['pilot'],
  'logistics-manager': ['supply-chain-manager', 'warehouse-manager', 'operations-manager'],
  'supply-chain-analyst': ['data-analyst', 'logistics-manager'],
  'warehouse-manager': ['logistics-manager'],
  'truck-driver': ['delivery-driver'],
  'delivery-driver': ['truck-driver'],
  'shipping-coordinator': ['logistics-manager'],
  'freight-broker': ['logistics-manager', 'sales-representative'],
  
  // Default compatibility for unlisted careers
  'default': []
};

const MAX_CAREER_SELECTIONS = 3;

export default function CareerSettingsScreen() {
  const { tokens } = useAuth();
  const [selectedCareers, setSelectedCareers] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedCareerInfo, setSelectedCareerInfo] = useState(null);
  const [showCareerModal, setShowCareerModal] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await apiClient.get('/auth/profile/detail/');
      const data = response;
      
      // Pre-populate form with existing data
      if (data.career_interests && Array.isArray(data.career_interests)) {
        // Map career interest names to job objects with category IDs
        const existingCareers = ALL_CAREER_JOBS.filter(job => 
          data.career_interests.some(interest => 
            interest === job.name || interest === job.id
          )
        );
        setSelectedCareers(existingCareers);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load your current settings.',
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const isCareerCompatible = (newJob) => {
    if (selectedCareers.length === 0) return true;
    
    // Get compatibility list for the new job
    const newJobCompatibility = CAREER_COMPATIBILITY[newJob.id] || CAREER_COMPATIBILITY['default'];
    
    // Check if the new job is compatible with all currently selected careers
    return selectedCareers.every(selectedCareer => {
      const selectedCompatibility = CAREER_COMPATIBILITY[selectedCareer.id] || CAREER_COMPATIBILITY['default'];
      
      // Check bidirectional compatibility
      return newJobCompatibility.includes(selectedCareer.id) || 
             selectedCompatibility.includes(newJob.id) ||
             (newJobCompatibility.length === 0 && selectedCompatibility.length === 0);
    });
  };

  const handleCareerSelect = (job) => {
    const isSelected = selectedCareers.find(c => c.id === job.id);
    
    if (isSelected) {
      // Remove the career
      setSelectedCareers(selectedCareers.filter(c => c.id !== job.id));
    } else {
      // Check if we've reached the maximum
      if (selectedCareers.length >= MAX_CAREER_SELECTIONS) {
        Toast.show({
          type: 'info',
          text1: 'Maximum Reached',
          text2: `You can only select up to ${MAX_CAREER_SELECTIONS} career interests.`,
        });
        return;
      }
      
      // Check compatibility
      if (!isCareerCompatible(job)) {
        Toast.show({
          type: 'warning',
          text1: 'Incompatible Career',
          text2: 'This career doesn\'t align well with your current selections. Consider choosing related fields.',
        });
        return;
      }
      
      // Add the career
      const jobWithCategory = { ...job, categoryId: job.categoryId || getCurrentCategoryId(job.id) };
      setSelectedCareers([...selectedCareers, jobWithCategory]);
    }
  };

  const getCurrentCategoryId = (jobId) => {
    for (const category of CAREER_CATEGORIES) {
      if (category.jobs.find(job => job.id === jobId)) {
        return category.id;
      }
    }
    return null;
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleSave = async () => {
    if (selectedCareers.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'No Careers Selected',
        text2: 'Please select at least one career interest.',
      });
      return;
    }

    setLoading(true);
    try {
      const careerNames = selectedCareers.map(career => career.name);
      
      const response = await apiClient.patch('/auth/profile/update/', {
        career_interests: careerNames,
      });
      
      Toast.show({
        type: 'success',
        text1: 'Settings Saved',
        text2: 'Your career interests have been updated successfully.',
      });
      
      router.back();
    } catch (error) {
      console.error('Career settings save error:', error);
      Toast.show({
        type: 'error',
        text1: 'Save Failed',
        text2: 'Failed to save settings. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCareerLongPress = (job) => {
    setSelectedCareerInfo(job);
    setShowCareerModal(true);
  };

  const closeCareerModal = () => {
    setShowCareerModal(false);
    setSelectedCareerInfo(null);
  };

  const filteredCategories = CAREER_CATEGORIES.map(category => ({
    ...category,
    jobs: category.jobs.filter(job =>
      job.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })).filter(category => category.jobs.length > 0);

  if (initialLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Paragraph>Loading your career settings...</Paragraph>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <Card style={styles.headerCard}>
            <Card.Content style={styles.headerContent}>
              <MaterialCommunityIcons 
                name="briefcase-search" 
                size={48} 
                color={theme.colors.primary} 
              />
              <Title style={styles.headerTitle}>Career Interests</Title>
              <Paragraph style={styles.headerDescription}>
                Select up to {MAX_CAREER_SELECTIONS} realistic career paths that align with your goals
              </Paragraph>
            </Card.Content>
          </Card>

          {/* Selection Counter */}
          <Banner
            visible={true}
            icon="information"
            style={styles.counterBanner}
          >
            <Text style={styles.counterText}>
              {selectedCareers.length}/{MAX_CAREER_SELECTIONS} careers selected
                  </Text>
          </Banner>

          {/* Selected Careers */}
          {selectedCareers.length > 0 && (
            <Card style={styles.selectedCard}>
              <Card.Content>
                <Title style={styles.selectedTitle}>Your Selected Careers</Title>
                <View style={styles.selectedChips}>
                    {selectedCareers.map((career) => (
                      <Chip 
                        key={career.id}
                      mode="flat"
                      selected
                        onClose={() => handleCareerSelect(career)}
                      style={styles.selectedChip}
                      textStyle={{ color: theme.colors.onPrimary }}
                      >
                        {career.name}
                      </Chip>
                    ))}
                  </View>
              </Card.Content>
            </Card>
          )}

          {/* Search */}
          <Searchbar
            placeholder="Search careers or skills..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
          />
          
          {/* Hint */}
          <View style={styles.hintContainer}>
            <MaterialCommunityIcons 
              name="gesture-tap-hold" 
              size={16} 
              color={theme.colors.outline} 
            />
            <Text style={styles.hintText}>
              Tap to select • Long press for details
            </Text>
          </View>

          {/* Career Categories */}
          {filteredCategories.map((category) => {
                const isExpanded = expandedCategories[category.id];
            const selectedInCategory = category.jobs.filter(job => 
              selectedCareers.find(selected => selected.id === job.id)
            ).length;
                
                return (
              <Card key={category.id} style={styles.categoryCard}>
                    <List.Item
                      title={category.name}
                  description={`${category.jobs.length} careers available`}
                      left={(props) => (
                        <View style={styles.categoryIconContainer}>
                          <MaterialCommunityIcons 
                            name={category.icon} 
                            size={24} 
                            color={category.color} 
                          />
                        </View>
                      )}
                      right={(props) => (
                    <View style={styles.categoryRight}>
                          {selectedInCategory > 0 && (
                        <Chip style={[styles.countChip, { backgroundColor: category.color + '20' }]}>
                          {selectedInCategory}
                        </Chip>
                          )}
                          <MaterialCommunityIcons 
                        name={isExpanded ? 'chevron-up' : 'chevron-down'} 
                            size={24} 
                        color={theme.colors.onSurface}
                          />
                        </View>
                      )}
                      onPress={() => toggleCategory(category.id)}
                  style={styles.categoryHeader}
                    />
                    
                    {isExpanded && (
                  <Card.Content style={styles.jobsContainer}>
                    <Divider style={styles.divider} />
                          {category.jobs.map((job) => {
                            const isSelected = selectedCareers.find(c => c.id === job.id);
                      const isCompatible = isCareerCompatible(job);
                      const isDisabled = !isSelected && 
                        (selectedCareers.length >= MAX_CAREER_SELECTIONS || !isCompatible);

                            return (
                        <TouchableOpacity
                                key={job.id} 
                          onPress={() => !isDisabled && handleCareerSelect(job)}
                          onLongPress={() => handleCareerLongPress(job)}
                          disabled={isDisabled}
                                style={[
                            styles.jobItem,
                            isSelected && styles.selectedJobItem,
                            isDisabled && styles.disabledJobItem
                          ]}
                        >
                          <List.Item
                            title={job.name}
                            description={job.skills.slice(0, 3).join(', ') + (job.skills.length > 3 ? '...' : '')}
                            left={(props) => (
                              <MaterialCommunityIcons 
                                name={isSelected ? 'check-circle' : 'circle-outline'} 
                                size={24} 
                                color={isSelected ? theme.colors.primary : 
                                       isDisabled ? theme.colors.outline : theme.colors.onSurface} 
                              />
                            )}
                            right={(props) => (
                              <MaterialCommunityIcons 
                                name="information-outline" 
                                size={16} 
                                color={theme.colors.outline} 
                              />
                            )}
                            style={{ paddingVertical: 0 }}
                          />
                        </TouchableOpacity>
                );
              })}
            </Card.Content>
                )}
          </Card>
            );
          })}

          {/* Compatibility Info */}
          <Card style={styles.infoCard}>
            <Card.Content>
              <View style={styles.infoHeader}>
                <MaterialCommunityIcons name="lightbulb" size={20} color={theme.colors.accent} />
                <Title style={styles.infoTitle}>Smart Career Matching</Title>
              </View>
              <Paragraph style={styles.infoText}>
                Our AI ensures your career selections are realistic and complementary. 
                For example, you can combine Software Engineering with Data Analysis, 
                but not Medicine with Accounting due to different educational paths and time commitments.
              </Paragraph>
            </Card.Content>
          </Card>

          {/* Save Button */}
          <Button
            mode="contained"
            onPress={handleSave}
            loading={loading}
            disabled={loading || selectedCareers.length === 0}
            style={styles.saveButton}
            icon="content-save"
          >
            Save Career Settings
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Career Information Modal */}
      <Portal>
        <Modal
          visible={showCareerModal}
          onDismiss={closeCareerModal}
          contentContainerStyle={styles.modalContainer}
        >
          {selectedCareerInfo && (
            <Card style={styles.modalCard}>
              <Card.Content>
                <View style={styles.modalHeader}>
                          <MaterialCommunityIcons 
                    name="briefcase" 
                    size={32} 
                    color={theme.colors.primary} 
                  />
                  <View style={styles.modalTitleContainer}>
                    <Title style={styles.modalTitle}>{selectedCareerInfo.name}</Title>
                    <Paragraph style={styles.modalSubtitle}>Career Information</Paragraph>
                          </View>
                  <Button
                    mode="outlined"
                    onPress={closeCareerModal}
                    style={styles.closeButtonHeader}
                    contentStyle={styles.closeButtonContent}
                    compact
                  >
                            <MaterialCommunityIcons 
                      name="close" 
                              size={18} 
                      color={theme.colors.onSurface} 
                            />
                  </Button>
                        </View>

                <Divider style={styles.modalDivider} />

                {/* Skills Section */}
                <View style={styles.modalSection}>
                  <View style={styles.sectionHeader}>
                    <MaterialCommunityIcons 
                      name="star" 
                      size={20} 
                      color={theme.colors.accent} 
                    />
                    <Title style={styles.sectionTitle}>Required Skills</Title>
                  </View>
                  <View style={styles.skillsContainer}>
                    {selectedCareerInfo.skills.map((skill, index) => (
                      <Chip 
                        key={index}
                        mode="outlined" 
                        style={styles.skillChip}
                        textStyle={styles.skillChipText}
                      >
                        {skill}
                      </Chip>
                    ))}
                  </View>
                </View>

                {/* Description Section */}
                <View style={styles.modalSection}>
                  <View style={styles.sectionHeader}>
                    <MaterialCommunityIcons 
                      name="text-box" 
                      size={20} 
                      color={theme.colors.accent} 
                    />
                    <Title style={styles.sectionTitle}>About This Career</Title>
                </View>
                  <Paragraph style={styles.careerDescription}>
                    {getCareerDescription(selectedCareerInfo.id)}
                  </Paragraph>
              </View>

                {/* Quick Stats */}
                <View style={styles.modalSection}>
                  <View style={styles.sectionHeader}>
                    <MaterialCommunityIcons 
                      name="chart-line" 
                      size={20} 
                      color={theme.colors.accent} 
                    />
                    <Title style={styles.sectionTitle}>Quick Stats</Title>
                  </View>
                  <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>Skills Required</Text>
                      <Text style={styles.statValue}>{selectedCareerInfo.skills.length}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>Growth Potential</Text>
                      <Text style={styles.statValue}>High</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>Remote Friendly</Text>
                      <Text style={styles.statValue}>Yes</Text>
                    </View>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.modalActions}>
          <Button 
            mode="contained" 
                    onPress={closeCareerModal}
                    style={[styles.modalButton, styles.closeButton]}
                    icon="close"
                    buttonColor={theme.colors.surfaceVariant}
                    textColor={theme.colors.onSurface}
                  >
                    Close
                  </Button>
                  <Button
                    mode="contained"
                    onPress={() => {
                      handleCareerSelect(selectedCareerInfo);
                      closeCareerModal();
                    }}
                    style={[styles.modalButton, styles.actionButton]}
                    icon={selectedCareers.find(c => c.id === selectedCareerInfo.id) ? 'minus' : 'plus'}
                    disabled={selectedCareers.find(c => c.id === selectedCareerInfo.id) || 
                             (selectedCareers.length >= MAX_CAREER_SELECTIONS && 
                              !selectedCareers.find(c => c.id === selectedCareerInfo.id))}
                  >
                    {selectedCareers.find(c => c.id === selectedCareerInfo.id) ? 'Remove' : 'Add to Selection'}
          </Button>
        </View>
              </Card.Content>
            </Card>
          )}
        </Modal>
      </Portal>
    </View>
  );
}

// Helper function to get career descriptions
const getCareerDescription = (careerId) => {
  const descriptions = {
    // Technology & Engineering
    'software-engineer': 'Design, develop, and maintain software applications using modern programming languages and frameworks. Work on complex systems that power everything from mobile apps to enterprise solutions.',
    'frontend-developer': 'Create engaging user interfaces and experiences for web applications using HTML, CSS, JavaScript, and modern frameworks like React, Vue, or Angular.',
    'backend-developer': 'Build and maintain server-side applications, APIs, and databases that power web and mobile applications. Focus on performance, security, and scalability.',
    'fullstack-developer': 'Work across the entire technology stack, from frontend user interfaces to backend systems and databases. Versatile role requiring broad technical knowledge.',
    'data-analyst': 'Transform raw data into actionable insights using statistical analysis, visualization tools, and business intelligence platforms to drive decision-making.',
    'data-scientist': 'Apply advanced analytics, machine learning, and statistical modeling to solve complex business problems and predict future trends.',
    'data-engineer': 'Design and build data pipelines, warehouses, and infrastructure to collect, process, and store large volumes of data for analysis.',
    'cybersecurity-analyst': 'Protect organizations from cyber threats by monitoring security systems, conducting risk assessments, and implementing security measures.',
    'ai-ml-engineer': 'Develop and deploy artificial intelligence and machine learning models to automate processes and create intelligent systems.',
    'web-developer': 'Create responsive, accessible websites and web applications that provide excellent user experiences across all devices.',
    'mobile-developer': 'Build native and cross-platform mobile applications for iOS and Android using modern development frameworks and tools.',
    'cloud-engineer': 'Design, implement, and manage cloud infrastructure and services to ensure scalable, reliable, and cost-effective computing solutions.',
    'devops-engineer': 'Streamline software development and deployment processes through automation, continuous integration, and infrastructure management.',
    'network-engineer': 'Design, implement, and maintain computer networks, ensuring reliable connectivity and optimal performance for organizations.',
    'database-admin': 'Manage and optimize database systems, ensuring data integrity, security, and performance for critical business applications.',
    'systems-analyst': 'Bridge the gap between business requirements and technical solutions by analyzing systems and recommending improvements.',
    'it-support': 'Provide technical assistance and troubleshooting for hardware, software, and network issues to keep organizations running smoothly.',
    'product-manager-tech': 'Guide the development of technology products from conception to launch, balancing user needs with business objectives.',
    'qa-engineer': 'Ensure software quality through comprehensive testing strategies, automation, and quality assurance processes.',
    'blockchain-developer': 'Build decentralized applications and smart contracts using blockchain technology for secure, transparent transactions.',
    'game-developer': 'Create engaging video games for various platforms using game engines, programming languages, and creative design principles.',
    'embedded-systems': 'Develop software for embedded systems in devices like IoT sensors, automotive systems, and consumer electronics.',

    // Business & Finance
    'project-manager': 'Lead cross-functional teams to deliver projects on time and within budget, managing resources, timelines, and stakeholder expectations.',
    'business-analyst': 'Analyze business processes and requirements to identify improvement opportunities and facilitate organizational change.',
    'financial-analyst': 'Evaluate investment opportunities, analyze financial performance, and provide recommendations for strategic financial decisions.',
    'investment-banker': 'Facilitate complex financial transactions including mergers, acquisitions, and capital raising for corporations and institutions.',
    'accountant': 'Maintain accurate financial records, prepare reports, and ensure compliance with accounting standards and tax regulations.',
    'cpa': 'Provide advanced accounting services including auditing, tax planning, and financial consulting with professional certification.',
    'marketing-manager': 'Develop and execute comprehensive marketing strategies to build brand awareness and drive customer acquisition.',
    'digital-marketer': 'Execute online marketing campaigns across digital channels including social media, search engines, and email platforms.',
    'sales-manager': 'Lead sales teams to achieve revenue targets through strategic planning, coaching, and customer relationship management.',
    'sales-representative': 'Build relationships with prospects and customers to generate sales and grow business revenue through direct selling.',
    'hr-manager': 'Oversee human resources functions including recruitment, employee development, and organizational culture initiatives.',
    'hr-generalist': 'Handle diverse HR responsibilities from recruiting and onboarding to employee relations and benefits administration.',
    'operations-manager': 'Optimize business operations to improve efficiency, reduce costs, and enhance overall organizational performance.',
    'supply-chain-manager': 'Coordinate the flow of goods and services from suppliers to customers, optimizing costs and delivery times.',
    'economist': 'Analyze economic trends and data to provide insights on market conditions, policy impacts, and business strategies.',
    'management-consultant': 'Advise organizations on strategic decisions, operational improvements, and organizational transformation initiatives.',
    'real-estate-agent': 'Help clients buy, sell, and rent properties while providing market expertise and negotiation services.',
    'insurance-agent': 'Assess client needs and sell insurance products to protect individuals and businesses from financial risks.',
    'financial-advisor': 'Provide personalized financial planning and investment advice to help clients achieve their financial goals.',
    'business-development': 'Identify and pursue new business opportunities, partnerships, and markets to drive organizational growth.',

    // Healthcare & Medical
    'medical-doctor': 'Diagnose and treat patients across various medical conditions, providing comprehensive healthcare and medical expertise.',
    'specialist-doctor': 'Provide specialized medical care in specific areas such as cardiology, neurology, or oncology with advanced training.',
    'surgeon': 'Perform surgical procedures to treat injuries, diseases, and deformities with precision and advanced medical techniques.',
    'nurse': 'Provide direct patient care, administer medications, and support patients through their healthcare journey with compassion.',
    'nurse-practitioner': 'Deliver advanced nursing care including diagnosis, treatment planning, and prescribing medications in specialized areas.',
    'pharmacist': 'Ensure safe and effective medication use through dispensing, counseling, and monitoring drug therapy outcomes.',
    'dentist': 'Maintain oral health through preventive care, diagnosis, and treatment of dental and oral conditions.',
    'dental-hygienist': 'Provide preventive dental care including cleanings, screenings, and patient education on oral health.',
    'physical-therapist': 'Help patients recover mobility and manage pain through therapeutic exercises and rehabilitation techniques.',
    'occupational-therapist': 'Assist patients in developing skills needed for daily living and working through adaptive techniques.',
    'psychologist': 'Provide mental health services including therapy, assessment, and research to improve psychological well-being.',
    'psychiatrist': 'Diagnose and treat mental health disorders using medication management and therapeutic interventions.',
    'veterinarian': 'Provide medical care for animals, including diagnosis, treatment, and preventive care across various species.',
    'medical-technologist': 'Perform laboratory tests and analyses that are crucial for disease diagnosis and treatment monitoring.',
    'radiologic-technologist': 'Operate imaging equipment to create diagnostic images that help physicians diagnose and treat patients.',
    'respiratory-therapist': 'Provide specialized care for patients with breathing disorders and respiratory conditions.',
    'healthcare-admin': 'Manage healthcare facilities and operations to ensure efficient delivery of quality patient care.',

    // Education & Training
    'elementary-teacher': 'Educate young children in fundamental subjects while fostering social and emotional development in early grades.',
    'high-school-teacher': 'Teach specialized subjects to adolescents, preparing them for college and career success through engaging instruction.',
    'special-education-teacher': 'Provide individualized instruction and support for students with diverse learning needs and disabilities.',
    'professor': 'Conduct research and teach at the university level while contributing to academic knowledge through scholarship.',
    'school-counselor': 'Support student academic and personal development through counseling, guidance, and crisis intervention.',
    'librarian': 'Manage information resources and assist patrons with research, digital literacy, and access to knowledge.',
    'instructional-designer': 'Create effective learning experiences and educational materials using pedagogical principles and technology.',
    'training-specialist': 'Develop and deliver professional training programs to enhance employee skills and organizational performance.',
    'education-administrator': 'Lead educational institutions through strategic planning, policy development, and academic oversight.',
    'tutor': 'Provide personalized instruction and academic support to help students achieve their learning goals.',

    // Creative & Media
    'graphic-designer': 'Create visual communications that effectively convey messages through typography, imagery, and design principles.',
    'web-designer': 'Design visually appealing and user-friendly websites that provide excellent user experiences across devices.',
    'ux-ui-designer': 'Research user needs and design intuitive interfaces that enhance user satisfaction and product usability.',
    'photographer': 'Capture compelling images for various purposes including events, portraits, commercial, and artistic projects.',
    'videographer': 'Create engaging video content for entertainment, marketing, education, and documentary purposes.',
    'video-editor': 'Transform raw footage into polished video content through editing, color correction, and post-production techniques.',
    'animator': 'Bring characters and stories to life through 2D and 3D animation for entertainment, education, and marketing.',
    'journalist': 'Research, investigate, and report news stories while maintaining ethical standards and factual accuracy.',
    'content-writer': 'Create engaging written content for websites, blogs, and marketing materials that resonates with target audiences.',
    'copywriter': 'Craft persuasive marketing copy that drives action and effectively communicates brand messages.',
    'author': 'Write books, articles, and other literary works while developing unique voice and storytelling abilities.',
    'translator': 'Convert written content between languages while preserving meaning, tone, and cultural context.',
    'interpreter': 'Provide real-time oral translation services for meetings, conferences, and other live communications.',
    'social-media-manager': 'Develop and execute social media strategies to build brand presence and engage online communities.',
    'art-director': 'Lead creative teams and guide visual direction for advertising, marketing, and media projects.',
    'interior-designer': 'Create functional and aesthetically pleasing interior spaces that meet client needs and preferences.',

    // Engineering & Construction
    'civil-engineer': 'Design and oversee construction of infrastructure projects including roads, bridges, and buildings.',
    'mechanical-engineer': 'Design and develop mechanical systems, machines, and devices for various industrial applications.',
    'electrical-engineer': 'Design electrical systems and components for power generation, electronics, and communication systems.',
    'chemical-engineer': 'Design processes for manufacturing chemicals, pharmaceuticals, and other products safely and efficiently.',
    'aerospace-engineer': 'Develop aircraft, spacecraft, and related systems with focus on performance, safety, and innovation.',
    'biomedical-engineer': 'Apply engineering principles to healthcare by designing medical devices and systems.',
    'environmental-engineer': 'Develop solutions to environmental problems including pollution control and sustainable systems.',
    'architect': 'Design buildings and structures that are functional, safe, and aesthetically pleasing.',
    'construction-manager': 'Oversee construction projects from planning to completion, ensuring quality, safety, and budget compliance.',
    'construction-worker': 'Perform hands-on construction work including building, installing, and maintaining structures.',
    'electrician': 'Install, maintain, and repair electrical systems in residential, commercial, and industrial settings.',
    'plumber': 'Install and maintain plumbing systems including pipes, fixtures, and water supply systems.',
    'hvac-technician': 'Install, maintain, and repair heating, ventilation, and air conditioning systems.',
    'surveyor': 'Measure and map land boundaries and features using specialized equipment and techniques.',

    // Science & Research
    'research-scientist': 'Conduct scientific research to advance knowledge and develop new technologies or treatments.',
    'biologist': 'Study living organisms and their interactions with the environment through research and field studies.',
    'chemist': 'Analyze chemical compounds and reactions to develop new materials, drugs, and industrial processes.',
    'physicist': 'Study matter, energy, and their interactions to understand fundamental principles of the universe.',
    'astronomer': 'Observe and study celestial objects and phenomena to understand the universe and its origins.',
    'geologist': 'Study Earth\'s structure, processes, and history through field work and laboratory analysis.',
    'environmental-scientist': 'Research environmental problems and develop solutions for conservation and sustainability.',
    'marine-biologist': 'Study marine life and ecosystems to understand ocean environments and conservation needs.',
    'meteorologist': 'Study weather patterns and atmospheric conditions to provide forecasts and climate analysis.',
    'forensic-scientist': 'Apply scientific methods to analyze evidence and assist in criminal investigations.',
    'food-scientist': 'Research and develop food products while ensuring safety, nutrition, and quality standards.',

    // Legal & Public Service
    'lawyer': 'Represent clients in legal matters, provide legal advice, and advocate for justice in various practice areas.',
    'corporate-lawyer': 'Specialize in business law including contracts, mergers, acquisitions, and corporate compliance.',
    'criminal-lawyer': 'Defend clients in criminal cases and navigate the criminal justice system.',
    'paralegal': 'Assist lawyers with legal research, document preparation, and case management.',
    'judge': 'Preside over court proceedings and make legal decisions based on law and evidence.',
    'police-officer': 'Protect and serve communities through law enforcement, investigation, and public safety.',
    'detective': 'Investigate crimes, gather evidence, and work to solve criminal cases.',
    'firefighter': 'Respond to emergencies including fires, medical calls, and rescue operations.',
    'paramedic': 'Provide emergency medical care and transport patients in critical situations.',
    'social-worker': 'Help individuals and families overcome challenges and connect with community resources.',
    'probation-officer': 'Supervise offenders in the community and help them reintegrate into society.',
    'urban-planner': 'Design and plan land use for communities to promote sustainable and livable environments.',
    'government-analyst': 'Research and analyze policy issues to inform government decision-making.',

    // Hospitality & Service
    'chef': 'Create culinary experiences through menu development, cooking techniques, and kitchen leadership.',
    'sous-chef': 'Assist head chefs in kitchen operations, food preparation, and staff management.',
    'pastry-chef': 'Specialize in creating desserts, baked goods, and sweet culinary creations.',
    'restaurant-manager': 'Oversee restaurant operations including staff, customer service, and financial performance.',
    'hotel-manager': 'Manage hotel operations to ensure excellent guest experiences and profitable operations.',
    'event-planner': 'Coordinate and execute events from conception to completion, managing all logistical details.',
    'wedding-planner': 'Specialize in planning and coordinating weddings to create memorable celebrations.',
    'travel-agent': 'Help clients plan and book travel experiences including flights, accommodations, and activities.',
    'tour-guide': 'Lead groups on educational and entertaining tours while sharing knowledge about destinations.',
    'flight-attendant': 'Ensure passenger safety and comfort during air travel while providing excellent customer service.',
    'concierge': 'Assist hotel guests with recommendations, reservations, and personalized service.',
    'bartender': 'Create beverages and provide hospitality in bars, restaurants, and entertainment venues.',

    // Transportation & Logistics
    'pilot': 'Operate aircraft safely and efficiently while ensuring passenger and cargo transportation.',
    'air-traffic-controller': 'Coordinate aircraft movements to ensure safe and efficient air traffic flow.',
    'logistics-manager': 'Coordinate the movement of goods and materials through supply chains efficiently.',
    'supply-chain-analyst': 'Analyze supply chain data to optimize processes and reduce costs.',
    'warehouse-manager': 'Oversee warehouse operations including inventory, staff, and distribution processes.',
    'truck-driver': 'Transport goods safely and efficiently across various distances and routes.',
    'delivery-driver': 'Provide last-mile delivery services while maintaining customer satisfaction.',
    'shipping-coordinator': 'Coordinate shipments and logistics to ensure timely and accurate delivery.',
    'freight-broker': 'Connect shippers with carriers to facilitate efficient freight transportation.',

    // Agriculture & Environment
    'farmer': 'Produce crops and livestock while managing agricultural operations and sustainable practices.',
    'agricultural-engineer': 'Apply engineering principles to agricultural production and food processing systems.',
    'veterinary-technician': 'Assist veterinarians in providing medical care for animals.',
    'forest-ranger': 'Protect and manage forest resources while educating the public about conservation.',
    'conservation-scientist': 'Research and develop strategies to protect natural resources and wildlife.',
    'landscape-architect': 'Design outdoor spaces that are both functional and environmentally sustainable.',
    'horticulturist': 'Specialize in plant cultivation, garden design, and plant science.',
    'environmental-consultant': 'Advise organizations on environmental compliance and sustainability practices.',

    // Arts & Culture
    'museum-curator': 'Manage museum collections and create educational exhibitions for public engagement.',
    'art-teacher': 'Educate students in various art forms while fostering creativity and artistic expression.',
    'musician': 'Perform music professionally while developing artistic skills and entertaining audiences.',
    'music-teacher': 'Educate students in music theory, performance, and appreciation.',
    'actor': 'Perform in theatrical, film, and television productions while developing character portrayals.',
    'theater-director': 'Guide theatrical productions from script to performance through creative leadership.',
    'dancer': 'Express artistic vision through movement and choreography in various dance styles.',
    'art-therapist': 'Use creative arts to help clients improve mental health and emotional well-being.',
    'gallery-manager': 'Manage art galleries and coordinate exhibitions while supporting artists.',
    'cultural-anthropologist': 'Study human cultures and societies to understand cultural diversity and change.',

    // Sports & Fitness
    'personal-trainer': 'Help clients achieve fitness goals through personalized exercise programs and motivation.',
    'athletic-trainer': 'Prevent and treat sports injuries while helping athletes optimize performance.',
    'sports-coach': 'Train and develop athletes in specific sports while building team dynamics.',
    'fitness-instructor': 'Lead group fitness classes and motivate participants to achieve health goals.',
    'nutritionist': 'Provide nutrition guidance to optimize health and athletic performance.',
    'physical-education-teacher': 'Educate students about physical fitness, sports, and healthy lifestyles.',
    'sports-analyst': 'Analyze sports performance and statistics to provide insights for teams and media.',
    'recreation-coordinator': 'Plan and organize recreational activities and programs for communities.',
  };
  
  return descriptions[careerId] || 'A rewarding career path with opportunities for growth and professional development in this field.';
};

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
  
  // Counter Banner
  counterBanner: {
    marginBottom: 16,
    backgroundColor: theme.colors.primaryContainer,
  },
  counterText: {
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  
  // Selected Careers
  selectedCard: {
    elevation: 2,
    borderRadius: theme.roundness,
    marginBottom: 16,
    backgroundColor: theme.colors.primaryContainer,
  },
  selectedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: theme.colors.onSurface,
  },
  selectedChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedChip: {
    backgroundColor: theme.colors.primary,
    marginBottom: 4,
  },
  
  // Search
  searchBar: {
    marginBottom: 8,
    elevation: 2,
  },
  
  // Hint
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  hintText: {
    fontSize: 12,
    color: theme.colors.outline,
    marginLeft: 6,
    fontStyle: 'italic',
  },
  
  // Categories
  categoryCard: {
    elevation: 2,
    borderRadius: theme.roundness,
    marginBottom: 12,
  },
  categoryHeader: {
    paddingVertical: 8,
  },
  categoryIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceVariant,
  },
  categoryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countChip: {
    minWidth: 24,
    height: 24,
  },
  
  // Jobs
  jobsContainer: {
    paddingTop: 0,
  },
  divider: {
    marginBottom: 8,
  },
  jobItem: {
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  selectedJobItem: {
    backgroundColor: theme.colors.primaryContainer + '40',
  },
  disabledJobItem: {
    opacity: 0.5,
  },
  
  // Info Card
  infoCard: {
    elevation: 1,
    borderRadius: theme.roundness,
    marginBottom: 16,
    backgroundColor: theme.colors.surfaceVariant,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: theme.colors.onSurface,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.onSurface,
  },
  
  // Save Button
  saveButton: {
    paddingVertical: 8,
    marginBottom: 32,
  },
  
  // Modal Styles
  modalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    borderRadius: theme.roundness,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    color: theme.colors.onSurface,
  },
  modalSubtitle: {
    fontSize: 14,
    color: theme.colors.outline,
  },
  closeButtonHeader: {
    minWidth: 40,
    borderRadius: 20,
  },
  closeButtonContent: {
    height: 32,
  },
  modalDivider: {
    marginBottom: 16,
  },
  modalSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: theme.colors.onSurface,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    marginBottom: 4,
    backgroundColor: theme.colors.surfaceVariant,
  },
  skillChipText: {
    fontSize: 12,
    color: theme.colors.onSurface,
  },
  careerDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.onSurface,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 8,
    padding: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.outline,
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 4,
  },
  closeButton: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  actionButton: {
    backgroundColor: theme.colors.primary,
  },
}); 