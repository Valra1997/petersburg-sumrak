export class SumrakMonsterSheet extends ActorSheet {

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["petersburg-sumrak", "sheet", "actor", "monster"],
      template: "systems/petersburg-sumrak/templates/actor/monster-sheet.hbs",
      width: 600,
      height: 700,
      tabs: []
    });
  }

  getData() {
    const context = super.getData();
    const actorData = context.actor.toObject(false);
    context.system = actorData.system;
    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable) return;
  }
}
