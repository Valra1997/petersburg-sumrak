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

// Хук для добавления кнопки в панель инструментов
Hooks.on("renderSceneControls", (app, html) => {
  const controlsList = html.querySelector("ol.control-tools");
  if (!controlsList) {
    console.warn("Петербургский Сумрак | Не найден список control-tools");
    return;
  }

  const li = document.createElement("li");
  li.className = "control-tool";
  li.innerHTML = `<i class="fas fa-clock"></i>`;
  li.title = "Часы угрозы";
  li.addEventListener("click", () => {
    const clock = new ThreatClock("default");
    clock.render(true);
  });

  controlsList.appendChild(li);
  console.log("Петербургский Сумрак | Кнопка часов добавлена");
});

Hooks.once("ready", async function() {
  console.log("Петербургский Сумрак | Город проснулся.");
});
