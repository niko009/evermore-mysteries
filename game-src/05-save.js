  // ========== СОХРАНЕНИЕ ==========
  function saveGame() {
    const data = {
      level: currentLevel,
      player: { ...player },
      keys: [...keys],
      flags: { ...flags },
      inventory: {
        coins: inventory.coins,
        hints: inventory.hints,
        items: inventory.items.map(i => ({ ...i }))
      },
      freeMistake: freeMistake,
      fog: fog.map(r => [...r]),
      map: map.map(r => [...r]),
      ts: Date.now()
    };
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
      statusEl.textContent = "Игра сохранена";
      setTimeout(updateStatus, 1200);
      AudioSys.sfx("click");
    } catch (e) {
      console.warn("Save failed", e);
    }
  }

  function loadGame() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      currentLevel = data.level || 1;
      player = data.player || { x: 4, y: 14 };
      keys = data.keys || [false, false, false];
      flags = data.flags || {};
      if (data.inventory) {
        inventory.coins = data.inventory.coins || 0;
        inventory.hints = data.inventory.hints || 0;
        inventory.items = data.inventory.items || [];
      }
      freeMistake = !!data.freeMistake;
      buildLevel(currentLevel, true);
      if (data.map) map = data.map;
      if (data.fog) fog = data.fog;
      applyFlagsToMap();
      updateKeysUI();
      updateInvUI();
      updateLevelName();
      revealAroundPlayer();
      updateStatus();
      draw();
      return true;
    } catch (e) {
      console.warn("Load failed", e);
      return false;
    }
  }

  function hasSave() {
    try { return !!localStorage.getItem(SAVE_KEY); } catch (_) { return false; }
  }

  function clearSave() {
    try { localStorage.removeItem(SAVE_KEY); } catch (_) {}
  }

  function applyFlagsToMap() {
    if (currentLevel === 1) {
      if (flags.door1Open) map[9][10] = 7;
      if (flags.door2Open) map[9][18] = 7;
      if (flags.gatesOpen) map[3][22] = 9;
      if (keys[0]) map[9][7] = 5;
      if (keys[1]) map[9][14] = 5;
      if (keys[2]) map[9][22] = 5;
    } else if (currentLevel === 2) {
      if (flags.altarActive) map[14][15] = 9;
      if (keys[0]) map[5][15] = 5;
      if (keys[1]) map[9][11] = 5;
      if (keys[2]) map[12][19] = 5;
    }
  }

