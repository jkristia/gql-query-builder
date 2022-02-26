

type TCharacter = {
    id: string;
    name: string;
}

type TPerson = TCharacter & {
    age: number;
    height: number;
    pets?: TDog[];
}

type TDog = TCharacter & {
    breed: string;
    owner?: TPerson;
}
//************************************************************ */
interface ICharacter {
    id: string;
    name: string;
}
interface IPerson extends ICharacter {
    age: string;
    height: string;
    pets: string;
}
interface IDog extends ICharacter {
    breed: string;
    owner: string;
}
//************************************************************ */
class _character implements ICharacter {
    id = 'id';
    name = 'name';
}
class _person extends _character implements IPerson {
    age = 'age' as any;
    height = 'height' as any;
    pets = 'pets' as any;
}
class _dog extends _character implements IDog {
    breed = 'breed' as any;
    owner = 'owner' as any;
}
//************************************************************ */

type fnFieldName<T> = (obj: T) => string;
type fnQueryCallback<T> = (obj: T) => { name: string, q: query<any> };
type fnNewSub = () => query<any>;

class query<T> {
    public fields: string[] = []
    constructor(public obj: T) {
    }
    field(fnField: fnFieldName<T>): query<T> {
        this.fields.push(fnField(this.obj))
        return this;
    }
    sub(fnField: fnFieldName<T>, newSub: fnNewSub): query<T> {
        return this;
    }
}

const q1 = new query<IPerson>(new _person())
    .field(d => d.id)
    .field(d => d.name)
    .sub(
        d => d.pets,
        () => new query<IDog>(new _dog())
            .field(d => d.owner)
            .field(d => d.breed)
    )

const q2 = new query<IDog>(new _dog())
    .field(d => d.id)
    .field(d => d.breed)


