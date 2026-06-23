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

// === НАДЁЖНОЕ ДОБАВЛЕНИЕ КНОПКИ ===
// Используем официальный хук для добавления кнопок в верхнюю панель навигации
Hooks.on("getApplicationV1HeaderButtons", (app, buttons) => {
  // Проверяем, что это окно навигации
  if (app.constructor.name !== "Navigation") return;

  // Проверяем, что кнопка ещё не добавлена
  if (buttons.find(b => b.class === "threat-clock-btn")) return;

  // Добавляем нашу кнопку в массив
  buttons.push({
    class: "threat-clock-btn",
    icon: "fas fa-clock",
    label: "Часы",
    onclick: () => {
      new ThreatClock("default").render(true);
    }
  });
});

Hooks.once("ready", async function() {
  console.log("Петербургский Сумрак | Город проснулся.");
});
