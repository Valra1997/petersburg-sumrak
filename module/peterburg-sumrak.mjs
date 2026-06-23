import { SumrakActor } from "./actor/sumrak-actor.mjs";
import { SumrakActorSheet } from "./actor/sumrak-actor-sheet.mjs";
import { SumrakMonsterSheet } from "./actor/sumrak-monster-sheet.mjs";
import { ThreatClock } from "./clock/threat-clock.mjs";

Hooks.once("init", async function() {
  console.log("Петербургский Сумрак | Инициализация системы...");

  // Регистрируем настройки для хранения состояния часов
  game.settings.register("petersburg-sumrak", "threatClock.default.segments", {
    scope: "world",
    config: false,
    type: Array,
    default: [false, false, false, false, false, false]
  });
  game.settings.register("petersburg-sumrak", "threatClock.default.total", {
    scope: "world",
    config: false,
    type: Number,
    default: 6
  });

  CONFIG.Actor.documentClass = SumrakActor;
  Actors.unregisterSheet("core", ActorSheet);

  Actors.registerSheet("petersburg-sumrak", SumrakActorSheet, {
    types: ["character", "npc"],
    makeDefault: true,
    label: "Лист Персонажа"
  });

  Actors.registerSheet("petersburg-sumrak", SumrakMonsterSheet, {
    types: ["monster"],
    makeDefault: true,
    label: "Лист Монстра"
  });
});

// Добавляем кнопку в верхнюю панель навигации
Hooks.on("renderNavigation", (app, html) => {
  // Ищем контейнер для кнопок навигации
  const nav = html.find('#navigation .main-controls, #navigation .controls, nav.main-controls');
  
  // Если не нашли, пробуем другие селекторы
  let container = nav.length ? nav : html.find('.main-controls');
  
  if (!container.length) {
    console.warn("Петербургский Сумрак | Не найден контейнер для кнопки");
    return;
  }

  // Проверяем, что кнопка уже не добавлена
  if (container.find('.clock-nav-button').length) return;

  // Создаём кнопку
  const button = $(`
    <li class="nav-item clock-nav-button" style="margin-left: 4px; display: inline-block;">
      <a class="nav-item" title="Часы угрозы" style="cursor: pointer; padding: 4px 8px; color: #ccc;">
        <i class="fas fa-clock"></i> <span style="font-size: 0.8em;">Часы</span>
      </a>
    </li>
  `);

  // Обработчик клика
  button.on('click', () => {
    new ThreatClock("default").render(true);
  });

  container.append(button);
  console.log("Петербургский Сумрак | Кнопка часов добавлена в навигацию");
});

Hooks.once("ready", async function() {
  console.log("Петербургский Сумрак | Город проснулся.");
});
