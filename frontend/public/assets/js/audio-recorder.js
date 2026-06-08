class AudioRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.stream = null;
    this.isRecording = false;
    this.startTime = null;
    this.timerInterval = null;
    this.onStateChange = null;
    this.onTimerUpdate = null;
    this.onError = null;
  }

  async initialize() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      this.mediaRecorder = new MediaRecorder(this.stream, { mimeType });
      this.setupEventListeners();
      return true;
    } catch (error) {
      if (this.onError) this.onError('Microphone non accessible');
      return false;
    }
  }

  setupEventListeners() {
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) this.audioChunks.push(event.data);
    };
    this.mediaRecorder.onstop = () => {
      const audioBlob = new Blob(this.audioChunks, { type: this.mediaRecorder.mimeType });
      if (this.onStateChange) {
        this.onStateChange({
          blob: audioBlob,
          duration: this.getDuration(),
          size: audioBlob.size,
          mimeType: this.mediaRecorder.mimeType
        });
      }
      this.stopTimer();
    };
  }

  async startRecording() {
    if (!this.mediaRecorder) await this.initialize();
    this.audioChunks = [];
    this.startTime = Date.now();
    this.mediaRecorder.start(1000);
    this.isRecording = true;
    this.startTimer();
    if (this.onStateChange) this.onStateChange({ recording: true });
    return true;
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      this.stream.getTracks().forEach(track => track.stop());
    }
  }

  cancelRecording() {
    this.stopRecording();
    this.audioChunks = [];
    this.stopTimer();
    if (this.onStateChange) this.onStateChange({ cancelled: true });
  }

  getDuration() {
    if (!this.startTime) return 0;
    return Math.round((Date.now() - this.startTime) / 1000);
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.onTimerUpdate) this.onTimerUpdate(this.getDuration());
    }, 100);
  }

  stopTimer() {
    clearInterval(this.timerInterval);
  }
}
window.AudioRecorder = AudioRecorder;