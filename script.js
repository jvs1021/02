// Array de Músicas com links públicos funcionais
const songs = [
    {
        title: "Brasil em Chamas",
        artist: "Fabio Brazza",
        cover: "Brasil em chamas.jpg",
        src: "Brasil em chamas.mp3"
    },
    {
        title: "As Flores e o Louco,",
        artist: "Fabio Brazza",
        cover: "As flores e o louco.jpg",
        src: "As flores e o louco.mp3"
    },
    {
        title: "Apesar de Você",
        artist: "Chico Buarque",
        cover: "Chico Buarque.jfif",
        src: "Apesar de voce.mp3"
    },
    {
        title: "João e Maria",
        artist: "Chico Buarque",
        cover: "João e Maria.jpg",
        src: "João e Maria.mp3"
    },
    {
        title: "Calice",
        artist: "Chico Buarque",
        cover: "Chico Buarque.jfif",
        src: "Calice.mp3"
    },
    {
        title: "Naquela Mesa",
        artist: "Nelson Gonçalves",
        cover: "Naquela Mesa.jpg",
        src: "Naquela Mesa.mp3"
    }
];

// Elementos do DOM
const audio = document.getElementById('audio-player');
const cover = document.getElementById('cover');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeBar = document.getElementById('volume-bar');
const muteBtn = document.getElementById('mute-btn');
const playlistEl = document.getElementById('playlist');

// Estados
let currentSongIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

// Inicialização
function loadSong(song) {
    title.innerText = song.title;
    artist.innerText = song.artist;
    cover.src = song.cover;
    audio.src = song.src;
    updatePlaylistHighlight();
}

function renderPlaylist() {
    playlistEl.innerHTML = '';
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.classList.add('playlist-item');
        if (index === currentSongIndex) li.classList.add('active');

        li.innerHTML = `
      <img src="${song.cover}" alt="Capa">
      <div class="playlist-item-info">
        <p class="playlist-item-title">${index + 1}. ${song.title}</p>
        <p class="playlist-item-artist">${song.artist}</p>
      </div>
    `;

        li.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(songs[currentSongIndex]);
            playSong();
        });

        playlistEl.appendChild(li);
    });
}

function updatePlaylistHighlight() {
    const items = document.querySelectorAll('.playlist-item');
    items.forEach((item, index) => {
        item.classList.toggle('active', index === currentSongIndex);
    });
}

// Reprodução
function playSong() {
    isPlaying = true;
    playBtn.innerText = '⏸';
    audio.play();
}

function pauseSong() {
    isPlaying = false;
    playBtn.innerText = '▶';
    audio.pause();
}

playBtn.addEventListener('click', () => {
    isPlaying ? pauseSong() : playSong();
});

// Navegação
function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(songs[currentSongIndex]);
    playSong();
}

function nextSong() {
    if (isShuffle) {
        currentSongIndex = Math.floor(Math.random() * songs.length);
    } else {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
    }
    loadSong(songs[currentSongIndex]);
    playSong();
}

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// Progresso e Duração
audio.addEventListener('timeupdate', (e) => {
    const { currentTime, duration } = e.srcElement;
    if (isNaN(duration)) return;

    const progressPercent = (currentTime / duration) * 100;
    progressBar.value = progressPercent;

    currentTimeEl.innerText = formatTime(currentTime);
    durationEl.innerText = formatTime(duration);
});

progressBar.addEventListener('input', (e) => {
    const seekTime = (e.target.value / 100) * audio.duration;
    audio.currentTime = seekTime;
});

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Fim da faixa
audio.addEventListener('ended', () => {
    if (isRepeat) {
        playSong();
    } else {
        nextSong();
    }
});

// Modos Aleatório e Repetir
shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);
});

repeatBtn.addEventListener('click', () => {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active', isRepeat);
});

// Volume
volumeBar.addEventListener('input', (e) => {
    audio.volume = e.target.value;
    muteBtn.innerText = audio.volume === 0 ? '🔇' : '🔊';
});

muteBtn.addEventListener('click', () => {
    if (audio.volume > 0) {
        audio.volume = 0;
        volumeBar.value = 0;
        muteBtn.innerText = '🔇';
    } else {
        audio.volume = 0.8;
        volumeBar.value = 0.8;
        muteBtn.innerText = '🔊';
    }
});

// Load Inicial
loadSong(songs[currentSongIndex]);
renderPlaylist();