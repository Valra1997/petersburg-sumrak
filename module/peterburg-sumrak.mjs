import { SumrakActor } from "./actor/sumrak-actor.mjs";
import { SumrakActorSheet } from "./actor/sumrak-actor-sheet.mjs";
import { SumrakMonsterSheet } from "./actor/sumrak-monster-sheet.mjs";
import { ThreatClock } from "./clock/threat-clock.mjs";

Hooks.once("init", async function() {
  console.log("Петербургский Сумрак | Инициализация системы...");

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

Hooks.on("renderSceneControls", (app, html) => {
  const controlsContainer = html.find('#controls ol, #controls ul').first();
  if (!controlsContainer.length) {
    console.warn("Петербургский Сумрак | Не найден контейнер control-tools");
    return;
  }
  if (controlsContainer.find('.clock-tool').length) return;

  const li = document.createElement("li");
  li.className = "control-tool clock-tool";
  li.innerHTML = `<i class="fas fa-clock"></i>`;
  li.title = "Часы угрозы";
  li.addEventListener("click", () => {
    const clock = new ThreatClock("default");
    clock.render(true);
  });

  controlsContainer[0].appendChild(li);
  console.log("Петербургский Сумрак | Кнопка часов добавлена");
});

Hooks.once("ready", async function() {
  console.log("Петербургский Сумрак | Город проснулся.");
});
