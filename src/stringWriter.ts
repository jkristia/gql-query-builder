export class StringWriter {
    private _strings: string[] = [];
    private _indents: string[] = [];
    private _indent = '';
    private _indentCharacter = '\t'
    
    public indentCharacter(ch: string): StringWriter {
        this._indentCharacter = ch;
        return this;
    }
    public indent(): StringWriter {
        this._indents.push(this._indentCharacter);
        this._indent = this._indents.join('');
        return this;
    }
    public popIndent(): StringWriter {
        this._indents.pop()
        this._indent = this._indents.join('');
        return this;
    }
    public writeLine(...strings: string[]): StringWriter {
        for (const s of strings){
            this._strings.push(this._indent + s);
        }
        return this;
    }
    public toString(): string {
        return this._strings.join('\n');
    }
}