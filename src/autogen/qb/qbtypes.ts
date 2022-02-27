// file is auto generated, do not modify
import { QbBase } from '../qbbase'

export class QbItemInterface extends QbBase<QbItemInterface> {
	readonly __typename = 'QbItemInterface';
	readonly id = 'id';
	readonly name = 'name';
}
export class QbItemA extends QbBase<QbItemA> {
	readonly __typename = 'QbItemA';
	readonly id = 'id';
	readonly name = 'name';
	items(items: QbItemB): QbItemA {
		this.sub(() => 'items', items)
		return this;
	}
	readonly onlyOnA = 'onlyOnA';
}
export class QbItemB extends QbBase<QbItemB> {
	readonly __typename = 'QbItemB';
	readonly id = 'id';
	readonly name = 'name';
	items(items: QbItemA): QbItemB {
		this.sub(() => 'items', items)
		return this;
	}
	readonly onlyOnB = 'onlyOnB';
}
export class QbUnionItem extends QbBase<QbUnionItem> {
	readonly __typename = 'QbUnionItem';
}
export class QbHello extends QbBase<QbHello> {
	readonly __typename = 'QbHello';
	readonly hello = 'hello';
}
export class QbQuery extends QbBase<QbQuery> {
	readonly __typename = 'QbQuery';
	greeting(greeting: QbHello): QbQuery {
		this.sub(() => 'greeting', greeting)
		return this;
	}
	itemsAsUnion(itemsAsUnion: QbUnionItem): QbQuery {
		this.sub(() => 'itemsAsUnion', itemsAsUnion)
		return this;
	}
	itemsAsInterface(itemsAsInterface: QbItemInterface): QbQuery {
		this.sub(() => 'itemsAsInterface', itemsAsInterface)
		return this;
	}
}