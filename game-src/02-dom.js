  // ========== DOM ==========
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");
  const statusEl = document.getElementById("status");
  const levelNameEl = document.getElementById("level-name");
  const keyEls = [
    document.getElementById("key1"),
    document.getElementById("key2"),
    document.getElementById("key3")
  ];
  const interactModal = document.getElementById("interact-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalText = document.getElementById("modal-text");
  const modalArea = document.getElementById("modal-area");
  const modalAction = document.getElementById("modal-action");
  const modalClose = document.getElementById("modal-close");
  const modalFeedback = document.getElementById("modal-feedback");
  const endingModal = document.getElementById("ending-modal");
  const endingTitle = document.getElementById("ending-title");
  const endingSub = document.getElementById("ending-sub");
  const endingArt = document.getElementById("ending-art");
  const endingBody = document.getElementById("ending-body");
  const nextLevelBtn = document.getElementById("next-level-btn");
  const restartBtn = document.getElementById("restart-btn");
  const startModal = document.getElementById("start-modal");
  const startNewBtn = document.getElementById("start-new-btn");
  const startContinueBtn = document.getElementById("start-continue-btn");
  const saveInfo = document.getElementById("save-info");
  const btnMute = document.getElementById("btn-mute");
  const btnSave = document.getElementById("btn-save");
  const btnInv = document.getElementById("btn-inv");
  const invModal = document.getElementById("inv-modal");
  const invClose = document.getElementById("inv-close");
  const btnBuyHint = document.getElementById("btn-buy-hint");
  const btnUseHint = document.getElementById("btn-use-hint");
  const coinCountEl = document.getElementById("coin-count");
  const hintCountEl = document.getElementById("hint-count");
  const invItemsList = document.getElementById("inv-items-list");
  const hintResult = document.getElementById("hint-result");

