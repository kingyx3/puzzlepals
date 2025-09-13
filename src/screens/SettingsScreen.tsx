// Settings screen with premium upgrade and app preferences

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  purchasePremium,
  isPremiumUser,
  restorePurchases,
} from '../services/monetization';
import { colors, spacing, typography, layout } from '../theme';
import { getSafeAreaPadding } from '../utils/statusBar';

interface SettingsScreenProps {
  onExit: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onExit }) => {
  const insets = useSafeAreaInsets();
  const safeAreaPadding = getSafeAreaPadding();
  const [isPremium, setIsPremium] = useState(isPremiumUser());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const handlePremiumPurchase = async () => {
    if (isPremium) return;

    setIsPurchasing(true);
    try {
      const result = await purchasePremium();
      if (result.success) {
        setIsPremium(true);
        Alert.alert(
          'Purchase Successful! 🎉',
          'You now have premium access with no ads!',
          [{ text: 'Great!', style: 'default' }]
        );
      } else {
        Alert.alert(
          'Purchase Failed',
          result.error || 'Something went wrong. Please try again.',
          [{ text: 'OK', style: 'default' }]
        );
      }
    } catch {
      Alert.alert(
        'Purchase Error',
        'Unable to complete purchase. Please try again later.',
        [{ text: 'OK', style: 'default' }]
      );
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestorePurchases = async () => {
    setIsRestoring(true);
    try {
      const results = await restorePurchases();
      const hasSuccessfulRestore = results.some((result) => result.success);

      if (hasSuccessfulRestore) {
        setIsPremium(true);
        Alert.alert(
          'Purchases Restored! 🎉',
          'Your premium access has been restored.',
          [{ text: 'Great!', style: 'default' }]
        );
      } else {
        Alert.alert(
          'No Purchases Found',
          'No previous purchases were found to restore.',
          [{ text: 'OK', style: 'default' }]
        );
      }
    } catch {
      Alert.alert(
        'Restore Error',
        'Unable to restore purchases. Please try again later.',
        [{ text: 'OK', style: 'default' }]
      );
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, safeAreaPadding.paddingTop) }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onExit}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          accessibilityHint="Returns to the previous screen"
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title} accessible={true} accessibilityRole="header">
          Settings
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* Premium Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Premium</Text>

          {isPremium ? (
            <View style={styles.premiumStatus}>
              <Text style={styles.premiumStatusText}>✨ Premium Active</Text>
              <Text style={styles.premiumStatusSubtext}>
                Enjoy ad-free puzzles!
              </Text>
            </View>
          ) : (
            <View style={styles.premiumOffer}>
              <View style={styles.premiumCard}>
                <Text style={styles.premiumTitle}>🚫 Remove All Ads</Text>
                <Text style={styles.premiumPrice}>$5.00</Text>
                <Text style={styles.premiumDescription}>
                  Enjoy uninterrupted puzzle fun!{'\n'}
                  One-time purchase, no subscriptions.
                </Text>

                <TouchableOpacity
                  style={[
                    styles.purchaseButton,
                    isPurchasing && styles.purchaseButtonDisabled,
                  ]}
                  onPress={handlePremiumPurchase}
                  disabled={isPurchasing}
                >
                  <Text style={styles.purchaseButtonText}>
                    {isPurchasing ? 'Processing...' : 'Buy Premium'}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.restoreButton}
                onPress={handleRestorePurchases}
                disabled={isRestoring}
              >
                <Text style={styles.restoreButtonText}>
                  {isRestoring ? 'Restoring...' : 'Restore Purchases'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* App Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Preferences</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Sound Effects</Text>
              <Text style={styles.settingDescription}>
                Play sounds when pieces snap
              </Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: colors.outline, true: colors.primary }}
              thumbColor={soundEnabled ? colors.onPrimary : colors.onSurface}
              accessible={true}
              accessibilityLabel="Toggle sound effects"
              accessibilityHint={
                soundEnabled
                  ? 'Sound effects are currently on'
                  : 'Sound effects are currently off'
              }
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Haptic Feedback</Text>
              <Text style={styles.settingDescription}>
                Feel vibrations when pieces connect
              </Text>
            </View>
            <Switch
              value={hapticsEnabled}
              onValueChange={setHapticsEnabled}
              trackColor={{ false: colors.outline, true: colors.primary }}
              thumbColor={hapticsEnabled ? colors.onPrimary : colors.onSurface}
              accessible={true}
              accessibilityLabel="Toggle haptic feedback"
              accessibilityHint={
                hapticsEnabled
                  ? 'Haptic feedback is currently on'
                  : 'Haptic feedback is currently off'
              }
            />
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Created with ❤️ for kids</Text>
            <Text style={styles.infoValue}>🧩 PuzzlePals</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.outline,
  },
  backButton: {
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: layout.touchTarget / 2,
    minWidth: layout.touchTarget,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: typography.sm,
    fontWeight: typography.weight.medium,
    color: colors.onSurface,
  },
  title: {
    flex: 1,
    fontSize: typography.xl,
    fontWeight: typography.weight.bold,
    color: colors.onBackground,
    textAlign: 'center',
  },
  headerSpacer: {
    width: layout.touchTarget,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.lg,
    fontWeight: typography.weight.bold,
    color: colors.onBackground,
    marginBottom: spacing.md,
  },
  premiumStatus: {
    backgroundColor: colors.success,
    padding: spacing.lg,
    borderRadius: spacing.md,
    alignItems: 'center',
  },
  premiumStatusText: {
    fontSize: typography.lg,
    fontWeight: typography.weight.bold,
    color: colors.onSuccess,
    marginBottom: spacing.xs,
  },
  premiumStatusSubtext: {
    fontSize: typography.md,
    color: colors.onSuccess,
  },
  premiumOffer: {
    gap: spacing.md,
  },
  premiumCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  premiumTitle: {
    fontSize: typography.xl,
    fontWeight: typography.weight.bold,
    color: colors.onSurface,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  premiumPrice: {
    fontSize: typography.xxxl,
    fontWeight: typography.weight.bold,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  premiumDescription: {
    fontSize: typography.md,
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: typography.md * 1.4,
  },
  purchaseButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: layout.touchTarget / 2,
    minWidth: layout.touchTarget * 3,
    alignItems: 'center',
  },
  purchaseButtonDisabled: {
    backgroundColor: colors.outline,
  },
  purchaseButtonText: {
    fontSize: typography.lg,
    fontWeight: typography.weight.bold,
    color: colors.onPrimary,
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  restoreButtonText: {
    fontSize: typography.md,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: spacing.sm,
    marginBottom: spacing.sm,
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingLabel: {
    fontSize: typography.md,
    fontWeight: typography.weight.medium,
    color: colors.onSurface,
    marginBottom: spacing.xs / 2,
  },
  settingDescription: {
    fontSize: typography.sm,
    color: colors.secondary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: spacing.sm,
    marginBottom: spacing.sm,
  },
  infoLabel: {
    fontSize: typography.md,
    color: colors.secondary,
  },
  infoValue: {
    fontSize: typography.md,
    fontWeight: typography.weight.medium,
    color: colors.onSurface,
  },
});
