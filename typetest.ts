

type Character = {
    id: string;
    name: string;
}

type Person = Character & {
    age: number;
    height: number;
    pets?: Dog[];
}

type Dog = Character & {
    breed: string;
    owner?: Person;
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

class _character implements ICharacter{
    id = 'id';
    name = 'name';
}

//************************************************************ */
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

type fnCallback<T> = (obj: T) => string;
type fnQueryCallback<T> = (obj: T) => { name: string, q: query<any> };

class query<T> {
    public fields: string[] = []
    constructor(public obj: T) {
    }
    addField(cb: fnCallback<T>): query<T> {
        this.fields.push(cb(this.obj))
        return this;
    }
    addQuery(cb: fnQueryCallback<T>) {
    }
}

const q1 = new query<IPerson>(new _person())
    .addField(d => d.id)
    .addField(d => d.name)
    .addQuery(d => {
        return {
            name: d.pets,
            q: new query<IDog>(new _dog())
            .addField(d => d.owner)
            .addField(d => d.breed)
        }
    })

const q2 = new query<Dog>(new _dog())
    .addField(d => d.id)
    .addField(d => d.breed)


