// Enhanced visual feedback system for better gaming experience

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  useAnimatedProps,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors } from '../theme';

interface VisualEffectsProps {
  canvasWidth: number;
  canvasHeight: number;
  snapEffectTrigger?: boolean;
  completionTrigger?: boolean;
  hintHighlights?: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

export const VisualEffects: React.FC<VisualEffectsProps> = ({
  canvasWidth,
  canvasHeight,
  snapEffectTrigger = false,
  completionTrigger = false,
  hintHighlights = [],
}) => {
  // Snap effect animation values
  const snapScale = useSharedValue(0);
  const snapOpacity = useSharedValue(0);

  // Completion effect animation values
  const completionProgress = useSharedValue(0);
  const sparkleProgress = useSharedValue(0);

  // Hint highlight animation
  const hintPulse = useSharedValue(0);

  // Animated props for SVG components
  const snapCircleProps = useAnimatedProps(() => ({
    strokeOpacity: snapOpacity.value,
  }));

  const sparkleProps = useAnimatedProps(() => ({
    opacity: sparkleProgress.value,
  }));

  // Trigger snap effect
  React.useEffect(() => {
    if (snapEffectTrigger) {
      snapScale.value = withSequence(
        withSpring(1.5, { damping: 15, stiffness: 300 }),
        withSpring(0, { damping: 15, stiffness: 300 })
      );
      snapOpacity.value = withSequence(
        withSpring(1, { damping: 15, stiffness: 300 }),
        withDelay(300, withSpring(0, { damping: 15, stiffness: 300 }))
      );
    }
  }, [snapEffectTrigger, snapScale, snapOpacity]);

  // Trigger completion effect
  React.useEffect(() => {
    if (completionTrigger) {
      completionProgress.value = withSpring(1, { damping: 8, stiffness: 100 });
      sparkleProgress.value = withSequence(
        withDelay(200, withSpring(1, { damping: 10, stiffness: 150 })),
        withDelay(2000, withSpring(0, { damping: 10, stiffness: 150 }))
      );
    }
  }, [completionTrigger, completionProgress, sparkleProgress]);

  // Animate hint highlights
  React.useEffect(() => {
    if (hintHighlights.length > 0) {
      hintPulse.value = withSequence(
        withSpring(1, { damping: 8, stiffness: 200 }),
        withSpring(0.3, { damping: 8, stiffness: 200 }),
        withSpring(1, { damping: 8, stiffness: 200 }),
        withSpring(0, { damping: 8, stiffness: 200 })
      );
    }
  }, [hintHighlights, hintPulse]);

  // Animated styles for snap effect
  const snapEffectStyle = useAnimatedStyle(() => ({
    transform: [{ scale: snapScale.value }],
    opacity: snapOpacity.value,
  }));

  // Animated styles for completion effect
  const completionEffectStyle = useAnimatedStyle(() => ({
    opacity: completionProgress.value,
    transform: [{ scale: completionProgress.value }],
  }));

  // Animated styles for sparkles
  const sparkleStyle = useAnimatedStyle(() => ({
    opacity: sparkleProgress.value,
    transform: [{ rotate: `${sparkleProgress.value * 360}deg` }],
  }));

  // Hint highlight styles
  const hintHighlightStyle = useAnimatedStyle(() => ({
    opacity: hintPulse.value,
  }));

  // Animated props for hint highlight border
  const hintBorderProps = useAnimatedProps(() => ({
    strokeWidth: 2 + hintPulse.value * 4,
    strokeOpacity: hintPulse.value,
  }));

  return (
    <View
      style={[styles.container, { width: canvasWidth, height: canvasHeight }]}
      pointerEvents="none"
    >
      <Svg
        width={canvasWidth}
        height={canvasHeight}
        style={StyleSheet.absoluteFillObject}
      >
        {/* Snap effect - expanding circle */}
        <AnimatedCircle
          cx={canvasWidth / 2}
          cy={canvasHeight / 2}
          r={Math.min(canvasWidth, canvasHeight) / 4}
          fill="none"
          stroke={colors.success}
          strokeWidth="4"
          animatedProps={snapCircleProps}
        />

        {/* Hint highlights */}
        {hintHighlights.map((highlight, index) => (
          <AnimatedPath
            key={index}
            d={`M${highlight.x},${highlight.y} L${highlight.x + highlight.width},${highlight.y} L${highlight.x + highlight.width},${highlight.y + highlight.height} L${highlight.x},${highlight.y + highlight.height} Z`}
            fill="none"
            stroke={colors.warning}
            strokeDasharray="5,5"
            animatedProps={hintBorderProps}
          />
        ))}

        {/* Completion sparkles */}
        {completionTrigger &&
          [...Array(8)].map((_, index) => {
            const angle = (index / 8) * 2 * Math.PI;
            const radius = Math.min(canvasWidth, canvasHeight) / 3;
            const x = canvasWidth / 2 + Math.cos(angle) * radius;
            const y = canvasHeight / 2 + Math.sin(angle) * radius;

            return (
              <AnimatedCircle
                key={`sparkle-${index}`}
                cx={x}
                cy={y}
                r="4"
                fill={colors.warning}
                animatedProps={sparkleProps}
              />
            );
          })}
      </Svg>

      {/* Snap effect overlay */}
      <Animated.View style={[styles.snapEffect, snapEffectStyle]}>
        <View style={styles.snapRing} />
      </Animated.View>

      {/* Completion effect overlay */}
      <Animated.View style={[styles.completionEffect, completionEffectStyle]}>
        <View style={styles.completionBurst} />
        <Animated.View style={[styles.sparkleContainer, sparkleStyle]}>
          {[...Array(12)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.sparkle,
                {
                  transform: [
                    { rotate: `${index * 30}deg` },
                    { translateY: -50 },
                  ],
                },
              ]}
            />
          ))}
        </Animated.View>
      </Animated.View>

      {/* Hint highlights overlay */}
      {hintHighlights.map((highlight, index) => (
        <Animated.View
          key={`hint-${index}`}
          style={[
            styles.hintHighlight,
            hintHighlightStyle,
            {
              left: highlight.x - 4,
              top: highlight.y - 4,
              width: highlight.width + 8,
              height: highlight.height + 8,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 100,
  },
  snapEffect: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -25,
    marginTop: -25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  snapRing: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: colors.success,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  completionEffect: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -40,
    marginTop: -40,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completionBurst: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.warning,
    opacity: 0.3,
  },
  sparkleContainer: {
    width: 100,
    height: 100,
    position: 'absolute',
  },
  sparkle: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: colors.warning,
    borderRadius: 3,
    top: '50%',
    left: '50%',
    marginLeft: -3,
    marginTop: -3,
  },
  hintHighlight: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: colors.warning,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 184, 107, 0.15)',
  },
});
