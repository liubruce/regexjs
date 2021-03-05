/* 
    Recursive descent parser for regular expressions. Implements the following grammar:

    Expr -> Term | Term '|' Expr
    Term -> Factor | Factor Term
    Factor -> Atom | Atom MetaChar
    Atom -> Char | '(' Expr ')'
    Char -> AnyCharExceptMeta | '\' AnyChar
    MetaChar -> '?' | '*' | '+'
*/

/**
* @param{string} label
* @param{TreeNode[]} children
*/
function TreeNode(label, children) {
    this.label = label;
    this.children = children || [];
}

let pattern = '';
let pos = 0;

const peek = () => pattern[pos];
const hasMoreChars = () => pos < pattern.length;
const isMetaChar = ch => ch === '*';// || ch === '?';

function match(ch) {
    // if (peek() !== ch)
    //     throw new Error(`Unexpected symbol ${ch}`);
    pos++;
}

function next() {
    let ch = peek();
    match(ch);

    return ch;
}

function expr() {
    const trm = term();
	console.log('enter expr', isMetaChar(peek()), peek(), pos);
    if (hasMoreChars() && peek() === '|') {
        match('|');
        const exp = expr();
        return new TreeNode('Expr', [trm, new TreeNode('|'), exp]);
    }

    return new TreeNode('Expr', [trm]);
}

function term() {
    const factr = factor();
	console.log('enter term', isMetaChar(peek()), peek(),pos);
    if (hasMoreChars() && peek() !== ')' && peek() !== '|') {
        const trm = term();
        return new TreeNode('Term', [factr, trm]);
    }

    return new TreeNode('Term', [factr]);
}

function factor() {
    const atm = atom();
console.log('enter factor', isMetaChar(peek()), peek(),pos);
    if (hasMoreChars() && isMetaChar(peek())) {
        const meta = next();
        return new TreeNode('Factor', [atm, new TreeNode(meta)]);
    }

    return new TreeNode('Factor', [atm]);
}

function atom() {
	console.log('enter atom', isMetaChar(peek()), peek(),pos);
    if (peek() === '(') {
        match('(');
        const exp = expr();
        match(')');
        return new TreeNode('Atom', [new TreeNode('('), exp, new TreeNode(')')]);
    }

    const ch = char();
    return new TreeNode('Atom', [ch]);
}

function char() {
	console.log('enter char', isMetaChar(peek()), peek(),pos);
    // if (isMetaChar(peek()))
    //     throw new Error(`Unexpected meta char ${peek()}`);

    // if (peek() === '\\') {
    //     match('\\');
    //     return new TreeNode('Char', [new TreeNode('\\'), new TreeNode(next())]);
    // }

    return new TreeNode('Char', [new TreeNode(next())]);
}

function toParseTree(regex) {
    pattern = regex;
    pos = 0;
console.log('enter toParseTree', regex,peek());
    return expr();
}

module.exports = { toParseTree };
