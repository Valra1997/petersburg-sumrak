import { SumrakActor } from "./actor/sumrak-actor.mjs";
import { SumrakActorSheet } from "./actor/sumrak-actor-sheet.mjs";
import { SumrakMonsterSheet } from "./actor/sumrak-monster-sheet.mjs";

Hooks.once("init", async function() {
  console.log("Петербургский Сумрак | Инициализация системы...");

  game.settings.register("petersburg-sumrak", "systemMigrationVersion", {
    name: "System Migration Version",
    scope: "world",
    config: false,
    type: String,
    default: ""
  });

  CONFIG.Actor.documentClass = SumrakActor;
  
  // Отключаем стандартные листы
  Actors.unregisterSheet("core", ActorSheet);
  
  // Лист персонажа (для character и npc)
  Actors.registerSheet("petersburg-sumrak", SumrakActorSheet, {
    types: ["character", "npc"],
    makeDefault: true,
    label: "Лист Персонажа"
  });

  // Лист монстра (только для monster)
  Actors.registerSheet("petersburg-sumrak", SumrakMonsterSheet, {
    types: ["monster"],
    makeDefault: true,
    label: "Лист Монстра"
  });
});

Hooks.once("ready", async function() {
  console.log("Петербургский Сумрак | Город проснулся.");
});
