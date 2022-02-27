// file is auto generated, do not modify
import { QbBase } from '../qbbase'

export class QbQuery extends QbBase<QbQuery> {
	product(product: QbProduct): QbQuery {
		this.sub(() => 'product', product)
		return this;
	}
	products(products: QbProduct): QbQuery {
		this.sub(() => 'products', products)
		return this;
	}
}
export class QbProduct extends QbBase<QbProduct> {
	readonly id = 'id';
	readonly name = 'name';
	readonly description = 'description';
	readonly price = 'price';
	reviews(reviews: QbReview): QbProduct {
		this.sub(() => 'reviews', reviews)
		return this;
	}
}
export class QbReview extends QbBase<QbReview> {
	readonly name = 'name';
	readonly message = 'message';
}
export class QbDog extends QbBase<QbDog> {
	readonly id = 'id';
	readonly breed = 'breed';
	owner(owner: QbHuman): QbDog {
		this.sub(() => 'owner', owner)
		return this;
	}
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