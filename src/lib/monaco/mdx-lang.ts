/*---------------------------------------------------------------------------------------------
 *	Copyright (c) Microsoft Corporation. All rights reserved.
 *	Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { languages } from 'monaco-editor';

enum IndentAction {
    /**
     * Insert new line and copy the previous line's indentation.
     */
    None = 0,
    /**
     * Insert new line and indent once (relative to the previous line's indentation).
     */
    Indent = 1,
    /**
     * Insert two new lines:
     *  - the first one indented which will hold the cursor
     *  - the second one at the same indentation level
     */
    IndentOutdent = 2,
    /**
     * Insert new line and outdent once (relative to the previous line's indentation).
     */
    Outdent = 3
}

export const conf: languages.LanguageConfiguration = {
    comments: {
        blockComment: ['{/*', '*/}'],
    },
    brackets: [['{', '}']],
    autoClosingPairs: [
        { open: '"', close: '"' },
        { open: "'", close: "'" },
        { open: '“', close: '”' },
        { open: '‘', close: '’' },
        { open: '`', close: '`' },
        { open: '{', close: '}' },
        { open: '(', close: ')' },
        { open: '_', close: '_' },
        { open: '**', close: '**' },
        { open: '<', close: '>' },
    ],
    onEnterRules: [
        {
            beforeText: /^\s*- .+/,
            action: {
                indentAction: IndentAction.None,
                appendText: '- ',
            },
        },
        {
            beforeText: /^\s*\+ .+/,
            action: {
                indentAction: IndentAction.None,
                appendText: '+ ',
            },
        },
        {
            beforeText: /^\s*\* .+/,
            action: {
                indentAction: IndentAction.None,
                appendText: '* ',
            },
        },
        {
            beforeText: /^> /,
            action: {
                indentAction: IndentAction.None,
                appendText: '> ',
            },
        },
        {
            beforeText: /<\w+/,
            action: { indentAction: IndentAction.Indent },
        },
        {
            beforeText: /\s+>\s*$/,
            action: { indentAction: IndentAction.Indent },
        },
        {
            beforeText: /<\/\w+>/,
            action: { indentAction: IndentAction.Outdent },
        },
        ...Array.from({ length: 100 }, (_, index) => ({
            beforeText: new RegExp(`^${index}\\. .+`),
            action: {
                indentAction: IndentAction.None,
                appendText: `${index + 1}. `,
            },
        })),
    ],
};

