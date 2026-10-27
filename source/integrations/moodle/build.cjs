// SPDX-License-Identifier: GPL-3.0-or-later
// Reconstrói somente os arquivos AMD deste plugin com as dependências já instaladas.
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const {transformSync} = require('esbuild');
const root = path.resolve(__dirname, '../..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const css = read('src/vendor/mathlive-static.css').replace(/url\(fonts\/([\w.-]+)\)/g, (_, name) =>
    'url(data:font/woff2;base64,' + fs.readFileSync(path.join(root, 'src/vendor/fonts', name)).toString('base64') + ')');
const assets = {estatico: css, dialogo: read('src/equacao.css')};
const files = ['vendor/mathlive.min.js', 'vendor/mathml-to-latex.min.js', 'i18n.js',
    ...fs.readdirSync(path.join(root, 'src/locales')).filter(name => name.endsWith('.js')).sort().map(name => 'locales/' + name),
    'formulix-ui.js', 'plugin.js'];
const licenses = ['src/vendor/LICENSE.txt', 'src/vendor/mathml-to-latex-LICENSE.md'].map(read).join('\n');
const source = '/*! Formulix browser bundle. See readme_moodle.txt for sources and rebuild instructions.\n'
    + licenses.replace(/\*\//g, '* /') + '\n*/\n'
    + 'define([], function() {\n(function() {var define, module, exports; var FormulixAssets = ' + JSON.stringify(assets) + ';\n'
    + files.map(name => read('src/' + name)).join('\n;\n') + '\n})();\nreturn window.FormulixTinyMCE;\n});\n';
fs.writeFileSync(path.join(__dirname, 'amd/src/bundle.js'), source);
fs.mkdirSync(path.join(__dirname, 'amd/build'), {recursive: true});
for (const name of ['plugin', 'bundle']) {
    const result = transformSync(fs.readFileSync(path.join(__dirname, 'amd/src', name + '.js'), 'utf8'), {
        minify: true, target: 'es2020', legalComments: 'inline',
    });
    fs.writeFileSync(path.join(__dirname, 'amd/build', name + '.min.js'), result.code);
}
console.log('Moodle: fontes e builds AMD atualizados em integrations/moodle/amd/');
