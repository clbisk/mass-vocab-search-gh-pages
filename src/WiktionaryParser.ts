function afterTag(str: string, startTag: string): string {
    const startIndex: number = str.indexOf(startTag);
    if (startIndex === -1) throw "tag " + startTag + " is not in the string " + str;
    return str.slice(startIndex + startTag.length);
}

function beforeTag(str: string, endTag: string): string {
    const endIndex: number = str.indexOf(endTag);
    if (endIndex === -1) throw "tag " + endTag + " is not in the string " + str;
    return str.slice(0, endIndex)
}

function betweenTags(str: string, startTag: string, endTag: string): string {
    return afterTag(beforeTag(str, endTag), startTag);
}

// function parsePage(page: any): Array<string> {
//     return [];
// }

function parseData(result: any): Array<Array<string>> {
    console.log('trying to parse', result);
    if (result.partOfSpeech === "Letter") return [];

    const parsedResult = result.map((item: any) => {
        const parsedDefns = item.definitions.map((innerItem: any) => {
            const defn: string = innerItem.definition;
            return parseDefinition(defn);
        });
        return parsedDefns;
    });
    return parsedResult.filter((val: Array<string>) => val.length > 0);
}

function parseDefinition(result: string): Array<string> {
    const parsedDefinitions: Array<string> = parseDefinitionHelper(result, []);
    console.log("parsed " + result + " as ", parsedDefinitions);
    return parsedDefinitions;
}

function parseDefinitionHelper(remaining: string, foundDefns: Array<string>): Array<string> {
    const startTagStart: string = '<a';
    if (remaining.indexOf(startTagStart) === -1) return foundDefns;

    const startTagEnd: string = '>';
    const defnStart = afterTag(afterTag(remaining, startTagStart), startTagEnd);
    const endTag: string = '</a>';
    const defn = beforeTag(defnStart, endTag);
    foundDefns.push(defn);

    const newRemaining: string = afterTag(remaining, endTag);
    if (newRemaining.length === 0) return foundDefns;

    return parseDefinitionHelper(newRemaining, foundDefns);
}

export {parseDefinition, parseData};