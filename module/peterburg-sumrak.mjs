// Импорт наших классов
import { SumrakActor } from "./actor/sumrak-actor.mjs";
import { SumrakActorSheet } from "./actor/sumrak-actor-sheet.mjs";

/* -------------------------------------------- */
/*  Инициализация системы                       */
/* -------------------------------------------- */
Hooks.once("init", async function() {
  console.log("Петербургский Сумрак | Инициализация системы...");

  // Регистрируем настройки системы
  game.settings.register("petersburg-sumrak", "systemMigrationVersion", {
    name: "System Migration Version",
    scope: "world",
    config: false,
    type: String,
    default: ""
  });

  // Определяем классы документов
  CONFIG.Actor.documentClass = SumrakActor;
  
  // Отключаем стандартные листы Foundry, чтобы использовать свои
  Actors.unregisterSheet("core", ActorSheet);
  
  // Регистрируем наш лист для персонажей
  Actors.registerSheet("petersburg-sumrak", SumrakActorSheet, {
    types: ["character", "monster", "npc"],
    makeDefault: true,
    label: "Лист Сумрака"
  });
});

/* -------------------------------------------- */
/*  Готовность системы                          */
/* -------------------------------------------- */
Hooks.once("ready", async function() {
  console.log("Петербургский Сумрак | Город проснулся.");
});