// Geometry helper functions for puzzle calculations

import { Rectangle, Position } from '../types';

/**
 * Calculate if two rectangles intersect
 */
export function rectIntersects(rect1: Rectangle, rect2: Rectangle): boolean {
  return !(
    rect1.x + rect1.width < rect2.x ||
    rect2.x + rect2.width < rect1.x ||
    rect1.y + rect1.height < rect2.y ||
    rect2.y + rect2.height < rect1.y
  );
}

/**
 * Calculate distance between two points
 */
export function distance(point1: Position, point2: Position): number {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate the center point of a rectangle
 */
export function getRectCenter(rect: Rectangle): Position {
  return {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2,
  };
}

/**
 * Check if a point is within a rectangle
 */
export function pointInRect(point: Position, rect: Rectangle): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Clamp a position within bounds
 */
export function clampPosition(position: Position, bounds: Rectangle): Position {
  return {
    x: clamp(position.x, bounds.x, bounds.x + bounds.width),
    y: clamp(position.y, bounds.y, bounds.y + bounds.height),
  };
}

/**
 * Calculate the bounds that contain all rectangles
 */
export function getBoundingRect(rectangles: Rectangle[]): Rectangle {
  if (rectangles.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  let minX = rectangles[0].x;
  let minY = rectangles[0].y;
  let maxX = rectangles[0].x + rectangles[0].width;
  let maxY = rectangles[0].y + rectangles[0].height;

  for (let i = 1; i < rectangles.length; i++) {
    const rect = rectangles[i];
    minX = Math.min(minX, rect.x);
    minY = Math.min(minY, rect.y);
    maxX = Math.max(maxX, rect.x + rect.width);
    maxY = Math.max(maxY, rect.y + rect.height);
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}
