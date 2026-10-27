'use strict';
const fs = require('fs');
const path = require('path');
const { transformSync } = require('esbuild');
const raiz = path.join(__dirname, '..');
const ler = p => fs.readFileSync(path.join(raiz, p), 'utf8');
const estatico = ler('src/vendor/mathlive-static.css').replace(/url\(fonts\/([\w.-]+)\)/g, (_, nome) =>
    'url(data:font/woff2;base64,' + fs.readFileSync(path.join(raiz, 'src/vendor/fonts', nome)).toString('base64') + ')');
const ativos = { estatico, dialogo: ler('src/equacao.css') };
const arquivos = ['vendor/mathlive.min.js', 'vendor/mathml-to-latex.min.js', 'i18n.js',
    ...fs.readdirSync(path.join(raiz, 'src/locales')).filter(n => n.endsWith('.js')).sort().map(n => 'locales/' + n), 'formulix-ui.js', 'plugin.js'];
const licencas = ['src/vendor/LICENSE.txt', 'src/vendor/mathml-to-latex-LICENSE.md'].map(ler).join('\n').replace(/\*\//g, '* /');
fs.mkdirSync(path.join(raiz, 'dist'), { recursive: true });
for (const nome of ['formulix.min.js', 'formulix-ui.min.js']) {
    const fontes = nome === 'formulix.min.js' ? arquivos : arquivos.filter(n => n !== 'plugin.js');
    const resultado = transformSync('(function(){var define, module, exports; var FormulixAssets=' + JSON.stringify(ativos) + ';\n' + fontes.map(n => ler('src/' + n)).join('\n;\n') + '\n})();', {
        minify: true, target: 'es2020', legalComments: 'inline',
        banner: '/*! Formulix ' + require('../package.json').version + '\n' + licencas + '\n*/'
    });
    fs.writeFileSync(path.join(raiz, 'dist', nome), resultado.code);
    console.log('dist/' + nome + ': ' + Buffer.byteLength(resultado.code).toLocaleString('pt-BR') + ' bytes (JS, CSS, idiomas e fontes)');
}
