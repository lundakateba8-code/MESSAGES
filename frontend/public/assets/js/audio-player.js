class AudioPlayer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.audio = null;
    this.isPlaying = false;
    this.createPlayerUI();
  }

  createPlayerUI() {
    this.container.innerHTML = `
      <div class="audio-player">
        <div class="player-controls">
          <button class="play-btn" id="playBtn"><span class="play-icon">▶️</span></button>
          <div class="progress-container" id="progressContainer">
            <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
            <div class="time-display">
              <span id="currentTime">0:00</span> / <span id="totalTime">0:00</span>
            </div>
          </div>
          <div class="volume-control">
            <span>🔊</span>
            <input type="range" id="volumeSlider" min="0" max="100" value="75">
          </div>
          <div class="speed-control">
            <select id="speedSelect">
              <option value="0.5">0.5x</option>
              <option value="1" selected>1x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
            </select>
          </div>
          <button id="downloadBtn">💾</button>
        </div>
        <canvas id="waveform" width="600" height="60"></canvas>
      </div>
    `;
    this.attachEvents();
  }

  attachEvents() {
    this.container.querySelector('#playBtn').addEventListener('click', () => this.togglePlay());
    this.container.querySelector('#volumeSlider').addEventListener('input', (e) => this.audio && (this.audio.volume = e.target.value / 100));
    this.container.querySelector('#speedSelect').addEventListener('change', (e) => this.audio && (this.audio.playbackRate = parseFloat(e.target.value)));
    this.container.querySelector('#downloadBtn').addEventListener('click', () => this.download());
    this.container.querySelector('#progressContainer').addEventListener('click', (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      this.seek(percent);
    });
  }

  async loadAudio(url) {
    this.audio = new Audio(url);
    this.audio.addEventListener('loadedmetadata', () => this.updateTotalTime());
    this.audio.addEventListener('timeupdate', () => this.updateProgress());
    this.audio.addEventListener('ended', () => this.onEnded());
  }

  togglePlay() {
    if (!this.audio) return;
    const icon = this.container.querySelector('.play-icon');
    if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
      icon.textContent = '▶️';
    } else {
      this.audio.play();
      this.isPlaying = true;
      icon.textContent = '⏸️';
    }
  }

  onEnded() {
    this.isPlaying = false;
    this.container.querySelector('.play-icon').textContent = '▶️';
    this.container.querySelector('#progressFill').style.width = '0%';
    this.container.querySelector('#currentTime').textContent = '0:00';
  }

  seek(percent) {
    if (this.audio) this.audio.currentTime = percent * this.audio.duration;
  }

  updateProgress() {
    if (!this.audio || !this.audio.duration) return;
    const percent = (this.audio.currentTime / this.audio.duration) * 100;
    this.container.querySelector('#progressFill').style.width = `${percent}%`;
    this.container.querySelector('#currentTime').textContent = this.formatTime(this.audio.currentTime);
  }

  updateTotalTime(duration = null) {
    const display = this.container.querySelector('#totalTime');
    if (!display) return;
    let dur = duration || (this.audio && this.audio.duration) || 0;
    display.textContent = this.formatTime(dur);
  }

  formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  download() {
    if (this.audio) {
      const a = document.createElement('a');
      a.href = this.audio.src;
      a.download = 'message-vocal.mp3';
      a.click();
    }
  }

  destroy() {
    if (this.audio) { this.audio.pause(); this.audio = null; }
    this.isPlaying = false;
  }
}
window.AudioPlayer = AudioPlayer;