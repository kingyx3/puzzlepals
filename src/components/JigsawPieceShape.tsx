// SVG component for rendering jigsaw piece shapes

import React from 'react';
import { View, Image, ImageSourcePropType, Text, Platform } from 'react-native';
import Svg, { Path, ClipPath, Defs, Image as SvgImage } from 'react-native-svg';
import { EdgeShape } from '../types';

interface JigsawPieceShapeProps {
  width: number;
  height: number;
  edges: EdgeShape;
  imageAsset: number | ImageSourcePropType; // Accept both number and ImageSourcePropType
  style?: object;
  placed?: boolean; // Whether the piece is placed to conditionally remove borders
  // Add cropping parameters
  boardWidth?: number;
  boardHeight?: number;
  totalCols?: number;
  totalRows?: number;
  pieceCol?: number;
  pieceRow?: number;
  padding?: number; // Add padding parameter
}

export const JigsawPieceShape: React.FC<JigsawPieceShapeProps> = ({
  width,
  height,
  edges,
  imageAsset,
  style,
  placed = false,
  boardWidth = 400,
  boardHeight = 400,
  totalCols = 2,
  totalRows = 2,
  pieceCol = 0,
  pieceRow = 0,
  padding = 20, // Default padding matching createBoard
}) => {
  const [useFallback, setUseFallback] = React.useState(false);
  const clipPath = generateJigsawPath(width, height, edges);
  const clipId = `jigsaw-clip-${Math.random().toString(36).substr(2, 9)}`;

  // Calculate image cropping for jigsaw pieces (must match logic in computeTargetRects)
  const availableWidth = boardWidth - padding * 2;
  const availableHeight = boardHeight - padding * 2;
  const scaledImageWidth = availableWidth;
  const scaledImageHeight = availableHeight;
  const offsetX = -pieceCol * (availableWidth / totalCols);
  const offsetY = -pieceRow * (availableHeight / totalRows);

  // Get proper URI for the asset with better Android compatibility
  const getImageUri = () => {
    if (typeof imageAsset === 'number') {
      try {
        const resolvedAsset = Image.resolveAssetSource(imageAsset);
        if (resolvedAsset && resolvedAsset.uri) {
          console.log(`[JigsawPieceShape] Resolved asset URI: ${resolvedAsset.uri}`);
          return resolvedAsset.uri;
        } else {
          console.warn('[JigsawPieceShape] Failed to resolve asset source - no URI returned:', resolvedAsset);
          return null; // Return null to trigger fallback rendering
        }
      } catch (e) {
        console.error('[JigsawPieceShape] Failed to resolve asset source:', e);
        return null; // Return null to trigger fallback rendering
      }
    }
    
    // Handle object-type image sources
    if (typeof imageAsset === 'object' && imageAsset !== null) {
      if ('uri' in imageAsset) {
        console.log(`[JigsawPieceShape] Using object URI: ${imageAsset.uri}`);
        return imageAsset.uri;
      }
    }
    
    console.log(`[JigsawPieceShape] Using imageAsset directly: ${imageAsset}`);
    return imageAsset;
  };

  const imageUri = getImageUri();

  // If we can't get a proper URI, use fallback immediately
  // Also prioritize fallback on Android for carousel compatibility
  React.useEffect(() => {
    if (!imageUri) {
      console.warn('[JigsawPieceShape] No image URI available, using fallback rendering');
      setUseFallback(true);
    } else if (Platform.OS === 'android') {
      console.log('[JigsawPieceShape] Android detected, using fallback rendering for better compatibility');
      setUseFallback(true);
    }
  }, [imageUri]);

  // If we should use fallback rendering or can't get a proper URI
  if (!imageUri || useFallback) {
    return (
      <View style={[style, { overflow: 'hidden' }]}>
        {imageUri ? (
          // Use regular Image component as fallback - this works better on Android
          <View
            style={{
              width,
              height,
              borderRadius: 8,
              overflow: 'hidden',
              backgroundColor: '#f0f0f0',
            }}
          >
            <Image
              source={typeof imageAsset === 'number' ? imageAsset : typeof imageUri === 'string' ? { uri: imageUri } : imageUri}
              style={{
                width: scaledImageWidth,
                height: scaledImageHeight,
                position: 'absolute',
                left: offsetX,
                top: offsetY,
              }}
              resizeMode="cover"
              onError={(error) => {
                console.error('[JigsawPieceShape] Fallback Image failed to load:', error.nativeEvent.error);
              }}
              onLoad={() => {
                console.log('[JigsawPieceShape] Fallback Image loaded successfully');
              }}
            />
            {!placed && (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderWidth: 1,
                  borderColor: 'rgba(0,0,0,0.2)',
                  borderRadius: 8,
                }}
              />
            )}
          </View>
        ) : (
          // Final fallback - placeholder view
          <View
            style={{
              width,
              height,
              backgroundColor: 'rgba(200, 200, 200, 0.3)',
              borderRadius: 4,
              borderWidth: 2,
              borderColor: 'rgba(100, 100, 100, 0.5)',
              borderStyle: 'dashed',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 10, color: '#666' }}>IMG</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={style}>
      <Svg width={width} height={height}>
        <Defs>
          <ClipPath id={clipId}>
            <Path d={clipPath} />
          </ClipPath>
        </Defs>

        {/* Background image clipped to jigsaw shape */}
        <SvgImage
          href={imageUri}
          width={scaledImageWidth}
          height={scaledImageHeight}
          x={offsetX}
          y={offsetY}
          clipPath={`url(#${clipId})`}
        />

        {/* Optional: Add stroke outline only for unplaced pieces */}
        {!placed && (
          <Path
            d={clipPath}
            fill="none"
            stroke="rgba(0,0,0,0.2)"
            strokeWidth="1"
          />
        )}
      </Svg>
    </View>
  );
};

/**
 * Generate SVG path for jigsaw piece based on edge configuration
 */
function generateJigsawPath(
  width: number,
  height: number,
  edges: EdgeShape
): string {
  const knobSize = Math.min(width, height) * 0.15; // Size of jigsaw knobs
  const knobRadius = knobSize * 0.6;

  let path = '';

  // Start at top-left corner
  path += `M 0,0`;

  // Top edge
  if (edges.top === 'flat') {
    path += ` L ${width},0`;
  } else {
    const midX = width / 2;
    const knobY = edges.top === 'out' ? -knobSize : knobSize;

    path += ` L ${midX - knobRadius},0`;
    path += ` Q ${midX - knobRadius},${knobY} ${midX},${knobY}`;
    path += ` Q ${midX + knobRadius},${knobY} ${midX + knobRadius},0`;
    path += ` L ${width},0`;
  }

  // Right edge
  if (edges.right === 'flat') {
    path += ` L ${width},${height}`;
  } else {
    const midY = height / 2;
    const knobX = edges.right === 'out' ? width + knobSize : width - knobSize;

    path += ` L ${width},${midY - knobRadius}`;
    path += ` Q ${knobX},${midY - knobRadius} ${knobX},${midY}`;
    path += ` Q ${knobX},${midY + knobRadius} ${width},${midY + knobRadius}`;
    path += ` L ${width},${height}`;
  }

  // Bottom edge
  if (edges.bottom === 'flat') {
    path += ` L 0,${height}`;
  } else {
    const midX = width / 2;
    const knobY =
      edges.bottom === 'out' ? height + knobSize : height - knobSize;

    path += ` L ${midX + knobRadius},${height}`;
    path += ` Q ${midX + knobRadius},${knobY} ${midX},${knobY}`;
    path += ` Q ${midX - knobRadius},${knobY} ${midX - knobRadius},${height}`;
    path += ` L 0,${height}`;
  }

  // Left edge
  if (edges.left === 'flat') {
    path += ` L 0,0`;
  } else {
    const midY = height / 2;
    const knobX = edges.left === 'out' ? -knobSize : knobSize;

    path += ` L 0,${midY + knobRadius}`;
    path += ` Q ${knobX},${midY + knobRadius} ${knobX},${midY}`;
    path += ` Q ${knobX},${midY - knobRadius} 0,${midY - knobRadius}`;
    path += ` L 0,0`;
  }

  path += ' Z';

  return path;
}
