// Enhanced accessibility features for inclusive gaming

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ScrollView,
  Switch,
} from 'react-native';
import * as Speech from 'expo-speech';
import { useSettingsStore } from '../stores/settings';
import { useGameStore } from '../stores/game';
import { colors, spacing, typography } from '../theme';
import { Piece } from '../types';

interface AccessibilityEnhancementsProps {
  visible: boolean;
  onClose: () => void;
}

interface AccessibilitySettings {
  voiceGuidance: boolean;
  highContrast: boolean;
  largeButtons: boolean;
  oneHandedMode: boolean;
  reduceMotion: boolean;
  autoDescribePieces: boolean;
}

export const AccessibilityEnhancements: React.FC<
  AccessibilityEnhancementsProps
> = ({ visible, onClose }) => {
  const { currentPuzzle } = useGameStore();
  const settingsStore = useSettingsStore();
  const speechUtteranceRef = useRef<Speech.SpeechOptions | null>(null);

  // Local accessibility settings state
  const [accessibilitySettings, setAccessibilitySettings] =
    React.useState<AccessibilitySettings>({
      voiceGuidance: false,
      highContrast: false,
      largeButtons: false,
      oneHandedMode: false,
      reduceMotion: settingsStore.reducedMotion,
      autoDescribePieces: false,
    });

  const updateSetting = (key: keyof AccessibilitySettings, value: boolean) => {
    setAccessibilitySettings((prev) => ({ ...prev, [key]: value }));

    // Update global settings where applicable
    if (key === 'reduceMotion') {
      settingsStore.updateSettings({ reducedMotion: value });
    }
  };

  // Voice guidance functions
  const speakText = async (text: string) => {
    if (!accessibilitySettings.voiceGuidance) return;

    // Stop any current speech
    Speech.stop();

    // Speech.speak returns void, not SpeechOptions
    Speech.speak(text, {
      language: 'en',
      pitch: 1.0,
      rate: 0.8,
      voice: undefined, // Use system default
    });

    // Store the options instead for reference if needed
    speechUtteranceRef.current = {
      language: 'en',
      pitch: 1.0,
      rate: 0.8,
      voice: undefined,
    };
  };

  const describePiece = (piece: Piece) => {
    if (!piece || !currentPuzzle) return '';

    const { board } = currentPuzzle;
    const totalPieces = board.cols * board.rows;
    const pieceNumber = piece.row * board.cols + piece.col + 1;

    let description = `Piece ${pieceNumber} of ${totalPieces}. `;

    // Describe piece position
    if (piece.col === 0) description += 'Left edge. ';
    else if (piece.col === board.cols - 1) description += 'Right edge. ';
    else description += 'Middle column. ';

    if (piece.row === 0) description += 'Top edge. ';
    else if (piece.row === board.rows - 1) description += 'Bottom edge. ';
    else description += 'Middle row. ';

    // Describe piece type
    const isCorner =
      (piece.row === 0 || piece.row === board.rows - 1) &&
      (piece.col === 0 || piece.col === board.cols - 1);
    const isEdge =
      !isCorner &&
      (piece.row === 0 ||
        piece.row === board.rows - 1 ||
        piece.col === 0 ||
        piece.col === board.cols - 1);

    if (isCorner) description += 'Corner piece. ';
    else if (isEdge) description += 'Edge piece. ';
    else description += 'Interior piece. ';

    // Describe placement status
    if (piece.placed) {
      description += 'Correctly placed.';
    } else {
      description += 'Not yet placed.';
    }

    return description;
  };

  const describePuzzleState = () => {
    if (!currentPuzzle) return;

    const { board } = currentPuzzle;
    const completedCount = board.completedCount;
    const totalPieces = board.cols * board.rows;
    const remainingCount = totalPieces - completedCount;

    let description = `Puzzle progress: ${completedCount} pieces placed, ${remainingCount} remaining. `;

    if (completedCount === 0) {
      description += 'Starting fresh! Look for corner pieces first.';
    } else if (completedCount < totalPieces * 0.25) {
      description += 'Good start! Continue with edge pieces.';
    } else if (completedCount < totalPieces * 0.75) {
      description += 'Great progress! Work on the interior pieces.';
    } else if (completedCount < totalPieces) {
      description += 'Almost done! Just a few pieces left.';
    } else {
      description += 'Puzzle complete! Excellent job!';
    }

    speakText(description);
  };

  const provideHint = () => {
    if (!currentPuzzle) return;

    const { board } = currentPuzzle;
    const unplacedPieces = Object.values(board.pieces).filter((p) => !p.placed);

    if (unplacedPieces.length === 0) {
      speakText('Puzzle is complete!');
      return;
    }

    // Find a good next piece to work on
    const cornerPieces = unplacedPieces.filter(
      (p) =>
        (p.row === 0 || p.row === board.rows - 1) &&
        (p.col === 0 || p.col === board.cols - 1)
    );

    const edgePieces = unplacedPieces.filter(
      (p) =>
        p.row === 0 ||
        p.row === board.rows - 1 ||
        p.col === 0 ||
        p.col === board.cols - 1
    );

    let hintPiece: Piece | null = null;
    let hintText = '';

    if (cornerPieces.length > 0) {
      hintPiece = cornerPieces[0];
      hintText = 'Try working on a corner piece next. ';
    } else if (edgePieces.length > 0) {
      hintPiece = edgePieces[0];
      hintText = 'Focus on an edge piece. ';
    } else {
      hintPiece = unplacedPieces[0];
      hintText = 'Work on an interior piece. ';
    }

    if (hintPiece) {
      hintText += describePiece(hintPiece);
      speakText(hintText);
    }
  };

  // Auto-describe pieces when enabled
  useEffect(() => {
    if (accessibilitySettings.autoDescribePieces && currentPuzzle && visible) {
      setTimeout(() => describePuzzleState(), 1000);
    }
  }, [accessibilitySettings.autoDescribePieces, currentPuzzle, visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.overlay}>
        <View
          style={[
            styles.panel,
            accessibilitySettings.highContrast && styles.highContrast,
          ]}
        >
          <View style={styles.header}>
            <Text
              style={[
                styles.title,
                accessibilitySettings.highContrast && styles.highContrastText,
              ]}
            >
              Accessibility Settings
            </Text>
            <TouchableOpacity
              style={[
                styles.closeButton,
                accessibilitySettings.largeButtons && styles.largeButton,
              ]}
              onPress={onClose}
              accessible={true}
              accessibilityLabel="Close accessibility settings"
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Voice Guidance Section */}
            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  accessibilitySettings.highContrast && styles.highContrastText,
                ]}
              >
                🔊 Voice Guidance
              </Text>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text
                    style={[
                      styles.settingTitle,
                      accessibilitySettings.highContrast &&
                        styles.highContrastText,
                    ]}
                  >
                    Enable Voice Guidance
                  </Text>
                  <Text
                    style={[
                      styles.settingDescription,
                      accessibilitySettings.highContrast &&
                        styles.highContrastText,
                    ]}
                  >
                    Hear descriptions of puzzle pieces and progress
                  </Text>
                </View>
                <Switch
                  value={accessibilitySettings.voiceGuidance}
                  onValueChange={(value) =>
                    updateSetting('voiceGuidance', value)
                  }
                  accessibilityLabel="Toggle voice guidance"
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text
                    style={[
                      styles.settingTitle,
                      accessibilitySettings.highContrast &&
                        styles.highContrastText,
                    ]}
                  >
                    Auto-Describe Pieces
                  </Text>
                  <Text
                    style={[
                      styles.settingDescription,
                      accessibilitySettings.highContrast &&
                        styles.highContrastText,
                    ]}
                  >
                    Automatically describe puzzle state when opening
                  </Text>
                </View>
                <Switch
                  value={accessibilitySettings.autoDescribePieces}
                  onValueChange={(value) =>
                    updateSetting('autoDescribePieces', value)
                  }
                  accessibilityLabel="Toggle automatic piece descriptions"
                />
              </View>

              {accessibilitySettings.voiceGuidance && (
                <View style={styles.voiceButtons}>
                  <TouchableOpacity
                    style={[
                      styles.voiceButton,
                      accessibilitySettings.largeButtons && styles.largeButton,
                    ]}
                    onPress={describePuzzleState}
                    accessible={true}
                    accessibilityLabel="Describe current puzzle state"
                  >
                    <Text style={styles.voiceButtonText}>
                      📊 Describe Progress
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.voiceButton,
                      accessibilitySettings.largeButtons && styles.largeButton,
                    ]}
                    onPress={provideHint}
                    accessible={true}
                    accessibilityLabel="Get a voice hint"
                  >
                    <Text style={styles.voiceButtonText}>💡 Voice Hint</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Visual Accessibility Section */}
            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  accessibilitySettings.highContrast && styles.highContrastText,
                ]}
              >
                👁 Visual Accessibility
              </Text>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text
                    style={[
                      styles.settingTitle,
                      accessibilitySettings.highContrast &&
                        styles.highContrastText,
                    ]}
                  >
                    High Contrast Mode
                  </Text>
                  <Text
                    style={[
                      styles.settingDescription,
                      accessibilitySettings.highContrast &&
                        styles.highContrastText,
                    ]}
                  >
                    Increase contrast for better visibility
                  </Text>
                </View>
                <Switch
                  value={accessibilitySettings.highContrast}
                  onValueChange={(value) =>
                    updateSetting('highContrast', value)
                  }
                  accessibilityLabel="Toggle high contrast mode"
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text
                    style={[
                      styles.settingTitle,
                      accessibilitySettings.highContrast &&
                        styles.highContrastText,
                    ]}
                  >
                    Reduce Motion
                  </Text>
                  <Text
                    style={[
                      styles.settingDescription,
                      accessibilitySettings.highContrast &&
                        styles.highContrastText,
                    ]}
                  >
                    Minimize animations and visual effects
                  </Text>
                </View>
                <Switch
                  value={accessibilitySettings.reduceMotion}
                  onValueChange={(value) =>
                    updateSetting('reduceMotion', value)
                  }
                  accessibilityLabel="Toggle reduced motion"
                />
              </View>
            </View>

            {/* Motor Accessibility Section */}
            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  accessibilitySettings.highContrast && styles.highContrastText,
                ]}
              >
                ✋ Motor Accessibility
              </Text>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text
                    style={[
                      styles.settingTitle,
                      accessibilitySettings.highContrast &&
                        styles.highContrastText,
                    ]}
                  >
                    Large Buttons
                  </Text>
                  <Text
                    style={[
                      styles.settingDescription,
                      accessibilitySettings.highContrast &&
                        styles.highContrastText,
                    ]}
                  >
                    Larger touch targets for easier interaction
                  </Text>
                </View>
                <Switch
                  value={accessibilitySettings.largeButtons}
                  onValueChange={(value) =>
                    updateSetting('largeButtons', value)
                  }
                  accessibilityLabel="Toggle large buttons"
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text
                    style={[
                      styles.settingTitle,
                      accessibilitySettings.highContrast &&
                        styles.highContrastText,
                    ]}
                  >
                    One-Handed Mode
                  </Text>
                  <Text
                    style={[
                      styles.settingDescription,
                      accessibilitySettings.highContrast &&
                        styles.highContrastText,
                    ]}
                  >
                    Optimize layout for single-handed use
                  </Text>
                </View>
                <Switch
                  value={accessibilitySettings.oneHandedMode}
                  onValueChange={(value) =>
                    updateSetting('oneHandedMode', value)
                  }
                  accessibilityLabel="Toggle one-handed mode"
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  panel: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    minHeight: '60%',
  },
  highContrast: {
    backgroundColor: '#000000',
    borderColor: '#FFFFFF',
    borderWidth: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.outline,
  },
  title: {
    fontSize: typography.xl,
    fontWeight: typography.weight.bold,
    color: colors.onSurface,
  },
  highContrastText: {
    color: '#FFFFFF',
  },
  closeButton: {
    padding: spacing.xs,
    borderRadius: 20,
    backgroundColor: colors.outline,
    minWidth: 32,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  largeButton: {
    minWidth: 44,
    minHeight: 44,
    padding: spacing.sm,
  },
  closeButtonText: {
    fontSize: typography.md,
    color: colors.onSurface,
  },
  content: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.lg,
    fontWeight: typography.weight.semibold,
    color: colors.onSurface,
    marginBottom: spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.outline,
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingTitle: {
    fontSize: typography.md,
    fontWeight: typography.weight.semibold,
    color: colors.onSurface,
    marginBottom: spacing.xs / 2,
  },
  settingDescription: {
    fontSize: typography.sm,
    color: colors.secondary,
  },
  voiceButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  voiceButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  voiceButtonText: {
    color: colors.onPrimary,
    fontSize: typography.md,
    fontWeight: typography.weight.medium,
  },
});
