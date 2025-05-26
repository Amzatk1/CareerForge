import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Dimensions } from 'react-native';
import { Card, Title, Paragraph, Button, Avatar, Chip, ProgressBar, FAB, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../utils/theme';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [showAllGoals, setShowAllGoals] = useState(false);
  const [stats, setStats] = useState({
    activeRoadmaps: 2,
    skillsLearned: 12,
    currentStreak: 5,
    careerScore: 78,
    weeklyGoals: 3,
    completedGoals: 2,
    jobMatches: 15,
    resumeStrength: 85,
    applicationsThisWeek: 3,
    networkConnections: 24,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Smart Insight Generator
  const getSmartInsight = () => {
    const completionRate = (stats.completedGoals / stats.weeklyGoals) * 100;
    
    if (completionRate >= 75) {
      return {
        message: `Excellent! You've completed ${completionRate.toFixed(0)}% of your goals this week. Keep your momentum going!`,
        icon: 'trophy',
        color: theme.colors.success,
        action: 'Add 1 more goal to maintain your streak'
      };
    } else if (completionRate >= 50) {
      return {
        message: `Good progress! You're ${completionRate.toFixed(0)}% through your weekly goals.`,
        icon: 'trending-up',
        color: theme.colors.primary,
        action: 'Complete 1 more task to stay on track'
      };
    } else {
      return {
        message: `Let's boost your progress! You have ${stats.weeklyGoals - stats.completedGoals} goals remaining this week.`,
        icon: 'rocket-launch',
        color: theme.colors.accent,
        action: 'Start with your easiest goal first'
      };
    }
  };

  const StatCard = ({ title, value, icon, color = theme.colors.primary, trend = "up", onPress, subtitle }) => (
    <TouchableOpacity 
      onPress={onPress} 
      style={styles.statCardTouchable}
      accessibilityRole="button"
      accessibilityLabel={`${title}: ${value}${subtitle ? `, ${subtitle}` : ''}`}
    >
      <Card style={[styles.statCard, { borderLeftColor: color, borderLeftWidth: 4 }]}>
        <Card.Content style={styles.statContent}>
          <View style={styles.statHeader}>
            <View style={styles.statIconContainer}>
              <MaterialCommunityIcons name={icon} size={24} color={color} />
              <MaterialCommunityIcons 
                name={trend === "up" ? "trending-up" : trend === "down" ? "trending-down" : "trending-neutral"} 
                size={16} 
                color={trend === "up" ? theme.colors.success : trend === "down" ? theme.colors.error : theme.colors.outline} 
                style={styles.trendIcon}
              />
            </View>
            <Title style={[styles.statValue, { color }]}>{value}</Title>
          </View>
          <Paragraph style={styles.statTitle}>{title}</Paragraph>
          {subtitle && <Paragraph style={styles.statSubtitle}>{subtitle}</Paragraph>}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const QuickActionFAB = ({ icon, label, onPress, color = theme.colors.primary }) => (
    <TouchableOpacity 
      onPress={onPress} 
      style={[styles.quickActionFAB, { backgroundColor: color + '15' }]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
        <MaterialCommunityIcons name={icon} size={24} color="white" />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );

  const insight = getSmartInsight();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <Card style={styles.welcomeCard}>
          <Card.Content>
            <View style={styles.welcomeHeader}>
              <View style={styles.avatarContainer}>
                <Avatar.Text 
                  size={70} 
                  label={user?.first_name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || 'U'} 
                  style={styles.avatar}
                />
                <View style={styles.avatarBadge}>
                  <MaterialCommunityIcons 
                    name="trending-up" 
                    size={16} 
                    color={theme.colors.success} 
                  />
                </View>
              </View>
              <View style={styles.welcomeText}>
                <Title style={styles.welcomeTitle}>
                  Welcome back, {user?.first_name || user?.username || 'User'}!
                </Title>
                <Paragraph style={styles.welcomeSubtitle}>
                  Your career score is {stats.careerScore}% and growing! Let's continue building your professional future.
                </Paragraph>
                <View style={styles.statusRow}>
                  <Paragraph style={styles.lastLogin}>
                    Last login: {new Date().toLocaleDateString()}
                  </Paragraph>
                  <Chip icon="trending-up" style={styles.statusChip} textStyle={styles.statusChipText}>
                    Growing
                  </Chip>
                </View>
              </View>
            </View>
            
            <View style={styles.streakContainer}>
              <Chip icon="fire" style={styles.streakChip} textStyle={styles.streakChipText}>
                {stats.currentStreak} day learning streak
              </Chip>
              <Chip icon="target" style={styles.goalChip} textStyle={styles.goalChipText}>
                {stats.completedGoals}/{stats.weeklyGoals} goals
              </Chip>
            </View>
          </Card.Content>
        </Card>

        {/* Smart Insight */}
        <Card style={[styles.insightCard, { borderColor: insight.color }]}>
          <Card.Content>
            <View style={styles.insightHeader}>
              <MaterialCommunityIcons name={insight.icon} size={32} color={insight.color} />
              <View style={styles.insightText}>
                <Title style={styles.insightTitle}>Smart Insight</Title>
                <Paragraph style={styles.insightMessage}>{insight.message}</Paragraph>
                <Text style={[styles.insightAction, { color: insight.color }]}>{insight.action}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Current Goals - Collapsible */}
        <Card style={styles.goalsCard}>
          <Card.Content>
            <TouchableOpacity 
              onPress={() => setShowAllGoals(!showAllGoals)}
              style={styles.sectionHeader}
              accessibilityRole="button"
              accessibilityLabel={`Current Career Goals, ${showAllGoals ? 'collapse' : 'expand'}`}
            >
              <Title style={styles.sectionTitle}>Current Career Goals</Title>
              <View style={styles.goalHeaderRight}>
                <Chip icon="target" style={styles.goalProgressChip} textStyle={styles.goalProgressText}>
                  {stats.completedGoals}/{stats.weeklyGoals} this week
                </Chip>
                <MaterialCommunityIcons 
                  name={showAllGoals ? "chevron-up" : "chevron-down"} 
                  size={24} 
                  color={theme.colors.primary} 
                />
              </View>
            </TouchableOpacity>
            
            <View style={styles.progressItem}>
              <View style={styles.goalHeader}>
                <Paragraph style={styles.goalTitle}>Master React Native Development</Paragraph>
                <MaterialCommunityIcons name="trending-up" size={16} color={theme.colors.success} />
              </View>
              <ProgressBar progress={0.75} color={theme.colors.primary} style={styles.progressBar} />
              <View style={styles.goalFooter}>
                <Paragraph style={styles.progressText}>75% Complete</Paragraph>
                <Paragraph style={styles.timeRemaining}>2 weeks left</Paragraph>
              </View>
            </View>
            
            {showAllGoals && (
              <>
                <View style={styles.progressItem}>
                  <View style={styles.goalHeader}>
                    <Paragraph style={styles.goalTitle}>Build Professional Portfolio</Paragraph>
                    <MaterialCommunityIcons name="trending-up" size={16} color={theme.colors.warning} />
                  </View>
                  <ProgressBar progress={0.45} color={theme.colors.accent} style={styles.progressBar} />
                  <View style={styles.goalFooter}>
                    <Paragraph style={styles.progressText}>45% Complete</Paragraph>
                    <Paragraph style={styles.timeRemaining}>3 weeks left</Paragraph>
                  </View>
                </View>
                
                <View style={styles.progressItem}>
                  <View style={styles.goalHeader}>
                    <Paragraph style={styles.goalTitle}>Complete AWS Certification</Paragraph>
                    <MaterialCommunityIcons name="clock-outline" size={16} color={theme.colors.outline} />
                  </View>
                  <ProgressBar progress={0.15} color={theme.colors.success} style={styles.progressBar} />
                  <View style={styles.goalFooter}>
                    <Paragraph style={styles.progressText}>15% Complete</Paragraph>
                    <Paragraph style={styles.timeRemaining}>8 weeks left</Paragraph>
                  </View>
                </View>
              </>
            )}
          </Card.Content>
        </Card>

        {/* Stats Grid - Grouped */}
        <View style={styles.statsSection}>
          <Title style={styles.statsGroupTitle}>Learning Progress</Title>
          <View style={styles.statsGrid}>
            <StatCard
              title="Active Roadmaps"
              value={stats.activeRoadmaps}
              icon="map-marker-path"
              color={theme.colors.chart}
              trend="up"
              onPress={() => router.push('/(main)/roadmap')}
            />
            <StatCard
              title="Skills Learned"
              value={stats.skillsLearned}
              icon="school"
              color={theme.colors.success}
              trend="up"
              subtitle="This month"
            />
          </View>
          
          <Title style={styles.statsGroupTitle}>Career Metrics</Title>
          <View style={styles.statsGrid}>
            <StatCard
              title="Career Score"
              value={`${stats.careerScore}%`}
              icon="chart-line"
              color={theme.colors.primary}
              trend="up"
              subtitle="+5% this week"
            />
            <StatCard
              title="Resume Strength"
              value={`${stats.resumeStrength}%`}
              icon="file-document"
              color={theme.colors.accent}
              trend="up"
              subtitle="Strong profile"
            />
          </View>
          
          <View style={styles.statsGrid}>
            <StatCard
              title="Job Matches"
              value={stats.jobMatches}
              icon="briefcase-search"
              color={theme.colors.tertiary}
              trend="up"
              onPress={() => router.push('/(main)/opportunities')}
              subtitle="New this week"
            />
            <StatCard
              title="Applications"
              value={stats.applicationsThisWeek}
              icon="send"
              color={theme.colors.secondary}
              trend="neutral"
              subtitle="This week"
            />
          </View>
        </View>

        {/* Quick Actions - Enhanced */}
        <Card style={styles.actionsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Quick Actions</Title>
            <View style={styles.quickActionsGrid}>
              <QuickActionFAB
                icon="robot"
                label="AI Assistant"
                onPress={() => router.push('/(main)/ai-chat')}
                color={theme.colors.primary}
              />
              <QuickActionFAB
                icon="briefcase-edit"
                label="Career Settings"
                onPress={() => router.push('/settings/career-settings')}
                color={theme.colors.success}
              />
              <QuickActionFAB
                icon="rocket-launch"
                label="Generate Roadmap"
                onPress={() => router.push('/(main)/roadmap')}
                color={theme.colors.secondary}
              />
              <QuickActionFAB
                icon="briefcase-search"
                label="Find Jobs"
                onPress={() => router.push('/(main)/opportunities')}
                color={theme.colors.tertiary}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Recent Activity - Compact */}
        <Card style={styles.activityCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Recent Activity</Title>
            
            <View style={styles.activitySection}>
              <Text style={styles.activityGroupTitle}>Today</Text>
              <View style={styles.activityItem}>
                <MaterialCommunityIcons name="check-circle" size={16} color={theme.colors.success} />
                <Text style={styles.activityText}>Completed "React Hooks" lesson</Text>
                <Text style={styles.activityTime}>2h ago</Text>
              </View>
              <View style={styles.activityItem}>
                <MaterialCommunityIcons name="briefcase-plus" size={16} color={theme.colors.primary} />
                <Text style={styles.activityText}>New job match: Senior Developer at TechCorp</Text>
                <Text style={styles.activityTime}>4h ago</Text>
              </View>
            </View>
            
            <View style={styles.activitySection}>
              <Text style={styles.activityGroupTitle}>This Week</Text>
              <View style={styles.activityItem}>
                <MaterialCommunityIcons name="trending-up" size={16} color={theme.colors.accent} />
                <Text style={styles.activityText}>Career score increased to 78%</Text>
                <Text style={styles.activityTime}>2 days ago</Text>
              </View>
              <View style={styles.activityItem}>
                <MaterialCommunityIcons name="school" size={16} color={theme.colors.success} />
                <Text style={styles.activityText}>Started "AWS Fundamentals" course</Text>
                <Text style={styles.activityTime}>3 days ago</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Daily Tip */}
        <Card style={styles.tipCard}>
          <Card.Content>
            <View style={styles.tipHeader}>
              <MaterialCommunityIcons name="lightbulb" size={24} color={theme.colors.warning} />
              <Title style={styles.tipTitle}>Daily Tip</Title>
            </View>
            <Paragraph style={styles.tipText}>
              Add your portfolio link to your profile to increase job match quality by up to 25%!
            </Paragraph>
                            <Button mode="text" onPress={() => router.push('/(main)/settings')} style={styles.tipButton}>
                  Update Profile
                </Button>
          </Card.Content>
        </Card>
      </ScrollView>
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

  // Welcome Card
  welcomeCard: {
    margin: 12,
    marginTop: 0,
    elevation: 6,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.surface,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    backgroundColor: theme.colors.primary,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 4,
    elevation: 2,
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    color: theme.colors.onSurface,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: theme.colors.outline,
    lineHeight: 20,
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastLogin: {
    fontSize: 12,
    color: theme.colors.outline,
  },
  statusChip: {
    backgroundColor: theme.colors.success,
    height: 24,
  },
  statusChipText: {
    fontSize: 10,
    color: theme.colors.surface,
  },
  streakContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  streakChip: {
    backgroundColor: theme.colors.warning,
    flex: 1,
  },
  streakChipText: {
    fontSize: 11,
    color: theme.colors.surface,
  },
  goalChip: {
    backgroundColor: theme.colors.accent,
    flex: 1,
  },
  goalChipText: {
    fontSize: 11,
    color: theme.colors.surface,
  },

  // Smart Insight
  insightCard: {
    margin: 12,
    marginTop: 0,
    elevation: 4,
    borderRadius: theme.roundness,
    borderWidth: 2,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  insightText: {
    flex: 1,
    marginLeft: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  insightMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  insightAction: {
    fontSize: 12,
    fontWeight: '600',
    fontStyle: 'italic',
  },

  // Goals Card
  goalsCard: {
    margin: 12,
    marginTop: 0,
    elevation: 3,
    borderRadius: theme.roundness,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    minHeight: 44, // Accessibility tap target
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
  },
  goalHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  goalProgressChip: {
    backgroundColor: theme.colors.primaryContainer,
    height: 28,
  },
  goalProgressText: {
    fontSize: 11,
    color: theme.colors.primary,
  },
  progressItem: {
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 12,
    color: theme.colors.onSurface,
  },
  timeRemaining: {
    fontSize: 12,
    color: theme.colors.outline,
  },

  // Stats Section
  statsSection: {
    margin: 12,
    marginTop: 0,
  },
  statsGroupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 12,
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCardTouchable: {
    flex: 1,
  },
  statCard: {
    elevation: 3,
    borderRadius: theme.roundness,
    minHeight: 80,
  },
  statContent: {
    padding: 12,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  statIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendIcon: {
    marginLeft: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statTitle: {
    fontSize: 12,
    color: theme.colors.onSurface,
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 10,
    color: theme.colors.outline,
  },

  // Quick Actions
  actionsCard: {
    margin: 12,
    marginTop: 0,
    elevation: 3,
    borderRadius: theme.roundness,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  quickActionFAB: {
    width: (width - 64) / 2, // Responsive width
    alignItems: 'center',
    padding: 16,
    borderRadius: theme.roundness,
    minHeight: 44, // Accessibility
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: theme.colors.onSurface,
  },

  // Activity Card
  activityCard: {
    margin: 12,
    marginTop: 0,
    elevation: 2,
    borderRadius: theme.roundness,
  },
  activitySection: {
    marginBottom: 16,
  },
  activityGroupTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 8,
  },
  activityText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.onSurface,
  },
  activityTime: {
    fontSize: 11,
    color: theme.colors.outline,
  },

  // Daily Tip
  tipCard: {
    margin: 12,
    marginTop: 0,
    marginBottom: 24,
    elevation: 2,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.warningContainer,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: theme.colors.warning,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
    color: theme.colors.onSurface,
  },
  tipButton: {
    alignSelf: 'flex-start',
  },
}); 