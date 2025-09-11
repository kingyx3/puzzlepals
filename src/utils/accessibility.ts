// Accessibility utilities for consistent UX/UI practices

/**
 * Gets proper accessibility props for interactive elements
 */
export function getAccessibilityProps(options: {
  label: string;
  hint?: string;
  role?: 'button' | 'image' | 'text' | 'header' | 'link' | 'progressbar';
  value?: {
    min?: number;
    max?: number;
    now?: number;
  };
}) {
  return {
    accessible: true,
    accessibilityRole: options.role || 'button',
    accessibilityLabel: options.label,
    accessibilityHint: options.hint,
    accessibilityValue: options.value,
  };
}

/**
 * Generates kid-friendly accessibility labels for puzzle elements
 */
export function getPuzzleAccessibilityLabel(
  title: string,
  difficulty: string,
  completed?: boolean
): string {
  const status = completed ? 'completed' : 'available';
  return `${title} puzzle, ${difficulty} difficulty, ${status}`;
}

/**
 * Generates progress accessibility info
 */
export function getProgressAccessibility(current: number, total: number) {
  const percentage = Math.round((current / total) * 100);
  return {
    label: `Progress: ${current} out of ${total} pieces placed, ${percentage}% complete`,
    value: {
      min: 0,
      max: 100,
      now: percentage,
    },
  };
}

/**
 * Kid-friendly announcement for screen readers
 */
export function announceToScreenReader(
  message: string,
  priority: 'low' | 'high' = 'low'
) {
  // In a real app, this would use AccessibilityInfo.announceForAccessibility
  console.log(`[Accessibility Announcement - ${priority}]: ${message}`);
}

/**
 * Validates if touch target meets accessibility guidelines
 */
export function validateTouchTarget(width: number, height: number): boolean {
  const KID_FRIENDLY_TARGET = 48; // Enhanced for kids

  return width >= KID_FRIENDLY_TARGET && height >= KID_FRIENDLY_TARGET;
}

/**
 * Gets semantic description for puzzle piece
 */
export function getPieceDescription(
  pieceId: string,
  position: { row: number; col: number },
  isPlaced: boolean
): string {
  const location = `row ${position.row + 1}, column ${position.col + 1}`;
  const status = isPlaced ? 'correctly placed' : 'movable';
  return `Puzzle piece for ${location}, ${status}`;
}
