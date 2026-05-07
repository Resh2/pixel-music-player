const state = {
    songs: [],
    currentIndex: 0,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 70,
    touchStart: 0,
    touchEnd: 0
};

const elements = {
    screen: document.getElementById('screen'),
    audioPlayer: document.getElementById('audioPlayer'),
    playBtn: document.getElementById('playBtn'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    progressBar: document.getElementById('progressBar'),
    volumeControl: document.getElementById('volumeControl'),
    volumePercent: document.getElementById('volumePercent'),
    fileInput: document.getElementById('fileInput'),
    playlistContainer: document.getElementById('playlistContainer'),
    playlistCount: document.getElementById('playlistCount'),
    themeToggle: document.getElementById('themeToggle')
};

const screenConfigs = [
    { bg: '#ffc0e8', char: '═══════════════\n█ ◉ ◉ █\n█ × × █\n═════════════════', timeColor: '#ff69d9' },
    { bg: '#d9f4ff', char: '╔════════╗\n║  ◉ ◉  ║\n║  × ×  ║\n╚════════╝', timeColor: '#5a9cca' },
    { bg: '#fff4c9', char: '┌─────────┐\n│ ◉───◉ │\n│ × · × │\n└─────────┘', timeColor: '#ffa500' },
    { bg: '#f0d9ff', char: '◉ ◉    ◉ ◉\n× ×    × ×', timeColor: '#c980d0' },
    { bg: '#dfffd9', char: '✧ ◉ ◉ ✧\n█ × × █', timeColor: '#5a8c5a' },
    { bg: '#ffe8d9', char: '◐◑━◐◑\n●─◉ ◉─●\n│ × × │', timeColor: '#ff69d9' },
    { bg: '#ffc9d9', char: '◉◉   ◉◉\n× ×═══× ×', timeColor: '#ff1493' },
    { bg: '#d9f4ff', char: '◑ Z z z\n◉ ◉\n× ×', timeColor: '#4da6ff' },
    { bg: '#e8d9ff', char: '┌──────┐\n│♪ ♪ ♪│\n│◉ ◉ │\n│× × │\n└──────┘', timeColor: '#8b5fbf' },
    { bg: '#fffacd', char: '╱╲\n◉ ◉\n═══\n× ×\n█ █', timeColor: '#ffa500' }
];

// Create soft scroll sound - lower pitch, one sound only
let lastScrollSoundTime = 0;
function playScrollSound() {
    const now = Date.now();
    // Only play sound once per 300ms to avoid multiple sounds
    if (now - lastScrollSoundTime < 300) return;
    lastScrollSoundTime = now;
    
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Softer, lower pitch (changed from 800 to 400)
        oscillator.frequency.value = 400;
        oscillator.type = 'sine'; // Changed to sine for softer sound
        
        // Much quieter (reduced from 0.3 to 0.1)
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
    } catch (e) {
        // Silent fail if audio context not available
    }
}

// Theme Toggle
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    elements.themeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Load theme preference
function loadTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
        document.body.classList.add('dark-mode');
        elements.themeToggle.textContent = '☀️';
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function updateScreen() {
    const currentSong = state.songs[state.currentIndex];
    if (!currentSong) {
        elements.screen.className = 'screen no-song';
        elements.screen.innerHTML = '<div style="font-size: 32px; margin-bottom: 12px;">♪ ♫ ♪</div><div style="color: #8ba3d9; font-size: 12px; font-weight: bold;">No song loaded</div><div style="color: #8ba3d9; font-size: 10px; margin-top: 8px;">Swipe to skip songs</div>';
        return;
    }

    const config = screenConfigs[state.currentIndex % 10];
    elements.screen.className = 'screen';
    elements.screen.style.background = config.bg;
    
    const trackInfo = state.songs.length > 1 ? `<div style="font-size: 11px; color: #2d3e50; margin-bottom: 4px;">Track ${state.currentIndex + 1} / ${state.songs.length}</div>` : '';
    
    elements.screen.innerHTML = `
        <div class="character">${config.char}</div>
        ${trackInfo}
        <div class="song-name">${currentSong.name}</div>
        <div class="time-display" style="color: ${config.timeColor};">⏱ ${formatTime(state.currentTime)} / ${formatTime(state.duration)}</div>
    `;
}

function updatePlaylist() {
    elements.playlistCount.textContent = state.songs.length;
    
    if (state.songs.length === 0) {
        elements.playlistContainer.innerHTML = '<div class="playlist-empty">No songs yet</div>';
        return;
    }

    elements.playlistContainer.innerHTML = state.songs.map((song, idx) => `
        <div class="playlist-item ${idx === state.currentIndex ? 'active' : ''}" onclick="playSong(${idx})">
            <span class="playlist-item-name">${idx + 1}. ${song.name}</span>
            <button class="playlist-item-remove" onclick="removeSong(event, ${idx})">✕</button>
        </div>
    `).join('');
}

