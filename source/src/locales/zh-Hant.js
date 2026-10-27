(function (root) {
    'use strict';

    // 保留英文作為尚未在地化的安全後備；以下覆蓋所有面向使用者的介面與教學文字。
    root.FormulixI18n.registrar('zh-Hant', Object.assign({}, root.FormulixI18n.DIC.en, {
        'Fórmula (Ctrl+Shift+M)': '公式 (Ctrl+Shift+M)', 'Armar conta': '直式計算', 'Gráfico de função': '函數圖形', 'Química': '化學',
        'Editar': '編輯', 'Remover': '移除', 'Fórmula': '公式', 'Gráfico': '圖形', 'Editor de fórmulas, contas e gráficos': '公式、計算與圖形編輯器',
        'Fechar': '關閉', 'Fechar (Esc)': '關閉 (Esc)', 'Mais usados': '常用', 'Categorias': '分類', 'Formatação da fórmula': '公式格式',
        'Nova linha alinhada pelo sinal de igual (Enter)': '依等號對齊的新行 (Enter)', 'Nova linha': '新行', 'Código LaTeX': 'LaTeX 程式碼', 'Em destaque (linha própria)': '顯示公式（獨立一行）',
        'Operação': '運算', 'Cancelar': '取消', 'Menos': '較少', 'Mais': '更多', '+ Adicionar': '+ 新增', '+ Adicionar ponto': '+ 新增點', 'Remover ponto': '移除點',
        'Outra cor': '其他顏色', 'Inserir {0}': '插入 {0}', '{0} do ponto {1}': '點 {1} 的 {0}', 'Texto': '文字', 'Escrever texto dentro da fórmula (alterna)': '在公式內輸入文字（切換）',
        'Pontos marcados: {0}': '已標記的點：{0}', 'Atualizar': '更新', 'Inserir': '插入', 'Gerando…': '產生中…', 'Não foi possível gerar a imagem.': '無法產生圖片。', 'Gráfico de {0}': '{0} 的圖形',
        'Fração': '分數', 'Potência': '次方', 'Raiz quadrada': '平方根', 'Raiz de índice n': 'n 次方根', 'Índice (subscrito)': '下標', 'Parênteses': '圓括號', 'Módulo': '絕對值', 'Mais ou menos': '正負',
        'Multiplicação (ponto)': '乘法（點）', 'Multiplicação (×)': '乘法（×）', 'Divisão': '除法', 'Diferente': '不等於', 'Menor ou igual': '小於或等於', 'Maior ou igual': '大於或等於', 'Aproximadamente': '約等於', 'Grau': '度', 'Porcentagem': '百分比',
        'Álgebra': '代數', 'Matrizes': '矩陣', 'Geometria': '幾何', 'Trigonometria': '三角函數', 'Conjuntos': '集合', 'Gregas': '希臘字母', 'Setas e lógica': '箭頭與邏輯', 'Cálculo': '微積分',
        'Sistema (2 equações)': '方程組（2 個方程）', 'Sistema (3 equações)': '方程組（3 個方程）', 'Discriminante (Δ)': '判別式 (Δ)', 'Fórmula de Bhaskara': '二次公式', 'Colchetes': '中括號', 'Chaves': '大括號', 'Logaritmo na base': '指定底的對數', 'Logaritmo decimal': '常用對數', 'Logaritmo natural': '自然對數', 'Fatorial': '階乘', 'Binomial': '二項式', 'Infinito': '無限大',
        'Intervalo fechado': '閉區間', 'Intervalo aberto': '開區間', 'Equivalente / congruente': '等價／全等', 'Proporcional': '成比例', 'Matriz 2×2': '2×2 矩陣', 'Matriz 3×3': '3×3 矩陣', 'Matriz 2×2 (colchetes)': '2×2 矩陣（中括號）', 'Determinante 2×2': '2×2 行列式', 'Determinante 3×3': '3×3 行列式', 'Matriz coluna': '欄矩陣', 'Transposta': '轉置', 'Inversa': '反矩陣',
        'Ângulo': '角', 'Segmento': '線段', 'Reta': '直線', 'Semirreta / vetor': '射線／向量', 'Vetor': '向量', 'Arco': '弧', 'Triângulo': '三角形', 'Paralelo': '平行', 'Perpendicular': '垂直', 'Congruente': '全等', 'Semelhante': '相似',
        'Seno': '正弦', 'Cosseno': '餘弦', 'Tangente': '正切', 'Cotangente': '餘切', 'Secante': '正割', 'Cossecante': '餘割', 'Seno ao quadrado': '正弦平方', 'Arco-seno': '反正弦',
        'Pertence': '屬於', 'Não pertence': '不屬於', 'Está contido': '包含於', 'Não está contido': '不包含於', 'Contém': '包含', 'União': '聯集', 'Interseção': '交集', 'Diferença': '差集', 'Conjunto vazio': '空集合', 'Naturais': '自然數', 'Inteiros': '整數', 'Racionais': '有理數', 'Reais': '實數', 'Complexos': '複數', 'Reais não nulos': '非零實數', 'Para todo': '對所有', 'Existe': '存在', 'Seta': '箭頭', 'Implica': '蘊含', 'Se e somente se': '若且唯若', 'E': '且', 'Ou': '或', 'Não': '非',
        'Limite': '極限', 'Somatório': '總和', 'Produtório': '連乘', 'Integral definida': '定積分', 'Integral': '積分', 'Derivada': '導數', 'Derivada parcial': '偏導數',
        'Dividendo': '被除數', 'Divisor': '除數', 'Quociente': '商', 'Resto': '餘數', 'Multiplicação': '乘法', 'Produto': '乘積', 'Adição': '加法', 'Soma': '和', 'Subtração': '減法', 'Aritmética': '算術', 'Números': '數字', 'Calcular': '計算', 'Os dois': '兩者', 'Fatoração': '因式分解', 'Número': '數字', 'Frações': '分數',
        'Equação': '方程式', 'Equação do 1º grau': '一元一次方程式', 'Equação do 2º grau': '一元二次方程式', 'Funções': '函數', 'Função': '函數', 'Tabela de valores': '數值表', 'Gráfico': '圖形', 'Pontos': '點', 'Raízes': '根', 'Interseções': '交點', 'Legenda': '圖例', 'Tamanho da imagem': '圖片大小', 'Pequeno': '小', 'Médio': '中', 'Grande': '大',
        'Equação química': '化學方程式', 'Fórmula ou equação': '化學式或方程式', 'Balancear automaticamente': '自動配平', 'Equação balanceada': '已配平的方程式', 'Não balanceada:': '未配平：', 'Massa molar': '莫耳質量', 'Massas atômicas': '原子量', 'Tabela periódica': '週期表', 'Símbolo': '符號', 'Nome': '名稱', 'Laboratório': '實驗室', 'Vidrarias': '玻璃器材', 'Cor': '顏色', 'Rótulo': '標籤', 'Titulação': '滴定', 'Distribuição eletrônica': '電子組態', 'Orgânica': '有機化學', 'Funções orgânicas': '官能基', 'Cadeia carbônica': '碳鏈', 'Cadeia': '鏈', 'Mais contas': '更多計算', 'Mais química': '更多化學',
        'Número inválido: "{0}".': '無效的數字：「{0}」。', 'O divisor não pode ser zero.': '除數不可為零。', 'Divisão por zero.': '不可除以零。', 'Expressão vazia.': '算式不可為空白。', 'Fórmula vazia': '化學式不可為空白。', 'Parêntese sem fechar': '括號未閉合', 'Elemento': '元素', 'Reagentes': '反應物', 'Produtos': '生成物', 'Ferro': '鐵', 'Elemento desconhecido "{0}"': '未知元素「{0}」', 'Elemento não encontrado (use símbolo, nome ou número atômico).': '找不到元素（請使用符號、名稱或原子序）。', 'Escolha um elemento na tabela.': '請在週期表選擇元素。', 'Carga do íon': '離子電荷', 'Carga inválida (ex.: 2, -2 ou 2-).': '無效的電荷（例如：2、-2 或 2-）。', 'Água': '水', 'Indicador': '指示劑'
    }), {
        H: '氫', He: '氦', Li: '鋰', Be: '鈹', B: '硼', C: '碳', N: '氮', O: '氧', F: '氟', Ne: '氖',
        Na: '鈉', Mg: '鎂', Al: '鋁', Si: '矽', P: '磷', S: '硫', Cl: '氯', Ar: '氬', K: '鉀', Ca: '鈣',
        Sc: '鈧', Ti: '鈦', V: '釩', Cr: '鉻', Mn: '錳', Fe: '鐵', Co: '鈷', Ni: '鎳', Cu: '銅', Zn: '鋅',
        Ga: '鎵', Ge: '鍺', As: '砷', Se: '硒', Br: '溴', Kr: '氪', Rb: '銣', Sr: '鍶', Y: '釔', Zr: '鋯',
        Nb: '鈮', Mo: '鉬', Tc: '鎝', Ru: '釕', Rh: '銠', Pd: '鈀', Ag: '銀', Cd: '鎘', In: '銦', Sn: '錫',
        Sb: '銻', Te: '碲', I: '碘', Xe: '氙', Cs: '銫', Ba: '鋇', La: '鑭', Ce: '鈰', Pr: '鐠', Nd: '釹',
        Pm: '鉕', Sm: '釤', Eu: '銪', Gd: '釓', Tb: '鋱', Dy: '鏑', Ho: '鈥', Er: '鉺', Tm: '銩', Yb: '鐿',
        Lu: '鑥', Hf: '鉿', Ta: '鉭', W: '鎢', Re: '錸', Os: '鋨', Ir: '銥', Pt: '鉑', Au: '金', Hg: '汞',
        Tl: '鉈', Pb: '鉛', Bi: '鉍', Po: '釙', At: '砈', Rn: '氡', Fr: '鍅', Ra: '鐳', Ac: '錒', Th: '釷',
        Pa: '鏷', U: '鈾', Np: '錼', Pu: '鈽', Am: '鋂', Cm: '鋦', Bk: '鉳', Cf: '鉲', Es: '鑀', Fm: '鐨',
        Md: '鍆', No: '鍩', Lr: '鐒', Rf: '鑪', Db: '𨧀', Sg: '𨭎', Bh: '波鋰', Hs: '𨭆', Mt: '䥑', Ds: '鐽',
        Rg: '錀', Cn: '鎶', Nh: '鉨', Fl: '鈇', Mc: '鏌', Lv: '鉝', Ts: '鿬', Og: '鿫'
    });
})(typeof window !== 'undefined' ? window : globalThis);
// limite do plano
Object.assign((typeof window !== 'undefined' ? window : globalThis).FormulixI18n.DIC['zh-hant'], {
    'O limite mensal de inserções do plano acabou. Veja os planos no painel do Formulix.': '本方案的每月插入次數已用完。請在 Formulix 控制台查看方案。'
});
