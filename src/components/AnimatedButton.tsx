// Enhanced animated button component for better UX
import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
  GestureResponderEvent,
  Platform,
} from 'react-native';
import { colors, shadows, borderRadius, typography, spacing, layout } from '../theme';
import { isSmallMobileDevice } from '../utils/device';

interface AnimatedButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
  disabled = false,
  onPress,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const getButtonStyle = (): ViewStyle[] => {
    const baseStyles: ViewStyle[] = [styles.button];
    
    // Add size-specific styles
    if (size === 'small') {
      baseStyles.push(styles.small);
    } else if (size === 'medium') {
      baseStyles.push(styles.medium);
    } else if (size === 'large') {
      baseStyles.push(styles.large);
    }
    
    // Add variant and state styles
    if (disabled) {
      baseStyles.push(styles.disabled);
    } else {
      if (variant === 'primary') {
        baseStyles.push(styles.primary);
      } else if (variant === 'secondary') {
        baseStyles.push(styles.secondary);
      } else if (variant === 'tertiary') {
        baseStyles.push(styles.tertiary);
      }
      
      if (isPressed) {
        baseStyles.push(styles.pressed);
      }
    }
    
    return baseStyles;
  };

  const getTextStyle = (): TextStyle[] => {
    const baseStyles: TextStyle[] = [styles.text];
    
    // Add size-specific text styles
    if (size === 'small') {
      baseStyles.push(styles.smallText);
    } else if (size === 'medium') {
      baseStyles.push(styles.mediumText);
    } else if (size === 'large') {
      baseStyles.push(styles.largeText);
    }
    
    // Add variant text styles
    if (disabled) {
      baseStyles.push(styles.disabledText);
    } else {
      if (variant === 'primary') {
        baseStyles.push(styles.primaryText);
      } else if (variant === 'secondary') {
        baseStyles.push(styles.secondaryText);
      } else if (variant === 'tertiary') {
        baseStyles.push(styles.tertiaryText);
      }
    }
    
    return baseStyles;
  };

  const handlePressIn = () => {
    if (!disabled) {
      setIsPressed(true);
    }
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  const handlePress = (event: GestureResponderEvent) => {
    if (!disabled && onPress) {
      onPress(event);
    }
  };

  return (
    <TouchableOpacity
      {...props}
      style={[getButtonStyle(), style]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={disabled ? 1 : 0.9}
      disabled={disabled}
    >
      <Text style={[getTextStyle(), textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderRadius: borderRadius.lg,
    transform: [{ scale: 1 }],
    // Enhanced touch area for better accessibility
    minWidth: layout.touchTarget,
  },
  
  // Sizes - responsive design for web, mobile, tablets
  small: {
    paddingHorizontal: isSmallMobileDevice() ? spacing.md : spacing.md,
    paddingVertical: isSmallMobileDevice() ? spacing.sm : spacing.sm,
    minHeight: isSmallMobileDevice() ? 40 : 40,
  },
  medium: {
    paddingHorizontal: isSmallMobileDevice() ? spacing.lg : spacing.lg,
    paddingVertical: isSmallMobileDevice() ? spacing.md : spacing.md,
    minHeight: layout.touchTarget,
  },
  large: {
    paddingHorizontal: isSmallMobileDevice() ? spacing.xl : spacing.xl,
    paddingVertical: isSmallMobileDevice() ? spacing.lg : spacing.lg,
    minHeight: layout.touchTargetLarge,
  },
  
  // Variants with proper shadow application
  primary: {
    backgroundColor: colors.primary,
    shadowColor: shadows.colored.primary.shadowColor,
    shadowOffset: shadows.colored.primary.shadowOffset,
    shadowOpacity: shadows.colored.primary.shadowOpacity,
    shadowRadius: shadows.colored.primary.shadowRadius,
    elevation: shadows.colored.primary.elevation,
  },
  secondary: {
    backgroundColor: colors.secondary,
    shadowColor: shadows.colored.secondary.shadowColor,
    shadowOffset: shadows.colored.secondary.shadowOffset,
    shadowOpacity: shadows.colored.secondary.shadowOpacity,
    shadowRadius: shadows.colored.secondary.shadowRadius,
    elevation: shadows.colored.secondary.elevation,
  },
  tertiary: {
    backgroundColor: colors.tertiary,
    shadowColor: shadows.colored.success.shadowColor,
    shadowOffset: shadows.colored.success.shadowOffset,
    shadowOpacity: shadows.colored.success.shadowOpacity,
    shadowRadius: shadows.colored.success.shadowRadius,
    elevation: shadows.colored.success.elevation,
  },
  
  // States with proper alignment and transform
  pressed: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderRadius: borderRadius.lg,
    transform: [{ scale: 0.97 }],
    shadowColor: shadows.md.shadowColor,
    shadowOffset: shadows.md.shadowOffset,
    shadowOpacity: shadows.md.shadowOpacity,
    shadowRadius: shadows.md.shadowRadius,
    elevation: shadows.md.elevation,
  },
  disabled: {
    backgroundColor: colors.disabled,
    shadowColor: shadows.none.shadowColor,
    shadowOffset: shadows.none.shadowOffset,
    shadowOpacity: shadows.none.shadowOpacity,
    shadowRadius: shadows.none.shadowRadius,
    elevation: shadows.none.elevation,
  },
  
  // Text styles with proper typography and responsive sizing
  text: {
    fontWeight: typography.weight.semibold,
    textAlign: 'center' as const,
    // Enhanced text legibility for kids
    letterSpacing: 0.5,
    lineHeight: Platform.OS === 'web' ? undefined : undefined, // Let React Native handle line height
  },
  smallText: {
    fontSize: isSmallMobileDevice() ? typography.md : typography.sm,
  },
  mediumText: {
    fontSize: isSmallMobileDevice() ? typography.lg : typography.md,
  },
  largeText: {
    fontSize: isSmallMobileDevice() ? typography.xl : typography.lg,
  },
  
  // Text variants with proper colors
  primaryText: {
    color: colors.onPrimary,
  },
  secondaryText: {
    color: colors.onSecondary,
  },
  tertiaryText: {
    color: colors.onSuccess,
  },
  disabledText: {
    color: colors.textTertiary,
  },
});