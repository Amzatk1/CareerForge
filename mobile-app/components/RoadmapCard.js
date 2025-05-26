import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, ProgressBar, List, Portal, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../utils/theme';

const RoadmapCard = ({ 
  roadmap, 
  isActive = false, 
  onStartRoadmap, 
  onViewDetails, 
  showExpandableSteps = false 
}) => {
  const [expanded, setExpanded] = useState(false);
  const [skillsModalVisible, setSkillsModalVisible] = useState(false);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return theme.colors.success;
      case 'intermediate': return theme.colors.warning;
      case 'advanced': return theme.colors.error;
      default: return theme.colors.outline;
    }
  };

  const getDomainColor = (domain) => {
    const domainColors = {
      'Software': theme.colors.primary,
      'Cloud': theme.colors.tertiary,
      'Data': theme.colors.accent,
      'Mobile': theme.colors.secondary,
      'DevOps': theme.colors.success,
      'Design': theme.colors.warning,
      'Business': theme.colors.error,
    };
    return domainColors[domain] || theme.colors.outline;
  };

  const getMatchColor = (match) => {
    if (match >= 90) return theme.colors.success;
    if (match >= 80) return theme.colors.warning;
    return theme.colors.accent;
  };

  const visibleSkills = roadmap.skills?.slice(0, 3) || [];
  const hiddenSkillsCount = Math.max(0, (roadmap.skills?.length || 0) - 3);

  const SmartTip = () => {
    if (!isActive) return null;
    
    const completionRate = roadmap.completedSteps / roadmap.totalSteps;
    let tipMessage = '';
    let tipIcon = 'lightbulb';
    
    if (completionRate >= 0.8) {
      tipMessage = `You're almost there! Just ${roadmap.totalSteps - roadmap.completedSteps} steps to complete this roadmap.`;
      tipIcon = 'trophy';
    } else if (completionRate >= 0.5) {
      tipMessage = `Great progress! Complete 2 more steps this week to maintain your streak.`;
      tipIcon = 'trending-up';
    } else {
      tipMessage = `Start with "${roadmap.nextMilestone}" to build momentum.`;
      tipIcon = 'rocket-launch';
    }

    return (
      <View style={styles.tipContainer}>
        <MaterialCommunityIcons name={tipIcon} size={16} color={theme.colors.primary} />
        <Text style={styles.tipText}>{tipMessage}</Text>
      </View>
    );
  };

  const SkillsModal = () => (
    <Portal>
      <Modal
        visible={skillsModalVisible}
        onDismiss={() => setSkillsModalVisible(false)}
        contentContainerStyle={styles.modalContainer}
      >
        <Card style={styles.modalCard}>
          <Card.Content>
            <View style={styles.modalHeader}>
              <Title style={styles.modalTitle}>Skills You'll Learn</Title>
              <TouchableOpacity onPress={() => setSkillsModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color={theme.colors.outline} />
              </TouchableOpacity>
            </View>
            <View style={styles.skillsGrid}>
              {roadmap.skills?.map((skill, index) => (
                <Chip
                  key={index}
                  icon="school"
                  style={styles.modalSkillChip}
                  textStyle={styles.modalSkillText}
                >
                  {skill}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>
      </Modal>
    </Portal>
  );

  return (
    <>
      <Card style={[styles.card, isActive && styles.activeCard]}>
        <Card.Content>
          {/* Header with Domain Tag and Match Score */}
          <View style={styles.cardHeader}>
            <View style={styles.headerLeft}>
              {roadmap.domain && (
                <Chip 
                  icon="tag-outline" 
                  style={[styles.domainChip, { backgroundColor: getDomainColor(roadmap.domain) + '20' }]}
                  textStyle={[styles.domainText, { color: getDomainColor(roadmap.domain) }]}
                >
                  {roadmap.domain}
                </Chip>
              )}
              {roadmap.match && (
                <Chip 
                  icon="target" 
                  style={[styles.matchChip, { backgroundColor: getMatchColor(roadmap.match) + '20' }]}
                  textStyle={[styles.matchText, { color: getMatchColor(roadmap.match) }]}
                >
                  {roadmap.match}% match
                </Chip>
              )}
            </View>
            {isActive && (
              <Chip icon="trending-up" style={styles.activeChip} textStyle={styles.activeChipText}>
                Active
              </Chip>
            )}
          </View>

          {/* Smart Tip */}
          <SmartTip />

          {/* Title and Description */}
          <Title style={styles.title}>{roadmap.title}</Title>
          <Paragraph style={styles.description}>{roadmap.description}</Paragraph>

          {/* Progress Section (for active roadmaps) */}
          {isActive && (
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Paragraph style={styles.progressLabel}>
                  Progress: {roadmap.completedSteps}/{roadmap.totalSteps} steps
                </Paragraph>
                <Paragraph style={styles.progressPercentage}>
                  {Math.round((roadmap.completedSteps / roadmap.totalSteps) * 100)}%
                </Paragraph>
              </View>
              <ProgressBar 
                progress={roadmap.completedSteps / roadmap.totalSteps} 
                color={theme.colors.primary} 
                style={styles.progressBar} 
              />
              <Paragraph style={styles.nextMilestone}>
                Next: {roadmap.nextMilestone}
              </Paragraph>
            </View>
          )}

          {/* Expandable Steps List */}
          {showExpandableSteps && roadmap.steps && (
            <List.Accordion
              title={`View ${roadmap.steps.length} Steps`}
              expanded={expanded}
              onPress={() => setExpanded(!expanded)}
              left={props => <List.Icon {...props} icon="format-list-bulleted" />}
              style={styles.accordion}
            >
              {roadmap.steps.map((step, index) => (
                <List.Item
                  key={index}
                  title={step.name}
                  description={step.description}
                  left={() => (
                    <List.Icon 
                      icon={step.completed ? "check-circle" : "circle-outline"} 
                      color={step.completed ? theme.colors.success : theme.colors.outline}
                    />
                  )}
                  right={() => step.duration && (
                    <Text style={styles.stepDuration}>{step.duration}</Text>
                  )}
                  style={[styles.stepItem, step.completed && styles.completedStep]}
                />
              ))}
            </List.Accordion>
          )}

          {/* Skills Section */}
          <View style={styles.skillsSection}>
            <Paragraph style={styles.skillsLabel}>Skills you'll learn:</Paragraph>
            <View style={styles.skillsContainer}>
              {visibleSkills.map((skill, index) => (
                <Chip key={index} style={styles.skillChip} textStyle={styles.skillText}>
                  {skill}
                </Chip>
              ))}
              {hiddenSkillsCount > 0 && (
                <TouchableOpacity onPress={() => setSkillsModalVisible(true)}>
                  <Chip 
                    icon="plus" 
                    style={styles.moreSkillsChip} 
                    textStyle={styles.moreSkillsText}
                  >
                    +{hiddenSkillsCount} more
                  </Chip>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Footer with Difficulty, Duration, and Actions */}
          <View style={styles.footer}>
            <View style={styles.footerInfo}>
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
            
            <View style={styles.actions}>
              {isActive ? (
                <>
                  <Button 
                    mode="outlined" 
                    onPress={onViewDetails}
                    style={styles.detailsButton}
                    labelStyle={styles.detailsButtonText}
                  >
                    View Details
                  </Button>
                  <Button 
                    mode="contained" 
                    onPress={() => {/* Continue learning */}}
                    style={styles.continueButton}
                  >
                    Continue
                  </Button>
                </>
              ) : (
                <Button 
                  mode="contained" 
                  onPress={() => onStartRoadmap(roadmap)}
                  style={styles.startButton}
                  icon="rocket-launch"
                >
                  Start Roadmap
                </Button>
              )}
            </View>
          </View>
        </Card.Content>
      </Card>
      
      <SkillsModal />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 3,
    borderRadius: theme.roundness,
  },
  activeCard: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  domainChip: {
    height: 24,
  },
  domainText: {
    fontSize: 10,
    fontWeight: '600',
  },
  matchChip: {
    height: 24,
  },
  matchText: {
    fontSize: 10,
    fontWeight: '600',
  },
  activeChip: {
    backgroundColor: theme.colors.success,
    height: 24,
  },
  activeChipText: {
    fontSize: 10,
    color: theme.colors.surface,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryContainer,
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
    gap: 6,
  },
  tipText: {
    fontSize: 12,
    color: theme.colors.primary,
    flex: 1,
    fontStyle: 'italic',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme.colors.onSurface,
  },
  description: {
    fontSize: 14,
    color: theme.colors.outline,
    marginBottom: 16,
    lineHeight: 20,
  },
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
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  nextMilestone: {
    fontSize: 12,
    color: theme.colors.accent,
    fontWeight: '600',
  },
  accordion: {
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 8,
    marginBottom: 16,
  },
  stepItem: {
    paddingLeft: 16,
  },
  completedStep: {
    opacity: 0.7,
  },
  stepDuration: {
    fontSize: 12,
    color: theme.colors.outline,
    alignSelf: 'center',
  },
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
    backgroundColor: theme.colors.secondaryContainer,
    height: 28,
  },
  skillText: {
    fontSize: 11,
    color: theme.colors.secondary,
  },
  moreSkillsChip: {
    backgroundColor: theme.colors.primary,
    height: 28,
  },
  moreSkillsText: {
    fontSize: 11,
    color: theme.colors.surface,
  },
  footer: {
    flexDirection: 'column',
    gap: 12,
  },
  footerInfo: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyChip: {
    height: 28,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '600',
  },
  durationChip: {
    backgroundColor: theme.colors.surfaceVariant,
    height: 28,
  },
  durationText: {
    fontSize: 11,
    color: theme.colors.outline,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
  detailsButton: {
    borderColor: theme.colors.primary,
  },
  detailsButtonText: {
    fontSize: 12,
  },
  continueButton: {
    backgroundColor: theme.colors.primary,
  },
  startButton: {
    backgroundColor: theme.colors.primary,
    flex: 1,
  },
  
  // Modal Styles
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
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modalSkillChip: {
    backgroundColor: theme.colors.primaryContainer,
    marginBottom: 4,
  },
  modalSkillText: {
    fontSize: 12,
    color: theme.colors.primary,
  },
});

export default RoadmapCard; 