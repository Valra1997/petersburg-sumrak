/**
 * Класс листа персонажа.
 */
export class SumrakActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["petersburg-sumrak", "sheet", "actor"],
      template: "systems/petersburg-sumrak/templates/actor/actor-sheet.hbs",
      width: 600,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "main" }]
    });
  }

  /** @override */
  getData() {
    const context = super.getData();
    const actorData = context.actor.toObject(false);

    context.system = actorData.system;
    context.flags = actorData.flags;
    
    // Передаем конфигурацию в шаблон
    context.config = CONFIG.PETERSBURG_SUMRAK || {};

    return context;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Всё, что не редактируется владельцем, блокируем
    if (!this.isEditable) return;

    // Броски атрибутов (по клику на название атрибута)
    html.find('.attribute-roll').click(this._onAttributeRoll.bind(this));
  }

  /**
   * Обработчик броска 2d6 + Атрибут
   */
  async _onAttributeRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const attribute = element.dataset.attribute;
    const actorData = this.actor.system;
    
    const attributeValue = actorData.attributes[attribute]?.value || 0;
    const label = game.i18n.localize(`PETERSBURG_SUMRAK.Attribute${attribute.charAt(0).toUpperCase() + attribute.slice(1)}`);

    // Формула броска: 2d6 + значение атрибута
    const roll = new Roll(`2d6 + @val`, { val: attributeValue });
    
    // Визуализация броска в чате
    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: `<h3>${label}</h3><p>Бросок: 2d6 + ${attributeValue}</p>`
    });
  }
}