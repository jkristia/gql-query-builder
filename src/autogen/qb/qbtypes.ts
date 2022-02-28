// file is auto generated, do not modify
// https://github.com/jkristia/gql-query-builder

import { QbBase } from '../qbbase'

export class QbItemInterface extends QbBase<QbItemInterface> {
	readonly __typename = 'ItemInterface';
	readonly id = 'id';
	readonly name = 'name';
}
export class QbItemA extends QbBase<QbItemA> {
	readonly __typename = 'ItemA';
	readonly id = 'id';
	readonly name = 'name';
	items(items: QbItemB): QbItemA {
		this.sub(() => 'items', items)
		return this;
	}
	readonly onlyOnA = 'onlyOnA';
}
export class QbItemB extends QbBase<QbItemB> {
	readonly __typename = 'ItemB';
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
	readonly __typename = 'Hello';
	readonly hello = 'hello';
}
export class QbQuery extends QbBase<QbQuery> {
	readonly __typename = 'Query';
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