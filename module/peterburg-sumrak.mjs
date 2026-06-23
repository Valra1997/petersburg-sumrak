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

// ПРАВИЛЬНЫЙ СПОСОБ: добавляем кнопку в панель инструментов сцены
Hooks.on("getSceneControlButtons", (controls) => {
  // Добавляем новую группу кнопок
  controls.push({
    name: "threat-clock",
    title: "Часы угрозы",
    icon: "fas fa-clock",
    layer: "controls",
    tools: [
      {
        name: "open-clock",
        title: "Открыть часы угрозы",
        icon: "fas fa-clock",
        onClick: () => {
          new ThreatClock("default").render(true);
        }
      }
    ]
  });
});

Hooks.once("ready", async function() {
  console.log("Петербургский Сумрак | Город проснулся.");
});