export const language = {
    defaultToken: '',
    tokenPostfix: '.mdx',
    control: /[!#()*+.[\\\]_`{}\-]/,
    escapes: /\\@control/,

    tokenizer: {
        root: [
            /*[
                /^---$/,
                {
                    token: 'meta.content',
                    next: '@frontmatter',
                    nextEmbedded: 'yaml',
                },
            ],*/
            [
                /^\s*import/,
                { token: 'keyword', next: '@import', nextEmbedded: 'js' },
            ],
            [
                /^\s*export/,
                { token: 'keyword', next: '@export', nextEmbedded: 'js' },
            ],
            [/<\w+/, { token: 'type.identifier', next: '@jsx' }],
            [/<\/?\w+>/, 'type.identifier'],
            [
                /^(\s*)(>*\s*)(#{1,6}\s)/,
                [
                    { token: 'white' },
                    { token: 'comment' },
                    { token: 'keyword', next: '@header' },
                ],
            ],
            [
                /^(\s*)(>*\s*)([*+-])(\s+)/,
                ['white', 'comment', 'keyword', 'white'],
            ],
            [
                /^(\s*)(>*\s*)(\d{1,9}\.)(\s+)/,
                ['white', 'comment', 'number', 'white'],
            ],
            [
                /^(\s*)(>*\s*)(\d{1,9}\.)(\s+)/,
                ['white', 'comment', 'number', 'white'],
            ],
            [
                /^(\s*)(>*\s*)(-{3,}|\*{3,}|_{3,})$/,
                ['white', 'comment', 'keyword'],
            ],
            [/`{3,}(\s.*)?$/, { token: 'string', next: '@codeblock_backtick' }],
            [/~{3,}(\s.*)?$/, { token: 'string', next: '@codeblock_tilde' }],
            [
                /`{3,}(\S+).*$/,
                {
                    token: 'string',
                    next: '@codeblock_highlight_backtick',
                    nextEmbedded: '$1',
                },
            ],
            [
                /~{3,}(\S+).*$/,
                {
                    token: 'string',
                    next: '@codeblock_highlight_tilde',
                    nextEmbedded: '$1',
                },
            ],
            [/^(\s*)(-{4,})$/, ['white', 'comment']],
            [/^(\s*)(>+)/, ['white', 'comment']],
            { include: 'content' },
        ],
        content: [
            [
                /(\[)(.+)(]\()(.+)(\s+".*")(\))/,
                ['', 'string.link', '', 'type.identifier', 'string.link', ''],
            ],
            [
                /(\[)(.+)(]\()(.+)(\))/,
                ['', 'type.identifier', '', 'string.link', ''],
            ],
            [
                /(\[)(.+)(]\[)(.+)(])/,
                ['', 'type.identifier', '', 'type.identifier', ''],
            ],
            [
                /(\[)(.+)(]:\s+)(\S*)/,
                ['', 'type.identifier', '', 'string.link'],
            ],
            [/(\[)(.+)(])/, ['', 'type.identifier', '']],
            [/`.*`/, 'variable.source'],
            [/_/, { token: 'emphasis', next: '@emphasis_underscore' }],
            [/\*(?!\*)/, { token: 'emphasis', next: '@emphasis_asterisk' }],
            [/\*\*/, { token: 'strong', next: '@strong' }],
            [
                /{/,
                {
                    token: 'delimiter.bracket',
                    next: '@expression',
                    nextEmbedded: 'js',
                },
            ],
        ],
        import: [
            [
                /'\s*(;|$)/,
                { token: 'string', next: '@pop', nextEmbedded: '@pop' },
            ],
        ],
        expression: [
            [/{/, { token: 'delimiter.bracket', next: '@expression' }],
            [
                /}/,
                {
                    token: 'delimiter.bracket',
                    next: '@pop',
                    nextEmbedded: '@pop',
                },
            ],
        ],
        export: [
            [
                /^\s*$/,
                {
                    token: 'delimiter.bracket',
                    next: '@pop',
                    nextEmbedded: '@pop',
                },
            ],
        ],
        jsx: [
            [/\s+/, ''],
            [
                /([\w\-]+)(=)("(?:[^"\\]|\\.)*")/,
                ['attribute.name', 'operator', 'string'],
            ],
            [
                /([\w\-]+)(=)('(?:[^'\\]|\\.)*')/,
                ['attribute.name', 'operator', 'string'],
            ],
            [/([\w\-]+(?=\s|>|={|$))/, ['attribute.name']],
            [
                /={/,
                {
                    token: 'delimiter.bracket',
                    next: '@expression',
                    nextEmbedded: 'js',
                },
            ],
            [/>/, { token: 'type.identifier', next: '@pop' }],
        ],
        header: [
            [/.$/, { token: 'keyword', next: '@pop' }],
            { include: 'content' },
            [/./, { token: 'keyword' }],
        ],
        strong: [
            [/\*\*/, { token: 'strong', next: '@pop' }],
            { include: 'content' },
            [/./, { token: 'strong' }],
        ],
        emphasis_underscore: [
            [/_/, { token: 'emphasis', next: '@pop' }],
            { include: 'content' },
            [/./, { token: 'emphasis' }],
        ],
        emphasis_asterisk: [
            [/\*(?!\*)/, { token: 'emphasis', next: '@pop' }],
            { include: 'content' },
            [/./, { token: 'emphasis' }],
        ],
        frontmatter: [
            [
                /^---$/,
                { token: 'meta.content', nextEmbedded: '@pop', next: '@pop' },
            ],
        ],
        codeblock_highlight_backtick: [
            [
                /\s*`{3,}\s*$/,
                { token: 'string', next: '@pop', nextEmbedded: '@pop' },
            ],
            [/.*$/, 'variable.source'],
        ],
        codeblock_highlight_tilde: [
            [
                /\s*~{3,}\s*$/,
                { token: 'string', next: '@pop', nextEmbedded: '@pop' },
            ],
            [/.*$/, 'variable.source'],
        ],
        codeblock_backtick: [
            [/\s*`{3,}\s*$/, { token: 'string', next: '@pop' }],
            [/.*$/, 'variable.source'],
        ],
        codeblock_tilde: [
            [/\s*~{3,}\s*$/, { token: 'string', next: '@pop' }],
            [/.*$/, 'variable.source'],
        ],
    },
} satisfies languages.IMonarchLanguage;
