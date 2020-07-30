/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class SimpleActorSheet extends ActorSheet {

  /** @override */
	static get defaultOptions() {
	  return mergeObject(super.defaultOptions, {
  	  classes: ["worldbuilding", "sheet", "actor"],
  	  template: "systems/openlegend/templates/actor-sheet.html",
      width: 600,
      height: 880,
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "attributes"}],
      dragDrop: [{dragSelector: ".item-list .item", dropSelector: null}]
    });
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();
    data.dtypes = ["String", "Number", "Boolean"];
    
    return data;
  }

  /* -------------------------------------------- */

  /** @override */
	async activateListeners(html) {
    super.activateListeners(html);

    // Rollable abilities.
    html.find('.rollable').click(this.onRoll.bind(this));

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Update Inventory Item
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.getOwnedItem(li.data("itemId"));
      item.sheet.render(true);
    });

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      this.actor.deleteOwnedItem(li.data("itemId"));
      li.slideUp(200, () => this.render(false));
    });
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   *
   */
  async onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    if (dataset.roll) {
      //let roll = new Roll(dataset.roll, this.actor.data.data);
      let roll = await this.checkAdvantage(dataset.roll, this.actor.data.data);

      let label = dataset.label ? `Rolling ${dataset.label}` : '';
      roll.roll().toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label
      });
    }
  }

  //TODO: Clean this up someday. Maybe. Eventually.
  /**
   * checkAdvantage will create a dialog box that lets user enter advantage/disadvantage and the number of dice.
   * @param attributeValue - Attribute score
   * @param actorData - Actor Data
   * @returns {Promise<Roll>} - Returns a Roll object with the correct formula
   */
  async checkAdvantage(attributeValue, actorData){
    let adv = true;
    let advAmount = 0;

    [adv, advAmount] = await new Promise((resolve, reject) => {
      new Dialog({
        title: "Advantage/Disadvantage",
        content: '<div class = "form-group dialog advantage-prompt">' +
            '<p>Choose either advantage or disadvantage and enter the amount</p>' +
            '<label>Advantage/Disadvantage Dice:</label>' +
            '<input type="number" name="advantageDice" placeholder="0" value="0" data-dtype="Number"/></div>',
        buttons: {
          advantage: {
            icon: '<i class="fas fa-check"></i>',
            label: "Advantage",
            callback: (html) => {
              resolve([true, html.find('.advantage-prompt.dialog [name="advantageDice"]')[0].value
              ]);
            },
          },
          disadvantage: {
            icon: '<i class="fas fa-times"></i>',
            label: "Disadvantage",
            callback: (html) => {
              resolve([false, html.find('.advantage-prompt.dialog [name="advantageDice"]')[0].value
              ]);
            },
          },
          neither: {
            icon: '<i class="fas fa-times"></i>',
            label: "Neither",
            callback: (html) => {
              resolve([null, html.find('.advantage-prompt.dialog [name="advantageDice"]')[0].value
              ]);
            },
          },
        },
        default: "neither",
        close: (html) => {
          resolve([null, html.find('.advantage-prompt.dialog [name="advantageDice"]')[0].value
          ]);
        }
      }).render(true);
    });

    // No Advantage/Disadvantage dice less than 0
    if(parseInt(advAmount) < 0){
      advAmount = 0;
    }

    // Get Roll formula depending on Advantage/Disadvantage

    // Attribute 0 && No advantage/disadvantage
    if(parseInt(attributeValue) === 0 && adv === null){
      return new Roll("1d20x20", actorData)
    }
    // Attribute 0 && Advantage
    else if(parseInt(attributeValue) === 0 && adv === true){
      return new Roll("2d20x20kh", actorData)
    }
    // Attribute 0 && Disadvantage
    else if(parseInt(attributeValue) === 0 && adv === false){
      return new Roll("2d20x20kl", actorData)
    }
    // Attribute 1 or higher and disadvantage or advantage
    else {
      return new Roll("1d20x20+" + this.getRolldata(attributeValue, advAmount, adv), actorData)
    }
  }

  /**
   * getRolldata will create a roll formula for a stat greater than 0
   * @param attributeValue - Attribute score
   * @param advAmount - Number of advantage/disadvantage dice
   * @param adv - True = Advantage, False = Disadvantage
   * @returns {string}  containing roll formula
   */
  getRolldata(attributeValue, advAmount, adv){
    let dice = parseInt(advAmount);
    let moreDice = 'kl';

    if (adv === true){
      moreDice = 'kh';
    }
    // If no advantage/disadvantage, set the dice to 0.
    else if (adv === null){
      dice = 0;
    }

    // Create dice formula depending on attribute score
    switch (parseInt(attributeValue)){
      case 1:
        dice += 1;
        return (dice.toString() + "d4" + moreDice + '1x4');
      case 2:
        dice += 1;
        return (dice.toString() + "d6" + moreDice + '1x6');
      case 3:
        dice += 1;
        return (dice.toString() + "d8" + moreDice + '1x8');
      case 4:
        dice += 1;
        return (dice.toString() + "d10" + moreDice + '1x10');
      case 5:
        dice += 2;
        return (dice.toString() + "d6" + moreDice + '2x6');
      case 6:
        dice += 2;
        return (dice.toString() + "d8" + moreDice + '2x8');
      case 7:
        dice += 2;
        return (dice.toString() + "d10" + moreDice + '2x10');
      case 8:
        dice += 3;
        return (dice.toString() + "d8" + moreDice + '3x8');
      case 9:
        dice += 3;
        return (dice.toString() + "d10" + moreDice + '3x10');
      case 10:
        dice += 4;
        return (dice.toString() + "d8" + moreDice + '4x8');
      default:
        // Thanks to https://github.com/Sieabah for cleaning this part up.
        dice = Math.floor(attributeValue/2) - 1;
        const multiplier = attributeValue%2 === 0 ? 8 : 10;
        return `${dice+(+advAmount)}d${multiplier}${moreDice + dice}x${multiplier}`;
    }
  }




}
