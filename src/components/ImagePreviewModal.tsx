// Modal component to display the full reference image of the puzzle

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { colors, spacing, typography, layout } from '../theme';
import { getAccessibilityProps } from '../utils/accessibility';

interface ImagePreviewModalProps {
  visible: boolean;
  onClose: () => void;
  imageAsset: string | number;
  puzzleTitle: string;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  visible,
  onClose,
  imageAsset,
  puzzleTitle,
}) => {
  const screenDimensions = Dimensions.get('window');
  const maxImageWidth = screenDimensions.width - spacing.xl * 2;
  const maxImageHeight = screenDimensions.height * 0.7;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
      {...getAccessibilityProps({
        label: `Full reference image for ${puzzleTitle}`,
        role: 'image',
      })}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Reference Image</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              {...getAccessibilityProps({
                label: 'Close image preview',
                hint: 'Returns to the puzzle game',
                role: 'button',
              })}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Image container with scroll view for zooming */}
          <ScrollView
            contentContainerStyle={styles.imageContainer}
            maximumZoomScale={3.0}
            minimumZoomScale={1.0}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <Image
              source={
                typeof imageAsset === 'number'
                  ? imageAsset
                  : { uri: imageAsset }
              }
              style={[
                styles.image,
                {
                  maxWidth: maxImageWidth,
                  maxHeight: maxImageHeight,
                },
              ]}
              resizeMode="contain"
              accessible={true}
              accessibilityLabel={`Complete reference image of ${puzzleTitle} puzzle`}
            />
          </ScrollView>

          {/* Footer with instructions */}
          <View style={styles.footer}>
            <Text style={styles.instructionText}>
              📱 Pinch to zoom • Use this as reference while solving the puzzle
            </Text>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 500,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: typography.lg,
    fontWeight: typography.weight.bold,
    color: colors.onPrimary,
  },
  closeButton: {
    width: layout.touchTarget,
    height: layout.touchTarget,
    borderRadius: layout.touchTarget / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: typography.lg,
    color: colors.onPrimary,
    fontWeight: typography.weight.bold,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  image: {
    width: '100%',
    borderRadius: spacing.sm,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  instructionText: {
    fontSize: typography.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
