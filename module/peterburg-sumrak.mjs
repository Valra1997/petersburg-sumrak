import { SumrakActor } from "./actor/sumrak-actor.mjs";
import { SumrakActorSheet } from "./actor/sumrak-actor-sheet.mjs";
import { SumrakMonsterSheet } from "./actor/sumrak-monster-sheet.mjs";
import { ThreatClock } from "./clock/threat-clock.mjs";   // <-- импорт

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

// Добавляем кнопку в панель управления
Hooks.on("renderSceneControls", (app, html) => {
  const button = document.createElement("button");
  button.className = "control-tool";
  button.innerHTML = `<i class="fas fa-clock"></i> Часы`;
  button.title = "Открыть часы угрозы";
  button.addEventListener("click", () => {
    const clock = new ThreatClock("default");
    clock.render(true);
  });
  // Вставляем после кнопки "Журнал" или в конец
  const controls = html.querySelector(".main-controls");
  if (controls) {
    controls.appendChild(button);
  }
});

Hooks.once("ready", async function() {
  console.log("Петербургский Сумрак | Город проснулся.");
});
