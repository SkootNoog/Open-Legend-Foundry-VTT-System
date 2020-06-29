export  class  ActorOL  extends  Actor {

	prepareData() {

		super.prepareData();

		const actorData = this.data;
		const data = actorData.data;

		if (actorData.type === "character") {
			data.defense.guard.value = Number(attr.agility.value) + Number(attr.dodge.value) + Number(data.defense.armor.value) + Number(data.defense.guardOther.value);
		}

	}
}
