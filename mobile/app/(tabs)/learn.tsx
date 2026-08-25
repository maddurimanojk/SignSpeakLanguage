import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { BookOpen, Camera, Search, Flame } from 'lucide-react-native';
import { HeaderBar } from '../../src/components/HeaderBar';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { colors, spacing, borderRadius } from '../../src/theme';
import { SignCategory, ISLSignItem } from '../../src/types';

const ISL_DICTIONARY: ISLSignItem[] = [
  { id: '1', name: 'HELLO', category: 'Basic', description: 'Open dominant hand near temple and wave outward gracefully.', gestureHint: 'Wave open palm from forehead outward', difficulty: 'Easy' },
  { id: '2', name: 'THANK YOU', category: 'Basic', description: 'Touch fingertips of flat dominant hand to chin, then extend forward towards receiver.', gestureHint: 'Flat hand from chin moving forward', difficulty: 'Easy' },
  { id: '3', name: 'YES', category: 'Basic', description: 'Make a fist and nod it up and down twice like a nodding head.', gestureHint: 'Fist nodding up and down', difficulty: 'Easy' },
  { id: '4', name: 'NO', category: 'Basic', description: 'Extend index and middle finger, snap them quickly against thumb.', gestureHint: 'Index & middle fingers tapping thumb', difficulty: 'Easy' },
  { id: '5', name: 'PLEASE', category: 'Basic', description: 'Place flat hand over chest and move in circular motion clockwise.', gestureHint: 'Flat palm circular motion on chest', difficulty: 'Easy' },
  { id: '6', name: 'SORRY', category: 'Basic', description: 'Form an "S" fist and rub in circular motion over heart.', gestureHint: 'Fist rubbing chest in circle', difficulty: 'Easy' },
  
  { id: '7', name: 'HELP', category: 'Emergency', description: 'Place dominant fist with thumb up over open palm of non-dominant hand and lift both slightly.', gestureHint: 'Thumb-up fist resting on flat palm lifted upward', difficulty: 'Medium' },
  { id: '8', name: 'WATER', category: 'Food', description: 'Form a "W" with index, middle, and ring fingers, tap index finger against chin.', gestureHint: 'Three fingers tapping chin', difficulty: 'Easy' },
  { id: '9', name: 'FOOD', category: 'Food', description: 'Bring fingertips together near lips as if putting morsel into mouth.', gestureHint: 'Fingertips bunched at mouth', difficulty: 'Easy' },
  
  { id: '10', name: 'HOME', category: 'Places', description: 'Touch flat fingers to cheek near mouth, then move to cheek near ear.', gestureHint: 'Fingertips touching mouth area then ear area', difficulty: 'Medium' },
  { id: '11', name: 'SCHOOL', category: 'Places', description: 'Clap flat hands horizontally twice.', gestureHint: 'Horizontal palm claps twice', difficulty: 'Easy' },
  { id: '12', name: 'HOSPITAL', category: 'Places', description: 'Use index and middle finger to draw an "H" cross shape on opposite upper arm.', gestureHint: 'Cross gesture on shoulder arm', difficulty: 'Medium' },
  
  { id: '13', name: 'GOOD', category: 'Basic', description: 'Fingertips at chin, move flat hand forward and downward.', gestureHint: 'Flat hand moving down from mouth', difficulty: 'Easy' },
  { id: '14', name: 'BAD', category: 'Basic', description: 'Fingertips at chin, turn palm outward and push downward sharply.', gestureHint: 'Palm pushing away from mouth downward', difficulty: 'Easy' },
  { id: '15', name: 'NAME', category: 'People', description: 'Tap index and middle fingers of both hands across each other at right angles.', gestureHint: 'H-fingers tapping crosswise', difficulty: 'Medium' },
  { id: '16', name: 'STOP', category: 'Basic', description: 'Chop edge of dominant flat hand onto palm of non-dominant hand sharply.', gestureHint: 'Hand edge chopping open palm', difficulty: 'Easy' },
  
  { id: '17', name: 'I', category: 'People', description: 'Point index finger towards own chest.', gestureHint: 'Index finger pointing to self', difficulty: 'Easy' },
  { id: '18', name: 'YOU', category: 'People', description: 'Point index finger toward second person.', gestureHint: 'Index finger pointing forward', difficulty: 'Easy' },
  { id: '19', name: 'WE', category: 'People', description: 'Point index finger to right shoulder, then circle around to left shoulder.', gestureHint: 'Index finger arc between shoulders', difficulty: 'Medium' },
  
  { id: '20', name: 'WHAT', category: 'Phrases', description: 'Hold open palms facing upward and shake side to side slightly with inquisitive facial expression.', gestureHint: 'Open palms shaking side to side', difficulty: 'Easy' },
  { id: '21', name: 'WHERE', category: 'Phrases', description: 'Hold index finger up and wave side to side like a pendulum.', gestureHint: 'Index finger waving side to side', difficulty: 'Easy' },
  { id: '22', name: 'HOW', category: 'Phrases', description: 'Rest curved knuckles together with palms down, rotate palms upward in arc.', gestureHint: 'Curved knuckles rotating upward', difficulty: 'Medium' },
  { id: '23', name: 'GOOD MORNING', category: 'Phrases', description: 'Sign GOOD (chin to palm) followed by MORNING (arm rising up like sun).', gestureHint: 'GOOD sign + sun rising arc gesture', difficulty: 'Hard' },
  { id: '24', name: 'GOOD NIGHT', category: 'Phrases', description: 'Sign GOOD followed by NIGHT (dominant hand arched over arm like setting sun).', gestureHint: 'GOOD sign + hand arching over arm', difficulty: 'Hard' },
];

