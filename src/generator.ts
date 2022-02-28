// https://www.graphql-tools.com/docs/schema-loading
// https://graphql.wtf/episodes/22-graphql-schema-file-loading-with-graphql-tools
import path from 'path';
import fs from 'fs';
import {
    GraphQLField, GraphQLInterfaceType, GraphQLNonNull, GraphQLObjectType, GraphQLScalarType, GraphQLSchema, GraphQLUnionType
} from 'graphql';
import { StringWriter } from './stringWriter';
import { loadSchemas } from './shared/load-schema';

export class QueryBuilderGeenrator {

    private _schema: GraphQLSchema;
    constructor(private _inputFile: string) {
        this._schema = loadSchemas(_inputFile);
    }
    public generateQbClasses(
        outputpath: string
    ) {
        const types = this._schema.getTypeMap()
        const outputfilename = path.join(outputpath, 'qbtypes.ts');
        if (!fs.existsSync(outputpath)) {
            fs.mkdirSync(outputpath, { recursive: true });
        }
        const wr = new StringWriter();
        wr.writeLine('// file is auto generated, do not modify')
        wr.writeLine('// https://github.com/jkristia/gql-query-builder')
        wr.writeLine('');
        wr.writeLine(`import { QbBase } from '../qbbase'`)
        wr.writeLine('');

        for (const typeName in types) {
            const qlType = types[typeName];
            if (qlType instanceof GraphQLInterfaceType) {
                this.generateClass(wr, qlType);
                continue;
            }
            if (qlType instanceof GraphQLUnionType) {
                this.generateUnion(wr, qlType);
            }
            if (qlType instanceof GraphQLScalarType) {
            }
            if (qlType instanceof GraphQLObjectType) {
                this.generateClass(wr, qlType);
                continue;
            }
        }

        fs.writeFileSync(outputfilename, wr.toString(), { flag: 'w+' });
    }

    public generateClass(wr: StringWriter, obj: GraphQLObjectType | GraphQLInterfaceType) {
        if (obj.name.startsWith('__')) {
            return
        }
        const className = `Qb${obj.name}`;
        wr.writeLine(`export class ${className} extends QbBase<${className}> {`);
        wr.indent();
        wr.writeLine(`readonly __typename = '${className}';`)
        const fields = obj.getFields();
        for (const fieldName in fields) {
            const field = fields[fieldName];
            const fieldObjType = this.getObjType(field)
            if (fieldObjType) {
                wr.writeLine(`${fieldName}(${fieldName}: Qb${fieldObjType.name}): ${className} {`).indent()
                wr.writeLine(`this.sub(() => '${fieldName}', ${fieldName})`);
                wr.writeLine(`return this;`).popIndent();
                wr.writeLine(`}`);
                continue;
            }
            const fieldInterfaceType = this.getInterfaceType(field)
            if (fieldInterfaceType) {
                wr.writeLine(`${fieldName}(${fieldName}: Qb${fieldInterfaceType.name}): ${className} {`).indent()
                wr.writeLine(`this.sub(() => '${fieldName}', ${fieldName})`);
                wr.writeLine(`return this;`).popIndent();
                wr.writeLine(`}`);
                continue;
            }
            const fieldUnionType = this.getUnionType(field)
            if (fieldUnionType) {
                wr.writeLine(`${fieldName}(${fieldName}: Qb${fieldUnionType.name}): ${className} {`).indent()
                wr.writeLine(`this.sub(() => '${fieldName}', ${fieldName})`);
                wr.writeLine(`return this;`).popIndent();
                wr.writeLine(`}`);
                continue;
            }
            wr.writeLine(`readonly ${fieldName} = '${fieldName}';`)
        }
        wr.popIndent();
        wr.writeLine(`}`)
    }
    public generateUnion(wr: StringWriter, obj: GraphQLUnionType) {
        if (obj.name.startsWith('__')) {
            return
        }
        const className = `Qb${obj.name}`;
        wr.writeLine(`export class ${className} extends QbBase<${className}> {`);
        wr.indent();
        wr.writeLine(`readonly __typename = '${className}';`)
        wr.popIndent();
        wr.writeLine(`}`)
    }

    private getObjType(field: GraphQLField<any, any>): GraphQLObjectType | null {
        if (field.type instanceof GraphQLObjectType) {
            return field.type;
        }
        let y = field.type as GraphQLNonNull<any>;
        while (y.ofType) {
            if (y.ofType instanceof GraphQLObjectType) {
                return y.ofType;
            }
            y = y.ofType;
        }
        return null;
    }
    private getInterfaceType(field: GraphQLField<any, any>): GraphQLInterfaceType | null {
        if (field.type instanceof GraphQLInterfaceType) {
            return field.type;
        }
        let y = field.type as GraphQLNonNull<any>;
        while (y.ofType) {
            if (y.ofType instanceof GraphQLInterfaceType) {
                return y.ofType;
            }
            y = y.ofType;
        }
        return null;
    }
    private getUnionType(field: GraphQLField<any, any>): GraphQLUnionType | null {
        if (field.type instanceof GraphQLUnionType) {
            return field.type;
        }
        let y = field.type as GraphQLNonNull<any>;
        while (y.ofType) {
            if (y.ofType instanceof GraphQLUnionType) {
                return y.ofType;
            }
            y = y.ofType;
        }
        return null;
    }


}