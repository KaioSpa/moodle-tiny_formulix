/*
 * Idioma e notação do Formulix.
 *
 * Os textos ficam em português no código e passam por tr(): tr('Divisão') → 'Division' em inglês;
 * tr('Parcela {0} inválida', 2) troca {0} pelo 1º argumento. Sem tradução, fica o português.
 *
 * A notação acompanha o idioma e pode ser trocada por configuração:
 *   decimal    ',' ou '.'           (padrão: o do idioma, via Intl)
 *   separador  ';' ou ','           pares ordenados e conjuntos: (2; 3) ou (2, 3)
 *   trig       'sen' ou 'sin'       sen/tg ou sin/tan
 *   divisao    'chave' ou 'longa'   método da chave (Brasil) ou long division (EUA/Reino Unido)
 *   raizes     'linha' ou 'indice'  x' e x'' ou x₁ e x₂
 *
 * Padrão: inglês (os testes de cada módulo chamam definir('pt-BR')). O plugin chama definir() com o formulix_idioma (e formulix_notacao)
 * do TinyMCE; sem essa opção, vale o que o host passou em FormulixI18n.definir().
 * Teste: node tests/i18n.test.cjs (confere se todo tr('...') tem tradução).
 */
(function (root) {
    'use strict';

    var DIC = {}, ELEMENTOS = {};
    DIC.en = {
        // ---------- plugin.js ----------
        'Fórmula (Ctrl+Shift+M)': 'Formula (Ctrl+Shift+M)',
        'Armar conta': 'Set up calculation',
        'Gráfico de função': 'Function graph',
        'Química': 'Chemistry',
        'Editar': 'Edit', 'Remover': 'Remove', 'Fórmula': 'Formula', 'Gráfico': 'Graph',
        'Editor de fórmulas, contas e gráficos': 'Formula, calculation and graph editor',
        'Fechar': 'Close', 'Fechar (Esc)': 'Close (Esc)', 'Mais usados': 'Most used', 'Categorias': 'Categories',
        'Formatação da fórmula': 'Formula formatting',
        'Nova linha alinhada pelo sinal de igual (Enter)': 'New line aligned at the equals sign (Enter)',
        'Nova linha': 'New line', 'Código LaTeX': 'LaTeX code', 'Em destaque (linha própria)': 'Display (own line)',
        'Operação': 'Operation', 'Cancelar': 'Cancel', 'Menos': 'Less', 'Mais': 'More',
        '+ Adicionar': '+ Add', '+ Adicionar ponto': '+ Add point', 'Remover ponto': 'Remove point',
        'Outra cor': 'Other color', 'Inserir {0}': 'Insert {0}', '{0} do ponto {1}': '{0} of point {1}',
        'Texto': 'Text', 'Escrever texto dentro da fórmula (alterna)': 'Write text inside the formula (toggle)',
        'Destaque': 'Highlight', 'Estilo': 'Style', 'Matriz / sistema': 'Matrix / system', 'Cor {0}': 'Color {0}',
        'Tirar a cor': 'Remove color', 'Marca-texto': 'Highlight color', 'Tirar o destaque': 'Remove highlight',
        'Negrito': 'Bold', 'Letra reta (sem itálico)': 'Upright text (no italics)', '+ linha': '+ row', '+ coluna': '+ column',
        'Acrescentar linha abaixo (com o cursor numa matriz ou sistema)': 'Add row below (with the cursor in a matrix or system)',
        'Acrescentar coluna à direita': 'Add column to the right',
        '− linha': '− row', '− coluna': '− column', 'Remover a linha': 'Remove row', 'Remover a coluna': 'Remove column',
        'Metais alcalinos': 'Alkali metals', 'Metais alcalinoterrosos': 'Alkaline earth metals', 'Metais de transição': 'Transition metals',
        'Outros metais': 'Other metals', 'Semimetais': 'Metalloids', 'Não metais': 'Nonmetals', 'Halogênios': 'Halogens',
        'Gases nobres': 'Noble gases', 'Lantanídeos': 'Lanthanides', 'Actinídeos': 'Actinides',
        'Pontos marcados: {0}': 'Marked points: {0}',
        '<kbd>Enter</kbd> nova linha · <kbd>Ctrl</kbd>+<kbd>Enter</kbd> insere · <kbd>/</kbd> fração · <kbd>^</kbd> potência · <kbd>Tab</kbd> próxima lacuna': '<kbd>Enter</kbd> new line · <kbd>Ctrl</kbd>+<kbd>Enter</kbd> insert · <kbd>/</kbd> fraction · <kbd>^</kbd> exponent · <kbd>Tab</kbd> next placeholder',
        'A resolução aparece igual para o aluno. Dê dois cliques nela no texto para editar.': 'The solution appears exactly as students see it. Double-click it in the text to edit.',
        'Vira uma imagem PNG no texto. Dê dois cliques nela para editar o gráfico.': 'It becomes a PNG image in the text. Double-click it to edit the graph.',
        'Fórmulas viram texto editável; desenhos (vidrarias, estruturas) viram imagem. Dê dois cliques para editar.': 'Formulas become editable text; drawings (glassware and structures) become images. Double-click to edit.',
        'Atualizar': 'Update', 'Inserir': 'Insert', 'Gerando…': 'Generating…',
        'Não foi possível gerar a imagem.': 'Could not generate the image.',
        'Gráfico de {0}': 'Graph of {0}',
        // labels and descriptions rendered from plugin metadata
        'Fração': 'Fraction', 'Potência': 'Power', 'Raiz quadrada': 'Square root', 'Raiz de índice n': 'Nth root',
        'Índice (subscrito)': 'Subscript', 'Parênteses': 'Parentheses', 'Módulo': 'Absolute value', 'Mais ou menos': 'Plus or minus',
        'Multiplicação (ponto)': 'Multiplication (dot)', 'Multiplicação (×)': 'Multiplication (×)', 'Divisão': 'Division',
        'Diferente': 'Not equal', 'Menor ou igual': 'Less than or equal to', 'Maior ou igual': 'Greater than or equal to',
        'Aproximadamente': 'Approximately', 'Grau': 'Degree', 'Porcentagem': 'Percentage',
        'Álgebra': 'Algebra', 'Matrizes': 'Matrices', 'Geometria': 'Geometry', 'Trigonometria': 'Trigonometry',
        'Conjuntos': 'Sets', 'Gregas': 'Greek', 'Setas e lógica': 'Arrows and logic', 'Cálculo': 'Calculus',
        'Sistema (2 equações)': 'System (2 equations)', 'Sistema (3 equações)': 'System (3 equations)', 'Discriminante (Δ)': 'Discriminant (Δ)',
        'Fórmula de Bhaskara': 'Quadratic formula', 'Colchetes': 'Brackets', 'Chaves': 'Braces', 'Logaritmo na base': 'Logarithm with base',
        'Logaritmo decimal': 'Common logarithm', 'Logaritmo natural': 'Natural logarithm', 'Fatorial': 'Factorial', 'Binomial': 'Binomial',
        'Infinito': 'Infinity', 'Intervalo fechado': 'Closed interval', 'Intervalo aberto': 'Open interval', 'Equivalente / congruente': 'Equivalent / congruent',
        'Proporcional': 'Proportional', 'Matriz 2×2': '2×2 matrix', 'Matriz 3×3': '3×3 matrix', 'Matriz 2×2 (colchetes)': '2×2 matrix (brackets)',
        'Determinante 2×2': '2×2 determinant', 'Determinante 3×3': '3×3 determinant', 'Matriz coluna': 'Column matrix',
        'Transposta': 'Transpose', 'Inversa': 'Inverse', 'Ângulo (Â)': 'Angle (Â)', 'Ângulo': 'Angle', 'Segmento': 'Segment', 'Reta': 'Line',
        'Semirreta / vetor': 'Ray / vector', 'Vetor': 'Vector', 'Arco': 'Arc', 'Triângulo': 'Triangle', 'Paralelo': 'Parallel',
        'Perpendicular': 'Perpendicular', 'Congruente': 'Congruent', 'Semelhante': 'Similar', 'Minuto (′)': 'Minute (′)', 'Segundo (″)': 'Second (″)',
        'Seno': 'Sine', 'Cosseno': 'Cosine', 'Tangente': 'Tangent', 'Cotangente': 'Cotangent', 'Secante': 'Secant', 'Cossecante': 'Cosecant',
        'Seno ao quadrado': 'Sine squared', 'Arco-seno': 'Arcsine', 'Teta': 'Theta', 'Alfa': 'Alpha', 'Beta': 'Beta',
        'Pertence': 'Belongs to', 'Não pertence': 'Does not belong to', 'Está contido': 'Is contained in', 'Não está contido': 'Is not contained in',
        'Contém': 'Contains', 'União': 'Union', 'Interseção': 'Intersection', 'Diferença': 'Difference', 'Conjunto vazio': 'Empty set',
        'Naturais': 'Natural numbers', 'Inteiros': 'Integers', 'Racionais': 'Rational numbers', 'Reais': 'Real numbers', 'Complexos': 'Complex numbers',
        'Reais não nulos': 'Nonzero real numbers', 'Conjunto { }': 'Set { }', 'Conjunto por propriedade': 'Set-builder notation',
        'Para todo': 'For all', 'Existe': 'There exists', 'Seta': 'Arrow', 'Implica': 'Implies', 'Se e somente se': 'If and only if',
        'Seta para a esquerda': 'Left arrow', 'Seta dupla': 'Double arrow', 'Portanto': 'Therefore', 'Pois': 'Because', 'E': 'And', 'Ou': 'Or', 'Não': 'Not',
        'Para cima': 'Up', 'Para baixo': 'Down', 'Limite': 'Limit', 'Somatório': 'Summation', 'Produtório': 'Product',
        'Integral definida': 'Definite integral', 'Integral': 'Integral', 'Derivada': 'Derivative', 'Linha (f′)': 'Prime (f′)', 'Derivada parcial': 'Partial derivative',
        'Dividendo': 'Dividend', 'Divisor': 'Divisor', 'Casas decimais no quociente': 'Decimal places in quotient',
        'Processo breve (sem escrever as subtrações)': 'Short process (without writing subtractions)', 'Quociente': 'Quotient', 'Resto': 'Remainder',
        'Multiplicação': 'Multiplication', 'Mostrar o “vai um” (fator de 1 algarismo)': 'Show carrying (one-digit factor)', 'Produto': 'Product',
        'casas decimais': 'decimal places', 'casa decimal': 'decimal place', 'no total': 'in total', 'Adição': 'Addition', 'Parcela {0}': 'Addend {0}',
        'Mostrar o “vai um”': 'Show carrying', 'Soma': 'Sum', 'Subtração': 'Subtraction', 'Minuendo (de cima)': 'Minuend (top)',
        'Subtraendo': 'Subtrahend', 'Mostrar os empréstimos': 'Show borrowing', 'Aritmética': 'Arithmetic', 'MMC e MDC': 'LCM and GCD',
        'Decomposição simultânea': 'Simultaneous factorization', 'Números': 'Numbers', 'Separe com espaço (de 2 a 4 números).': 'Separate with spaces (2 to 4 numbers).',
        'Calcular': 'Calculate', 'Os dois': 'Both', 'Fatoração': 'Factorization', 'Decomposição em fatores primos': 'Prime factorization',
        'Número': 'Number', 'Frações': 'Fractions', 'Soma, subtração, produto e divisão': 'Addition, subtraction, multiplication and division',
        '1ª fração': '1st fraction', '2ª fração': '2nd fraction', 'Regra de três': 'Rule of three', 'Direta ou inversa': 'Direct or inverse',
        'Grandeza A': 'Quantity A', 'Grandeza B': 'Quantity B', 'A (1º valor)': 'A (1st value)', 'B (1º valor)': 'B (1st value)', 'A (2º valor)': 'A (2nd value)',
        'Proporção': 'Proportion', 'Direta': 'Direct', 'Inversa': 'Inverse', 'Equação do 1º grau': 'Linear equation', 'Isolando a incógnita': 'Isolating the unknown',
        'Equação': 'Equation', 'Equação do 2º grau': 'Quadratic equation', 'Bhaskara passo a passo': 'Quadratic formula step by step',
        'Sistema 2×2': '2×2 system', 'Adição ou substituição': 'Addition or substitution', 'Método': 'Method', 'Substituição': 'Substitution',
        'Divisão de polinômio por (x − a)': 'Polynomial division by (x − a)', 'Coeficientes': 'Coefficients', 'Raiz (o a de x − a)': 'Root (the a in x − a)',
        'Funções': 'Functions', 'Tabela de valores': 'Table of values', 'Substituindo x na função': 'Substituting x in the function',
        'Função': 'Function', 'Valores de x': 'x values', 'Ou um intervalo: -3..3': 'Or a range: -3..3', 'Coluna com o par ordenado (x; y)': 'Column with ordered pair (x; y)',
        'Estudo da função': 'Function analysis', 'Zeros, vértice e crescimento': 'Zeros, vertex and monotonicity', 'Função do 1º ou 2º grau': 'Linear or quadratic function',
        'Posição no texto': 'Position in text', 'À esquerda': 'Left', 'Centralizada': 'Centered', 'x mínimo': 'minimum x', 'x máximo': 'maximum x',
        'y mínimo': 'minimum y', 'y máximo': 'maximum y', 'automático': 'automatic', 'Marcar automaticamente': 'Mark automatically',
        'Raízes': 'Roots', 'Vértice / máx. e mín.': 'Vertex / max. and min.', 'Corte no eixo y': 'y-axis intercept', 'Interseções': 'Intersections',
        'Pontos': 'Points', 'Dica: clique no gráfico para marcar um ponto (ele “gruda” na curva).': 'Tip: click the graph to mark a point (it snaps to the curve).',
        'Linhas tracejadas dos pontos até os eixos': 'Dashed lines from points to axes', 'Quadriculado': 'Grid', 'Legenda': 'Legend', 'Tamanho da imagem': 'Image size',
        'Pequeno': 'Small', 'Médio': 'Medium', 'Grande': 'Large',
        'Equação química': 'Chemical equation', 'Fórmula ou equação': 'Formula or equation',
        'Carga com ^ (Fe^3+, SO4^2-), estado no fim (aq), hidrato com · e condição na seta: ->[Δ].': 'Charge with ^ (Fe^3+, SO4^2-), state at the end (aq), hydrate with · and condition on the arrow: ->[Δ].',
        '→ com Δ': '→ with Δ', '→ com catalisador': '→ with catalyst', '↑ gás': '↑ gas', '↓ precipitado': '↓ precipitate', '· hidrato': '· hydrate',
        'Balancear automaticamente': 'Balance automatically', 'Mostrar a contagem de átomos (insere como bloco)': 'Show atom count (insert as block)',
        'Equação balanceada': 'Balanced equation', 'Não balanceada:': 'Not balanced:', ' — ligue “Balancear automaticamente”.': ' — enable “Balance automatically”.',
        'Massa molar': 'Molar mass', 'Massas atômicas': 'Atomic masses', 'Arredondadas': 'Rounded', 'Da tabela': 'From table',
        'Calcular também': 'Also calculate', 'Só a massa molar': 'Only molar mass', 'Massa (de mols)': 'Mass (from moles)', 'Mols (de massa)': 'Moles (from mass)',
        'Quantidade (mol ou g)': 'Quantity (mol or g)', 'resultado': 'result', 'Distribuição eletrônica': 'Electron configuration',
        'Símbolo, nome ou número atômico.': 'Symbol, name or atomic number.', 'Carga do íon': 'Ion charge', 'Tabela periódica': 'Periodic table',
        'Clique na tabela ao lado ou digite.': 'Click the table beside it or type.', 'Inserir como': 'Insert as', 'Símbolo': 'Symbol', 'Nome': 'Name', 'Ficha': 'Card',
        'Massa na ficha': 'Mass on card', 'Arredondada': 'Rounded', 'Laboratório': 'Laboratory', 'Vidrarias': 'Glassware',
        'Béquer, proveta, bureta, balões…': 'Beakers, graduated cylinders, burettes, flasks…', 'Vidrarias (lado a lado)': 'Glassware (side by side)',
        '+ Adicionar vidraria': '+ Add glassware', 'Tipo': 'Type', 'Balão fundo redondo': 'Round-bottom flask', 'Nível (%) / leitura': 'Level (%) / reading',
        'Cor': 'Color', 'Rótulo': 'Label', 'Titulação': 'Titration', 'Montagem com bureta e erlenmeyer': 'Burette and Erlenmeyer setup',
        'Titulante (na bureta)': 'Titrant (in burette)', 'Cor do titulante': 'Titrant color', 'Leitura da bureta (mL)': 'Burette reading (mL)',
        'Nível no erlenmeyer (%)': 'Level in Erlenmeyer (%)', 'Titulado (no erlenmeyer)': 'Analyte (in Erlenmeyer)', 'Cor do titulado': 'Analyte color',
        'Mostrar a gota caindo': 'Show falling drop', 'Atomística': 'Atomic structure', 'Diagrama de Pauling': 'Aufbau diagram',
        'Com os subníveis preenchidos': 'With subshells filled', 'Elemento (opcional)': 'Element (optional)', 'Deixe vazio para o diagrama em branco.': 'Leave empty for a blank diagram.',
        'Orgânica': 'Organic chemistry', 'Funções orgânicas': 'Functional groups', 'Grupos funcionais e anéis': 'Functional groups and rings',
        'Cadeia carbônica': 'Carbon chain', 'Fórmula estrutural com ramificações': 'Structural formula with branches',
        'Cadeia': 'Chain', 'Ligações: - = ≡. Ramificações entre parênteses.': 'Bonds: - = ≡. Branches in parentheses.',
        'Mais contas': 'More calculations', 'Mais química': 'More chemistry',
        // ---------- contas.js ----------
        'Número inválido em "{0}" (use números positivos, com vírgula se precisar).': 'Invalid number in "{0}" (use positive numbers, with a decimal point if needed).',
        'Número inválido: "{0}".': 'Invalid number: "{0}".',
        'dividendo': 'dividend', 'divisor': 'divisor', '1º fator': '1st factor', '2º fator': '2nd factor',
        'O divisor não pode ser zero.': 'The divisor cannot be zero.',
        'Igualando as casas decimais (×{0} nos dois): ': 'Moving the decimal point (×{0} on both): ',
        'Parcela {0} inválida (use números positivos, vírgula opcional).': 'Addend {0} is invalid (use positive numbers; decimals are fine).',
        'Informe ao menos duas parcelas.': 'Enter at least two addends.',
        'O minuendo (de cima) precisa ser maior ou igual ao subtraendo.': 'The minuend (top number) must be greater than or equal to the subtrahend.',
        'Informe os coeficientes separados por espaço (ex.: 1 -5 6).': 'Enter the coefficients separated by spaces (e.g. 1 -5 6).',

        // ---------- quimica.js ----------
        'Ferro': 'Iron',
        '{0} em "{1}"': '{0} in "{1}"',
        'Parêntese sem fechar': 'Unclosed parenthesis',
        'Elemento desconhecido "{0}"': 'Unknown element "{0}"',
        'Símbolo inesperado "{0}"': 'Unexpected symbol "{0}"',
        'Sobrou "{0}"': 'Leftover "{0}"',
        'Fórmula vazia': 'Empty formula',
        'Digite uma fórmula ou equação (ex.: 2H2 + O2 -> 2H2O).': 'Enter a formula or equation (e.g. 2H2 + O2 -> 2H2O).',
        'Para balancear, escreva uma reação com seta (ex.: H2 + O2 -> H2O).': 'To balance, write a reaction with an arrow (e.g. H2 + O2 -> H2O).',
        'algebra.js não carregado': 'algebra.js not loaded',
        'Essa reação tem mais de um balanceamento possível.': 'This reaction has more than one possible balance.',
        'Não foi possível balancear: confira as fórmulas.': 'Could not balance: check the formulas.',
        'Não foi possível balancear com coeficientes positivos.': 'Could not balance with positive coefficients.',
        'Conferindo a quantidade de átomos de cada elemento:': 'Checking the number of atoms of each element:',
        'Elemento': 'Element', 'Reagentes': 'Reactants', 'Produtos': 'Products',
        'Digite uma fórmula, como H2SO4 ou CuSO4·5H2O.': 'Enter a formula, such as H2SO4 or CuSO4·5H2O.',
        'Massas atômicas: {0} (em u).': 'Atomic masses: {0} (in u).',
        'Massa correspondente a': 'Mass for',
        'Quantidade de matéria em': 'Amount of substance in',
        'Informe a {0}.': 'Enter the {0}.',
        'quantidade de matéria': 'amount of substance', 'massa': 'mass',
        'Elemento não encontrado (use símbolo, nome ou número atômico).': 'Element not found (use symbol, name or atomic number).',
        'Carga inválida (ex.: 2, -2 ou 2-).': 'Invalid charge (e.g. 2, -2 or 2-).',
        'Carga maior que o número de prótons.': 'Charge greater than the number of protons.',
        'Esse íon não tem elétrons para distribuir.': 'This ion has no electrons to distribute.',
        '{0} (${1}$): $Z={2}$': '{0} (${1}$): $Z={2}$',
        '{0} (${1}$): $Z={2}$, {3} elétrons.': '{0} (${1}$): $Z={2}$, {3} electrons.',
        'Ordem energética (diagrama de Linus Pauling):': 'Energy order (Aufbau / Madelung diagram):',
        'Por camadas: {0}.': 'By shell: {0}.',
        'Camada de valência: {0} (${1}$), com {2} elétron(s).': 'Valence shell: {0} (${1}$), with {2} electron(s).',
        'Subnível mais energético: ${0}$.': 'Highest-energy subshell: ${0}$.',
        'Vidraria desconhecida': 'Unknown glassware',
        'Adicione ao menos uma vidraria.': 'Add at least one piece of glassware.',
        'Vidrarias: {0}': 'Glassware: {0}',
        'Leitura: {0} mL': 'Reading: {0} mL',
        'Montagem de titulação': 'Titration setup',
        'Escolha uma função orgânica.': 'Choose a functional group.',
        'Digite a cadeia, ex.: H3C-CH2-CH(CH3)-CH3': 'Enter the chain, e.g. H3C-CH2-CH(CH3)-CH3',
        'Cadeia inválida perto de "{0}"': 'Invalid chain near "{0}"',
        'Parêntese sem fechar na cadeia': 'Unclosed parenthesis in the chain',
        'Diagrama de Linus Pauling': 'Aufbau diagram',
        'Diagrama de Linus Pauling — {0}': 'Aufbau diagram — {0}',
        'Cadeia carbônica {0}': 'Carbon chain {0}',
        'Fórmula estrutural: {0}': 'Structural formula: {0}',
        'Escolha um elemento na tabela.': 'Choose an element from the table.',
        'Elemento {0}': 'Element {0}',
        // nomes das vidrarias
        'Béquer': 'Beaker', 'Balão volumétrico': 'Volumetric flask', 'Balão de fundo redondo': 'Round-bottom flask',
        'Proveta': 'Graduated cylinder', 'Bureta': 'Burette', 'Pipeta volumétrica': 'Volumetric pipette',
        'Tubo de ensaio': 'Test tube', 'Funil': 'Funnel',
        // nomes das funções orgânicas
        'Álcool': 'Alcohol', 'Fenol': 'Phenol', 'Aldeído': 'Aldehyde', 'Cetona': 'Ketone',
        'Ácido carboxílico': 'Carboxylic acid', 'Éster': 'Ester', 'Éter': 'Ether', 'Amina': 'Amine', 'Amida': 'Amide',
        'Haleto orgânico': 'Organic halide', 'Nitrila': 'Nitrile', 'Benzeno': 'Benzene', 'Cicloexano': 'Cyclohexane',

        // ---------- algebra.js ----------
        'Divisão por zero.': 'Division by zero.',
        'Números grandes demais para a resolução exata.': 'Numbers too large for an exact solution.',
        'Símbolo não reconhecido: "{0}".': 'Unrecognized symbol: "{0}".',
        'Expressão vazia.': 'Empty expression.',
        'Esperava "{0}" na expressão.': 'Expected "{0}" in the expression.',
        'Expressão incompleta.': 'Incomplete expression.',
        'Expressão inválida perto de "{0}".': 'Invalid expression near "{0}".',
        'Variável "{0}" sem valor.': 'Variable "{0}" has no value.',
        'Use números em vez de π/e nesta resolução.': 'Use numbers instead of π/e in this solution.',
        'Funções (sen, √, log...) não entram nesta resolução.': 'Functions (sin, √, log...) are not supported in this solution.',
        'Incógnita no denominador ainda não é suportada.': 'An unknown in the denominator is not supported yet.',
        'Expoente precisa ser um inteiro de 0 a 6.': 'The exponent must be a whole number from 0 to 6.',
        'Escreva uma equação com um sinal de "=" (ex.: 2x + 3 = 7).': 'Write an equation with an "=" sign (e.g. 2x + 3 = 7).',
        'A igualdade é sempre verdadeira: qualquer valor de ${0}$ é solução.': 'The equation is always true: any value of ${0}$ is a solution.',
        'A igualdade é falsa: não há solução.': 'The equation is never true: there is no solution.',
        'Use só uma incógnita.': 'Use only one unknown.',
        'A equação não tem incógnita.': 'The equation has no unknown.',
        'Essa equação é do 2º grau — use “Equação do 2º grau”.': 'This is a quadratic equation — use “Quadratic equation”.',
        'A equação não é do 1º grau.': 'The equation is not linear.',
        'Coeficientes: $a={0}$, $b={1}$ e $c={2}$': 'Coefficients: $a={0}$, $b={1}$ and $c={2}$',
        'Como $\\Delta<0$, não há raízes reais.': 'Since $\\Delta<0$, there are no real roots.',
        'Essa equação é do 1º grau — use “Equação do 1º grau”.': 'This is a linear equation — use “Linear equation”.',
        'A equação não é do 2º grau.': 'The equation is not quadratic.',
        '{0}ª equação: {1}': 'Equation {0}: {1}',
        'O sistema precisa ter exatamente duas incógnitas (ex.: x e y).': 'The system must have exactly two unknowns (e.g. x and y).',
        'As equações precisam ser do 1º grau.': 'The equations must be linear.',
        'Organizando as equações:': 'Rearranging the equations:',
        'Sistema impossível (SI): $S=\\varnothing$': 'Inconsistent system (no solution): $S=\\varnothing$',
        'Sistema possível e indeterminado (SPI): infinitas soluções.': 'Dependent system: infinitely many solutions.',
        'Isolando ${0}$ na {1}ª equação: ${0}={2}$': 'Solving equation {1} for ${0}$: ${0}={2}$',
        'Substituindo na {0}ª equação:': 'Substituting into equation {0}:',
        'A {0}ª equação só tem ${1}$:': 'Equation {0} has only ${1}$:',
        'Multiplicando as equações para eliminar ${0}$:': 'Multiplying the equations to eliminate ${0}$:',
        'Somando as equações:': 'Adding the equations:',
        'Substituindo ${0}={1}$ na {2}ª equação:': 'Substituting ${0}={1}$ into equation {2}:',
        'Use frações como 3/4 ou números inteiros.': 'Use fractions like 3/4 or whole numbers.',
        'Denominador não pode ser zero.': 'The denominator cannot be zero.',
        'Denominadores diferentes: usamos o mmc({0}, {1}) = {2}.': 'Different denominators: we use the least common denominator, lcm({0}, {1}) = {2}.',
        'Não dá para dividir por zero.': 'You cannot divide by zero.',
        'simplificando por': 'simplifying by',
        'Grandezas inversamente proporcionais: invertemos a razão de B.': 'Inversely proportional quantities: we flip the ratio of B.',
        'Grandezas diretamente proporcionais.': 'Directly proportional quantities.',
        'Os valores conhecidos não podem ser zero.': 'The known values cannot be zero.',
        'Use números naturais maiores que 1.': 'Use whole numbers greater than 1.',
        'Número grande demais.': 'Number too large.',
        'Informe um número.': 'Enter a number.',
        'Informe de {0} a {1} números.': 'Enter {0} to {1} numbers.',
        'mmc': 'lcm', 'mdc': 'gcd', '(primos entre si)': '(coprime)',
        '* fatores que dividem todos os números ao mesmo tempo': '* factors that divide all the numbers at once',
        'Use só a variável x.': 'Use only the variable x.',
        'Intervalo grande demais (máx. 40 valores).': 'Range too large (max. 40 values).',
        'Informe os valores de x.': 'Enter the values of x.',
        'No máximo 40 valores.': 'At most 40 values.',
        'O estudo automático é para funções do 1º ou 2º grau (ex.: 2x − 4 ou x² − 5x + 6).': 'Automatic analysis works for linear or quadratic functions (e.g. 2x − 4 or x² − 5x + 6).',
        'Coeficientes: $a={0}$ e $b={1}$': 'Coefficients: $a={0}$ and $b={1}$',
        'Como $a>0$, a função é crescente.': 'Since $a>0$, the function is increasing.',
        'Como $a<0$, a função é decrescente.': 'Since $a<0$, the function is decreasing.',
        'Zero da função ($f({0})=0$):': 'Zero of the function ($f({0})=0$):',
        'O gráfico corta o eixo ${0}$ em ${1}$ e o eixo $y$ em ${2}$.': 'The graph crosses the ${0}$-axis at ${1}$ and the $y$-axis at ${2}$.',
        'Como $a>0$, a concavidade é para cima (ponto de mínimo).': 'Since $a>0$, the parabola opens upward (minimum point).',
        'Como $a<0$, a concavidade é para baixo (ponto de máximo).': 'Since $a<0$, the parabola opens downward (maximum point).',
        'Zeros da função ($f({0})=0$):': 'Zeros of the function ($f({0})=0$):',
        'Coordenadas do vértice:': 'Vertex coordinates:',
        'Vértice: $V{0}$, valor mínimo ${1}$.': 'Vertex: $V{0}$, minimum value ${1}$.',
        'Vértice: $V{0}$, valor máximo ${1}$.': 'Vertex: $V{0}$, maximum value ${1}$.',
        'Corta o eixo $y$ em ${0}$.': 'It crosses the $y$-axis at ${0}$.',
        'Corta o eixo $y$ em ${0}$ e não corta o eixo ${1}$.': 'It crosses the $y$-axis at ${0}$ and does not cross the ${1}$-axis.',

        // ---------- grafico.js ----------
        'Pontos: use o formato {0}, {1}.': 'Points: use the format {0}, {1}.',
        'Ponto {0}: informe x e y.': 'Point {0}: enter x and y.',
        'Digite ao menos uma função (ex.: 2x + 1).': 'Enter at least one function (e.g. 2x + 1).',
        'O x máximo precisa ser maior que o x mínimo.': 'The maximum x must be greater than the minimum x.',
        'O y máximo precisa ser maior que o y mínimo.': 'The maximum y must be greater than the minimum y.',

        // ---------- plugin.js: dicas, exemplos, resumos ----------
        'Escrever texto (alterna)': 'Write text (toggle)', 'Desfazer (Ctrl+Z)': 'Undo (Ctrl+Z)', 'Refazer (Ctrl+Y)': 'Redo (Ctrl+Y)',
        'Cosseno ao quadrado': 'Cosine squared', '+ Adicionar função': '+ Add function', '+ Adicionar parcela': '+ Add addend',
        'MMC': 'LCM', 'MDC': 'GCD', '1ª equação': '1st equation', '2ª equação': '2nd equation',
        'ex.: 2x + 1': 'e.g. 2x + 1', 'ex.: Horas': 'e.g. Hours', 'ex.: Km': 'e.g. km', 'ex.: 2': 'e.g. 2', 'ex.: 2 ou -2': 'e.g. 2 or -2',
        'ex.: 3-metilpent-1-eno': 'e.g. 3-methylpent-1-ene',
        'Aceita parênteses e frações, como x/2 + 1 = 4.': 'Parentheses and fractions are accepted, e.g. x/2 + 1 = 4.',
        'Digite x² ou x^2.': 'Type x² or x^2.',
        'Do maior grau ao termo independente; use 0 nos que faltam.': 'From the highest degree to the constant term; use 0 for missing terms.',
        'Aceita parênteses e hidratos: Ca(OH)2, CuSO4·5H2O.': 'Parentheses and hydrates are accepted: Ca(OH)2, CuSO4·5H2O.',
        'Grupo R': 'R group', "Grupo R'": "R' group", 'Halogênio (X)': 'Halogen (X)', 'Mostrar o nome da função': 'Show the functional group name',
        'Legenda (opcional)': 'Caption (optional)',
        '→ com Δ': '→ with Δ', '→ com catalisador': '→ with catalyst', '↑ gás': '↑ gas', '↓ precipitado': '↓ precipitate', '· hidrato': '· hydrate',
        '( ramificação )': '( branch )', 'Água': 'Water', 'Indicador': 'Indicator', 'HCl + fenolftaleína': 'HCl + phenolphthalein',
        '{0} casas decimais no total': '{0} decimal places in total', '{0} casa decimal no total': '{0} decimal place in total',
        '✓ Equação balanceada': '✓ Balanced equation', '⚠ Não balanceada: {0} — ligue “{1}”.': '⚠ Not balanced: {0} — turn on “{1}”.',
        'Não consegui ler essa equação antiga do Word aqui. Cole direto no texto do editor: ela entra como imagem.': 'Could not read this old Word equation here. Paste it straight into the editor text: it goes in as an image.',
        '{0} equações coladas do Word.': '{0} equations pasted from Word.',
        'O limite mensal de inserções do plano acabou. Veja os planos no painel do Formulix.': 'This plan’s monthly insertion limit has been reached. See the plans in the Formulix dashboard.',
        'Ver planos': 'See plans',
        'Chave do Formulix inválida para este site.': 'Formulix key is not valid for this site.',
        'Muitos pedidos; tente de novo em instantes.': 'Too many requests; try again in a moment.',
        'Sem conexão com o servidor do Formulix.': 'Cannot reach the Formulix server.'
        // ---------- fim ----------
    };
    ELEMENTOS.en = {
        H: 'Hydrogen', He: 'Helium', Li: 'Lithium', Be: 'Beryllium', B: 'Boron', C: 'Carbon', N: 'Nitrogen', O: 'Oxygen', F: 'Fluorine', Ne: 'Neon',
        Na: 'Sodium', Mg: 'Magnesium', Al: 'Aluminium', Si: 'Silicon', P: 'Phosphorus', S: 'Sulfur', Cl: 'Chlorine', Ar: 'Argon', K: 'Potassium', Ca: 'Calcium',
        Sc: 'Scandium', Ti: 'Titanium', V: 'Vanadium', Cr: 'Chromium', Mn: 'Manganese', Fe: 'Iron', Co: 'Cobalt', Ni: 'Nickel', Cu: 'Copper', Zn: 'Zinc',
        Ga: 'Gallium', Ge: 'Germanium', As: 'Arsenic', Se: 'Selenium', Br: 'Bromine', Kr: 'Krypton', Rb: 'Rubidium', Sr: 'Strontium', Y: 'Yttrium', Zr: 'Zirconium',
        Nb: 'Niobium', Mo: 'Molybdenum', Tc: 'Technetium', Ru: 'Ruthenium', Rh: 'Rhodium', Pd: 'Palladium', Ag: 'Silver', Cd: 'Cadmium', In: 'Indium', Sn: 'Tin',
        Sb: 'Antimony', Te: 'Tellurium', I: 'Iodine', Xe: 'Xenon', Cs: 'Caesium', Ba: 'Barium', La: 'Lanthanum', Ce: 'Cerium', Pr: 'Praseodymium', Nd: 'Neodymium',
        Pm: 'Promethium', Sm: 'Samarium', Eu: 'Europium', Gd: 'Gadolinium', Tb: 'Terbium', Dy: 'Dysprosium', Ho: 'Holmium', Er: 'Erbium', Tm: 'Thulium', Yb: 'Ytterbium',
        Lu: 'Lutetium', Hf: 'Hafnium', Ta: 'Tantalum', W: 'Tungsten', Re: 'Rhenium', Os: 'Osmium', Ir: 'Iridium', Pt: 'Platinum', Au: 'Gold', Hg: 'Mercury',
        Tl: 'Thallium', Pb: 'Lead', Bi: 'Bismuth', Po: 'Polonium', At: 'Astatine', Rn: 'Radon', Fr: 'Francium', Ra: 'Radium', Ac: 'Actinium', Th: 'Thorium',
        Pa: 'Protactinium', U: 'Uranium', Np: 'Neptunium', Pu: 'Plutonium', Am: 'Americium', Cm: 'Curium', Bk: 'Berkelium', Cf: 'Californium', Es: 'Einsteinium', Fm: 'Fermium',
        Md: 'Mendelevium', No: 'Nobelium', Lr: 'Lawrencium', Rf: 'Rutherfordium', Db: 'Dubnium', Sg: 'Seaborgium', Bh: 'Bohrium', Hs: 'Hassium', Mt: 'Meitnerium', Ds: 'Darmstadtium',
        Rg: 'Roentgenium', Cn: 'Copernicium', Nh: 'Nihonium', Fl: 'Flerovium', Mc: 'Moscovium', Lv: 'Livermorium', Ts: 'Tennessine', Og: 'Oganesson'
    };

    var I = {
        idioma: 'en', dec: '.', sep: ',', trig: 'sin', divisao: 'longa', raizes: 'indice',
        idiomas: ['pt-BR', 'en'],

        registrar: function (idioma, dicionario, elementos) {
            var chave = String(idioma).toLowerCase().replace('_', '-');
            DIC[chave] = Object.assign({}, DIC.en, dicionario);
            if (elementos) ELEMENTOS[chave] = elementos;
            if (I.idiomas.indexOf(chave) < 0) I.idiomas.push(chave);
        },

        // idioma: 'pt-BR', 'en-US', 'en', 'de'... (sem dicionário próprio → inglês com a notação do idioma)
        definir: function (idioma, notacao) {
            var pedido = String(idioma || 'en'), chave = pedido.toLowerCase().replace('_', '-'), base = chave.split('-')[0];
            I.idioma = base === 'pt' ? 'pt-BR' : DIC[chave] ? chave : /^zh-(hant|tw|hk|mo)\b/.test(chave) && DIC['zh-hant'] ? 'zh-hant' : base === 'zh' && DIC['zh-hans'] ? 'zh-hans' : DIC[base] ? base : DIC[base + '-419'] ? base + '-419' : 'en';
            var pt = I.idioma === 'pt-BR', dec = pt ? ',' : '.';
            try {
                var parte = new Intl.NumberFormat(pedido).formatToParts(1.5).filter(function (p) { return p.type === 'decimal'; })[0];
                if (parte) dec = parte.value;
            } catch (e) { /* idioma desconhecido para o Intl: fica o padrão */ }
            notacao = notacao || {};
            I.dec = notacao.decimal || dec;
            I.sep = notacao.separador || (I.dec === ',' ? ';' : ',');
            I.trig = notacao.trig || (pt ? 'sen' : 'sin');
            I.divisao = notacao.divisao || (pt ? 'chave' : 'longa');
            I.raizes = notacao.raizes || (pt ? 'linha' : 'indice');
            return I;
        },

        tr: function (s) {
            var d = DIC[I.idioma], r = (d && d[s]) || s, args = arguments;
            return r.replace(/\{(\d)\}/g, function (_, i) { return args[+i + 1]; });
        },

        nomeElemento: function (e) {
            return (ELEMENTOS[I.idioma] && ELEMENTOS[I.idioma][e.s]) || I.tr(e.nome);
        },

        // número (string ou Number) com o separador decimal escolhido
        num: function (v) { return String(v).replace('.', I.dec); },
        // idem, em LaTeX: a vírgula vai entre chaves para não ganhar espaço de pontuação
        numTex: function (v) { return String(v).replace(/[.,]/, I.dec === ',' ? '{,}' : '.'); },
        // par ordenado: (2; 3) ou (2, 3)
        par: function (a, b) { return '(' + a + I.sep + ' ' + b + ')'; },
        parTex: function (a, b) { return '\\left(' + a + I.sep + '\\ ' + b + '\\right)'; },
        // separador de elementos de conjunto em LaTeX
        sepTex: function () { return I.sep + '\\ '; },
        // sen/tg em LaTeX conforme a notação
        trigTex: function (f) {
            if (I.trig === 'sin') return { sen: '\\sin', tg: '\\tan', cotg: '\\cot', cossec: '\\csc', arcsen: '\\arcsin', arctg: '\\arctan' }[f] || '\\' + f;
            return { sen: '\\operatorname{sen}', tg: '\\operatorname{tg}', cotg: '\\operatorname{cotg}', cossec: '\\operatorname{cossec}', arcsen: '\\operatorname{arcsen}', arctg: '\\operatorname{arctg}' }[f] || '\\' + f;
        },
        // nome da k-ésima raiz (1 ou 2): x' / x'' ou x_1 / x_2
        raiz: function (v, k) { return I.raizes === 'indice' ? v + '_' + k : v + (k === 1 ? "'" : "''"); },

        DIC: DIC
    };

    root.FormulixI18n = I;
    if (typeof module !== 'undefined' && module.exports) module.exports = I;
})(typeof window !== 'undefined' ? window : globalThis);