const CATEGORIES: (SignCategory | 'All')[] = ['All', 'Basic', 'People', 'Food', 'Places', 'Emergency', 'Phrases'];

export default function LearnScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<SignCategory | 'All'>('All');

  const filteredSigns = selectedCategory === 'All'
    ? ISL_DICTIONARY
    : ISL_DICTIONARY.filter(s => s.category === selectedCategory);

  return (
    <View style={styles.container}>
      <HeaderBar title="Learn ISL Signs" />

      {/* Category Filter Chips */}
      <View style={styles.categoriesWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, selectedCategory === cat && styles.activeCategoryChip]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.categoryText, selectedCategory === cat && styles.activeCategoryText]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.countText}>
          Showing {filteredSigns.length} ISL signs ({selectedCategory})
        </Text>

        {filteredSigns.map((item) => (
          <Card key={item.id} style={styles.signCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.signTitle}>{item.name}</Text>
              <View style={styles.badgeRow}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{item.category}</Text>
                </View>
                <View style={[styles.diffBadge, item.difficulty === 'Easy' ? styles.easyBg : styles.mediumBg]}>
                  <Text style={styles.diffText}>{item.difficulty}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.descText}>{item.description}</Text>

            <View style={styles.hintBox}>
              <Flame size={14} color={colors.warning} />
              <Text style={styles.hintText}>
                <Text style={{ fontWeight: '700' }}>Gesture Hint:</Text> {item.gestureHint}
              </Text>
            </View>

            <Button
              title="Practice Sign"
              onPress={() => router.push('/(tabs)/translate')}
              variant="outline"
              icon={<Camera size={16} color={colors.textPrimary} />}
              style={styles.practiceBtn}
            />
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  categoriesWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
    backgroundColor: colors.surface,
  },
  categoriesContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    borderColor: colors.surfaceBorder,
    borderWidth: 1,
  },
  activeCategoryChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: spacing.md,
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.secondary,
    letterSpacing: 1.1,
    marginBottom: spacing.xs,
  },
  signCard: {
    marginBottom: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  signTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  categoryBadge: {
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondary,
  },
  diffBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  easyBg: { backgroundColor: 'rgba(16, 185, 129, 0.15)' },
  mediumBg: { backgroundColor: 'rgba(245, 158, 11, 0.15)' },
  diffText: { fontSize: 11, fontWeight: '700', color: colors.textPrimary },
  descText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  hintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: '#0F172A',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    borderColor: colors.surfaceBorder,
    borderWidth: 1,
  },
  hintText: {
    fontSize: 13,
    color: colors.textPrimary,
    flex: 1,
  },
  practiceBtn: {
    minHeight: 40,
  },
});
