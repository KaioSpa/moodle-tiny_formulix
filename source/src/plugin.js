/* Adaptador TinyMCE 6/7/8. Carregue formulix-ui.js antes deste arquivo, ou use dist/formulix.min.js. */
(function () {
    'use strict';
    function iniciar(editor, url) {
        var UI = window.FormulixUI, I = window.FormulixI18n;
        var tr = I.tr, ICONES = UI.icones, CSS_EDITOR = UI.cssEditor;
        var latexDe = UI.latexDe, markup = UI.markup, mathmlSimples = UI.mathmlSimples;
        var dadosQuimica = UI.dadosQuimica, escAttr = UI.escAttr;
        var embutido = typeof FormulixAssets !== 'undefined' ? FormulixAssets : null;
        editor.options.register('formulix_idioma', { processor: 'string' });
        editor.options.register('formulix_notacao', { processor: 'object' });
        editor.options.register('formulix_servidor', { processor: 'string', default: '' });
        editor.options.register('formulix_chave', { processor: 'string', default: '' });
        editor.options.register('formulix_formato', { processor: 'string', default: 'mathml' }); // 'tex': fórmulas salvas como \( … \)
        var tex = editor.options.get('formulix_formato') === 'tex';
        var formulix = UI.criar({
            url: url, idioma: editor.options.get('formulix_idioma'), notacao: editor.options.get('formulix_notacao'),
            servidor: editor.options.get('formulix_servidor'), chave: editor.options.get('formulix_chave'),
            inserir: inserir, remover: function (alvo) { editor.dom.remove(alvo); },
            focar: function () { editor.focus(); }, imagem: imagemNoEditor
        });
        var abrir = formulix.abrir, inserirNoServidor = formulix.inserirNoServidor;
        editor.on('remove', formulix.fechar);

        // --- conteúdo do editor: <math> ⇄ span.eqx ---

        function desenhar(w) {
            var mml = w.getAttribute('data-mathml');
            var latex = latexDe(mml);
            var destaque = w.hasAttribute('data-bloco') || /^<math[^>]*>\s*<mstyle displaystyle="true">/.test(mml);
            try { w.innerHTML = latex ? markup(latex, destaque) : mml; } catch (e) { w.innerHTML = mml; }
        }

        function envolver() {
            var body = editor.getBody(), doc = editor.getDoc();
            if (!body) return;
            // formato antigo do plugin mathjax: <span class="math-tex">\( … \)</span>
            // (também é o formato salvo com formulix_formato 'tex'; \[ … \] = fórmula em destaque)
            body.querySelectorAll('span.math-tex').forEach(function (s) {
                var txt = s.textContent.trim(), bloco = /^\\\[/.test(txt);
                var latex = txt.replace(/^\\[([]|\\[)\]]$/g, '').trim();
                var t = doc.createElement('template');
                try {
                    t.innerHTML = mathmlSimples(latex);
                    var m = t.content.firstChild;
                    if (bloco) m.setAttribute('display', 'block');
                    if (s.hasAttribute('data-quimica')) m.setAttribute('data-quimica', s.getAttribute('data-quimica'));
                    s.replaceWith(t.content);
                } catch (e) { /* deixa como está */ }
            });
            body.querySelectorAll('math').forEach(function (m) {
                if (m.closest('.eqx')) return;
                var w = doc.createElement('span');
                w.className = 'eqx';
                w.contentEditable = 'false';
                w.setAttribute('data-mathml', m.outerHTML);
                if (m.getAttribute('display') === 'block') w.setAttribute('data-bloco', '1');
                m.replaceWith(w);
                desenhar(w);
            });
            body.querySelectorAll('.conta-armada').forEach(function (d) { d.contentEditable = 'false'; });
        }

        // MathML válido e "com conteúdo": sem isso o TinyMCE apaga um <p>/<div>/<td> que só tem uma fórmula
        editor.on('PreInit', function () {
            var tags = 'math semantics annotation mrow mi mn mo ms mtext mspace msub msup msubsup mfrac msqrt mroot mover munder munderover ' +
                'mtable mtr mtd mstyle mpadded mphantom menclose mfenced mmultiscripts mprescripts none';
            editor.schema.addValidElements(tags.split(' ').map(function (t) { return t + '[*]'; }).join(','));
            editor.schema.getNonEmptyElements().math = {};
        });

        editor.on('init', function () {
            if (embutido) editor.dom.addStyle(embutido.estatico);
            else editor.dom.loadCSS(url + '/vendor/mathlive-static.css');
            editor.dom.addStyle(CSS_EDITOR);
            envolver();
        });
        editor.on('SetContent', envolver);

        // Ctrl+V do Word: equações (OMML) viram fórmulas editáveis; o resto segue o fluxo normal de colar do TinyMCE.
        // Registrado na frente (prepend) para ler o HTML cru antes do TinyMCE limpar os comentários condicionais.
        editor.on('paste', function (e) {
            var d = e.clipboardData;
            if (!d) return;
            var html = d.getData('text/html') || '';
            if (!/msEquation|ProgID="Equation\./.test(html)) return;
            // equações antigas (Equation 3.0 / MathType) só têm os dados de verdade no RTF
            var rtf = '';
            try { rtf = d.getData('text/rtf') || ''; } catch (err) { rtf = ''; }
            // a leitura é no servidor: segura a colagem e devolve ao TinyMCE quando voltar (sem equação lida: o HTML original)
            e.preventDefault();
            e.stopImmediatePropagation();
            var marca = editor.selection.getBookmark(2, true);
            // cada equação convertida conta como uma inserção; sem limite ou sem conexão, entra o HTML original (imagens)
            inserirNoServidor({ tipo: 'word', html: html, rtf: rtf }).then(function (r) { return r.html == null ? html : r.html; }, function () { return html; })
                .then(function (novo) {
                    editor.selection.moveToBookmark(marca);
                    editor.execCommand('mceInsertClipboardContent', false, { html: novo });
                });
        }, true);

        editor.on('PreProcess', function (e) {
            e.node.querySelectorAll('.eqx').forEach(function (w) {
                var t = document.createElement('template');
                t.innerHTML = w.getAttribute('data-mathml');
                if (tex) {
                    // formulix_formato 'tex' (Moodle): campos limpos pelo HTMLPurifier apagam MathML, mas o \( … \) passa e o filtro MathJax desenha
                    var m = t.content.querySelector('math'), s = w.ownerDocument.createElement('span');
                    var latex = (m && m.getAttribute('data-latex')) || latexDe(w.getAttribute('data-mathml'));
                    s.className = 'math-tex';
                    if (m && m.hasAttribute('data-quimica')) s.setAttribute('data-quimica', m.getAttribute('data-quimica'));
                    s.textContent = w.hasAttribute('data-bloco') ? '\\[' + latex + '\\]' : '\\(' + latex + '\\)';
                    return w.replaceWith(s);
                }
                w.replaceWith(t.content);
            });
            e.node.querySelectorAll('.conta-armada').forEach(function (d) {
                d.removeAttribute('contenteditable');
                d.classList.remove('mceNonEditable');
            });
        });

        // conta (que pode conter fórmulas) > gráfico > fórmula
        function alvoDe(node) {
            if (!node || !node.closest) return null;
            return node.closest('.conta-armada') || node.closest('img[data-grafico], img[data-quimica]') || node.closest('.eqx');
        }

        // conta nova entra depois do bloco do cursor (ou no lugar de um parágrafo vazio):
        // dividir o <p> faria ele perder o id que ancora as anotações dos alunos
        function entraDepoisDoBloco(html) {
            var body = editor.getBody(), b = editor.selection.getStart();
            while (b && b.parentNode !== body) b = b.parentNode;
            if (!b || b === body) return false;
            var novo = editor.dom.createFragment(html).firstChild;
            if (b.nodeName === 'P' && !b.textContent.trim() && !b.querySelector('img,.eqx,.conta-armada')) b.replaceWith(novo);
            else b.after(novo);
            envolver();
            editor.selection.select(novo);
            return true;
        }

        function inserir(html, alvo, bloco) {
            editor.undoManager.transact(function () {
                var sel = alvoDe(editor.selection.getNode());
                if (alvo) editor.selection.select(alvo);
                // item novo com outra fórmula/conta selecionada: insere depois dela, sem substituir
                else if (sel) { editor.selection.select(sel); editor.selection.collapse(false); }
                if (bloco && !alvo && entraDepoisDoBloco(html)) return;
                editor.insertContent(html);
                envolver();
            });
            editor.focus();
        }

        // --- botões ---

        editor.ui.registry.addIcon('eqx-equacao', ICONES.equacao);
        editor.ui.registry.addIcon('eqx-conta', ICONES.conta);
        editor.ui.registry.addButton('equacao', {
            icon: 'eqx-equacao', tooltip: tr('Fórmula (Ctrl+Shift+M)'),
            onAction: function () { var a = alvoDe(editor.selection.getNode()); abrir('formula', a && a.classList.contains('eqx') ? a : null); }
        });
        editor.ui.registry.addButton('contaarmada', {
            icon: 'eqx-conta', tooltip: tr('Armar conta'),
            onAction: function () { var a = alvoDe(editor.selection.getNode()); abrir('conta', a && a.classList.contains('conta-armada') ? a : null); }
        });
        editor.ui.registry.addIcon('eqx-grafico', ICONES.grafico);
        editor.ui.registry.addButton('grafico', {
            icon: 'eqx-grafico', tooltip: tr('Gráfico de função'),
            onAction: function () { var a = alvoDe(editor.selection.getNode()); abrir('grafico', a && a.nodeName === 'IMG' ? a : null); }
        });
        editor.ui.registry.addIcon('eqx-quimica', ICONES.quimica);
        editor.ui.registry.addButton('quimica', {
            icon: 'eqx-quimica', tooltip: tr('Química'),
            onAction: function () { var a = alvoDe(editor.selection.getNode()); abrir('quimica', a && dadosQuimica(a) ? a : null); }
        });
        editor.ui.registry.addButton('eqxeditar', {
            icon: 'edit-block', text: tr('Editar'),
            onAction: function () { var a = alvoDe(editor.selection.getNode()); if (a) abrir(null, a); }
        });
        editor.ui.registry.addButton('eqxremover', {
            icon: 'remove', tooltip: tr('Remover'),
            onAction: function () { var a = alvoDe(editor.selection.getNode()); if (a) { editor.undoManager.transact(function () { editor.dom.remove(a); }); } }
        });
        editor.ui.registry.addContextToolbar('equacao', {
            predicate: function (n) { return !!alvoDe(n) && alvoDe(n) === n; },
            items: 'eqxeditar eqxremover', position: 'node', scope: 'node'
        });
        editor.addShortcut('meta+shift+m', tr('Fórmula'), function () { abrir('formula', alvoDe(editor.selection.getNode())); });
        editor.on('dblclick', function (e) { var a = alvoDe(e.target); if (a) { e.preventDefault(); abrir(null, a); } });

        function imagemNoEditor(blob, r, attr, alvo) {
            return new Promise(function (ok) {
                var leitor = new FileReader();
                leitor.onload = function () {
                    var cache = editor.editorUpload.blobCache;
                    var info = cache.create('grafico' + Date.now(), blob, String(leitor.result).split(',')[1], 'grafico.png');
                    cache.add(info);
                    var alt = r.alt || (r.funcoes && r.funcoes.length ? tr('Gráfico de {0}', r.funcoes.join(', ')) : tr('Gráfico'));
                    var img = '<img src="' + info.blobUri() + '" width="' + r.w + '" height="' + r.h + '" alt="' + escAttr(alt) + '" ' + attr + ' style="max-width:100%;height:auto;">';
                    if (alvo) inserir(img, alvo);
                    else inserir('<p style="text-align:center">' + img + '</p>', null, true);
                    editor.uploadImages();
                    ok();
                };
                leitor.readAsDataURL(blob);
            });
        }

        return { getMetadata: function () { return { name: 'Formulix — fórmulas, contas armadas, gráficos e química'}; } };
    }

    window.FormulixTinyMCE = { iniciar: iniciar };
    if (typeof tinymce !== 'undefined') {
        tinymce.PluginManager.add('formulix', iniciar);
        tinymce.PluginManager.add('equacao', iniciar); // nome antigo, usado no Estudoon
    }
})();
