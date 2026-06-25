/**
 * База данных базовых ходов из Книги Игрока
 */
const BASIC_MOVES_DATA = {
    look: {
        name: "Присмотреться",
        attr: "razum",
        attrLabel: "РАЗУМ",
        text10: "Задайте 3 вопроса мастеру.",
        text7: "Задайте 1 вопрос.",
        text6: "Вы что-то упустили или привлекли внимание опасности."
    },
    fear: {
        name: "Сдержать страх",
        attr: "dusha",
        attrLabel: "ДУША",
        text10: "Вы держитесь и получаете +1 к следующему броску.",
        text7: "1 Страх или помеха -1.",
        text6: "2 Страха и паника."
    },
    attack: {
        name: "Нанести удар",
        attr: "telo",
        attrLabel: "ТЕЛО",
        text10: "Нанесите урон и выберите эффект (оттеснить, сбить, выбить предмет).",
        text7: "Нанесите урон, но враг контратакует.",
        text6: "Промах, вы получаете урон и новую неприятность."
    },
    weakness: {
        name: "Применить уязвимость",
        attr: "telo",
        attrLabel: "ТЕЛО/РАЗУМ",
        text10: "Уязвимость сработала, враг получает урон и дезориентацию.",
        text7: "Сработало, но вы под ударом.",
        text6: "Не сработало или сработало не так."
    },
    rule: {
        name: "Обойти правило",
        attr: "harizma",
        attrLabel: "ХАРИЗМА",
        text10: "Монстр связан правилом.",
        text7: "Правило держит, но нужна жертва или монстр понял обман.",
        text6: "Вы нарушили правило."
    },
    help: {
        name: "Помочь союзнику",
        attr: "harizma",
        attrLabel: "ХАРИЗМА",
        text10: "Союзник получает +2 к броску.",
        text7: "Союзник получает +1, а вы привлекаете внимание.",
        text6: "Вы мешаете, союзник получает -1."
    },
    retreat: {
        name: "Отступить",
        attr: "telo",
        attrLabel: "ТЕЛО",
        text10: "Ушли и потеряли след.",
        text7: "Ушли, но монстр преследует или кто-то получает лёгкую рану.",
        text6: "Пойманы."
    },
    ritual: {
        name: "Провести ритуал",
        attr: "dusha",
        attrLabel: "ДУША",
        text10: "Ритуал работает.",
        text7: "Работает с ценой.",
        text6: "Ритуал зовёт не то или усиливает угрозу."
    }
};

/**
 * Класс листа персонажа.
 */
