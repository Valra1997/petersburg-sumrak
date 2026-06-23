/**
 * Класс для отображения и управления Часами угрозы.
 * Хранит состояние в game.settings.
 */
export class ThreatClock extends Application {

  /**
   * Конструктор принимает ID часов (для хранения в settings)
   */
  constructor(clockId = "default", options = {}) {
    super(options);
    this.clockId = clockId;
    this.segments = this._loadState();
    this.totalSegments = this._loadTotalSegments();
  }

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "threat-clock",
      title: "Часы угрозы",
      template: "systems/petersburg-sumrak/module/clock/threat-clock.hbs",
      width: 400,
      height: "auto",
      resizable: true,
      classes: ["threat-clock-app"]
    });
  }

  /** @override */
  getData() {
    return {
      clockId: this.clockId,
      segments: this.segments,
      totalSegments: this.totalSegments,
      filled: this.segments.filter(s => s).length,
      isFull: this.segments.every(s => s)
    };
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Клик по сегменту - переключает состояние
    html.find('.clock-segment').click(event => {
      const index = parseInt(event.currentTarget.dataset.index, 10);
      this._toggleSegment(index);
    });

    // Кнопка "Сбросить"
    html.find('.clock-reset').click(() => {
      this._resetClock();
    });

    // Кнопка "Изменить размер" (открывает диалог выбора количества сегментов)
    html.find('.clock-change-size').click(() => {
      this._changeSizeDialog();
    });
  }

  // --- Приватные методы ---

  _loadState() {
    const key = `threatClock.${this.clockId}.segments`;
    const saved = game.settings.get("petersburg-sumrak", key);
    if (saved && Array.isArray(saved)) {
      return saved;
    }
    // По умолчанию 6 сегментов, все false
    const total = this._loadTotalSegments();
    return new Array(total).fill(false);
  }

  _loadTotalSegments() {
    const key = `threatClock.${this.clockId}.total`;
    const saved = game.settings.get("petersburg-sumrak", key);
    return saved || 6;
  }

  _saveState() {
    const key = `threatClock.${this.clockId}.segments`;
    game.settings.set("petersburg-sumrak", key, this.segments);
  }

  _saveTotalSegments(total) {
    const key = `threatClock.${this.clockId}.total`;
    game.settings.set("petersburg-sumrak", key, total);
  }

  _toggleSegment(index) {
    if (index < 0 || index >= this.segments.length) return;
    this.segments[index] = !this.segments[index];
    this._saveState();
    this.render();
  }

  _resetClock() {
    this.segments = new Array(this.totalSegments).fill(false);
    this._saveState();
    this.render();
  }

  async _changeSizeDialog() {
    const content = `
      <form>
        <div class="form-group">
          <label>Количество сегментов:</label>
          <select id="clock-size-select">
            <option value="4">4</option>
            <option value="6" selected>6</option>
            <option value="8">8</option>
            <option value="10">10</option>
          </select>
        </div>
      </form>
    `;
    new Dialog({
      title: "Изменить размер часов",
      content: content,
      buttons: {
        confirm: {
          label: "Применить",
          callback: async (html) => {
            const newTotal = parseInt(html.find('#clock-size-select').val(), 10);
            this.totalSegments = newTotal;
            this._saveTotalSegments(newTotal);
            this.segments = new Array(newTotal).fill(false);
            this._saveState();
            this.render();
          }
        },
        cancel: {
          label: "Отмена"
        }
      }
    }).render(true);
  }
}
