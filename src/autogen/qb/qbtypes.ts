// file is auto generated, do not modify
import { QbBase } from '../qbbase'

export class QbQuery extends QbBase<QbQuery> {
	humans(humans: QbHuman): QbQuery {
		this.sub(() => 'humans', humans)
		return this;
	}
	readonly persons = 'persons';
	greeting(greeting: QbHello): QbQuery {
		this.sub(() => 'greeting', greeting)
		return this;
	}
	readonly hello = 'hello';
}
export class QbHuman extends QbBase<QbHuman> {
	readonly id = 'id';
	readonly name = 'name';
	readonly age = 'age';
	readonly height = 'height';
	pets(pets: QbDog): QbHuman {
		this.sub(() => 'pets', pets)
		return this;
	}
}
export class QbHello extends QbBase<QbHello> {
	readonly hello = 'hello';
}
export class QbAdult extends QbBase<QbAdult> {
	readonly name = 'name';
	readonly work = 'work';
}
export class QbChild extends QbBase<QbChild> {
	readonly name = 'name';
	readonly school = 'school';
}
export class QbDog extends QbBase<QbDog> {
	readonly id = 'id';
	readonly breed = 'breed';
	owner(owner: QbHuman): QbDog {
		this.sub(() => 'owner', owner)
		return this;
	}
}