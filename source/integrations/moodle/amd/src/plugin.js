// SPDX-License-Identifier: GPL-3.0-or-later
/**
 * Adaptador TinyMCE do Moodle. Reconstruir com node integrations/moodle/build.cjs.
 *
 * @module tiny_formulix/plugin
 * @copyright 2026 Formulix contributors
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
define(['require', 'editor_tiny/loader', 'editor_tiny/utils', 'tiny_formulix/bundle'], function(require, loader, utils, bundle) {
    const getString = (key) => new Promise((resolve, reject) => {
        require(['core/str'], (strings) => strings.get_string(key, 'tiny_formulix').then(resolve, reject), reject);
    });
    const nomes = ['equacao', 'contaarmada', 'grafico', 'quimica'];
    return loader.getTinyMCE().then(function(tiny) {
        tiny.PluginManager.add('tiny_formulix/plugin', function(editor) {
            const configuracao = {};
            ['servidor', 'chave', 'contextid', 'upload'].forEach(function(nome) {
                const opcao = 'tiny_formulix/plugin:' + nome;
                editor.options.register(opcao, {processor: nome === 'contextid' ? 'number' : nome === 'upload' ? 'boolean' : 'string'});
                configuracao[nome] = editor.options.get(opcao);
            });
            editor.options.register('formulix_servidor', {processor: 'string'});
            editor.options.register('formulix_chave', {processor: 'string'});
            editor.options.register('formulix_idioma', {processor: 'string'});
            // Fórmulas salvas como \( … \): o filtro MathJax do Moodle exibe também em fórum, tarefa e respostas de aluno,
            // campos em que o HTMLPurifier apagaria o MathML.
            editor.options.register('formulix_formato', {processor: 'string'});
            editor.options.set('formulix_formato', 'tex');
            editor.options.set('formulix_servidor', configuracao.servidor);
            editor.options.set('formulix_chave', configuracao.chave);
            editor.options.set('formulix_idioma', editor.options.get('moodle:currentLanguage') || document.documentElement.lang || 'en');
            editor.options.set('images_upload_handler', async function(blobInfo) {
                if (!configuracao.upload) throw new Error(await getString('uploadnotallowed'));
                const dados = new FormData();
                dados.append('image', blobInfo.blob(), 'formulix.png');
                dados.append('contextid', configuracao.contextid);
                dados.append('itemid', editor.options.get('moodle:draftitemid'));
                dados.append('sesskey', M.cfg.sesskey);
                const resposta = await fetch(M.cfg.wwwroot + '/lib/editor/tiny/plugins/formulix/upload.php', {method: 'POST', body: dados, credentials: 'same-origin'});
                const json = await resposta.json();
                if (!resposta.ok || !json.url) throw new Error(json.message || await getString('uploaderror'));
                return json.url;
            });
            return bundle.iniciar(editor, '');
        });
        return ['tiny_formulix/plugin', {configure: function(config) {
            return {toolbar: utils.addToolbarButtons(config.toolbar, 'content', nomes)};
        }}];
    });
});
