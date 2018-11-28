'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
/* TODO | - Multiple entities in a single selection
 *        - Unicode data
 *        - Extensible, options
 *        - Key map
 *        - Latex mode
 *        - Categories
 */
const lookup = {
    // Greek
    alpha: 'α',
    beta: 'β',
    gamma: 'γ',
    delta: 'δ',
    epsilon: 'ε',
    zeta: 'ζ',
    eta: 'η',
    theta: 'θ',
    iota: 'ι',
    kappa: 'κ',
    lambda: 'λ',
    mu: 'μ',
    nu: 'ν',
    xi: 'ξ',
    omicron: 'ο',
    pi: 'π',
    rho: 'ρ',
    sigma: 'σ',
    tau: 'τ',
    upsilon: 'υ',
    phi: 'φ',
    chi: 'χ',
    psi: 'ψ',
    omega: 'ω',
    // Math
    '+-': '±',
    '*': '×',
    '/': '÷',
    'sqrt': '√',
    'integral': '∫',
    'inf': '∞',
    '/=': '≠',
    'approx': '≈',
    'equiv': '≡',
    'prop': '∝',
    'ge': '≥',
    'le': '≤',
    // Set theory
    'elem': '∈',
    'nelem': '∉',
    'nat': 'ℕ',
    'int': 'ℤ',
    'ratio': 'ℚ',
    'real': 'ℝ',
    'aleph': 'ℵ',
    // ⊆ ⊇
    // Logic
    'not': '¬',
    '∝': 'prop',
    'forall': '∀',
    // Arrows
    '<=>': '⇔',
    '=>': '⇒',
    // Subscripts
    '_0': '₀',
    '_1': '₁',
    '_2': '₂',
    '_3': '₃',
    '_4': '₄',
    '_5': '₅',
    '_6': '₆',
    '_7': '₇',
    '_8': '₈',
    '_9': '₉',
    // Superscripts
    '^0': '⁰',
    '^1': '¹',
    '^2': '²',
    '^3': '³',
    '^4': '⁴',
    '^5': '⁵',
    '^6': '⁶',
    '^7': '⁷',
    '^8': '⁸',
    '^9': '⁹',
    // Geometry
    // Arabic, Hebrew
    // Cultural
    'man': '♂',
    'woman': '♀'
    // Music
};
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('insert-special-symbol is been activated!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    const commandName = 'insert-special-symbol.replaceSelection';
    function isUnicodeEscape(s) {
        // A Unicode escape sequence consists
        // of the characters '\u' followed by
        // exactly four hexadecimal digits
        return /\\u[0-9a-fA-F]{4}/.test(s);
    }
    function sameCase(paragon, s) {
        // TODO: Make more robust
        // Like 'copySign', but for letter cases.
        // Assumes it's either uppercase or lowercase (which may not be the case)
        return (paragon.toUpperCase() === paragon) ? s.toUpperCase() : s.toLowerCase();
    }
    function tryReplaceNameWithCharacter(name, range, edit) {
        const character = lookup[name.toLowerCase()];
        if (character !== undefined) {
            edit.replace(range, sameCase(name, character));
            return true;
        }
        else {
            console.log(`[${commandName}] No replacement available for name ${name}.`);
            return false;
        }
    }
    function tryReplaceCodeWithCharacter(code, range, edit) {
        if (isUnicodeEscape(code)) {
            const character = String.fromCharCode(parseInt(code.slice(2), 16));
            edit.replace(range, character);
            return true;
        }
        else {
            console.log(`[${commandName}] String '${code}' is not a Unicode escape sequence.`);
            return false;
        }
    }
    function tryReplaceEverySelection(editor, edit) {
        editor.selections.forEach(sel => {
            const selected = editor.document.getText(sel);
            tryReplaceNameWithCharacter(selected, sel, edit) || tryReplaceCodeWithCharacter(selected, sel, edit);
        });
    }
    let disposable = vscode.commands.registerTextEditorCommand(commandName, (editor, edit, args) => {
        // The code you place here will be executed every time your command is executed
        // const editor = vscode.window.activeTextEditor;
        tryReplaceEverySelection(editor, edit);
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map