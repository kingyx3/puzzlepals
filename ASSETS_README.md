# PuzzlePals Assets Guide

## Current Asset Structure

The app now has a proper asset structure with organized puzzle images:

```
assets/
├── packs/
│   ├── animals/
│   │   ├── cover.jpg         # Pack cover image
│   │   ├── lion.jpg          # Lion puzzle image
│   │   ├── panda.jpg         # Panda puzzle image
│   │   ├── elephant.jpg      # Elephant puzzle image
│   │   └── eagle.jpg         # Eagle puzzle image
│   ├── vehicles/
│   │   ├── cover.jpg         # Pack cover image
│   │   ├── car.jpg           # Car puzzle image
│   │   └── airplane.jpg      # Airplane puzzle image
│   └── advanced/
│       ├── cover.jpg         # Pack cover image
│       ├── nature.jpg        # Nature puzzle image
│       ├── landscape.jpg     # Landscape puzzle image
│       ├── cityscape.jpg     # Cityscape puzzle image
│       ├── masterpiece.jpg   # Masterpiece puzzle image
│       └── ultimate.jpg      # Ultimate puzzle image
```

## Replacing Placeholder Assets

Currently, all images are using the same placeholder (adaptive-icon.png) copied to demonstrate the structure. To add proper kid-friendly puzzle images:

### Recommended Image Specifications

- **Format**: JPG or PNG
- **Resolution**: 512x512px minimum (square format works best)
- **Quality**: High resolution for clean puzzle pieces
- **Content**: Kid-friendly, colorful, and age-appropriate

### Where to Find Kid-Friendly Puzzle Images

1. **Free Sources**:
   - Unsplash Kids Collection
   - Pixabay (filter for photos suitable for children)
   - Pexels (nature, animals, vehicles)
   - Wikimedia Commons (educational images)

2. **Paid Sources**:
   - Shutterstock Kids
   - Getty Images Education
   - Adobe Stock (kid-friendly filter)

### Asset Guidelines

**Animals Pack**:
- **Lion**: Friendly cartoon or real lion image, bright and colorful
- **Panda**: Cute panda in natural setting or cartoon style
- **Elephant**: Family-friendly elephant image, preferably with baby elephant
- **Eagle**: Majestic eagle in flight or perched, clear details for puzzle pieces

**Vehicles Pack**:
- **Car**: Colorful, modern car suitable for children (bright colors preferred)
- **Airplane**: Commercial airplane or cartoon plane, clear against sky background

**Advanced Pack**:
- **Nature**: Beautiful landscape with flowers, trees, or garden scenes
- **Landscape**: Mountain, lake, or scenic countryside view
- **Cityscape**: Kid-friendly city view with colorful buildings
- **Masterpiece**: Famous artwork suitable for children (e.g., Van Gogh sunflowers)
- **Ultimate**: Complex but child-appropriate image (detailed castle, fantasy scene)

### Implementation

1. Download appropriate images following the guidelines above
2. Resize to at least 512x512px square
3. Replace the current placeholder files in the respective directories
4. Ensure file names match exactly (case-sensitive)
5. Test the app to verify images load correctly

### Testing

After replacing assets:
1. Run `npx expo start --web --offline`
2. Navigate to each puzzle pack
3. Verify cover images display correctly
4. Test individual puzzles to ensure pieces render properly
5. Check different difficulty levels (2x2, 3x3, 4x4, 6x6, etc.)

## Notes

- The current structure is fully functional and ready for real assets
- All code references are properly organized and modular
- Asset loading is optimized for React Native performance
- The placeholder system allows for easy testing of new images