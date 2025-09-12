// SVG component for rendering jigsaw piece shapes

import React from 'react';
import { View, Image, ImageSourcePropType } from 'react-native';
import Svg, { Path, ClipPath, Defs, Image as SvgImage } from 'react-native-svg';
import { EdgeShape } from '../types';

interface JigsawPieceShapeProps {
  width: number;
  height: number;
  edges: EdgeShape;
  imageAsset: ImageSourcePropType;
  style?: object;
  // Add cropping parameters
  boardWidth?: number;
  boardHeight?: number;
  totalCols?: number;
  totalRows?: number;
  pieceCol?: number;
  pieceRow?: number;
}

export const JigsawPieceShape: React.FC<JigsawPieceShapeProps> = ({
  width,
  height,
  edges,
  imageAsset,
  style,
  boardWidth = 400,
  boardHeight = 400,
  totalCols = 2,
  totalRows = 2,
  pieceCol = 0,
  pieceRow = 0,
}) => {
  const clipPath = generateJigsawPath(width, height, edges);
  const clipId = `jigsaw-clip-${Math.random().toString(36).substr(2, 9)}`;

  // Calculate image cropping for jigsaw pieces
  const scaledImageWidth = boardWidth;
  const scaledImageHeight = boardHeight;
  const offsetX = -pieceCol * (boardWidth / totalCols);
  const offsetY = -pieceRow * (boardHeight / totalRows);

  // Get proper URI for the asset
  const getImageUri = () => {
    if (typeof imageAsset === 'number') {
      try {
        const resolvedAsset = Image.resolveAssetSource(imageAsset);
        return resolvedAsset.uri;
      } catch (e) {
        console.warn('Failed to resolve asset source:', e);
        return imageAsset.toString();
      }
    }
    return imageAsset;
  };

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
          href={getImageUri()}
          width={scaledImageWidth}
          height={scaledImageHeight}
          x={offsetX}
          y={offsetY}
          clipPath={`url(#${clipId})`}
        />

        {/* Optional: Add stroke outline */}
        <Path
          d={clipPath}
          fill="none"
          stroke="rgba(0,0,0,0.2)"
          strokeWidth="1"
        />
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
