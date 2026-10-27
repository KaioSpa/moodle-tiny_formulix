'use strict';
const fs = require('fs'), path = require('path');
const { buildSync } = require('esbuild');
const raiz = path.resolve(__dirname, '..');
const destino = path.join(raiz, 'dist/integrations');
const alvo = process.argv[2] || 'moodle';
if(alvo === 'all') {
    for(const nome of ['moodle','ckeditor5','wordpress','drupal','tiptap']) {
        const r=require('child_process').spawnSync(process.execPath,[__filename,nome],{stdio:'inherit'});
        if(r.status!==0) process.exit(r.status || 1);
    }
    return;
}
if(alvo === 'tiptap') {
    const pasta=path.join(destino,'tiptap');
    fs.mkdirSync(pasta,{recursive:true});
    for(const nome of ['formulix-ui.min.js'])fs.copyFileSync(path.join(raiz,'dist',nome),path.join(pasta,nome));
    fs.copyFileSync(path.join(raiz,'integrations/tiptap/README.md'),path.join(pasta,'README.md'));
    fs.writeFileSync(path.join(pasta,'package.json'),JSON.stringify({name:'formulix-tiptap',description:'Formulix: formulas, long-hand arithmetic, graphs and chemistry for Tiptap (uses the Formulix API).',keywords:['tiptap','tiptap-extension','math','chemistry','education'],homepage:'https://for-muli-x.com/docs/tiptap.html',bugs:{email:'suporte@for-muli-x.com'},author:'Formulix',version:require('../package.json').version,type:'module',exports:{'.':'./index.js','./formulix-ui.min.js':'./formulix-ui.min.js'},files:['index.js','formulix-ui.min.js','README.md','source/','LICENSE.txt','DOMPURIFY_LICENSE.txt','THIRD_PARTY_NOTICES.txt'],peerDependencies:{'@tiptap/core':'^3.32.0','@tiptap/pm':'^3.32.0'},license:'GPL-3.0-or-later'},null,2));
    buildSync({entryPoints:[path.join(raiz,'integrations/tiptap/src/index.js')],outfile:path.join(pasta,'index.js'),bundle:true,format:'esm',external:['@tiptap/core','@tiptap/pm/*'],minify:true});
    if(fs.existsSync(path.join(raiz,'tests/e2e/tiptap-entry.js')))buildSync({entryPoints:[path.join(raiz,'tests/e2e/tiptap-entry.js')],outfile:path.join(pasta,'test-editor.js'),bundle:true,format:'iife',minify:true});
    console.log('Tiptap: '+pasta);return;
}
if (alvo === 'drupal') {
    const pasta=path.join(destino,'drupal/formulix');
    fs.mkdirSync(path.join(pasta,'assets'),{recursive:true});
    fs.cpSync(path.join(raiz,'integrations/drupal'),pasta,{recursive:true});
    fs.copyFileSync(path.join(raiz,'dist/formulix-ui.min.js'),path.join(pasta,'assets/formulix-ui.min.js'));
    buildSync({entryPoints:[path.join(raiz,'integrations/drupal/editor.js')],outfile:path.join(pasta,'assets/formulix.js'),bundle:true,format:'iife',alias:{ckeditor5:path.join(raiz,'integrations/drupal/ckeditor-shim.js')},minify:true});
    console.log('Drupal: '+pasta);return;
}
if (alvo === 'wordpress') {
    const pasta = path.join(destino,'wordpress/formulix');
    fs.mkdirSync(path.join(pasta,'assets'),{recursive:true});
    fs.cpSync(path.join(raiz,'integrations/wordpress'),pasta,{recursive:true});
    fs.copyFileSync(path.join(raiz,'dist/formulix-ui.min.js'),path.join(pasta,'assets/formulix-ui.min.js'));
    buildSync({entryPoints:[path.join(raiz,'integrations/wordpress/editor.js')],outfile:path.join(pasta,'assets/editor.js'),bundle:true,format:'iife',minify:true});
    console.log('WordPress: '+pasta); return;
}
if (alvo === 'ckeditor5') {
    const pasta = path.join(destino, 'ckeditor5');
    fs.mkdirSync(pasta, {recursive:true});
    fs.copyFileSync(path.join(raiz,'integrations/ckeditor5/README.md'),path.join(pasta,'README.md'));
    fs.copyFileSync(path.join(raiz,'dist/formulix-ui.min.js'),path.join(pasta,'formulix-ui.min.js'));
    fs.writeFileSync(path.join(pasta,'package.json'),JSON.stringify({name:'formulix-ckeditor5',description:'Formulix: formulas, long-hand arithmetic, graphs and chemistry for CKEditor 5 (uses the Formulix API).',keywords:['ckeditor5','ckeditor5-plugin','math','chemistry','education'],homepage:'https://for-muli-x.com/docs/ckeditor5.html',bugs:{email:'suporte@for-muli-x.com'},author:'Formulix',version:require('../package.json').version,type:'module',exports:{'.':'./index.js','./formulix-ui.min.js':'./formulix-ui.min.js'},files:['index.js','formulix-ui.min.js','README.md','source/','LICENSE.txt','DOMPURIFY_LICENSE.txt','THIRD_PARTY_NOTICES.txt'],peerDependencies:{ckeditor5:'^49.0.0'},license:'GPL-3.0-or-later'},null,2));
    buildSync({entryPoints:[path.join(raiz,'integrations/ckeditor5/src/index.js')],outfile:path.join(pasta,'index.js'),bundle:true,format:'esm',external:['ckeditor5'],minify:true});
    if(fs.existsSync(path.join(raiz,'tests/e2e/ckeditor-entry.js'))) buildSync({entryPoints:[path.join(raiz,'tests/e2e/ckeditor-entry.js')],outfile:path.join(pasta,'test-editor.js'),bundle:true,format:'iife',loader:{'.svg':'dataurl'},minify:true});
    console.log('CKEditor 5: ' + pasta);
    return;
}
if (alvo !== 'moodle') throw new Error('Integração ainda indisponível: ' + alvo);
const pasta = path.join(destino, 'moodle/formulix');
// um só caminho de build AMD: o do próprio plugin (amd/src → amd/build), depois a cópia
require(path.join(raiz, 'integrations/moodle/build.cjs'));
fs.mkdirSync(pasta, {recursive:true});
fs.cpSync(path.join(raiz, 'integrations/moodle'), pasta, {recursive:true});
console.log('Moodle: ' + pasta);
