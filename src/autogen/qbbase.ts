/*
	GraphQL QueryBuilder base class. Used by auto generated classes.
*/
import { StringWriter } from "../stringWriter";

type FieldItem = {
	name: string;
	value: string | QbBase<any>
}
type Argument = {
	name: string;
	value: string;
}

export class QbBase<T> {
	private _fields: FieldItem[] = [];
	protected __typename = '';
	protected _asRoot = true;
	protected _arguments: Argument[] = [];

	argument( fnArg: (obj: T) => {name: string, value: string}): T {
		this._arguments.push(fnArg(this as any));
		return this as any as T
	}
	field(fnField: (obj: T) => string): T {
		const name = fnField(this as any);
		this._fields.push({
			name,
			value: name
		})
		return this as any as T;
	}
	sub(fnField: (obj: T) => string, sub: QbBase<any>): T {
		const name = fnField(this as any);
		sub._asRoot = false;
		this._fields.push({
			name,
			value: sub
		})
		return this as any as T;
	}
	fragment(sub: QbBase<any>): T {
		const name = `... on ${sub.__typename} `;
		sub._asRoot = false;
		this._fields.push({
			name,
			value: sub
		})
		return this as any as T;
	}

	protected write(fieldname: string = '', wr?: StringWriter): StringWriter {
		wr = wr || new StringWriter();
		let args = '';
		if (this._arguments.length > 0) {
			const m = this._arguments.map(a => `${a.name}: "${a.value}"`);
			args = `(${m.join(', ')})`
		}
		wr.writeLine(`${fieldname}${args}{`);
		wr.indent();
		for (const field of this._fields) {
			if (field.value instanceof QbBase) {
				field.value.write(field.name, wr)
			} else {
				wr.writeLine(field.name);
			}
		}
		wr.popIndent();
		wr.writeLine('}');
		return wr;
	}
	protected writeAsRoot(): StringWriter {
		const wr = new StringWriter();
		wr.writeLine(`{`)
		wr.indent();
		this.write(this.__typename, wr);
		wr.popIndent();
		wr.writeLine(`}`)
		return wr;
	}
	protected _multipleRoots: QbBase<any>[] | null = null;
	protected writeMultipleRoots(): StringWriter {
		const wr = new StringWriter();
		wr.writeLine(`{`)
		wr.indent();
		for (const root of this._multipleRoots!) {
			root.write(root.__typename, wr);
		}
		wr.popIndent();
		wr.writeLine(`}`)
		return wr;
	}
	public toString(): string {
		if (this._multipleRoots) {
			return this.writeMultipleRoots().toString();
		}
		if (this._asRoot) {
			return this.writeAsRoot().toString();
		}
		const wr = new StringWriter().indentCharacter('   ');
		return this.write('', wr).toString();
	}
}
export class QbMultiple extends QbBase<any> {
	constructor(...qbs: QbBase<any>[]) {
		super();
		this._multipleRoots = qbs;
	}
}