export class SumrakActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["petersburg-sumrak", "sheet", "actor"],
      template: "systems/petersburg-sumrak/templates/actor/actor-sheet.hbs",
      width: 650,
      height: 700,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "main" }]
    });
  }

  /** @override */
  getData() {
    const context = super.getData();
    const actorData = context.actor.toObject(false);
    context.system = actorData.system;
    return context;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable) return;

    // Броски атрибутов
    html.find('.attribute-roll').click(this._onAttributeRoll.bind(this));
    
    // Броски базовых ходов
    html.find('.move-btn').click(this._onMoveRoll.bind(this));
    
    // --- Инвентарь ---
    html.find('.add-item-btn').click(this._onAddItem.bind(this));
    html.find('.item-use').click(this._onUseItem.bind(this));
    html.find('.item-edit').click(this._onEditItem.bind(this));
    html.find('.item-delete').click(this._onDeleteItem.bind(this));
  }

  // ==================== БАЗОВЫЕ ХОДЫ ====================

  async _onMoveRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const moveKey = element.dataset.move;
    const moveData = BASIC_MOVES_DATA[moveKey];
    if (!moveData) return;

    const actorData = this.actor.system;
    const attributeValue = actorData.attributes[moveData.attr]?.value || 0;

    const roll = new Roll(`2d6 + @val`, { val: attributeValue });
    await roll.evaluate({ async: true });

    const total = roll.total;
    let outcomeHtml = "";
    let outcomeClass = "";

    if (total >= 10) {
        outcomeHtml = `<div class="move-result success-full"><strong>10+ Полный успех:</strong><br>${moveData.text10}</div>`;
        outcomeClass = "success";
    } else if (total >= 7) {
        outcomeHtml = `<div class="move-result success-partial"><strong>7-9 Успех с ценой:</strong><br>${moveData.text7}</div>`;
        outcomeClass = "partial";
    } else {
        outcomeHtml = `<div class="move-result fail"><strong>6- Провал:</strong><br>${moveData.text6}<br><em>Мастер, сделайте ход!</em></div>`;
        outcomeClass = "fail";
    }

    const chatContent = `
        <div class="sumrak-move-card ${outcomeClass}">
            <h3>${moveData.name} <span class="attr-label">(+${moveData.attrLabel}: ${attributeValue})</span></h3>
            <div class="roll-formula">${roll.formula} = <strong>${total}</strong></div>
            ${outcomeHtml}
        </div>
    `;

    await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: chatContent,
        roll: roll,
        type: CONST.CHAT_MESSAGE_STYLES.ROLL
    });
  }

  async _onAttributeRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const attribute = element.dataset.attribute;
    const actorData = this.actor.system;
    const attributeValue = actorData.attributes[attribute]?.value || 0;
    const label = game.i18n.localize(`PETERSBURG_SUMRAK.Attribute${attribute.charAt(0).toUpperCase() + attribute.slice(1)}`);

    const roll = new Roll(`2d6 + @val`, { val: attributeValue });
    await roll.evaluate({ async: true });

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: `<h3>Проверка: ${label}</h3><p>Формула: ${roll.formula} = <strong>${roll.total}</strong></p>`,
      roll: roll,
      type: CONST.CHAT_MESSAGE_STYLES.ROLL
    });
  }

  // ==================== ИНВЕНТАРЬ ====================

  /**
   * Добавить новый предмет
   */
  async _onAddItem(event) {
    event.preventDefault();

    const content = `
      <form>
        <div class="form-group">
          <label>Название предмета</label>
          <input type="text" id="item-name" placeholder="Например: Серебряный крест"/>
        </div>
        <div class="form-group">
          <label>Тип предмета</label>
          <select id="item-type">
            <option value="tool">Инструмент</option>
            <option value="weapon">Оружие</option>
            <option value="consumable">Расходник</option>
            <option value="armor">Броня</option>
            <option value="clue">Улика</option>
            <option value="special">Особое</option>
          </select>
        </div>
        <div class="form-group">
          <label>Количество</label>
          <input type="number" id="item-quantity" value="1" min="1"/>
        </div>
        <div class="form-group">
          <label>Урон (если оружие)</label>
          <input type="text" id="item-damage" placeholder="Например: 1 лёгкая"/>
        </div>
        <div class="form-group">
          <label>Описание</label>
          <textarea id="item-description" rows="2" placeholder="Что это и для чего"></textarea>
        </div>
      </form>
    `;

    new Dialog({
      title: "Добавить предмет",
      content: content,
      buttons: {
        confirm: {
          label: "Создать",
          callback: async (html) => {
            const name = html.find('#item-name').val();
            const type = html.find('#item-type').val();
            const quantity = parseInt(html.find('#item-quantity').val(), 10) || 1;
            const damage = html.find('#item-damage').val() || "";
            const description = html.find('#item-description').val() || "";

            if (!name) {
              ui.notifications.warn("Название предмета обязательно");
              return;
            }

            await this.actor.createEmbeddedDocuments("Item", [{
              name: name,
              type: "gear",
              system: {
                description: description,
                quantity: quantity,
                damage: damage,
                type: type,
                effects: "",
                weight: 0
              }
            }]);

            ui.notifications.info(`Предмет "${name}" добавлен`);
          }
        },
        cancel: {
          label: "Отмена"
        }
      }
    }).render(true);
  }

  /**
   * Использовать предмет
   */
  async _onUseItem(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest('.inventory-item').dataset.itemId;
    const item = this.actor.items.get(itemId);
    if (!item) return;

    const itemData = item.system;
    const itemName = item.name;

    let chatContent = `
      <div class="item-use-card">
        <h3>🛠️ Использование: ${itemName}</h3>
        <div class="item-description">${itemData.description || "Нет описания"}</div>
    `;

    // Если оружие с уроном
    if (itemData.type === "weapon" && itemData.damage) {
      const damageRoll = itemData.damage;
      if (damageRoll.match(/\d+d\d+/)) {
        const roll = new Roll(damageRoll);
        await roll.evaluate({ async: true });
        chatContent += `
          <div class="damage-roll">🎲 Урон: ${roll.formula} = <strong>${roll.total}</strong></div>
        `;
      } else {
        chatContent += `
          <div class="damage-text">⚔️ Урон: ${damageRoll}</div>
        `;
      }
    }

    // Если расходник — уменьшаем количество
    if (itemData.type === "consumable") {
      const newQuantity = itemData.quantity - 1;
      if (newQuantity <= 0) {
        await item.delete();
        chatContent += `<div class="item-consumed">💫 Предмет использован и исчез</div>`;
      } else {
        await item.update({ "system.quantity": newQuantity });
        chatContent += `<div class="item-consumed">💫 Осталось: ${newQuantity}</div>`;
      }
    }

    chatContent += `</div>`;

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: chatContent,
      type: CONST.CHAT_MESSAGE_STYLES.OTHER
    });
  }

  /**
   * Редактировать предмет (показывает стандартное окно редактирования)
   */
  async _onEditItem(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest('.inventory-item').dataset.itemId;
    const item = this.actor.items.get(itemId);
    if (item) item.sheet.render(true);
  }

  /**
   * Удалить предмет
   */
  async _onDeleteItem(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest('.inventory-item').dataset.itemId;
    const item = this.actor.items.get(itemId);
    if (!item) return;

    const confirmed = await Dialog.confirm({
      title: "Удалить предмет?",
      content: `<p>Вы уверены, что хотите удалить <strong>${item.name}</strong>?</p>`,
      yes: () => true,
      no: () => false,
      defaultYes: false
    });

    if (confirmed) {
      await item.delete();
      ui.notifications.info(`Предмет "${item.name}" удалён`);
    }
  }
}
