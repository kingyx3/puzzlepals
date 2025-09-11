// UI/UX validation utilities for ensuring best practices compliance

/**
 * Validates touch target size for accessibility and kid-friendliness
 */
export function validateTouchTarget(
  width: number,
  height: number
): {
  isValid: boolean;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];

  const MIN_WCAG = 44;
  const KID_FRIENDLY = 48;

  if (width < MIN_WCAG || height < MIN_WCAG) {
    issues.push('Touch target below WCAG minimum (44pt)');
  }

  if (width < KID_FRIENDLY || height < KID_FRIENDLY) {
    recommendations.push(
      'Consider increasing to 48pt+ for kid-friendly design'
    );
  }

  return {
    isValid: width >= MIN_WCAG && height >= MIN_WCAG,
    issues,
    recommendations,
  };
}

/**
 * Validates color contrast ratios (simplified check)
 */
export function validateColorContrast(
  foregroundColor: string,
  backgroundColor: string
): {
  isValid: boolean;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // This is a simplified check - in a real app, you'd use a proper contrast calculator
  const isHighContrastCombination =
    (foregroundColor.includes('FFFFFF') && backgroundColor.includes('000')) ||
    (foregroundColor.includes('000') && backgroundColor.includes('FFFFFF')) ||
    (foregroundColor.includes('2C2C2C') && backgroundColor.includes('FFFFFF'));

  if (!isHighContrastCombination) {
    recommendations.push(
      'Verify color combination meets WCAG AA standards (4.5:1 ratio)'
    );
  }

  return {
    isValid: true, // Assume valid unless we have proper contrast calculation
    issues,
    recommendations,
  };
}

/**
 * Validates component for kid-friendly design principles
 */
export function validateKidFriendlyDesign(component: {
  hasLargeText: boolean;
  hasSimpleLanguage: boolean;
  hasVisualFeedback: boolean;
  hasHapticFeedback?: boolean;
  usesColorCoding: boolean;
}): {
  score: number;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 0;

  if (component.hasLargeText) {
    score += 20;
  } else {
    issues.push('Text may be too small for children');
    recommendations.push('Use larger font sizes (16pt+ for body text)');
  }

  if (component.hasSimpleLanguage) {
    score += 20;
  } else {
    recommendations.push(
      'Use simple, clear language appropriate for age group'
    );
  }

  if (component.hasVisualFeedback) {
    score += 20;
  } else {
    issues.push('Missing visual feedback for interactions');
    recommendations.push('Add pressed states, animations, or color changes');
  }

  if (component.hasHapticFeedback) {
    score += 20;
  } else {
    recommendations.push('Consider adding haptic feedback for success actions');
  }

  if (component.usesColorCoding) {
    score += 20;
  } else {
    recommendations.push('Use colors consistently to reinforce meanings');
  }

  return { score, issues, recommendations };
}

/**
 * Validates accessibility compliance for interactive components
 */
export function validateAccessibilityCompliance(component: {
  hasAccessibilityLabel: boolean;
  hasAccessibilityHint: boolean;
  hasSemanticRole: boolean;
  hasKeyboardNavigation?: boolean;
  hasScreenReaderSupport: boolean;
}): {
  score: number;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 0;

  if (component.hasAccessibilityLabel) {
    score += 25;
  } else {
    issues.push('Missing accessibility label');
    recommendations.push('Add descriptive accessibilityLabel');
  }

  if (component.hasAccessibilityHint) {
    score += 20;
  } else {
    recommendations.push('Add accessibility hints for complex interactions');
  }

  if (component.hasSemanticRole) {
    score += 25;
  } else {
    issues.push('Missing semantic role');
    recommendations.push('Specify accessibilityRole (button, header, etc.)');
  }

  if (component.hasScreenReaderSupport) {
    score += 30;
  } else {
    issues.push('Not optimized for screen readers');
    recommendations.push('Test with VoiceOver/TalkBack');
  }

  return { score, issues, recommendations };
}

/**
 * Validates loading states and user feedback
 */
export function validateUserFeedback(component: {
  hasLoadingStates: boolean;
  hasErrorStates: boolean;
  hasSuccessStates: boolean;
  hasProgressIndicators: boolean;
}): {
  score: number;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 0;

  if (component.hasLoadingStates) {
    score += 25;
  } else {
    issues.push('Missing loading states');
    recommendations.push('Show spinners or skeleton screens during loading');
  }

  if (component.hasErrorStates) {
    score += 25;
  } else {
    issues.push('Missing error handling UI');
    recommendations.push('Display user-friendly error messages');
  }

  if (component.hasSuccessStates) {
    score += 25;
  } else {
    recommendations.push('Add positive feedback for completed actions');
  }

  if (component.hasProgressIndicators) {
    score += 25;
  } else {
    recommendations.push('Show progress for multi-step processes');
  }

  return { score, issues, recommendations };
}

/**
 * Comprehensive UI/UX audit
 */
export function auditComponent(
  componentName: string,
  checks: {
    touchTargets?: { width: number; height: number }[];
    colors?: { foreground: string; background: string }[];
    kidFriendly?: Parameters<typeof validateKidFriendlyDesign>[0];
    accessibility?: Parameters<typeof validateAccessibilityCompliance>[0];
    userFeedback?: Parameters<typeof validateUserFeedback>[0];
  }
): {
  overallScore: number;
  criticalIssues: string[];
  recommendations: string[];
  detailedResults: Record<string, unknown>;
} {
  const results: Record<string, unknown> = {};
  const allIssues: string[] = [];
  const allRecommendations: string[] = [];
  const scores: number[] = [];

  // Touch target validation
  if (checks.touchTargets) {
    checks.touchTargets.forEach((target, index) => {
      const result = validateTouchTarget(target.width, target.height);
      results[`touchTarget${index}`] = result;
      allIssues.push(...result.issues);
      allRecommendations.push(...result.recommendations);
      scores.push(result.isValid ? 100 : 60);
    });
  }

  // Color contrast validation
  if (checks.colors) {
    checks.colors.forEach((colorPair, index) => {
      const result = validateColorContrast(
        colorPair.foreground,
        colorPair.background
      );
      results[`colorContrast${index}`] = result;
      allIssues.push(...result.issues);
      allRecommendations.push(...result.recommendations);
      scores.push(result.isValid ? 100 : 70);
    });
  }

  // Kid-friendly design validation
  if (checks.kidFriendly) {
    const result = validateKidFriendlyDesign(checks.kidFriendly);
    results.kidFriendly = result;
    allIssues.push(...result.issues);
    allRecommendations.push(...result.recommendations);
    scores.push(result.score);
  }

  // Accessibility validation
  if (checks.accessibility) {
    const result = validateAccessibilityCompliance(checks.accessibility);
    results.accessibility = result;
    allIssues.push(...result.issues);
    allRecommendations.push(...result.recommendations);
    scores.push(result.score);
  }

  // User feedback validation
  if (checks.userFeedback) {
    const result = validateUserFeedback(checks.userFeedback);
    results.userFeedback = result;
    allIssues.push(...result.issues);
    allRecommendations.push(...result.recommendations);
    scores.push(result.score);
  }

  const overallScore =
    scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;
  const criticalIssues = allIssues.filter(
    (issue) =>
      issue.includes('missing') ||
      issue.includes('below') ||
      issue.includes('not optimized')
  );

  return {
    overallScore,
    criticalIssues,
    recommendations: [...new Set(allRecommendations)], // Remove duplicates
    detailedResults: results,
  };
}
