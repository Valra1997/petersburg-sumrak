/**
 * Расширение документа Актера для Петербургского Сумрака.
 */
export class SumrakActor extends Actor {

  /** @override */
  prepareData() {
    super.prepareData();
    const actorData = this;
    const data = actorData.system;
    
    // Здесь в будущем мы будем считать штрафы от Страха и Ран
    this._prepareCharacterData(actorData);
  }

  _prepareCharacterData(actorData) {
    if (actorData.type !== "character") return;
    const data = actorData.system;

    // Пример: Если страх 5-6, персонаж в панике (штраф)
    data.isPanicked = data.fear.value >= 5;
    
    // Пример: Если заполнены все лёгкие раны, штраф к Телу
    data.teloPenalty = (data.wounds.light.value >= data.wounds.light.max) ? -1 : 0;
  }
}