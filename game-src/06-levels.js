  // ========== УРОВНИ ==========
  function buildLevel(level, skipReset = false) {
    map = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    fog = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    objects = [];
    if (!skipReset) {
      keys = [false, false, false];
      flags = {};
      // inventory НЕ сбрасываем при смене уровня — монеты и подсказки переносятся
    }
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (x === 0 || y === 0 || x === COLS - 1 || y === ROWS - 1) map[y][x] = 1;
      }
    }
    if (level === 1) buildLevel1();
    else if (level === 2) buildLevel2();
    else if (level === 3) buildLevel3();
    else if (level === 4) buildLevel4();
    else buildLevel5();
    updateKeysUI();
    updateLevelName();
  }

  /** Общий каркас: опушка + стены-комната + 3 сундука + финальные ворота */
  function buildSimpleArena(opts) {
    const { trees, water, walls, start, chests, gate, extras } = opts;
    (trees || []).forEach(([x, y]) => { if (map[y]) map[y][x] = 2; });
    (water || []).forEach(([x, y]) => { if (map[y]) map[y][x] = 3; });
    (walls || []).forEach(([x, y]) => { if (map[y]) map[y][x] = 1; });
    player = { x: start[0], y: start[1] };
    map[start[1]][start[0]] = 0;

    chests.forEach((c, i) => {
      const type = `lx_chest${i + 1}`;
      objects.push({ x: c.x, y: c.y, type, title: c.title, text: c.text, chestIndex: i, mapX: c.x, mapY: c.y });
      map[c.y][c.x] = keys[i] ? 5 : 4;
    });
    if (gate) {
      map[gate.y][gate.x] = flags.lxGatesOpen ? 9 : 8;
      objects.push({ x: gate.x, y: gate.y, type: "lx_gates", title: gate.title, text: gate.text, mapX: gate.x, mapY: gate.y });
    }
    (extras || []).forEach(o => objects.push(o));
  }

  function buildLevel1() {
    // Три двора крепости с запада на восток:
    // Двор 1 (загадка) → дверь 1 → Двор 2 (призрак) → дверь 2 → Двор 3 (порядок ключей) → врата
    // Стены нельзя обойти — только через двери.

    const trees = [
      [2,2],[3,2],[2,3],[2,5],[2,7],[2,9],[2,11],[2,13],[2,15],
      [27,2],[28,2],[28,4],[28,6],[28,8],[28,10],[28,12],[28,14],[28,16],
      [5,2],[8,2],[11,2],[14,2],[17,2],[20,2],[23,2],[25,2],
      [5,16],[8,16],[11,16],[14,16],[17,16],[20,16],[23,16],[25,16]
    ];
    trees.forEach(([x, y]) => { if (map[y]) map[y][x] = 2; });

    // Внешние стены
    for (let x = 3; x <= 26; x++) { map[3][x] = 1; map[15][x] = 1; }
    for (let y = 3; y <= 15; y++) { map[y][3] = 1; map[y][26] = 1; }

    // Перегородки дворов
    for (let y = 3; y <= 15; y++) { map[y][10] = 1; map[y][18] = 1; }
    map[9][10] = flags.door1Open ? 7 : 6;
    map[9][18] = flags.door2Open ? 7 : 6;

    // Вход с юга во двор 1
    map[15][6] = 0;
    map[16][6] = 0;

    // Ворота на севере двора 3
    map[3][22] = flags.gatesOpen ? 9 : 8;

    // --- ДВОР 1: загадка (ответ: тень) ---
    objects.push({
      x: 5, y: 12, type: "sign", title: "Камень у тропы",
      text: "На камне выбито:\n«Днём меня нет, ночью я длиннее дерева.\nЯ бегу за тобой, но никогда не догоню.»"
    });
    objects.push({
      x: 8, y: 11, type: "sign", title: "Обломок таблички",
      text: "«…где свет падает — там и ищи ответ.\nБез солнца я пропадаю.»"
    });
    objects.push({
      x: 6, y: 7, type: "sign", title: "Царапины на стене",
      text: "Чьи-то ногти оставили:\n«НЕ СВЕТ. НЕ ТЬМА. ТО, ЧТО МЕЖДУ.»"
    });
    objects.push({
      x: 7, y: 9, type: "chest1", title: "Сундук первого двора",
      text: "На крышке:\n«Что всегда рядом, но нельзя схватить?\nОтвет — одно слово.»"
    });
    map[9][7] = keys[0] ? 5 : 4;

    objects.push({
      x: 10, y: 9, type: "door_tower", title: "Дверь первого двора",
      text: "Дубовая дверь. Нужен ключ из первого сундука."
    });

    // --- ДВОР 2: призрак рядом с сундуком ---
    objects.push({
      x: 13, y: 8, type: "ghost", title: "Призрак Эдрика",
      text: "Холод. Силуэт смотрителя стоит у сундука."
    });
    objects.push({
      x: 14, y: 9, type: "chest2", title: "Сундук второго двора",
      text: "Замок без надписи. Ответ знает лишь тот, кто уже не жив."
    });
    map[9][14] = keys[1] ? 5 : 4;
    objects.push({
      x: 18, y: 9, type: "door_camp", title: "Дверь второго двора",
      text: "Серебряный замок. Нужен ключ из второго сундука."
    });
    if (!flags.coin_l1_a) {
      objects.push({ x: 12, y: 12, type: "coin", id: "coin_l1_a", amount: 2, title: "Монеты", text: "Монеты у стены." });
    }

    // --- ДВОР 3: порядок ключей ---
    objects.push({
      x: 21, y: 12, type: "note", title: "Третья подсказка",
      text: "Пергамент на столбе:\n\n«Три ключа — три части дерева.\nСначала КОРЕНЬ.\nПотом СТВОЛ.\nПотом КРОНА.\n\nВставь их в замки сундука в этом порядке.»",
      loreId: "lore_order",
      loreTitle: "Порядок ключей",
      loreText: "Корень → Ствол → Крона."
    });
    objects.push({
      x: 22, y: 9, type: "chest3", title: "Сундук третьего двора",
      text: "Три скважины. Над ними: Корень · Ствол · Крона."
    });
    map[9][22] = keys[2] ? 5 : 4;
    objects.push({
      x: 22, y: 3, type: "gates", title: "Ворота Эвермора",
      text: "Северные врата. Три ключа дворов откроют путь дальше."
    });
    if (!flags.coin_l1_b) {
      objects.push({ x: 24, y: 11, type: "coin", id: "coin_l1_b", amount: 2, title: "Монеты", text: "Монеты в углу." });
    }

    objects.push({
      x: 5, y: 14, type: "trader",
      title: "Странствующий торговец",
      text: "«Крепость старая. Стены здесь не для красоты.\nСмотри на камни с знаком — они помнят больше, чем люди.»"
    });

    player = { x: 6, y: 14 };
  }

  function buildLevel2() {
    const walls = [
      ...Array.from({ length: 15 }, (_, i) => [8 + i, 4]),
      ...Array.from({ length: 15 }, (_, i) => [8 + i, 14]),
      ...Array.from({ length: 11 }, (_, i) => [8, 4 + i]),
      ...Array.from({ length: 11 }, (_, i) => [22, 4 + i]),
      [11, 7], [11, 11], [15, 7], [15, 11], [19, 7], [19, 11]
    ];
    walls.forEach(([x, y]) => { if (map[y]) map[y][x] = 1; });
    map[4][15] = 0; map[14][15] = 0; map[9][8] = 0; map[9][22] = 0;

    const trees = [
      [2,2],[3,3],[2,5],[3,7],[2,9],[4,11],[2,13],[3,15],[2,16],
      [27,2],[28,3],[26,5],[28,7],[27,9],[28,11],[26,13],[28,15],[27,16],
      [5,2],[7,2],[25,2],[12,2],[18,2],[5,16],[10,16],[20,16],[25,16]
    ];
    trees.forEach(([x, y]) => { if (map[y]) map[y][x] = 2; });

    map[6][12] = 3; map[6][13] = 3; map[7][12] = 3;
    map[12][17] = 3; map[12][18] = 3; map[13][17] = 3;
    map[9][15] = 14;
    map[7][12] = 13; map[7][15] = 13; map[7][18] = 13;

    objects.push({ x: 15, y: 5, type: "l2_chest1", title: "Древний сундук", text: "Руны на крышке пульсируют в такт твоему дыханию. Будто сундук тебя узнал." });
    map[5][15] = 4;
    if (!flags.coin_l2_1) {
      objects.push({ x: 12, y: 8, type: "coin", id: "coin_l2_1", amount: 2, title: "Монеты", text: "Две монеты у колонны." });
    }
    if (!flags.coin_l2_2) {
      objects.push({ x: 20, y: 10, type: "coin", id: "coin_l2_2", amount: 2, title: "Монеты", text: "Монеты в трещине пола." });
    }
    if (!flags.item_amulet) {
      objects.push({
        x: 17, y: 8, type: "item", id: "item_amulet",
        itemName: "Изумрудный амулет", itemIcon: "🟢",
        itemDesc: "Камень бьётся, как второе сердце.",
        title: "Амулет",
        text: "Камень тёплый. На оборотной стороне — крохотная надпись:\n«Носи, пока алтарь молчит. Отдай, когда заговорит.»"
      });
    }
    objects.push({ x: 11, y: 9, type: "l2_chest2", title: "Сундук стража", text: "На полу — круг из пепла. Надписи лгут все до одной. Страж верил только в проверку." });
    map[9][11] = 4;
    objects.push({ x: 19, y: 12, type: "l2_chest3", title: "Сундук жреца", text: "Замок без замочной скважины. Лишь вопрос, высеченный мелко: сколько лиц у света?" });
    map[12][19] = 4;
    objects.push({
      x: 15, y: 9, type: "altar", title: "Алтарь зелёного света",
      text: "Камень покрыт мхом, но углубления чисты — будто их касались вчера.\n\nТри гнезда: Лес. Свет. Врата.\n\nОт алтаря тянется едва слышный гул — как имя, которое ты почти вспоминаешь."
    });
    objects.push({ x: 12, y: 7, type: "rune", title: "Постамент «Лес»", text: "Пустой постамент. Воздух пахнет хвоей и дождём." });
    objects.push({ x: 15, y: 7, type: "rune", title: "Постамент «Свет»", text: "В камне дрожит бледная искра." });
    objects.push({ x: 18, y: 7, type: "rune", title: "Постамент «Врата»", text: "На грани высечено: «Не открывай из любопытства. Открывай из необходимости.»" });
    objects.push({
      x: 10, y: 5, type: "sign", title: "Каменная табличка",
      text: "«Три руны — три ключа.\nСобери их и пробуди алтарь.\n\nТогда Эвермор перестанет притворяться сном\nи покажет, чем он был — и чем станет.»",
      loreId: "lore_tablet",
      loreTitle: "Табличка руин",
      loreText: "Три руны будят алтарь. Тогда Эвермор перестанет быть сном."
    });
    map[14][15] = 8;
    objects.push({
      x: 15, y: 14, type: "l2_gates", title: "Врата глубин",
      text: "Тьма за ними не пустая — она ждёт.\nСквозь щель видно мерцание, будто кто-то держит свечу очень далеко внизу."
    });

    objects.push({
      x: 9, y: 12, type: "trader",
      title: "Торговец руин",
      text: "Капюшон. Голос — как шорох страниц.\n\n«Здесь торговали не золотом, а обещаниями.\nЯ беру монеты — привычка живых.\nА даю то, что помогает не забыть, зачем ты вошёл.»"
    });

    // Призрак у алтаря (продолжение)
    objects.push({
      x: 16, y: 10, type: "ghost",
      title: "Призрак у алтаря",
      text: "Тот же силуэт. Теперь он яснее — будто свет алтаря удерживает его форму."
    });

    if (!flags.coin_l2_3) {
      objects.push({ x: 18, y: 5, type: "coin", id: "coin_l2_3", amount: 3, title: "Горсть монет", text: "Монеты в нише стены." });
    }
    if (!flags.item_crystal) {
      objects.push({
        x: 13, y: 12, type: "item", id: "item_crystal",
        itemName: "Осколок кристалла", itemIcon: "💎",
        itemDesc: "Слабо пульсирует зелёным.",
        title: "Кристалл", text: "Осколок кристалла в пыли."
      });
    }
    if (!flags.item_keyring) {
      objects.push({
        x: 21, y: 8, type: "item", id: "item_keyring",
        itemName: "Связка ключей", itemIcon: "🗝️",
        itemDesc: "Старые ключи. Для дверей Эвермора уже не подходят.",
        title: "Ключи", text: "Ржавая связка ключей."
      });
    }

    player = { x: 15, y: 3 };
    map[3][15] = 0; map[2][15] = 0;
  }

  // ----- Уровень 3: Шепчущие коридоры -----
  function buildLevel3() {
    const walls = [];
    for (let x = 5; x <= 24; x++) { walls.push([x, 4]); walls.push([x, 14]); }
    for (let y = 4; y <= 14; y++) { walls.push([5, y]); walls.push([24, y]); }
    // внутренние коридоры
    for (let y = 6; y <= 12; y++) { walls.push([10, y]); walls.push([15, y]); walls.push([19, y]); }
    // проходы (НЕ трогаем клетку ворот 14,4)
    const open = [[10,9],[15,7],[15,11],[19,9],[5,9],[24,9],[14,14]];
    buildSimpleArena({
      trees: [[2,2],[3,3],[27,2],[26,3],[2,15],[27,15],[8,2],[20,2]],
      walls,
      start: [14, 15],
      chests: [
        { x: 7, y: 7, title: "Сундук эха", text: "Шёпот повторяет числа задом наперёд…" },
        { x: 12, y: 11, title: "Сундук тени", text: "На крышке три силуэта. Один из них — ложь." },
        { x: 21, y: 8, title: "Сундук имени", text: "Замок спрашивает: сколько букв в слове «ЭВЕРМОР»?" }
      ],
      gate: { x: 14, y: 4, title: "Арочные врата", text: "За ними — запах соли и старого железа. Три ключа коридоров…" },
      extras: [
        { x: 8, y: 9, type: "sign", title: "Надпись на стене", text: "«Здесь лес стал камнем. Камень — памятью.\nНе верь первому эху. Верь тому, что остаётся, когда эхо замолкает.»", loreId: "lore_l3", loreTitle: "Коридоры", loreText: "Лес стал камнем. Не верь первому эху." },
        { x: 17, y: 9, type: "ghost", title: "Эдрик", text: "Голос тоньше, чем прежде.\n«Коридоры — это корни, вывернутые наизнанку. Пройди их, и глубина примет тебя.»" },
        ...(!flags.coin_l3_1 ? [{ x: 7, y: 11, type: "coin", id: "coin_l3_1", amount: 2, title: "Монеты", text: "Монеты в пыли коридора." }] : []),
        ...(!flags.coin_l3_2 ? [{ x: 21, y: 11, type: "coin", id: "coin_l3_2", amount: 2, title: "Монеты", text: "Ещё немного золота." }] : [])
      ]
    });
    // открыть проходы в стенах
    open.forEach(([x, y]) => { map[y][x] = 0; });
    map[15][14] = 0; map[16][14] = 0;
    // восстановить ворота (на случай если что-то затёрло)
    map[4][14] = flags.lxGatesOpen ? 9 : 8;
    player = { x: 14, y: 15 };
  }

  // ----- Уровень 4: Соляные берега -----
  function buildLevel4() {
    const walls = [];
    for (let x = 6; x <= 22; x++) { walls.push([x, 3]); walls.push([x, 15]); }
    for (let y = 3; y <= 15; y++) { walls.push([6, y]); walls.push([22, y]); }
    walls.push([12, 8], [12, 9], [12, 10], [16, 6], [16, 7], [16, 11], [16, 12]);
    const water = [];
    for (let x = 8; x <= 11; x++) for (let y = 12; y <= 13; y++) water.push([x, y]);
    for (let x = 17; x <= 20; x++) for (let y = 5; y <= 6; y++) water.push([x, y]);
    buildSimpleArena({
      trees: [[2,8],[3,10],[27,7],[26,12],[4,4],[25,14]],
      walls, water,
      start: [14, 14],
      chests: [
        { x: 9, y: 7, title: "Сундук прилива", text: "Волны шепчут ряд: 1, 1, 2, 3, 5, ?" },
        { x: 18, y: 10, title: "Сундук якоря", text: "Три якоря. Все надписи лживы. Где правда?" },
        { x: 14, y: 6, title: "Сундук горизонта", text: "Сколько сторон у горизонта, если стоять на берегу Эвермора?" }
      ],
      gate: { x: 14, y: 3, title: "Морские врата", text: "Соль на губах. За вратами — гул, похожий на сердцебиение города." },
      extras: [
        { x: 10, y: 10, type: "sign", title: "Обломок таблички", text: "«Когда лес ушёл в камень, часть корней ушла в море.\nТам спит Второй Свет — не зелёный, а бледно-синий.»", loreId: "lore_l4", loreTitle: "Соляные берега", loreText: "Второй Свет спит в море — бледно-синий." },
        { x: 19, y: 12, type: "ghost", title: "Эдрик", text: "«Дальше — не руины. Дальше — то, что мы пытались забыть.\nЕсли услышишь своё имя в прибое… ответь. Или уйди.»" },
        ...(!flags.coin_l4_1 ? [{ x: 8, y: 9, type: "coin", id: "coin_l4_1", amount: 3, title: "Монеты", text: "Монеты в песке." }] : []),
        ...(!flags.item_shell ? [{ x: 20, y: 9, type: "item", id: "item_shell", itemName: "Раковина", itemIcon: "🐚", itemDesc: "Внутри слышен далёкий гул.", title: "Раковина", text: "Раковина. Если приложить к уху — будто кто-то зовёт по имени." }] : [])
      ]
    });
    map[8][12] = 0; map[10][12] = 0; map[9][16] = 0; map[14][16] = 0;
    map[14][14] = 0; map[15][14] = 0;
    map[3][14] = flags.lxGatesOpen ? 9 : 8;
    player = { x: 14, y: 14 };
  }

  // ----- Уровень 5: Сердце Эвермора -----
  function buildLevel5() {
    const walls = [];
    for (let x = 8; x <= 21; x++) { walls.push([x, 5]); walls.push([x, 13]); }
    for (let y = 5; y <= 13; y++) { walls.push([8, y]); walls.push([21, y]); }
    // колонны
    [[11,8],[11,10],[18,8],[18,10],[14,7],[15,7]].forEach(p => walls.push(p));
    buildSimpleArena({
      trees: [[3,3],[4,4],[25,3],[26,4],[3,15],[26,15]],
      walls,
      start: [14, 15],
      chests: [
        { x: 10, y: 9, title: "Сундук корня", text: "Что было первым: лес, свет или врата?" },
        { x: 19, y: 9, title: "Сундук клятвы", text: "Эдрик просил об одном. О чём?" },
        { x: 14, y: 11, title: "Сундук имени", text: "Введи то, что лес обещал — не место, а…" }
      ],
      gate: { x: 14, y: 5, title: "Последние врата", text: "За ними — зелёный и синий свет вместе.\nТри ключа Сердца. Один выбор." },
      extras: [
        { x: 14, y: 9, type: "sign", title: "Алтарь Сердца", text: "Камень бьётся. На нём одна фраза:\n\n«Эвермор — не место. Эвермор — обещание.\nИсполни его или отпусти навсегда.»", loreId: "lore_l5", loreTitle: "Сердце", loreText: "Эвермор — обещание. Исполнить или отпустить." },
        { x: 16, y: 11, type: "ghost", title: "Эдрик", text: "Он почти прозрачен.\n«Это конец моей истории. Начало — твоей.\nСобери ключи. Открой врата. И не повтори мой страх.»" },
        ...(!flags.coin_l5_1 ? [{ x: 12, y: 11, type: "coin", id: "coin_l5_1", amount: 3, title: "Монеты", text: "Последние монеты пути." }] : [])
      ]
    });
    map[9][11] = 0; map[9][18] = 0; map[8][14] = 0; map[10][14] = 0;
    map[13][14] = 0; map[14][14] = 0; map[15][14] = 0;
    map[5][14] = flags.lxGatesOpen ? 9 : 8;
    player = { x: 14, y: 15 };
  }

