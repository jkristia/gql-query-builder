// https://www.graphql-tools.com/docs/schema-loading
// https://graphql.wtf/episodes/22-graphql-schema-file-loading-with-graphql-tools
import path from 'path';
import fs from 'fs';
import { GraphQLField, GraphQLNamedType, GraphQLNonNull, GraphQLNullableType, GraphQLObjectType, GraphQLScalarType, printSchema } from 'graphql';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { StringWriter } from './stringWriter';

export class QueryBuilderGeenrator {

    public generateQbClasses(types: { [key: string]: GraphQLNamedType }) {
        const outputpath = 'src/autogen/qb'
        const outputfilename = path.join(outputpath, 'qbtypes.ts');
        if (!fs.existsSync(outputpath)) {
            fs.mkdirSync(outputpath, { recursive: true });
        }
        const wr = new StringWriter();
        wr.writeLine('// file is auto generated, do not modify')
        wr.writeLine(`import { QbBase } from '../qbbase'`)
        wr.writeLine('');

        for (const typeName in types) {
            const qlType = types[typeName];
            if (qlType instanceof GraphQLScalarType) {
            }
            if (qlType instanceof GraphQLObjectType) {
                this.generateClass(wr, qlType);
            }
        }

        fs.writeFileSync(outputfilename, wr.toString(), { flag: 'w+' });
    }

    public generateClass(wr: StringWriter, obj: GraphQLObjectType) {
        if (obj.name.startsWith('__')) {
            return
        }
        const className = `Qb${obj.name}`;
        wr.writeLine(`export class ${className} extends QbBase<${className}> {`);
        wr.indent();
        const fields = obj.getFields();
        for (const fieldName in fields) {
            const field = fields[fieldName];
            const fieldObjType = this.getObjType(field)
            if (!fieldObjType) {
                wr.writeLine(`readonly ${fieldName} = '${fieldName}';`)
            } else {
                wr.writeLine(`${fieldName}(${fieldName}: Qb${fieldObjType.name}): ${className} {`).indent()
                wr.writeLine(`this.sub(() => '${fieldName}', ${fieldName})`);
                wr.writeLine(`return this;`).popIndent();
                wr.writeLine(`}`);

            }
        }
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


}