export  class  ActorOL  extends  Actor {

	prepareData() {

		super.prepareData();

		const actorData = this.data;
		const data = actorData.data;

		if (actorData.type === "character") {

			// TODO: Properly set up and work with derived values
			this.prepareCharData(actorData);
			data.defenses.guard.value = Number(data.attributes.agility.value) + Number(data.attributes.might.value) + Number(data.defenses.armor) + Number(data.defenses.guardOther) +10;
			data.defenses.toughness.value = Number(data.attributes.fortitude.value) + Number(data.attributes.will.value) + Number(data.defenses.toughOther) + 10;
			data.defenses.resolve.value = Number(data.attributes.presence.value) + Number(data.attributes.will.value) + Number(data.defenses.resolveOther) + 10;

			data.derived.health.max = 2*(Number(data.attributes.fortitude.value) + Number(data.attributes.will.value) + Number(data.attributes.presence.value)) + 10;
		}

	}

	// TODO: Figure out if this is needed
	prepareCharData(actorData){
		const data = actorData.data;

		// Loop through attribute scores, and add their modifiers to our sheet output.
		for (let [key, attribute] of Object.entries(data.attributes)) {
			// Calculate the modifier using d20 rules.
			attribute.roll = this.getRolldata(attribute.value);
		}
	}

	getRolldata(attributeValue){
		//TODO: Figure out if this is needed
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
