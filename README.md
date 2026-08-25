# Тайны Эвермора / The Mysteries of Evermore

Атмосферная 2D браузерная приключенческая игра о забытом обещании, древних рунах и тайнах Эвермора.

- **Repository:** `niko009/evermore-mysteries`
- **Project / Docker:** `evermore-mysteries`
- **Site:** `https://evermore.bacus.dev`
- **Container:** `bacus-evermore-mysteries`
- **Current version:** `2026.08.25.01`

## Что уже есть

- 5 сюжетных уровней: Забытый лес, Руины зелёного света, Шепчущие коридоры, Соляные берега и Сердце Эвермора.
- Исследование карты с туманом войны.
- Загадки, ключи, двери, сундуки и финальные врата.
- Призрак Эдрика и сюжетные записи.
- Монеты, предметы, инвентарь, торговцы и подсказки.
- Автосохранение и продолжение игры через `localStorage`.
- Музыка и звуковые эффекты через Web Audio API.
- Desktop-управление и мобильный D-pad с кнопкой действия.
- PWA manifest, service worker и offline-cache.
- Версия приложения в интерфейсе и `/version.json`.
- Docker + Nginx, `/health` и подключение к внешней сети `bacus-net`.

## Управление

| Действие | Desktop | Mobile |
| --- | --- | --- |
| Движение | WASD / стрелки | D-pad |
| Взаимодействие | E | кнопка E |
| Инвентарь | I / 🎒 | 🎒 |
| Сохранить | 💾 | 💾 |
| Звук | 🔊 / 🔇 | 🔊 / 🔇 |

## Игровой исходник

Полный runtime-файл `game.js` хранится без потерь в `game-bundle/*.b64` как gzip+base64 bundle. Это сделано только для надёжной загрузки большого файла через GitHub-коннектор.

Для локального восстановления:

```bash
sh build-game.sh
```

После этого появится обычный `game.js`, который можно открыть и редактировать как обычно.

## Локальный запуск

```bash
sh build-game.sh
python3 -m http.server 8080
```

Открой `http://localhost:8080`.

## Production

```bash
docker compose up -d --build
```

Nginx внутри контейнера слушает порт `8080`. Во время Docker build полный `game.js` автоматически восстанавливается из `game-bundle`.

Health check:

```text
/health
```

Build metadata:

```text
/version.json
```

## Название

**Русский:** Тайны Эвермора  
**English:** The Mysteries of Evermore
