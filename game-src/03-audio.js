  // ========== АУДИО (Web Audio API) ==========
  const AudioSys = (() => {
    let actx = null;
    let master = null;
    let musicGain = null;
    let sfxGain = null;
    let muted = false;
    let musicNodes = [];
    let musicPlaying = false;
    let melodyTimer = null;

    function ensure() {
      if (actx) return;
      actx = new (window.AudioContext || window.webkitAudioContext)();
      master = actx.createGain();
      master.gain.value = 0.7;
      master.connect(actx.destination);
      musicGain = actx.createGain();
      musicGain.gain.value = 0.22;
      musicGain.connect(master);
      sfxGain = actx.createGain();
      sfxGain.gain.value = 0.45;
      sfxGain.connect(master);
    }

    function resume() {
      ensure();
      if (actx.state === "suspended") actx.resume();
    }

    function tone(freq, dur, type = "triangle", vol = 0.3, dest = null) {
      ensure();
      resume();
      const o = actx.createOscillator();
      const g = actx.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.setValueAtTime(vol, actx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + dur);
      o.connect(g);
      g.connect(dest || sfxGain);
      o.start();
      o.stop(actx.currentTime + dur + 0.05);
    }

    function sfx(name) {
      if (muted) return;
      ensure();
      resume();
      switch (name) {
        case "step":
          tone(180 + Math.random() * 40, 0.06, "square", 0.08);
          break;
        case "chest":
          tone(320, 0.15, "triangle", 0.25);
          setTimeout(() => tone(480, 0.2, "triangle", 0.2), 80);
          break;
        case "key":
          tone(520, 0.12, "sine", 0.3);
          setTimeout(() => tone(780, 0.18, "sine", 0.25), 90);
          setTimeout(() => tone(1040, 0.25, "sine", 0.2), 180);
          break;
        case "door":
          tone(120, 0.25, "sawtooth", 0.15);
          setTimeout(() => tone(90, 0.3, "sawtooth", 0.12), 100);
          break;
        case "success":
          [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(f, 0.22, "triangle", 0.22), i * 90));
          break;
        case "error":
          tone(200, 0.15, "square", 0.2);
          setTimeout(() => tone(150, 0.2, "square", 0.15), 100);
          break;
        case "gate":
          tone(80, 0.4, "sawtooth", 0.2);
          setTimeout(() => tone(110, 0.5, "triangle", 0.18), 200);
          setTimeout(() => tone(160, 0.6, "sine", 0.15), 450);
          break;
        case "click":
          tone(600, 0.04, "square", 0.1);
          break;
        case "level":
          [392, 494, 587, 784].forEach((f, i) => setTimeout(() => tone(f, 0.3, "triangle", 0.2), i * 120));
          break;
      }
    }

    function startMusic() {
      if (muted || musicPlaying) return;
      ensure();
      resume();
      stopMusic();
      musicPlaying = true;

      const drone = actx.createOscillator();
      const droneG = actx.createGain();
      drone.type = "sine";
      drone.frequency.value = 110;
      droneG.gain.value = 0.12;
      drone.connect(droneG);
      droneG.connect(musicGain);
      drone.start();
      musicNodes.push(drone, droneG);

      const drone2 = actx.createOscillator();
      const drone2G = actx.createGain();
      drone2.type = "sine";
      drone2.frequency.value = 165;
      drone2G.gain.value = 0.07;
      drone2.connect(drone2G);
      drone2G.connect(musicGain);
      drone2.start();
      musicNodes.push(drone2, drone2G);

      const notes = [220, 247, 262, 294, 330, 349, 392, 440, 392, 349, 330, 294, 262, 247, 220, 196];
      const pattern = [0, 2, 4, 5, 4, 2, 0, 7, 5, 4, 2, 0, 2, 4, 5, 7];
      let step = 0;
      const tempo = 0.55;

      function playNote() {
        if (!musicPlaying || muted) return;
        const freq = notes[pattern[step % pattern.length]];
        const o = actx.createOscillator();
        const g = actx.createGain();
        o.type = "triangle";
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.0001, actx.currentTime);
        g.gain.linearRampToValueAtTime(0.14, actx.currentTime + 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + tempo * 0.9);
        o.connect(g);
        g.connect(musicGain);
        o.start();
        o.stop(actx.currentTime + tempo);
        step++;
        melodyTimer = setTimeout(playNote, tempo * 1000);
      }
      playNote();
    }

    function stopMusic() {
      musicPlaying = false;
      if (melodyTimer) clearTimeout(melodyTimer);
      musicNodes.forEach(n => {
        try { if (n.stop) n.stop(); } catch (_) {}
        try { if (n.disconnect) n.disconnect(); } catch (_) {}
      });
      musicNodes = [];
    }

    function toggleMute() {
      muted = !muted;
      if (master) master.gain.value = muted ? 0 : 0.7;
      btnMute.textContent = muted ? "🔇" : "🔊";
      btnMute.classList.toggle("muted", muted);
      if (!muted) {
        resume();
        if (!musicPlaying) startMusic();
      } else {
        stopMusic();
      }
    }

    return { sfx, startMusic, stopMusic, toggleMute, resume, ensure };
  })();

