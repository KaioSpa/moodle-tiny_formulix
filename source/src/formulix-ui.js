/* Interface do Formulix: diálogo e API, sem dependência de editor. Hospedeiro: inserir, remover, focar e imagem. */
(function () {
    'use strict';

    // A integração carrega i18n.js antes da interface.
    // shortcut: idioma e notação são globais na página; isolar antes de suportar instâncias com idiomas simultâneos diferentes.
    var I = window.FormulixI18n || { tr: function (s) { return s; }, num: function (v) { return String(v).replace('.', ','); }, idioma: 'pt-BR', dec: ',' };
    var tr = I.tr;

    // ---------- paletas ----------
    // [latex inserido (#@ = seleção/termo anterior, #? = lacuna), dica, ícone opcional]
    var RAPIDOS = [
        ['\\frac{#@}{#?}', 'Fração', null, 'fr'],
        ['#@^{#?}', 'Potência', null, 'pot'],
        ['\\sqrt{#@}', 'Raiz quadrada'],
        ['\\sqrt[#?]{#@}', 'Raiz de índice n'],
        ['#@_{#?}', 'Índice (subscrito)'],
        ['\\left(#@\\right)', 'Parênteses'],
        ['\\left|#@\\right|', 'Módulo'],
        ['\\pm', 'Mais ou menos'],
        ['\\cdot', 'Multiplicação (ponto)'],
        ['\\times', 'Multiplicação (×)'],
        ['\\div', 'Divisão'],
        ['\\neq', 'Diferente'],
        ['\\leq', 'Menor ou igual'],
        ['\\geq', 'Maior ou igual'],
        ['\\approx', 'Aproximadamente'],
        ['\\pi', 'Pi'],
        ['#@^{\\circ}', 'Grau', '\\placeholder{}^{\\circ}'],
        ['\\%', 'Porcentagem']
    ];

    var CATEGORIAS = [
        { nome: 'Álgebra', itens: [
            ['\\begin{cases}#?\\\\#?\\end{cases}', 'Sistema (2 equações)', null, 'w'],
            ['\\begin{cases}#?\\\\#?\\\\#?\\end{cases}', 'Sistema (3 equações)', null, 'w'],
            ['\\Delta=b^2-4ac', 'Discriminante (Δ)', null, 'w'],
            ['x=\\frac{-b\\pm\\sqrt{\\Delta}}{2a}', 'Fórmula de Bhaskara', null, 'w'],
            ['\\left[#@\\right]', 'Colchetes'],
            ['\\left\\{#@\\right\\}', 'Chaves'],
            ['\\log_{#?}{#?}', 'Logaritmo na base'],
            ['\\log', 'Logaritmo decimal'],
            ['\\ln', 'Logaritmo natural'],
            ['#@!', 'Fatorial'],
            ['\\binom{#?}{#?}', 'Binomial'],
            ['\\infty', 'Infinito'],
            ['\\left[#?,#?\\right]', 'Intervalo fechado', null, 'w'],
            ['\\left]#?,#?\\right[', 'Intervalo aberto', null, 'w'],
            ['\\equiv', 'Equivalente / congruente'],
            ['\\propto', 'Proporcional']
        ] },
        { nome: 'Matrizes', itens: [
            ['\\begin{pmatrix}#?&#?\\\\#?&#?\\end{pmatrix}', 'Matriz 2×2', null, 'w'],
            ['\\begin{pmatrix}#?&#?&#?\\\\#?&#?&#?\\\\#?&#?&#?\\end{pmatrix}', 'Matriz 3×3', null, 'w'],
            ['\\begin{bmatrix}#?&#?\\\\#?&#?\\end{bmatrix}', 'Matriz 2×2 (colchetes)', null, 'w'],
            ['\\begin{vmatrix}#?&#?\\\\#?&#?\\end{vmatrix}', 'Determinante 2×2', null, 'w'],
            ['\\begin{vmatrix}#?&#?&#?\\\\#?&#?&#?\\\\#?&#?&#?\\end{vmatrix}', 'Determinante 3×3', null, 'w'],
            ['\\begin{pmatrix}#?\\\\#?\\end{pmatrix}', 'Matriz coluna'],
            ['#@^{t}', 'Transposta', '\\placeholder{}^{t}'],
            ['#@^{-1}', 'Inversa', '\\placeholder{}^{-1}']
        ] },
        { nome: 'Geometria', itens: [
            ['\\hat{#@}', 'Ângulo (Â)'],
            ['\\angle', 'Ângulo'],
            ['\\overline{#@}', 'Segmento'],
            ['\\overleftrightarrow{#@}', 'Reta'],
            ['\\overrightarrow{#@}', 'Semirreta / vetor'],
            ['\\vec{#@}', 'Vetor'],
            ['\\overset{\\frown}{#@}', 'Arco'],
            ['\\triangle', 'Triângulo'],
            ['\\parallel', 'Paralelo'],
            ['\\perp', 'Perpendicular'],
            ['\\cong', 'Congruente'],
            ['\\sim', 'Semelhante'],
            ['^{\\prime}', 'Minuto (′)', '\\placeholder{}^{\\prime}'],
            ['^{\\prime\\prime}', 'Segundo (″)', '\\placeholder{}^{\\prime\\prime}']
        ] },
        { nome: 'Trigonometria', itens: [
            ['\\operatorname{sen}', 'Seno'],
            ['\\cos', 'Cosseno'],
            ['\\operatorname{tg}', 'Tangente'],
            ['\\operatorname{cotg}', 'Cotangente'],
            ['\\sec', 'Secante'],
            ['\\operatorname{cossec}', 'Cossecante'],
            ['\\operatorname{sen}^2', 'Seno ao quadrado'],
            ['\\cos^2', 'Cosseno ao quadrado'],
            ['\\operatorname{arcsen}', 'Arco-seno'],
            ['\\theta', 'Teta'],
            ['\\alpha', 'Alfa'],
            ['\\beta', 'Beta']
        ] },
        { nome: 'Conjuntos', itens: [
            ['\\in', 'Pertence'], ['\\notin', 'Não pertence'],
            ['\\subset', 'Está contido'], ['\\not\\subset', 'Não está contido'], ['\\supset', 'Contém'],
            ['\\cup', 'União'], ['\\cap', 'Interseção'], ['\\setminus', 'Diferença'],
            ['\\varnothing', 'Conjunto vazio'],
            ['\\mathbb{N}', 'Naturais'], ['\\mathbb{Z}', 'Inteiros'], ['\\mathbb{Q}', 'Racionais'],
            ['\\mathbb{R}', 'Reais'], ['\\mathbb{C}', 'Complexos'], ['\\mathbb{R}^*', 'Reais não nulos'],
            ['\\left\\{#?\\right\\}', 'Conjunto { }'],
            ['\\left\\{x\\in\\mathbb{R}\\mid #?\\right\\}', 'Conjunto por propriedade', null, 'w'],
            ['\\forall', 'Para todo'], ['\\exists', 'Existe']
        ] },
        { nome: 'Gregas', itens: [
            ['\\alpha'], ['\\beta'], ['\\gamma'], ['\\delta'], ['\\Delta'], ['\\varepsilon'], ['\\theta'],
            ['\\lambda'], ['\\mu'], ['\\pi'], ['\\rho'], ['\\sigma'], ['\\Sigma'], ['\\varphi'], ['\\omega'], ['\\Omega']
        ] },
        { nome: 'Setas e lógica', itens: [
            ['\\rightarrow', 'Seta'], ['\\Rightarrow', 'Implica'], ['\\Leftrightarrow', 'Se e somente se'],
            ['\\leftarrow', 'Seta para a esquerda'], ['\\leftrightarrow', 'Seta dupla'],
            ['\\therefore', 'Portanto'], ['\\because', 'Pois'],
            ['\\land', 'E'], ['\\lor', 'Ou'], ['\\neg', 'Não'],
            ['\\uparrow', 'Para cima'], ['\\downarrow', 'Para baixo']
        ] },
        { nome: 'Cálculo', itens: [
            ['\\lim_{#?\\to#?}', 'Limite', null, 'w'],
            ['\\sum_{#?}^{#?}', 'Somatório'],
            ['\\prod_{#?}^{#?}', 'Produtório'],
            ['\\int_{#?}^{#?}#?\\,d#?', 'Integral definida', null, 'w'],
            ['\\int #?\\,d#?', 'Integral'],
            ['\\frac{d}{dx}', 'Derivada'],
            ['#@^{\\prime}', 'Linha (f′)', '\\placeholder{}^{\\prime}'],
            ['\\partial', 'Derivada parcial']
        ] }
    ];

    // ---------- armar conta / gráfico: formulários ----------
    // campo: [chave, tipo, rótulo, padrão, extra]
    //   t = texto (extra: {dica, ph, meia}) · n = contador 0–4 · sw = interruptor
    //   seg = escolha (extra: [[valor, rótulo]]) · lista = várias entradas (extra: {min, max, add, ph, cor(i)}; rótulo(i))
    // o cálculo de cada operação roda no servidor (POST /v1/calc com op = chave do objeto)
    var NOMES_F = ['f', 'g', 'h', 'p', 'q'], CORES_F = ['#2563eb', '#e0457b', '#16a34a', '#f59e0b', '#7c3aed']; // iguais a server/nucleo/grafico.js

    var OPS = {
        divisao: { nome: 'Divisão', simb: '÷',
            campos: [['a', 't', 'Dividendo', '1035'], ['b', 't', 'Divisor', '15'],
                ['casas', 'n', 'Casas decimais no quociente', 0], ['breve', 'sw', 'Processo breve (sem escrever as subtrações)', false]],
            resumo: function (r) { return tr('Quociente') + ' <b>' + r.quoc + '</b> · ' + tr('Resto') + ' <b>' + r.resto + '</b>'; } },
        multiplicacao: { nome: 'Multiplicação', simb: '×',
            campos: [['a', 't', '1º fator', '347'], ['b', 't', '2º fator', '26'], ['vaiUm', 'sw', 'Mostrar o “vai um” (fator de 1 algarismo)', true]],
            resumo: function (r) { return tr('Produto') + ' <b>' + r.resultado + '</b>' + (r.casas ? ' · ' + tr(r.casas > 1 ? '{0} casas decimais no total' : '{0} casa decimal no total', r.casas) : ''); } },
        adicao: { nome: 'Adição', simb: '+',
            campos: [['termos', 'lista', function (i) { return tr('Parcela {0}', i + 1); }, ['258', '67,5', '9'], { min: 2, max: 6, add: '+ Adicionar parcela' }],
                ['vaiUm', 'sw', 'Mostrar o “vai um”', true]],
            resumo: function (r) { return tr('Soma') + ' <b>' + r.resultado + '</b>'; } },
        subtracao: { nome: 'Subtração', simb: '−',
            campos: [['a', 't', 'Minuendo (de cima)', '503'], ['b', 't', 'Subtraendo', '178'], ['emprestimo', 'sw', 'Mostrar os empréstimos', true]],
            resumo: function (r) { return tr('Diferença') + ' <b>' + r.resultado + '</b>'; } },

        // ----- "Mais contas" -----
        mmc: { grupo: 'Aritmética', nome: 'MMC e MDC', simb: 'mmc', desc: 'Decomposição simultânea',
            campos: [['nums', 't', 'Números', '12 18', { dica: 'Separe com espaço (de 2 a 4 números).' }],
                ['modo', 'seg', 'Calcular', 'mmc', [['mmc', 'MMC'], ['mdc', 'MDC'], ['ambos', 'Os dois']]]] },
        fatoracao: { grupo: 'Aritmética', nome: 'Fatoração', simb: '360|2', desc: 'Decomposição em fatores primos',
            campos: [['n', 't', 'Número', '360']] },
        fracoes: { grupo: 'Aritmética', nome: 'Frações', simb: '½+⅓', desc: 'Soma, subtração, produto e divisão',
            campos: [['a', 't', '1ª fração', '3/4', { meia: true }], ['b', 't', '2ª fração', '5/6', { meia: true }],
                ['op', 'seg', 'Operação', '+', [['+', '+'], ['-', '−'], ['*', '×'], ['/', '÷']]]] },
        regra3: { grupo: 'Aritmética', nome: 'Regra de três', simb: 'a→b', desc: 'Direta ou inversa',
            campos: [['ga', 't', 'Grandeza A', '', { meia: true, ph: 'ex.: Horas' }], ['gb', 't', 'Grandeza B', '', { meia: true, ph: 'ex.: Km' }],
                ['a1', 't', 'A (1º valor)', '2', { meia: true }], ['b1', 't', 'B (1º valor)', '10', { meia: true }],
                ['a2', 't', 'A (2º valor)', '5', { meia: true }],
                ['tipo', 'seg', 'Proporção', 'direta', [['direta', 'Direta'], ['inversa', 'Inversa']]]] },
        eq1: { grupo: 'Álgebra', nome: 'Equação do 1º grau', simb: 'ax+b', desc: 'Isolando a incógnita',
            campos: [['eq', 't', 'Equação', '3(x − 2) = 2x + 5', { dica: 'Aceita parênteses e frações, como x/2 + 1 = 4.' }]] },
        eq2: { grupo: 'Álgebra', nome: 'Equação do 2º grau', simb: 'Δ', desc: 'Bhaskara passo a passo',
            campos: [['eq', 't', 'Equação', 'x² − 5x + 6 = 0', { dica: 'Digite x² ou x^2.' }]] },
        sistema: { grupo: 'Álgebra', nome: 'Sistema 2×2', simb: '{', desc: 'Adição ou substituição',
            campos: [['eq1', 't', '1ª equação', '2x + 3y = 12'], ['eq2', 't', '2ª equação', '3x − 2y = 5'],
                ['metodo', 'seg', 'Método', 'adicao', [['adicao', 'Adição'], ['substituicao', 'Substituição']]]] },
        ruffini: { grupo: 'Álgebra', nome: 'Briot-Ruffini', simb: 'P(x)', desc: 'Divisão de polinômio por (x − a)',
            campos: [['coefs', 't', 'Coeficientes', '1 -5 6', { dica: 'Do maior grau ao termo independente; use 0 nos que faltam.' }], ['raiz', 't', 'Raiz (o a de x − a)', '2']],
            resumo: function (r) { return tr('Quociente') + ' <b>' + r.quociente.join('  ') + '</b> · ' + tr('Resto') + ' <b>' + r.resto + '</b>'; } },
        tabela: { grupo: 'Funções', nome: 'Tabela de valores', simb: 'x|y', desc: 'Substituindo x na função',
            campos: [['f', 't', 'Função', 'f(x) = 2x + 3'], ['xs', 't', 'Valores de x', '-2 -1 0 1 2', { dica: 'Ou um intervalo: -3..3' }],
                ['par', 'sw', 'Coluna com o par ordenado (x; y)', true]] },
        estudo: { grupo: 'Funções', nome: 'Estudo da função', simb: 'f(x)', desc: 'Zeros, vértice e crescimento',
            campos: [['f', 't', 'Função do 1º ou 2º grau', 'f(x) = x² − 4x + 3']] }
    };
    var PRINCIPAIS = ['divisao', 'multiplicacao', 'adicao', 'subtracao'];
    var CAMPO_POSICAO = ['alinhar', 'seg', 'Posição no texto', 'esq', [['esq', 'À esquerda'], ['centro', 'Centralizada']]];

    var GRAF = [
        ['funcs', 'lista', function (i) { return NOMES_F[i] + '(x) ='; }, ['x² − 4x + 3'],
            { min: 1, max: 5, add: '+ Adicionar função', ph: 'ex.: 2x + 1', cor: function (i) { return CORES_F[i]; } }],
        ['xmin', 't', 'x mínimo', '-2', { meia: true }], ['xmax', 't', 'x máximo', '6', { meia: true }],
        ['ymin', 't', 'y mínimo', '', { meia: true, ph: 'automático' }], ['ymax', 't', 'y máximo', '', { meia: true, ph: 'automático' }],
        ['marcar', 'chips', 'Marcar automaticamente', ['raizes', 'extremos', 'eixoy', 'intersecoes'],
            [['raizes', 'Raízes'], ['extremos', 'Vértice / máx. e mín.'], ['eixoy', 'Corte no eixo y'], ['intersecoes', 'Interseções']]],
        ['pts', 'pontos', 'Pontos', [], { dica: 'Dica: clique no gráfico para marcar um ponto (ele “gruda” na curva).' }],
        ['projecao', 'sw', 'Linhas tracejadas dos pontos até os eixos', true],
        ['grade', 'sw', 'Quadriculado', true], ['legenda', 'sw', 'Legenda', true],
        ['tamanho', 'seg', 'Tamanho da imagem', 'm', [['p', 'Pequeno'], ['m', 'Médio'], ['g', 'Grande']]]
    ];

    // ---------- química ----------
    function numBR(v) { return I.num(Math.round(v * 1000) / 1000); }
    var CORES_LIQ = ['#4f9ad8', '#e0457b', '#f2b134', '#3fb27f', '#8b5cf6', '#f97316', '#9aa3b2', '#ffffff'];
    var OPC_VIDRARIAS = Object.keys({ bequer: 1, erlenmeyer: 1, volumetrico: 1, redondo: 1, proveta: 1, bureta: 1, pipeta: 1, tubo: 1, funil: 1 });

    var QOPS = {
        qeq: { nome: 'Equação química', simb: '⇌',
            campos: [
                ['eq', 't', 'Fórmula ou equação', 'CH4 + O2 -> CO2 + H2O', {
                    dica: 'Carga com ^ (Fe^3+, SO4^2-), estado no fim (aq), hidrato com · e condição na seta: ->[Δ].',
                    atalhos: [['→', ' -> '], ['⇌', ' <=> '], ['+', ' + '], ['→ com Δ', ' ->[Δ] '], ['→ com catalisador', ' ->[cat] '], ['(s)', '(s)'], ['(ℓ)', '(l)'],
                        ['(g)', '(g)'], ['(aq)', '(aq)'], ['↑ gás', '↑'], ['↓ precipitado', '↓'], ['· hidrato', '·'], ['⁺', '^+'], ['⁻', '^-'], ['²⁺', '^2+'], ['²⁻', '^2-'], ['e⁻', 'e-']]
                }],
                ['balancear', 'sw', 'Balancear automaticamente', false],
                ['conferir', 'sw', 'Mostrar a contagem de átomos (insere como bloco)', false],
                ['destaque', 'sw', 'Em destaque (linha própria)', false]
            ],
            resumo: function (r) {
                if (!r.contagem) return '';
                return r.balanceada ? '<span class="eqd-ok-txt">' + tr('✓ Equação balanceada') + '</span>'
                    : tr('⚠ Não balanceada: {0} — ligue “{1}”.', r.contagem.filter(function (c) { return Math.abs(c.r - c.p) > 1e-9; }).map(function (c) { return c.el + ' (' + numBR(c.r) + ' × ' + numBR(c.p) + ')'; }).join(', '),
                        tr('Balancear automaticamente'));
            } },
        qmassa: { nome: 'Massa molar', simb: 'g/mol',
            campos: [
                ['f', 't', 'Fórmula', 'H2SO4', { dica: 'Aceita parênteses e hidratos: Ca(OH)2, CuSO4·5H2O.' }],
                ['massas', 'seg', 'Massas atômicas', 'escola', [['escola', 'Arredondadas'], ['tabela', 'Da tabela']]],
                ['calcular', 'seg', 'Calcular também', 'molar', [['molar', 'Só a massa molar'], ['massa', 'Massa (de mols)'], ['mols', 'Mols (de massa)']]],
                ['qtd', 't', 'Quantidade (mol ou g)', '', { ph: 'ex.: 2' }]
            ],
            resumo: function (r) { return 'M = <b>' + numBR(r.massa) + ' g/mol</b>' + (r.resultado != null ? ' · ' + tr('resultado') + ' <b>' + numBR(r.resultado) + '</b>' : ''); } },
        qdist: { nome: 'Distribuição eletrônica', simb: '1s²',
            campos: [
                ['el', 't', 'Elemento', 'Fe', { dica: 'Símbolo, nome ou número atômico.', meia: true }],
                ['carga', 't', 'Carga do íon', '0', { meia: true, ph: 'ex.: 2 ou -2' }]
            ],
            resumo: function (r) { return '<b>' + r.config.replace(/(\d)([spdf])(\d+)/g, '$1$2<sup>$3</sup>') + '</b>'; } },
        qtab: { nome: 'Tabela periódica', simb: 'Fe', tabela: true,
            campos: [
                ['el', 't', 'Elemento', 'Fe', { dica: 'Clique na tabela ao lado ou digite.' }],
                ['saida', 'seg', 'Inserir como', 'notacao', [['notacao', '¹²₆C'], ['simbolo', 'Símbolo'], ['nome', 'Nome'], ['ficha', 'Ficha']]],
                ['massas', 'seg', 'Massa na ficha', 'escola', [['escola', 'Arredondada'], ['tabela', 'Da tabela']]]
            ],
            resumo: function (r) {
                var el = r.info; // nome e categoria já vêm no idioma pedido
                return el ? '<b>' + el.nome + '</b> · Z = ' + el.z + ' · ' + tr('massa') + ' ' + numBR(el.massa) + ' u · ' + el.categoria : '';
            } },

        // ----- "Mais" -----
        qvid: { grupo: 'Laboratório', nome: 'Vidrarias', simb: '⚗', desc: 'Béquer, proveta, bureta, balões…',
            campos: [['itens', 'linhas', 'Vidrarias (lado a lado)', [{ tipo: 'bequer', nivel: '55', cor: '#4f9ad8', rot: 'Água' }, { tipo: 'erlenmeyer', nivel: '35', cor: '#e0457b', rot: 'Indicador' }], {
                max: 4, add: '+ Adicionar vidraria',
                cols: [['tipo', 'sel', 'Tipo', OPC_VIDRARIAS.map(function (k) { return [k, { bequer: 'Béquer', erlenmeyer: 'Erlenmeyer', volumetrico: 'Balão volumétrico', redondo: 'Balão fundo redondo', proveta: 'Proveta', bureta: 'Bureta', pipeta: 'Pipeta volumétrica', tubo: 'Tubo de ensaio', funil: 'Funil' }[k]]; })],
                    ['nivel', 'n%', 'Nível (%) / leitura'], ['cor', 'cor', 'Cor'], ['rot', 't', 'Rótulo']]
            }]] },
        qtit: { grupo: 'Laboratório', nome: 'Titulação', simb: '⫯', desc: 'Montagem com bureta e erlenmeyer',
            campos: [
                ['titulante', 't', 'Titulante (na bureta)', 'NaOH 0,1 mol/L'], ['corTitulante', 'cor', 'Cor do titulante', '#4f9ad8'],
                ['leitura', 't', 'Leitura da bureta (mL)', '12,5', { meia: true }], ['nivelErlen', 't', 'Nível no erlenmeyer (%)', '35', { meia: true }],
                ['titulado', 't', 'Titulado (no erlenmeyer)', 'HCl + fenolftaleína'], ['corTitulado', 'cor', 'Cor do titulado', '#f3a6c8'],
                ['gota', 'sw', 'Mostrar a gota caindo', true]
            ] },
        qpaul: { grupo: 'Atomística', nome: 'Diagrama de Pauling', simb: '↘', desc: 'Com os subníveis preenchidos',
            campos: [['el', 't', 'Elemento (opcional)', 'Fe', { dica: 'Deixe vazio para o diagrama em branco.' }]] },
        qorg: { grupo: 'Orgânica', nome: 'Funções orgânicas', simb: 'R–OH', desc: 'Grupos funcionais e anéis',
            campos: [
                ['funcao', 'sel', 'Função', 'acido', [['alcool', 'Álcool'], ['fenol', 'Fenol'], ['aldeido', 'Aldeído'], ['cetona', 'Cetona'], ['acido', 'Ácido carboxílico'],
                    ['ester', 'Éster'], ['eter', 'Éter'], ['amina', 'Amina'], ['amida', 'Amida'], ['haleto', 'Haleto orgânico'], ['nitrila', 'Nitrila'], ['benzeno', 'Benzeno'], ['cicloexano', 'Cicloexano']]],
                ['R', 't', 'Grupo R', 'R', { meia: true }], ['R2', 't', "Grupo R'", "R'", { meia: true }], ['X', 't', 'Halogênio (X)', 'X', { meia: true }],
                ['nome', 'sw', 'Mostrar o nome da função', true]
            ] },
        qcad: { grupo: 'Orgânica', nome: 'Cadeia carbônica', simb: 'C–C', desc: 'Fórmula estrutural com ramificações',
            campos: [
                ['cadeia', 't', 'Cadeia', 'H3C-CH2-CH(CH3)-CH=CH2', { dica: 'Ligações: - = ≡. Ramificações entre parênteses.', atalhos: [['−', '-'], ['=', '='], ['≡', '≡'], ['( ramificação )', '()']] }],
                ['legenda', 't', 'Legenda (opcional)', '', { ph: 'ex.: 3-metilpent-1-eno' }]
            ] }
    };
    var QPRINC = ['qeq', 'qmassa', 'qdist', 'qtab'];

    var ICONES = {
        quimica: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6M10 3v6.2L4.6 18.4A1.7 1.7 0 0 0 6.1 21h11.8a1.7 1.7 0 0 0 1.5-2.6L14 9.2V3" fill="none"/><path d="M7.2 15h9.6" fill="none"/></svg>',
        grafico: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 3.5v16.5h16.5" fill="none"/><path d="M6.5 6.5c2.2 9 4.6 10.5 6.6 10.5s4-2.6 6-10.5" fill="none" stroke-width="2.1"/></svg>',
        equacao: '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M3.5 13.2l2.1-1 2.9 6.3L12.9 4H21" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.5 9.5l5 5m0-5l-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
        // chave da divisão: dividendo | divisor, quociente embaixo
        conta: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M13 3.5v8.5h8.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><rect x="2.5" y="6" width="8" height="3.2" rx="1.2"/><rect x="15.5" y="6" width="4.5" height="3.2" rx="1.2"/><rect x="15.5" y="15" width="5.5" height="3.2" rx="1.2" opacity=".55"/><rect x="4.5" y="13.5" width="6" height="1.6" rx=".8" opacity=".55"/><rect x="6.5" y="18" width="4" height="3.2" rx="1.2" opacity=".55"/></svg>'
    };

    var CSS_EDITOR =
        '.eqx{display:inline-block;cursor:pointer;border-radius:5px;padding:0 2px;margin:0 1px;transition:background .15s,box-shadow .15s;}' +
        '.eqx:hover{background:rgba(254,204,69,.22);}' +
        '.eqx[data-mce-selected]{background:rgba(254,204,69,.3);box-shadow:0 0 0 2px #fecc45;outline:none!important;}' +
        '.eqx[data-bloco]{display:block;text-align:center;margin:.5em 0;padding:.2em 0;}' +
        '.conta-armada{cursor:pointer;border-radius:8px;outline:none!important;}' +
        '.conta-armada>div,.conta-armada[style*="inline-block"]{border-radius:8px;transition:box-shadow .15s;}' +
        '.conta-armada:hover>div,.conta-armada[style*="inline-block"]:hover{box-shadow:0 0 0 2px rgba(254,204,69,.6);}' +
        '.conta-armada[data-mce-selected]>div,.conta-armada[data-mce-selected][style*="inline-block"]{box-shadow:0 0 0 2px #fecc45;}' +
        '.conta-armada .eqx{cursor:inherit;background:none!important;box-shadow:none!important;}' +
        'img[data-grafico]{cursor:pointer;}';

    // ---------- utilidades ----------

    function h(tag, cls, html) {
        var e = document.createElement(tag);
        if (cls) e.className = cls;
        if (html != null) e.innerHTML = html;
        return e;
    }

    function escAttr(s) {
        return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function decodeEntities(s) {
        var t = document.createElement('textarea');
        t.innerHTML = s;
        return t.value;
    }

    function guardar(k, v) { try { localStorage.setItem('eqx.' + k, v); } catch (e) { /* sem storage: tudo bem */ } }
    function lembrar(k) { try { return localStorage.getItem('eqx.' + k); } catch (e) { return null; } }

    // lacunas viram quadradinhos cinza no desenho do botão
    function icone(latex) {
        return latex.replace(/#[@?]|\\placeholder\{\}/g, '\\textcolor{#b3bccd}{\\square}');
    }

    function markup(latex, bloco) {
        return window.MathLive.convertLatexToMarkup(latex, { defaultMode: bloco ? 'math' : 'inline-math' });
    }

    // MathML (do Wiris ou deste plugin) → LaTeX para editar/desenhar
    function latexDe(mml) {
        var d = /^<math[^>]*\sdata-latex="([^"]*)"/i.exec(mml);
        if (d) return decodeEntities(d[1]);
        var m = /<annotation[^>]*encoding="application\/x-tex"[^>]*>([\s\S]*?)<\/annotation>/i.exec(mml);
        if (m) return decodeEntities(m[1]).trim();
        try { return converterMathml(mml); } catch (e) { return ''; }
    }

    // MathML → LaTeX preservando cores (mathcolor do Wiris): cada trecho colorido é convertido à parte,
    // entra no lugar de um marcador e volta como \textcolor{cor}{...}
    var MARCA = 0xE001; // área de uso privado do Unicode (U+E000 = espaço; U+E001… = trechos coloridos)
    function converterMathml(mml) {
        var doc = new DOMParser().parseFromString(mml.replace(/&nbsp;/g, '&#160;'), 'text/html');
        var math = doc.querySelector('math');
        if (!math) return '';
        // espaço do Wiris (<mo>&#160;</mo>) some na conversão: vira \ (espaço do LaTeX)
        math.querySelectorAll('mo, mtext, mi').forEach(function (n) {
            if (/^[\s\u00a0]+$/.test(n.textContent) && n.textContent.length) { n.textContent = String.fromCharCode(MARCA - 1); }
        });
        // vizinhos da mesma cor viram um grupo só (\textcolor{c}{∅ ou {}} em vez de um por símbolo);
        // só onde a ordem dos filhos não tem significado (numa <mfrac>, 1º filho = numerador)
        var LIVRES = /^(math|mrow|mstyle|mtd|msqrt|menclose|mpadded|mphantom)$/;
        math.querySelectorAll('*').forEach(function (pai) { agruparCor(doc, pai, LIVRES); });
        agruparCor(doc, math, LIVRES);
        var trechos = [];
        Array.prototype.filter.call(math.querySelectorAll('[mathcolor]'), function (n) { return !n.parentElement.closest('[mathcolor]'); })
            .forEach(function (n) {
                var cor = n.getAttribute('mathcolor');
                n.removeAttribute('mathcolor');
                var dentro = converterMathml('<math xmlns="http://www.w3.org/1998/Math/MathML">' + n.outerHTML + '</math>');
                trechos.push(dentro ? '\\textcolor{' + cor + '}{' + dentro + '}' : '');
                var m = doc.createElementNS('http://www.w3.org/1998/Math/MathML', 'mi');
                m.textContent = String.fromCharCode(MARCA + trechos.length - 1);
                n.replaceWith(m);
            });
        var xml = '<math xmlns="http://www.w3.org/1998/Math/MathML">' + math.innerHTML.replace(/&nbsp;/g, '&#160;') + '</math>';
        var l = window.MathMLToLaTeX.MathMLToLaTeX.convert(xml).trim(); // trim antes: "\ " no fim \u00E9 espa\u00E7o, n\u00E3o sobra
        return l.replace(/[\uE000-\uF8FF]/g, function (c) {
            var i = c.charCodeAt(0) - MARCA;
            return i === -1 ? '\\ ' : trechos[i] || '';
        }).replace(/\u00a0/g, '\\ ');
    }

    function agruparCor(doc, pai, livres) {
        if (!livres.test(pai.localName)) return;
        var filhos = Array.prototype.slice.call(pai.children), i = 0;
        while (i < filhos.length) {
            var cor = filhos[i].getAttribute('mathcolor'), j = i + 1;
            if (!cor) { i++; continue; }
            while (j < filhos.length && filhos[j].getAttribute('mathcolor') === cor) j++;
            if (j - i > 1) {
                var g = doc.createElementNS('http://www.w3.org/1998/Math/MathML', 'mrow');
                g.setAttribute('mathcolor', cor);
                filhos[i].before(g);
                for (var k = i; k < j; k++) { filhos[k].removeAttribute('mathcolor'); g.appendChild(filhos[k]); }
            }
            i = j;
        }
    }

    // formato antigo (span.math-tex) → <math> ao abrir o conteúdo; a saída com cores e destaque é feita no servidor
    function mathmlSimples(latex) {
        return '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="' + escAttr(latex) + '">' + window.MathLive.convertLatexToMathMl(latex) + '</math>';
    }

    // resolução em blocos (algebra.js) → HTML: frases em texto, grupos alinhados pelo "=", fórmulas soltas.
    // f(latex, destaque) desenha a fórmula (MathLive na prévia, MathML no texto).
    function blocosHtml(blocos, f) {
        return blocos.map(function (b) {
            if (b.h != null) return '<div style="margin:.35em 0">' + b.h + '</div>';
            if (b.t != null) {
                return '<div style="margin:.55em 0 .25em">' + b.t.split('$').map(function (pedaco, i) {
                    return i % 2 ? f(pedaco, false) : escAttr(pedaco);
                }).join('') + '</div>';
            }
            var l = b.a ? '\\begin{aligned}' + b.a.join('\\\\') + '\\end{aligned}' : b.m;
            return '<div style="margin:.25em 0">' + f(l, true) + '</div>';
        }).join('');
    }

    // células vazias de matrizes, sistemas e tabelas viram lacunas (\placeholder{});
    // "aligned" fica de fora: lá a célula vazia é intencional ("&= …")
    function preencherCelulas(latex) {
        var re = /\\begin\{([pbvVB]?matrix|cases|array)\}(\{[^}]*\})?((?:(?!\\begin\{)[\s\S])*?)\\end\{\1\}/g;
        return latex.replace(re, function (tudo, amb, colunas, corpo) {
            var cel = [], atual = '', prof = 0, seps = [];
            for (var i = 0; i < corpo.length; i++) {
                var c = corpo[i];
                if (c === '\\' && corpo[i + 1] === '\\' && !prof) { cel.push(atual); seps.push('\\\\'); atual = ''; i++; continue; }
                if (c === '\\') { atual += c + (corpo[i + 1] || ''); i++; continue; }
                if (c === '{') prof++;
                if (c === '}') prof--;
                if (c === '&' && !prof) { cel.push(atual); seps.push('&'); atual = ''; continue; }
                atual += c;
            }
            cel.push(atual);
            var saida = '';
            cel.forEach(function (x, k) { saida += (x.trim() ? x : '\\placeholder{}') + (seps[k] || ''); });
            return '\\begin{' + amb + '}' + (colunas || '') + saida + '\\end{' + amb + '}';
        });
    }

        function dadosQuimica(alvo) {
            if (!alvo) return null;
            var t = alvo.getAttribute('data-quimica');
            if (!t && alvo.classList.contains('eqx')) {
                var m = /data-quimica="([^"]*)"/.exec(alvo.getAttribute('data-mathml') || '');
                t = m && decodeEntities(m[1]);
            }
            try { return t ? JSON.parse(t) : null; } catch (e) { return null; }
        }

        function tipoDe(alvo) {
            if (!alvo) return null;
            if (dadosQuimica(alvo)) return 'quimica';
            if (alvo.classList.contains('conta-armada')) return 'conta';
            if (alvo.nodeName === 'IMG') return 'grafico';
            return 'formula';
        }


    function criar(opcoes) {
        ['inserir', 'remover', 'focar', 'imagem'].forEach(function (nome) {
            if (typeof opcoes[nome] !== 'function') throw new TypeError('FormulixUI: callback obrigatório: ' + nome);
        });
        var fecharAberto = null;
        var embutido = typeof FormulixAssets !== 'undefined' ? FormulixAssets : null;
        if (opcoes.idioma && I.definir) I.definir(opcoes.idioma, opcoes.notacao);
        var MF = window.MathLive.MathfieldElement;
        MF.fontsDirectory = embutido ? null : opcoes.url + '/vendor/fonts/';
        MF.soundsDirectory = null;
        MF.locale = I.idioma.split('-')[0];
        MF.decimalSeparator = I.dec === '.' ? '.' : ',';
        if (embutido) {
            if (!document.getElementById('formulix-estilos')) {
                var estilo = h('style');
                estilo.id = 'formulix-estilos';
                estilo.textContent = embutido.estatico + embutido.dialogo;
                document.head.appendChild(estilo);
            }
        } else ['vendor/mathlive-static.css', 'equacao.css'].forEach(function (arquivo) {
            var href = opcoes.url + '/' + arquivo;
            if (Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(function (l) { return l.getAttribute('href') === href; })) return;
            var link = h('link'); link.rel = 'stylesheet'; link.href = href; document.head.appendChild(link);
        });
        var servidor = (opcoes.servidor || '').replace(/\/$/, ''), chave = opcoes.chave || '';
        var inserir = opcoes.inserir;
        function falhou(status, j) {
            if (status === 401 || status === 403) return new Error(tr('Chave do Formulix inválida para este site.'));
            if (status === 429) return new Error(tr('Muitos pedidos; tente de novo em instantes.'));
            if (status === 402) return new Error(tr('O limite mensal de inserções do plano acabou. Veja os planos no painel do Formulix.'));
            return new Error(j && j.erro && status === 422 ? j.erro : tr('Sem conexão com o servidor do Formulix.'));
        }
        function chamar(caminho, opcoes) {
            opcoes.headers = Object.assign({ 'X-Formulix-Chave': chave }, opcoes.headers);
            return fetch(servidor + caminho, opcoes).then(function (r) {
                return r.json().catch(function () { return null; }).then(function (j) { if (!r.ok) throw falhou(r.status, j); return j; });
            }, function () { throw falhou(0); });
        }
        // a notação vai junto para o servidor responder igual ao cliente
        function postar(caminho, corpo) {
            corpo.idioma = I.idioma;
            corpo.notacao = { decimal: I.dec, separador: I.sep, trig: I.trig, divisao: I.divisao, raizes: I.raizes };
            return chamar(caminho, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corpo) });
        }
        // prévia: op = nome da operação (divisao, eq2, grafico, qeq, word…); não conta como inserção
        function pedir(op, dados) { return postar('/v1/calc', { op: op, dados: dados }); }
        // o que vai para o texto: { tipo: formula|conta|quimica|grafico|word, … } → { html } ou { svg, w, h }; conta no plano
        function inserirNoServidor(corpo) { return postar('/v1/inserir', corpo); }
        var tabelas = {};
        function tabelaPeriodica() {
            return tabelas[I.idioma] || (tabelas[I.idioma] = chamar('/v1/tabela?idioma=' + encodeURIComponent(I.idioma), {}).catch(function (e) { delete tabelas[I.idioma]; throw e; }));
        }

        function abrir(aba, alvo) {
            if (fecharAberto) fecharAberto();
            aba = tipoDe(alvo) || aba || 'formula';

            var ov = h('div', 'eqd-ov');
            var dlg = h('div', 'eqd');
            dlg.setAttribute('role', 'dialog');
            dlg.setAttribute('aria-modal', 'true');
            dlg.setAttribute('aria-label', tr('Editor de fórmulas, contas e gráficos'));
            dlg.innerHTML =
                '<header class="eqd-head">' +
                  '<div class="eqd-tabs" role="tablist">' +
                    '<button type="button" role="tab" data-aba="formula">' + ICONES.equacao + '<span>' + tr('Fórmula') + '</span></button>' +
                    '<button type="button" role="tab" data-aba="conta">' + ICONES.conta + '<span>' + tr('Armar conta') + '</span></button>' +
                    '<button type="button" role="tab" data-aba="grafico">' + ICONES.grafico + '<span>' + tr('Gráfico') + '</span></button>' +
                    '<button type="button" role="tab" data-aba="quimica">' + ICONES.quimica + '<span>' + tr('Química') + '</span></button>' +
                  '</div>' +
                  '<button type="button" class="eqd-x" aria-label="' + tr('Fechar') + '" title="' + tr('Fechar (Esc)') + '">&times;</button>' +
                '</header>' +
                '<section class="eqd-pane" data-pane="formula">' +
                  '<div class="eqd-rapidos" aria-label="' + tr('Mais usados') + '"></div>' +
                  '<div class="eqd-cats" role="tablist" aria-label="' + tr('Categorias') + '"></div>' +
                  '<div class="eqd-grade"></div>' +
                  '<div class="eqd-fmt" role="toolbar" aria-label="' + tr('Formatação da fórmula') + '"></div>' +
                  '<div class="eqd-campo"></div>' +
                  '<div class="eqd-aviso" hidden></div>' +
                  '<div class="eqd-sub">' +
                    '<div class="eqd-sub-l">' +
                      '<button type="button" class="eqd-pill eqd-nova" title="' + tr('Nova linha alinhada pelo sinal de igual (Enter)') + '">↵ ' + tr('Nova linha') + '</button>' +
                      '<button type="button" class="eqd-link eqd-latex" aria-expanded="false"><span class="eqd-chev">›</span> ' + tr('Código LaTeX') + '</button>' +
                    '</div>' +
                    '<label class="eqd-sw"><input type="checkbox" class="eqd-bloco"><i></i>' + tr('Em destaque (linha própria)') + '</label>' +
                  '</div>' +
                  '<textarea class="eqd-src" spellcheck="false" hidden aria-label="' + tr('Código LaTeX') + '"></textarea>' +
                '</section>' +
                '<section class="eqd-pane" data-pane="conta">' +
                  '<div class="eqd-ops" role="tablist" aria-label="' + tr('Operação') + '"></div>' +
                  '<div class="eqd-mais" hidden></div>' +
                  '<div class="eqd-conta">' +
                    '<div class="eqd-form"></div>' +
                    '<div class="eqd-prev"><div class="eqd-papel"><div class="eqd-papel-in"></div></div><div class="eqd-resumo"></div></div>' +
                  '</div>' +
                '</section>' +
                '<section class="eqd-pane" data-pane="grafico">' +
                  '<div class="eqd-conta">' +
                    '<div class="eqd-form eqd-form-graf"></div>' +
                    '<div class="eqd-prev"><div class="eqd-papel eqd-papel-graf"><div class="eqd-papel-in eqd-in-graf"></div></div><div class="eqd-resumo eqd-res-graf"></div></div>' +
                  '</div>' +
                '</section>' +
                '<section class="eqd-pane" data-pane="quimica">' +
                  '<div class="eqd-ops" role="tablist" aria-label="' + tr('Química') + '"></div>' +
                  '<div class="eqd-mais" hidden></div>' +
                  '<div class="eqd-conta">' +
                    '<div class="eqd-form"></div>' +
                    '<div class="eqd-prev"><div class="eqd-papel"><div class="eqd-papel-in"></div></div><div class="eqd-resumo"></div></div>' +
                  '</div>' +
                '</section>' +
                '<footer class="eqd-foot">' +
                  '<span class="eqd-dica"></span>' +
                  '<button type="button" class="eqd-btn eqd-cancelar">' + tr('Cancelar') + '</button>' +
                  '<button type="button" class="eqd-btn eqd-ok"></button>' +
                '</footer>';
            ov.appendChild(dlg);
            document.body.appendChild(ov);
            var $ = function (s) { return dlg.querySelector(s); };

            function fechar() {
                document.removeEventListener('keydown', teclas, true);
                ov.remove();
                fecharAberto = null;
                opcoes.focar();
            }
            fecharAberto = fechar;
            $('.eqd-x').onclick = fechar;
            $('.eqd-cancelar').onclick = fechar;

            // ---- formulários (armar conta e gráfico) ----

            function entrada(valor, ph, onInput) {
                var i = h('input');
                i.type = 'text';
                i.autocomplete = 'off';
                i.spellcheck = false;
                i.inputMode = /^[\d\s,./-]*$/.test(String(valor)) ? 'decimal' : 'text';
                i.value = valor;
                if (ph) i.placeholder = tr(ph);
                i.oninput = function () { onInput(i.value); };
                return i;
            }

            function montarForm(form, campos, estado, mudou) {
                form.innerHTML = '';
                campos.forEach(function (c) {
                    var k = c[0], tipo = c[1], rot = c[2], extra = c[4] || {};
                    if (typeof rot === 'string') rot = tr(rot);
                    if (estado[k] == null) {
                        // só exemplos digitáveis passam por padrao(): valores de opção ('mmc', 'bequer'...) são códigos
                        var v0 = c[3];
                        if (tipo === 't' || tipo === 'lista') v0 = padrao(v0);
                        else if (tipo === 'linhas') v0 = v0.map(function (o) { var n = Object.assign({}, o); extra.cols.forEach(function (col) { if (col[1] === 't') n[col[0]] = padrao(n[col[0]]); }); return n; });
                        else if (Array.isArray(v0)) v0 = v0.slice();
                        estado[k] = v0;
                    }
                    if (tipo === 't') {
                        var l = h('label', 'eqd-f' + (extra.meia ? ' eqd-meia' : ''));
                        l.appendChild(h('span', null, rot));
                        l.appendChild(entrada(estado[k], extra.ph, function (v) { estado[k] = v; mudou(); }));
                        if (extra.dica) l.appendChild(h('small', null, tr(extra.dica)));
                        form.appendChild(l);
                        if (extra.atalhos) form.appendChild(atalhos(l.querySelector('input'), extra.atalhos, function (v) { estado[k] = v; mudou(); }));
                    } else if (tipo === 'sw') {
                        var s = h('label', 'eqd-sw', '<input type="checkbox"><i></i>' + rot);
                        var cb = s.querySelector('input');
                        cb.checked = !!estado[k];
                        cb.onchange = function () { estado[k] = cb.checked; mudou(); };
                        form.appendChild(s);
                    } else if (tipo === 'n') {
                        var st = h('div', 'eqd-step', '<span>' + rot + '</span><div><button type="button" aria-label="' + tr('Menos') + '">−</button><output></output><button type="button" aria-label="' + tr('Mais') + '">+</button></div>');
                        var out = st.querySelector('output'), bs = st.querySelectorAll('button');
                        var set = function (v) { estado[k] = Math.max(0, Math.min(4, v)); out.textContent = estado[k]; mudou(); };
                        bs[0].onclick = function () { set(+estado[k] - 1); };
                        bs[1].onclick = function () { set(+estado[k] + 1); };
                        out.textContent = estado[k];
                        form.appendChild(st);
                    } else if (tipo === 'seg') {
                        var g = h('div', 'eqd-segf', '<span>' + rot + '</span>');
                        var seg = h('div', 'eqd-seg');
                        seg.setAttribute('role', 'radiogroup');
                        seg.setAttribute('aria-label', rot);
                        c[4].forEach(function (o) {
                            var b = h('button', null, tr(o[1]));
                            b.type = 'button';
                            b.setAttribute('role', 'radio');
                            b.setAttribute('aria-checked', String(estado[k] === o[0]));
                            b.onclick = function () {
                                estado[k] = o[0];
                                seg.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-checked', String(x === b)); });
                                mudou();
                            };
                            seg.appendChild(b);
                        });
                        g.appendChild(seg);
                        form.appendChild(g);
                    } else if (tipo === 'lista') {
                        var box = h('div', 'eqd-lista');
                        var redesenhar = function (foco) {
                            box.innerHTML = '';
                            estado[k].forEach(function (v, i) {
                                var linha = h('div', 'eqd-lista-l');
                                var f = h('label', 'eqd-f');
                                var r = h('span', null, (extra.cor ? '<i class="eqd-cor" style="background:' + extra.cor(i) + '"></i>' : '') + tr(rot(i)));
                                f.appendChild(r);
                                f.appendChild(entrada(v, extra.ph, function (nv) { estado[k][i] = nv; mudou(); }));
                                linha.appendChild(f);
                                if (estado[k].length > (extra.min || 1)) {
                                    var rm = h('button', 'eqd-rm', '&times;');
                                    rm.type = 'button';
                                    rm.title = tr('Remover');
                                    rm.onclick = function () { estado[k].splice(i, 1); redesenhar(); mudou(); };
                                    linha.appendChild(rm);
                                }
                                box.appendChild(linha);
                            });
                            if (estado[k].length < (extra.max || 6)) {
                                var add = h('button', 'eqd-link eqd-add', tr(extra.add || '+ Adicionar'));
                                add.type = 'button';
                                add.onclick = function () { estado[k].push(''); redesenhar(true); };
                                box.appendChild(add);
                            }
                            if (foco) { var ins = box.querySelectorAll('input'); ins[ins.length - 1].focus(); }
                        };
                        redesenhar();
                        form.appendChild(box);
                    } else if (tipo === 'sel') {
                        var ls = h('label', 'eqd-f' + (extra.meia ? ' eqd-meia' : ''));
                        ls.appendChild(h('span', null, rot));
                        ls.appendChild(selecao(c[4], estado[k], function (v) { estado[k] = v; mudou(); }));
                        form.appendChild(ls);
                    } else if (tipo === 'cor') {
                        var gcor = h('div', 'eqd-segf', '<span>' + rot + '</span>');
                        gcor.appendChild(cores(estado[k], function (v) { estado[k] = v; mudou(); }));
                        form.appendChild(gcor);
                    } else if (tipo === 'linhas') {
                        // várias linhas com colunas (ex.: vidrarias: tipo, nível, cor, rótulo)
                        var bl = h('div', 'eqd-linhas', '<span class="eqd-pts-rot">' + rot + '</span>');
                        var corpoL = h('div');
                        bl.appendChild(corpoL);
                        var desenharL = function () {
                            corpoL.innerHTML = '';
                            estado[k].forEach(function (obj, i) {
                                var linha = h('div', 'eqd-linha');
                                extra.cols.forEach(function (col) {
                                    var el;
                                    if (col[1] === 'sel') el = selecao(col[3], obj[col[0]], function (v) { obj[col[0]] = v; mudou(); });
                                    else if (col[1] === 'cor') { el = h('input'); el.type = 'color'; el.value = obj[col[0]] || '#4f9ad8'; el.oninput = function () { obj[col[0]] = el.value; mudou(); }; }
                                    else { el = entrada(obj[col[0]] == null ? '' : obj[col[0]], tr(col[2]), function (v) { obj[col[0]] = v; mudou(); }); if (col[1] === 'n%') el.inputMode = 'decimal'; }
                                    el.title = tr(col[2]);
                                    el.setAttribute('aria-label', tr(col[2]) + ' ' + (i + 1));
                                    el.classList.add('eqd-col-' + col[1].replace('%', 'p'));
                                    linha.appendChild(el);
                                });
                                if (estado[k].length > 1) {
                                    var rm = h('button', 'eqd-rm', '&times;');
                                    rm.type = 'button';
                                    rm.title = tr('Remover');
                                    rm.onclick = function () { estado[k].splice(i, 1); desenharL(); mudou(); };
                                    linha.appendChild(rm);
                                }
                                corpoL.appendChild(linha);
                            });
                        };
                        desenharL();
                        if (extra.max) {
                            var addL = h('button', 'eqd-link eqd-add', tr(extra.add || '+ Adicionar'));
                            addL.type = 'button';
                            addL.onclick = function () {
                                if (estado[k].length >= extra.max) return;
                                estado[k].push(Object.assign({}, estado[k][estado[k].length - 1] || {}));
                                desenharL(); mudou();
                            };
                            bl.appendChild(addL);
                        }
                        form.appendChild(bl);
                    } else if (tipo === 'chips') {
                        // várias escolhas ligadas/desligadas
                        var gc = h('div', 'eqd-segf', '<span>' + rot + '</span>');
                        var chips = h('div', 'eqd-chips');
                        c[4].forEach(function (o) {
                            var b = h('button', 'eqd-chipx', tr(o[1]));
                            b.type = 'button';
                            b.setAttribute('aria-pressed', String(estado[k].indexOf(o[0]) >= 0));
                            b.onclick = function () {
                                var i = estado[k].indexOf(o[0]);
                                if (i >= 0) estado[k].splice(i, 1); else estado[k].push(o[0]);
                                b.setAttribute('aria-pressed', String(i < 0));
                                mudou();
                            };
                            chips.appendChild(b);
                        });
                        gc.appendChild(chips);
                        form.appendChild(gc);
                    } else if (tipo === 'pontos') {
                        // pontos individuais: nome, x, y
                        var bp = h('div', 'eqd-pts', '<span class="eqd-pts-rot">' + rot + '</span>');
                        var lista = h('div');
                        bp.appendChild(lista);
                        var desenharPts = function (foco) {
                            lista.innerHTML = '';
                            estado[k].forEach(function (pt, i) {
                                var l = h('div', 'eqd-pt');
                                [['n', 'Nome', 'A'], ['x', 'x', '0'], ['y', 'y', '0']].forEach(function (q) {
                                    var e = entrada(pt[q[0]] == null ? '' : pt[q[0]], q[2], function (v) { pt[q[0]] = v; mudou(); });
                                    e.setAttribute('aria-label', tr('{0} do ponto {1}', tr(q[1]), i + 1));
                                    if (q[0] === 'n') e.inputMode = 'text';
                                    l.appendChild(e);
                                });
                                var rm = h('button', 'eqd-rm', '&times;');
                                rm.type = 'button';
                                rm.title = tr('Remover ponto');
                                rm.onclick = function () { estado[k].splice(i, 1); desenharPts(); mudou(); };
                                l.appendChild(rm);
                                lista.appendChild(l);
                            });
                            if (foco) { var ins = lista.querySelectorAll('input'); if (ins.length) ins[ins.length - 2].focus(); }
                        };
                        var addp = h('button', 'eqd-link eqd-add', tr('+ Adicionar ponto'));
                        addp.type = 'button';
                        addp.onclick = function () { estado[k].push({ n: proximoNome(estado[k]), x: '', y: '' }); desenharPts(true); };
                        bp.appendChild(addp);
                        if (extra.dica) bp.appendChild(h('small', 'eqd-pts-dica', tr(extra.dica)));
                        desenharPts();
                        form.appendChild(bp);
                        form['_redesenhar_' + k] = desenharPts;
                    }
                });
            }

            // exemplo de um campo no idioma: texto traduzido e vírgula decimal trocada ('67,5' → '67.5')
            function padrao(v) {
                if (typeof v === 'string') return tr(v).replace(/(\d),(\d)/g, '$1' + I.dec + '$2');
                return Array.isArray(v) ? v.map(padrao) : v;
            }

            function selecao(opcoes, valor, mudou) {
                var sl = h('select');
                opcoes.forEach(function (o) { var op = h('option', null, tr(o[1])); op.value = o[0]; sl.appendChild(op); });
                sl.value = valor;
                sl.onchange = function () { mudou(sl.value); };
                return sl;
            }

            function cores(valor, mudou) {
                var box = h('div', 'eqd-cores');
                CORES_LIQ.forEach(function (c) {
                    var b = h('button', 'eqd-cor-b');
                    b.type = 'button';
                    b.style.background = c;
                    b.title = c;
                    b.setAttribute('aria-pressed', String(String(valor).toLowerCase() === c));
                    b.onclick = function () { inp.value = c; marcar(c); mudou(c); };
                    box.appendChild(b);
                });
                var inp = h('input');
                inp.type = 'color';
                inp.value = valor || '#4f9ad8';
                inp.title = tr('Outra cor');
                inp.oninput = function () { marcar(inp.value); mudou(inp.value); };
                box.appendChild(inp);
                function marcar(c) { box.querySelectorAll('.eqd-cor-b').forEach(function (b) { b.setAttribute('aria-pressed', String(b.title === c)); }); }
                return box;
            }

            // botões que inserem um pedaço de texto na posição do cursor do campo
            function atalhos(inp, lista, mudou) {
                var box = h('div', 'eqd-atalhos');
                lista.forEach(function (a) {
                    var b = h('button', 'eqd-at', tr(a[0]));
                    b.type = 'button';
                    b.title = tr('Inserir {0}', a[1].trim());
                    b.onmousedown = function (ev) { ev.preventDefault(); }; // mantém o cursor no campo
                    b.onclick = function () {
                        var i0 = inp.selectionStart == null ? inp.value.length : inp.selectionStart, i1 = inp.selectionEnd == null ? i0 : inp.selectionEnd;
                        inp.value = inp.value.slice(0, i0) + a[1] + inp.value.slice(i1);
                        var pos = a[1] === '()' ? i0 + 1 : i0 + a[1].length;
                        inp.focus();
                        inp.setSelectionRange(pos, pos);
                        mudou(inp.value);
                    };
                    box.appendChild(b);
                });
                return box;
            }

            // A, B, C... (pula nomes já usados)
            function proximoNome(pts) {
                for (var i = 0; i < 26; i++) {
                    var n = String.fromCharCode(65 + i);
                    if (!pts.some(function (p) { return p.n === n; })) return n;
                }
                return 'P';
            }

            // prévia calculada no servidor: espera o professor parar de digitar, descarta respostas atrasadas
            // e deixa o "Inserir" esperar o último pedido (esperar()). executar() → Promise do resultado pronto.
            function criarPrevia(papel, resumo, executar, depois) {
                var p = { res: null, seq: 0, pronto: Promise.resolve(), t: null, solta: null };
                p.agendar = function (atraso) {
                    var meu = ++p.seq;
                    clearTimeout(p.t);
                    if (p.solta) p.solta(); // o pedido trocado não fica pendurado em quem estava esperando
                    p.pronto = new Promise(function (ok) {
                        p.solta = ok;
                        p.t = setTimeout(function () {
                            executar().then(function (r) {
                                if (meu !== p.seq) return;
                                papel.innerHTML = r.preview;
                                resumo.innerHTML = r.resumo || '';
                                resumo.classList.remove('eqd-erro');
                                p.res = r;
                            }, function (e) {
                                if (meu !== p.seq) return;
                                resumo.textContent = e.message;
                                resumo.classList.add('eqd-erro');
                                p.res = null;
                            }).then(function () { if (meu === p.seq && depois) depois(p.res); }).then(ok, ok);
                        }, atraso == null ? 120 : atraso);
                    });
                };
                p.esperar = function () { var s = p.seq; return p.pronto.then(function () { return p.seq === s ? p.res : p.esperar(); }); };
                return p;
            }

            // ---- aba Fórmula ----
            var mf = new MF();
            mf.mathVirtualKeyboardPolicy = 'manual';
            mf.smartFence = true;
            $('.eqd-campo').appendChild(mf);
            // o menu ☰ do MathLive travava (cor não aplicava, sumia depois do Esc): a barra acima o substitui
            mf.menuItems = [];

            // ---- barra de formatação ----
            var CORES_TXT = ['#243047', '#e0457b', '#2563eb', '#16a34a', '#f59e0b', '#7c3aed', '#dc2626'];
            var CORES_FUNDO = ['#fff3b0', '#d9f2e3', '#dbeafe', '#fde2ef'];
            function bfmt(html, titulo, acao, cls) {
                titulo = tr(titulo);
                var b = h('button', 'eqd-fb' + (cls ? ' ' + cls : ''), html);
                b.type = 'button';
                b.title = titulo;
                b.setAttribute('aria-label', titulo);
                b.onmousedown = function (ev) { ev.preventDefault(); }; // não tira a seleção do campo
                b.onclick = function () { acao(); mf.focus(); src.value = mf.value; };
                return b;
            }
            function grupoFmt(rotulo) { var g = h('div', 'eqd-fg'); if (rotulo) g.appendChild(h('span', 'eqd-fg-rot', tr(rotulo))); $('.eqd-fmt').appendChild(g); return g; }
            var gCor = grupoFmt('Cor');
            CORES_TXT.forEach(function (c) { gCor.appendChild(bfmt('', tr('Cor {0}', c), function () { mf.applyStyle({ color: c }); }, 'eqd-fb-cor')).style.setProperty('--c', c); });
            gCor.appendChild(bfmt('<s>A</s>', 'Tirar a cor', function () { mf.applyStyle({ color: 'none' }); }));
            var gFundo = grupoFmt('Destaque');
            CORES_FUNDO.forEach(function (c) { gFundo.appendChild(bfmt('', 'Marca-texto', function () { mf.applyStyle({ backgroundColor: c }); }, 'eqd-fb-fundo')).style.setProperty('--c', c); });
            gFundo.appendChild(bfmt('<s>▮</s>', 'Tirar o destaque', function () { mf.applyStyle({ backgroundColor: 'none' }); }));
            var gEst = grupoFmt('Estilo');
            gEst.appendChild(bfmt('<b>B</b>', 'Negrito', function () { mf.insert('\\mathbf{#@}', { selectionMode: 'item' }); }));
            gEst.appendChild(bfmt('Aa', 'Letra reta (sem itálico)', function () { mf.insert('\\mathrm{#@}', { selectionMode: 'item' }); }));
            gEst.appendChild(bfmt('T', 'Escrever texto (alterna)', function () { mf.executeCommand(['switchMode', mf.mode === 'text' ? 'math' : 'text']); }));
            var gMat = grupoFmt('Matriz / sistema');
            gMat.appendChild(bfmt(tr('+ linha'), 'Acrescentar linha abaixo (com o cursor numa matriz ou sistema)', function () { comLacunas('addRowAfter'); }));
            gMat.appendChild(bfmt(tr('+ coluna'), 'Acrescentar coluna à direita', function () { comLacunas('addColumnAfter'); }));

            // O MathLive cria a coluna nova com células vazias (sem o quadradinho de digitação).
            // Marca a célula do cursor, preenche as vazias com lacunas e devolve o cursor à célula nova.
            function comLacunas(comando) {
                var MARCA_CEL = '\\mathrm{QZQ}';
                mf.executeCommand(comando);
                mf.insert(MARCA_CEL);
                var v = preencherCelulas(mf.value), i = v.indexOf(MARCA_CEL);
                if (i < 0) return;
                var antes = (v.slice(0, i).match(/\\placeholder\{\}/g) || []).length;
                mf.value = v.replace(MARCA_CEL, '\\placeholder{}');
                mf.executeCommand('moveToMathfieldStart');
                for (var j = 0; j <= antes; j++) mf.executeCommand('moveToNextPlaceholder');
            }
            gMat.appendChild(bfmt(tr('− linha'), 'Remover a linha', function () { mf.executeCommand('removeRow'); }));
            gMat.appendChild(bfmt(tr('− coluna'), 'Remover a coluna', function () { mf.executeCommand('removeColumn'); }));
            var gHist = grupoFmt('');
            gHist.appendChild(bfmt('↶', 'Desfazer (Ctrl+Z)', function () { mf.executeCommand('undo'); }));
            gHist.appendChild(bfmt('↷', 'Refazer (Ctrl+Y)', function () { mf.executeCommand('redo'); }));

            // ---- Ctrl+V do Word direto no campo: equações novas (OMML) e antigas (Equation 3.0/MathType, via RTF) ----
            function aviso(txt) {
                var a = $('.eqd-aviso');
                a.textContent = txt;
                a.hidden = !txt;
                if (txt) setTimeout(function () { a.hidden = true; }, 6000);
            }
            mf.addEventListener('paste', function (e) {
                var d = e.clipboardData;
                if (!d) return;
                var html = d.getData('text/html') || '';
                if (!/msEquation|ProgID="Equation\./.test(html)) return;
                var rtf = '';
                try { rtf = d.getData('text/rtf') || ''; } catch (err) { rtf = ''; }
                e.preventDefault();
                e.stopPropagation();
                pedir('word', { html: html, rtf: rtf }).then(function (r) {
                    var achadas = r.eqs.map(function (q) { return q.latex; });
                    if (!achadas.length) {
                        aviso(tr('Não consegui ler essa equação antiga do Word aqui. Cole direto no texto do editor: ela entra como imagem.'));
                        return;
                    }
                    mf.insert(achadas.join('\\quad '), { format: 'latex', selectionMode: 'after', focus: true });
                    src.value = mf.value;
                    aviso(achadas.length > 1 ? tr('{0} equações coladas do Word.', achadas.length) : '');
                }, function (err) { aviso(err.message); });
            }, true);
            var src = $('.eqd-src');
            var bloco = $('.eqd-bloco');
            if (tipoDe(alvo) === 'formula') {
                mf.value = latexDe(alvo.getAttribute('data-mathml'));
                bloco.checked = alvo.hasAttribute('data-bloco');
            }
            src.value = mf.value;
            mf.addEventListener('input', function () { src.value = mf.value; });
            src.addEventListener('input', function () { mf.value = src.value; });
            $('.eqd-latex').onclick = function () {
                src.hidden = !src.hidden;
                this.setAttribute('aria-expanded', String(!src.hidden));
                if (!src.hidden) src.focus();
            };

            // resolução em cascata: \begin{aligned} alinhado pelo "="
            var LINHA_NOVA = '\\placeholder{}&=\\placeholder{}';
            function novaLinha() {
                var v = mf.value.trim();
                if (!v) return;
                if (/^\\begin\{aligned\}[\s\S]*\\end\{aligned\}$/.test(v)) v = v.replace(/\\end\{aligned\}$/, '\\\\' + LINHA_NOVA + '\\end{aligned}');
                else v = '\\begin{aligned}' + (v.indexOf('=') >= 0 ? v.replace('=', '&=') : v + '&') + '\\\\' + LINHA_NOVA + '\\end{aligned}';
                mf.value = v;
                src.value = v;
                bloco.checked = true;
                mf.focus();
                mf.executeCommand('moveToMathfieldEnd');
                mf.executeCommand('moveToPreviousPlaceholder');
                mf.executeCommand('moveToPreviousPlaceholder');
            }
            $('.eqd-nova').onclick = novaLinha;

            // tira linhas que ficaram vazias e lacunas não preenchidas
            function limparLatex(v) {
                var m = /^\\begin\{aligned\}([\s\S]*)\\end\{aligned\}$/.exec(v);
                if (m) {
                    var ls = m[1].split('\\\\').filter(function (l) { return l.replace(/\\placeholder\{\}|[&=\s]/g, ''); });
                    v = ls.length > 1 ? '\\begin{aligned}' + ls.join('\\\\') + '\\end{aligned}' : (ls[0] || '').replace('&', '');
                }
                return v.replace(/\\placeholder\{\}/g, '').trim();
            }

            function botao(item) {
                var b = h('button', 'eqd-k' + (item[3] === 'w' ? ' eqd-k-w' : ''));
                b.type = 'button';
                b.title = tr(item[1] || item[0]);
                b.setAttribute('aria-label', tr(item[1] || item[0]));
                try { b.innerHTML = markup(icone(item[2] || item[0])); } catch (e) { b.textContent = tr(item[1] || item[0]); }
                b.onclick = function () { mf.insert(item[0], { selectionMode: 'placeholder', focus: true }); };
                return b;
            }
            var rap = $('.eqd-rapidos');
            RAPIDOS.forEach(function (it) { rap.appendChild(botao(it)); });
            var txt = h('button', 'eqd-k eqd-k-txt', tr('Texto'));
            txt.type = 'button';
            txt.title = tr('Escrever texto dentro da fórmula (alterna)');
            txt.onclick = function () { mf.executeCommand(['switchMode', mf.mode === 'text' ? 'math' : 'text']); mf.focus(); };
            rap.appendChild(txt);

            var cats = $('.eqd-cats'), grade = $('.eqd-grade');
            function mostrarCat(i) {
                cats.querySelectorAll('button').forEach(function (b, j) { b.setAttribute('aria-selected', String(i === j)); });
                grade.innerHTML = '';
                CATEGORIAS[i].itens.forEach(function (it) { grade.appendChild(botao(it)); });
                guardar('cat', i);
            }
            CATEGORIAS.forEach(function (c, i) {
                var b = h('button', 'eqd-chip', tr(c.nome));
                b.type = 'button';
                b.setAttribute('role', 'tab');
                b.onclick = function () { mostrarCat(i); };
                cats.appendChild(b);
            });
            mostrarCat(Math.min(+lembrar('cat') || 0, CATEGORIAS.length - 1));

            // ---- painéis com operações (Armar conta e Química) ----
            // cfg: { secao, ops, principais, chave, rotuloMais, extras: campos acrescentados, preparar(r, op, estado) }
            function criarPainel(cfg) {
                var sec = $(cfg.secao), opsEl = sec.querySelector('.eqd-ops'), mais = sec.querySelector('.eqd-mais');
                var form = sec.querySelector('.eqd-form'), papel = sec.querySelector('.eqd-papel-in'), resumo = sec.querySelector('.eqd-resumo');
                var P = { op: null, estado: {}, res: null, mais: mais };
                cfg.principais.forEach(function (k) {
                    var b = h('button', 'eqd-op', '<b>' + cfg.ops[k].simb + '</b><span>' + tr(cfg.ops[k].nome) + '</span>');
                    b.type = 'button';
                    b.setAttribute('role', 'tab');
                    b.dataset.op = k;
                    b.onclick = function () { mais.hidden = true; P.mostrar(k); };
                    opsEl.appendChild(b);
                });
                var bMais = h('button', 'eqd-op eqd-op-mais');
                bMais.type = 'button';
                bMais.setAttribute('aria-haspopup', 'true');
                bMais.onclick = function () { mais.hidden = !mais.hidden; bMais.setAttribute('aria-expanded', String(!mais.hidden)); };
                opsEl.appendChild(bMais);
                var grupos = {};
                Object.keys(cfg.ops).forEach(function (k) { if (cfg.ops[k].grupo) (grupos[cfg.ops[k].grupo] = grupos[cfg.ops[k].grupo] || []).push(k); });
                Object.keys(grupos).forEach(function (g) {
                    var col = h('div', 'eqd-mais-g', '<h4>' + tr(g) + '</h4>');
                    grupos[g].forEach(function (k) {
                        var o = cfg.ops[k];
                        var b = h('button', 'eqd-mais-i', '<b>' + o.simb + '</b><span><strong>' + tr(o.nome) + '</strong><small>' + tr(o.desc) + '</small></span>');
                        b.type = 'button';
                        b.dataset.op = k;
                        b.onclick = function () { mais.hidden = true; bMais.setAttribute('aria-expanded', 'false'); P.mostrar(k); };
                        col.appendChild(b);
                    });
                    mais.appendChild(col);
                });

                P.prev = criarPrevia(papel, resumo, function () {
                    var o = cfg.ops[P.op], estado = P.estado;
                    return pedir(P.op, estado).then(function (r) {
                        r = cfg.preparar(r);
                        r.resumo = o.resumo ? o.resumo(r, estado) : '';
                        return r;
                    });
                }, function () {
                    if (cfg.ops[P.op].tabela) desenharTabela(papel, P);
                    atualizarOk();
                });
                Object.defineProperty(P, 'res', { get: function () { return P.prev.res; } });
                P.previa = function (atraso) { P.prev.agendar(atraso); };
                P.mostrar = function (k, dados) {
                    P.op = k;
                    guardar(cfg.chave, k);
                    opsEl.querySelectorAll('.eqd-op').forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.op === k)); });
                    var extra = !!cfg.ops[k].grupo;
                    bMais.innerHTML = extra ? '<b>' + cfg.ops[k].simb + '</b><span>' + tr(cfg.ops[k].nome) + ' ▾</span>' : '<b>⋯</b><span>' + tr(cfg.rotuloMais) + ' ▾</span>';
                    bMais.setAttribute('aria-selected', String(extra));
                    mais.querySelectorAll('.eqd-mais-i').forEach(function (b) { b.classList.toggle('eqd-on', b.dataset.op === k); });
                    P.estado = dados ? Object.assign({}, dados) : {};
                    var campos = cfg.ops[k].campos.concat(cfg.extras ? cfg.extras(k, P.estado) : []);
                    montarForm(form, campos, P.estado, function () { P.previa(); });
                    P.previa(0);
                };
                P.form = form;
                return P;
            }

            // tabela periódica clicável (na área da prévia), com o resultado logo abaixo
            function desenharTabela(papel, P) {
                tabelaPeriodica().then(function (lista) {
                    var sel = P.res && P.res.info ? P.res.info.z : null;
                    var html = '<div class="eqd-tp">';
                    lista.forEach(function (e) {
                        html += '<button type="button" class="eqd-tp-el' + (sel === e.z ? ' eqd-on' : '') + '" data-s="' + e.s + '" title="' + escAttr(e.nome) + ' (' + e.z + ')" ' +
                            'style="grid-row:' + e.pos[0] + ';grid-column:' + e.pos[1] + ';background:' + e.cor + '"><i>' + e.z + '</i>' + e.s + '</button>';
                    });
                    html += '<span class="eqd-tp-fl" style="grid-row:6;grid-column:3">57–71</span><span class="eqd-tp-fl" style="grid-row:7;grid-column:3">89–103</span></div>';
                    var res = papel.querySelector('.eqd-tp-res'); // após um erro a prévia anterior continua aí, já com a tabela
                    papel.innerHTML = html + '<div class="eqd-tp-res">' + (res ? res.innerHTML : papel.innerHTML) + '</div>';
                    papel.querySelectorAll('.eqd-tp-el').forEach(function (b) {
                        b.onclick = function () {
                            P.estado.el = b.dataset.s;
                            var inp = P.form.querySelector('input');
                            if (inp) inp.value = b.dataset.s;
                            P.previa(0);
                        };
                    });
                }, function () { /* sem tabela: o campo de texto continua funcionando */ });
            }

            // resultado → prévia (MathLive) e HTML final (MathML); desenhos ficam em SVG até virar PNG
            function prepararSaida(r, op, estado) {
                if (r.svg) { r.preview = r.svg; return r; }
                if (r.blocos) {
                    r.preview = blocosHtml(r.blocos, function (l, d) { return markup(l, d); });
                } else if (r.latex != null) {
                    r.preview = '<div class="eqd-formula-prev">' + markup(r.latex, true) + '</div>';
                } else r.preview = r.html;
                return r;
            }

            var painelConta = criarPainel({
                secao: '[data-pane="conta"]', ops: OPS, principais: PRINCIPAIS, chave: 'op', rotuloMais: 'Mais contas',
                extras: function (k, est) { if (est.alinhar == null) est.alinhar = lembrar('alinhar') || 'esq'; return [CAMPO_POSICAO]; },
                preparar: prepararSaida
            });
            if (tipoDe(alvo) === 'conta') {
                var d = {};
                try { d = JSON.parse(alvo.getAttribute('data-conta')); } catch (e) { /* conta sem dados: abre vazia */ }
                painelConta.mostrar(OPS[d.op] ? d.op : 'divisao', d);
            } else {
                painelConta.mostrar(OPS[lembrar('op')] ? lembrar('op') : 'divisao');
            }

            // ---- aba Química ----
            var painelQ = criarPainel({
                secao: '[data-pane="quimica"]', ops: QOPS, principais: QPRINC, chave: 'qop', rotuloMais: 'Mais química',
                extras: function (k, est) {
                    // resoluções em bloco (massa molar, distribuição) podem ser centralizadas como as contas
                    if (k !== 'qmassa' && k !== 'qdist') return [];
                    if (est.alinhar == null) est.alinhar = lembrar('alinhar') || 'esq';
                    return [CAMPO_POSICAO];
                },
                preparar: prepararSaida
            });
            var dadosQ = dadosQuimica(alvo);
            if (dadosQ) painelQ.mostrar(QOPS[dadosQ.op] ? dadosQ.op : 'qeq', dadosQ);
            else painelQ.mostrar(QOPS[lembrar('qop')] ? lembrar('qop') : 'qeq');

            // ---- aba Gráfico ----
            var estGraf = {};
            if (tipoDe(alvo) === 'grafico') { try { estGraf = JSON.parse(alvo.getAttribute('data-grafico')); } catch (e) { estGraf = {}; } }
            if (estGraf.notaveis === false && !estGraf.marcar) estGraf.marcar = []; // gráficos da 1ª versão
            var prevGraf = criarPrevia($('.eqd-in-graf'), $('.eqd-res-graf'), function () {
                return pedir('grafico', estGraf).then(function (r) {
                    r.preview = r.svg;
                    r.resumo = r.pontos.length ? tr('Pontos marcados: {0}', r.pontos.slice(0, 6).join(' · ')) : '';
                    return r;
                });
            }, atualizarOk);
            function previaGraf(atraso) { prevGraf.agendar(atraso); }
            montarForm($('.eqd-form-graf'), GRAF, estGraf, function () { previaGraf(); });
            previaGraf(0);

            // clique no gráfico marca um ponto: gruda num ponto notável, senão na curva, senão na grade
            $('.eqd-in-graf').addEventListener('click', function (e) {
                var svg = this.querySelector('svg'), resGraf = prevGraf.res;
                if (!svg || !resGraf) return;
                var m = resGraf.mapa, rc = svg.getBoundingClientRect();
                var px = (e.clientX - rc.left) * m.W / rc.width, py = (e.clientY - rc.top) * m.H / rc.height;
                if (px < m.M || px > m.M + m.PW || py < m.M || py > m.M + m.PH) return;
                function sx(x) { return m.M + (x - m.x0) / (m.x1 - m.x0) * m.PW; }
                function sy(y) { return m.M + (m.y1 - y) / (m.y1 - m.y0) * m.PH; }
                var x = m.x0 + (px - m.M) / m.PW * (m.x1 - m.x0), y = m.y1 - (py - m.M) / m.PH * (m.y1 - m.y0);
                var px2 = m.passo[0] / 2, py2 = m.passo[1] / 2;
                var perto = resGraf.marcas.filter(function (q) { return !q.extra && Math.hypot(sx(q.x) - px, sy(q.y) - py) < 10; })[0];
                if (perto) { x = perto.x; y = perto.y; }
                else {
                    var xr = Math.round(x / px2) * px2, melhor = null;
                    // curvas chegam amostradas na grade de meio passo (a mesma do arredondamento de xr)
                    resGraf.curvas.forEach(function (amostras) {
                        var a = amostras.filter(function (p) { return Math.abs(p[0] - xr) < px2 / 2; })[0];
                        if (!a) return;
                        var yy = a[1];
                        var d = Math.abs(sy(yy) - py);
                        if (d < 14 && (!melhor || d < melhor.d)) melhor = { d: d, y: yy };
                    });
                    if (melhor) { x = xr; y = melhor.y; }
                    else { x = xr; y = Math.round(y / py2) * py2; }
                }
                function br(v) { return I.num(Math.round(v * 100) / 100); }
                estGraf.pts.push({ n: proximoNome(estGraf.pts), x: br(x), y: br(y) });
                $('.eqd-form-graf')._redesenhar_pts();
                previaGraf(0);
            });

            // ---- abas / rodapé ----
            function atualizarOk() {
                $('.eqd-ok').disabled = (aba === 'conta' && !(painelConta && painelConta.res)) || (aba === 'grafico' && !(prevGraf && prevGraf.res)) ||
                    (aba === 'quimica' && !(painelQ && painelQ.res));
            }
            var DICAS = {
                formula: tr('<kbd>Enter</kbd> nova linha · <kbd>Ctrl</kbd>+<kbd>Enter</kbd> insere · <kbd>/</kbd> fração · <kbd>^</kbd> potência · <kbd>Tab</kbd> próxima lacuna'),
                conta: tr('A resolução aparece igual para o aluno. Dê dois cliques nela no texto para editar.'),
                grafico: tr('Vira uma imagem PNG no texto. Dê dois cliques nela para editar o gráfico.'),
                quimica: tr('Fórmulas viram texto editável; desenhos (vidrarias, estruturas) viram imagem. Dê dois cliques para editar.')
            };
            function mostrarAba(a) {
                aba = a;
                dlg.querySelectorAll('.eqd-tabs button').forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.aba === a)); });
                dlg.querySelectorAll('.eqd-pane').forEach(function (p) { p.hidden = p.dataset.pane !== a; });
                $('.eqd-ok').textContent = alvo ? tr('Atualizar') : tr('Inserir');
                $('.eqd-dica').innerHTML = DICAS[a];
                atualizarOk();
                // window.focus(): no Firefox o iframe do editor segura o foco e o focus() do diálogo não pega
                if (a === 'formula') setTimeout(function () { window.focus(); mf.focus(); }, 30);
                else setTimeout(function () { var i = dlg.querySelector('[data-pane="' + a + '"] .eqd-form input'); if (i) { window.focus(); i.focus(); } }, 30);
            }
            dlg.querySelectorAll('.eqd-tabs button').forEach(function (b) {
                b.onclick = function () { mostrarAba(b.dataset.aba); };
                // editando um item existente, não troca de aba (atualiza só o que foi clicado)
                if (alvo) b.disabled = b.dataset.aba !== aba;
            });

            // "Inserir" espera a prévia que ainda está a caminho do servidor (e ignora cliques repetidos enquanto isso)
            // o que entra no texto é gerado (e contado) pelo servidor em /v1/inserir; a prévia serve só para ver
            var confirmando = false;
            function confirmar() {
                if (confirmando) return;
                var p = { conta: painelConta.prev, quimica: painelQ.prev, grafico: prevGraf }[aba];
                var btn = $('.eqd-ok'), texto = btn.textContent;
                confirmando = true;
                btn.disabled = true;
                (p ? p.esperar() : Promise.resolve()).then(confirmarJa).then(null, function (e) {
                    var onde = aba === 'formula' ? null : $('[data-pane="' + aba + '"] .eqd-resumo');
                    if (onde) { onde.textContent = e.message; onde.classList.add('eqd-erro'); } else aviso(e.message);
                }).then(function () { confirmando = false; btn.textContent = texto; atualizarOk(); });
            }
            function confirmarJa() {
                var al = alvo;
                if (aba === 'formula') {
                    var latex = limparLatex(mf.value.trim());
                    if (!latex) { if (al) opcoes.remover(al); fechar(); return; }
                    return inserirNoServidor({ tipo: 'formula', latex: latex, bloco: bloco.checked }).then(function (r) { inserir(r.html, al); fechar(); });
                }
                if (aba === 'conta') {
                    if (!painelConta.res) return;
                    var est = painelConta.estado, dados = Object.assign({ op: painelConta.op }, est);
                    return inserirNoServidor({ tipo: 'conta', op: painelConta.op, dados: est }).then(function (r) {
                        guardar('alinhar', est.alinhar);
                        inserir(blocoConta('data-conta', dados, r.html, est.alinhar), al, true);
                        fechar();
                    });
                }
                if (aba === 'quimica') {
                    if (!painelQ.res) return;
                    var eq = painelQ.estado, dq = Object.assign({ op: painelQ.op }, eq);
                    return inserirNoServidor({ tipo: 'quimica', op: painelQ.op, dados: eq }).then(function (r) {
                        if (r.svg) return gerarImagem(r, 'data-quimica="' + escAttr(JSON.stringify(dq)) + '"', al);
                        if (eq.alinhar) guardar('alinhar', eq.alinhar);
                        // bloco: resolução (massa molar, distribuição); senão a fórmula já vem com data-quimica
                        inserir(r.bloco ? blocoConta('data-quimica', dq, r.html, eq.alinhar) : r.html, al, !!r.bloco);
                        fechar();
                    });
                }
                if (!prevGraf.res) return;
                return inserirNoServidor({ tipo: 'grafico', dados: estGraf }).then(function (r) {
                    return gerarImagem(r, 'data-grafico="' + escAttr(JSON.stringify(estGraf)) + '"', al);
                });
            }

            // conta/resolução em bloco próprio (nunca lado a lado); o conteúdo fica num inline-block alinhado
            function blocoConta(attr, dados, html, alinhar) {
                return '<div class="conta-armada" ' + attr + '="' + escAttr(JSON.stringify(dados)) + '" ' +
                    'style="margin:.6em 0;text-align:' + (alinhar === 'centro' ? 'center' : 'left') + ';">' +
                    '<div style="display:inline-block;text-align:left;vertical-align:top;">' + html + '</div></div>';
            }

            function gerarImagem(r, attr, al) {
                $('.eqd-ok').textContent = tr('Gerando…');
                return svgParaPng(r.svg, r.w, r.h).then(function (blob) {
                    return opcoes.imagem(blob, r, attr, al);
                }, function () { throw new Error(tr('Não foi possível gerar a imagem.')); }).then(fechar);
            }
            $('.eqd-ok').onclick = confirmar;

            function teclas(e) {
                if (e.key === 'Tab') { // modal: Tab circula dentro do diálogo
                    var foco = [].filter.call(dlg.querySelectorAll('button, input, select, textarea, math-field, [tabindex]:not([tabindex="-1"])'),
                        function (el) { return !el.disabled && el.getClientRects().length; });
                    var i = foco.indexOf(document.activeElement.closest('math-field') || document.activeElement);
                    if (i < 0 || (e.shiftKey ? i === 0 : i === foco.length - 1)) {
                        e.preventDefault();
                        (e.shiftKey ? foco[foco.length - 1] : foco[0]).focus();
                    }
                    return;
                }
                if (e.key === 'Escape') {
                    e.preventDefault(); e.stopPropagation();
                    var aberto = dlg.querySelector('.eqd-mais:not([hidden])');
                    if (aberto) { aberto.hidden = true; return; }
                    fechar();
                } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); e.stopPropagation(); confirmar(); }
                else if (e.key === 'Enter' && !e.shiftKey && !e.altKey && aba === 'formula' && (e.target === mf || mf.contains(e.target)) && mf.mode !== 'latex') {
                    e.preventDefault(); e.stopPropagation(); novaLinha();
                }
                else if (e.key === 'Enter' && aba !== 'formula' && e.target.tagName === 'INPUT' && e.target.type === 'text') { e.preventDefault(); confirmar(); }
            }
            document.addEventListener('keydown', teclas, true);

            mostrarAba(aba);
        }

        // SVG → PNG (2×, para ficar nítido em telas retina)
        function svgParaPng(svg, w, h) {
            return new Promise(function (ok, erro) {
                var img = new Image();
                img.onload = function () {
                    var c = document.createElement('canvas');
                    c.width = w * 2; c.height = h * 2;
                    var g = c.getContext('2d');
                    g.scale(2, 2);
                    g.drawImage(img, 0, 0, w, h);
                    c.toBlob(function (b) { if (b) ok(b); else erro(); }, 'image/png');
                };
                img.onerror = erro;
                img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
            });
        }

        return { abrir: abrir, inserirNoServidor: inserirNoServidor, fechar: function () { if (fecharAberto) fecharAberto(); } };
    }

    window.FormulixUI = { criar: criar, icones: ICONES, cssEditor: CSS_EDITOR, latexDe: latexDe,
        markup: markup, mathmlSimples: mathmlSimples, dadosQuimica: dadosQuimica, escAttr: escAttr };
})();
