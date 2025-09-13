// Enhanced animated button component for better UX
import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { colors, shadows, borderRadius, typography, spacing } from '../theme';

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

  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    if (disabled) {
      baseStyle.push(styles.disabled);
    } else {
      baseStyle.push(styles[variant]);
      if (isPressed) {
        baseStyle.push(styles.pressed);
      }
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text, styles[`${size}Text`]];
    
    if (disabled) {
      baseStyle.push(styles.disabledText);
    } else {
      baseStyle.push(styles[`${variant}Text`]);
    }
    
    return baseStyle;
  };

  const handlePressIn = () => {
    if (!disabled) {
      setIsPressed(true);
    }
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  const handlePress = () => {
    if (!disabled && onPress) {
      onPress();
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
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
    transform: [{ scale: 1 }],
  },
  
  // Sizes
  small: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 40,
  },
  medium: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 48,
  },
  large: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    minHeight: 56,
  },
  
  // Variants
  primary: {
    backgroundColor: colors.primary,
    ...shadows.colored.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
    ...shadows.colored.secondary,
  },
  tertiary: {
    backgroundColor: colors.tertiary,
    ...shadows.colored.success,
  },
  
  // States
  pressed: {
    transform: [{ scale: 0.97 }],
    ...shadows.md,
  },
  disabled: {
    backgroundColor: colors.disabled,
    ...shadows.none,
  },
  
  // Text styles
  text: {
    fontWeight: typography.weight.semibold,
    textAlign: 'center',
  },
  smallText: {
    fontSize: typography.sm,
  },
  mediumText: {
    fontSize: typography.md,
  },
  largeText: {
    fontSize: typography.lg,
  },
  
  // Text variants
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