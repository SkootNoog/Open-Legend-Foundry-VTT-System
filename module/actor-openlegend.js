export  class  ActorOL  extends  Actor {

	prepareData() {

		super.prepareData();

		const actorData = this.data;
		const data = actorData.data;

		if (actorData.type === "character") {
			this.prepareCharData(actorData);
			// data.defense.guard.value = Number(attr.agility.value) + Number(attr.dodge.value) + Number(data.defense.armor.value) + Number(data.defense.guardOther.value);
		}

	}

	prepareCharData(actorData){
		const data = actorData.data;

		// Loop through attribute scores, and add their modifiers to our sheet output.
		for (let [key, attribute] of Object.entries(data.attributes)) {
			// Calculate the modifier using d20 rules.
			attribute.roll = this.getRolldata(attribute.value);
		}
	}

	getRolldata(attributeValue){
		//TODO: maybe see if we can do advantage and disadvantage
		switch (attributeValue){
			case 1:
				return "1d20x20+1d4x4";
			case 2:
				return "1d20x20+1d6x6";
			case 3:
				return "1d20x20+1d8x8";
			case 4:
				return "1d20x20+1d10x10";
			case 5:
				return "1d20x20+2d6x6";
			case 6:
				return "1d20x20+2d8x8";
			case 7:
				return "1d20x20+2d10x10";
			case 8:
				return "1d20x20+3d8x8";
			case 9:
				return "1d20x20+3d10x10";
			case 10:
				return "1d20x20+4d8x8";
			default:
				return "1d20x20";
		}
	}
}