function updateButtons() {
    const hasS = state.songs.length > 0;
    elements.playBtn.disabled = !hasS;
    elements.prevBtn.disabled = !hasS || state.currentIndex === 0;
    elements.nextBtn.disabled = !hasS || state.currentIndex === state.songs.length - 1;
    elements.playBtn.textContent = state.isPlaying ? '⏸ PAUSE' : '▶ PLAY';
}

function handleFileUpload(e) {
    const files = Array.from(e.target.files).slice(0, 10 - state.songs.length);
    files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const songId = Date.now() + Math.random();
            state.songs.push({
                id: songId,
                name: file.name.replace(/\.[^/.]+$/, ""),
                src: event.target.result
            });
            updatePlaylist();
            updateButtons();
        };
        reader.readAsDataURL(file);
    });
    e.target.value = '';
}

function togglePlayPause() {
    if (state.songs.length === 0) return;
    
    if (state.isPlaying) {
        elements.audioPlayer.pause();
        state.isPlaying = false;
    } else {
        elements.audioPlayer.play().catch(err => console.log('Play error:', err));
        state.isPlaying = true;
    }
    updateButtons();
}

function playSong(index) {
    state.currentIndex = index;
    const song = state.songs[index];
    elements.audioPlayer.src = song.src;
    
    playScrollSound();
    
    setTimeout(() => {
        elements.audioPlayer.play().catch(err => console.log('Play error:', err));
        state.isPlaying = true;
        updateButtons();
        updateScreen();
        updatePlaylist();
    }, 100);
}

function nextSong() {
    if (state.currentIndex < state.songs.length - 1) {
        playSong(state.currentIndex + 1);
    } else {
        state.isPlaying = false;
        updateButtons();
    }
}

function prevSong() {
    if (state.currentIndex > 0) {
        playSong(state.currentIndex - 1);
    }
}

function removeSong(e, idx) {
    e.stopPropagation();
    state.songs.splice(idx, 1);
    if (state.currentIndex >= state.songs.length && state.songs.length > 0) {
        state.currentIndex = Math.max(0, state.songs.length - 1);
    }
    updatePlaylist();
    updateButtons();
    updateScreen();
}

function handleTouchStart(e) {
    state.touchStart = e.targetTouches[0].clientX;
}

function handleTouchEnd(e) {
    state.touchEnd = e.changedTouches[0].clientX;
    handleSwipe();
}

function handleSwipe() {
    const distance = state.touchStart - state.touchEnd;
    if (distance > 50) {
        nextSong();
    } else if (distance < -50) {
        prevSong();
    }
}

// Event Listeners
elements.fileInput.addEventListener('change', handleFileUpload);
elements.playBtn.addEventListener('click', togglePlayPause);
elements.prevBtn.addEventListener('click', prevSong);
elements.nextBtn.addEventListener('click', nextSong);
elements.themeToggle.addEventListener('click', toggleTheme);

elements.progressBar.addEventListener('input', (e) => {
    const newTime = (e.target.value / 100) * state.duration;
    elements.audioPlayer.currentTime = newTime;
});

elements.volumeControl.addEventListener('input', (e) => {
    state.volume = e.target.value;
    elements.audioPlayer.volume = state.volume / 100;
    elements.volumePercent.textContent = state.volume;
});

elements.audioPlayer.addEventListener('timeupdate', () => {
    state.currentTime = elements.audioPlayer.currentTime;
    elements.progressBar.value = (state.currentTime / state.duration) * 100 || 0;
    updateScreen();
});

elements.audioPlayer.addEventListener('loadedmetadata', () => {
    state.duration = elements.audioPlayer.duration;
});

elements.audioPlayer.addEventListener('ended', () => {
    if (state.currentIndex < state.songs.length - 1) {
        // Auto-play next song
        nextSong();
    } else {
        // Stop at last song
        state.isPlaying = false;
        updateButtons();
    }
});

elements.screen.addEventListener('touchstart', handleTouchStart);
elements.screen.addEventListener('touchend', handleTouchEnd);

// Listen to playlist scroll and play sound
document.querySelector('.playlist').addEventListener('scroll', () => {
    playScrollSound();
});

// Initialize
loadTheme();
elements.audioPlayer.volume = state.volume / 100;
updateButtons();
updateScreen();
