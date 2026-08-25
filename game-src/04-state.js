  // ========== СОСТОЯНИЕ ==========
  let currentLevel = 1;
  let map = [];
  let fog = [];
  let player = { x: 4, y: 14 };
  let lastMoveTime = 0;
  let keys = [false, false, false];
  let flags = {};
  let objects = [];
  let currentInteract = null;
  // Инвентарь
  let inventory = {
    coins: 0,
    hints: 0,
    items: [] // { id, name, icon, desc }
  };
  const HINT_COST_INV = 3;   // цена в инвентаре
  const HINT_COST_NPC = 2;   // цена у торговца
  const SHOP = {
    hint: { name: "Подсказка", cost: HINT_COST_NPC, desc: "Намёк к текущей цели" },
    map_fragment: { name: "Фрагмент карты", cost: 4, desc: "Открывает часть тумана навсегда", id: "shop_map" },
    lucky_charm: { name: "Амулет удачи", cost: 5, desc: "Следующая ошибка в загадке прощается", id: "shop_charm" }
  };
  let freeMistake = false; // от амулета удачи

