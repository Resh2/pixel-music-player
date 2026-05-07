# 🎵 Pixel Music Player

A retro-inspired, pixel-art styled music player with a nostalgic 8-bit aesthetic. Perfect for indie developers, music enthusiasts, and anyone who loves retro gaming vibes!

## Features

✨ **Retro Pixel Design** - Classic 8-bit inspired UI with colorful displays
🌙 **Dark Mode Toggle** - Switch between light and dark themes
🎵 **Local File Support** - Upload and play audio files directly from your device
📱 **Mobile Responsive** - Works seamlessly on desktop, tablet, and mobile devices
🔊 **Volume Control** - Adjust playback volume with visual feedback
⏱️ **Time Display** - Real-time track progress and duration
📋 **Playlist Management** - Manage up to 10 songs with add/remove functionality
👆 **Touch Gestures** - Swipe left/right to navigate between songs
🎨 **10 Unique Faces** - Different character faces for each track
🔊 **Soft Sound Effects** - Gentle beep sounds for UI interactions

## How to Use

1. **Open the Application**: Open `index.html` in your web browser
2. **Add Songs**: Click the "ADD SONGS" button and select audio files from your device
3. **Play Music**: Click the "PLAY" button or swipe on the player screen
4. **Navigate**: Use PREV/NEXT buttons or swipe left/right to change tracks
5. **Control Volume**: Adjust the volume slider to your preference
6. **Toggle Theme**: Click the moon/sun icon in the top-right corner to switch themes

## Supported Audio Formats

- MP3
- WAV
- OGG
- FLAC
- M4A
- And other formats supported by your browser

## Project Structure

```
pixel-music-player/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # Stylesheet
├── js/
│   └── player.js       # Player logic and functionality
├── README.md           # Project documentation
├── LICENSE             # MIT License
└── .gitignore          # Git ignore rules
```

## Browser Compatibility

- Chrome/Chromium 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile, Firefox Mobile)

## Features Breakdown

### Display
- Dynamic 10 unique pixel-art character faces
- Real-time time display
- Track number counter
- Visual progress bar

### Controls
- Play/Pause toggle
- Previous/Next navigation
- Swipe gestures for mobile
- Progress seeking
- Volume adjustment

### Themes
- Light mode with pastel colors
- Dark mode with contrasting colors
- Persistent theme preference (saved to browser storage)

### Playlist
- Add up to 10 songs
- Remove individual songs
- Click to play any song in the playlist
- Auto-advance to next song on completion
- Visual active track indicator

## Customization

You can easily customize:
- **Colors**: Edit CSS variables in `css/styles.css`
- **Faces**: Modify the `screenConfigs` array in `js/player.js`
- **Playlist Limit**: Change the `10` in file upload logic
- **Sounds**: Adjust sound parameters in the audio context code

## Local Development

No build process or dependencies required! Simply:
1. Clone the repository
2. Open `index.html` in your browser
3. Start using the player

## Known Limitations

- Maximum 10 songs per session (stored in memory)
- Playlist is cleared on page refresh
- Audio files must be less than browser memory limits
- Swipe gestures only on touch devices

## Future Enhancements

- [ ] Persistent storage using localStorage/IndexedDB
- [ ] Shuffle and repeat modes
- [ ] Playlist export/import
- [ ] Keyboard shortcuts
- [ ] Visualizer
- [ ] Lyrics display
- [ ] Drag-and-drop support

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Feel free to fork this project and submit pull requests for any improvements!

## Author

Created with 💜 for retro gaming enthusiasts and music lovers

---

Enjoy your pixel music! 🎮🎵
