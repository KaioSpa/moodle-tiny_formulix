(function (root) {
    'use strict';

    // Start with the complete English catalogue so a newly added source key is
    // never lost in Japanese. The entries below are the Japanese UI vocabulary.
    root.FormulixI18n.registrar('ja', Object.assign({}, root.FormulixI18n.DIC.en, {
        'Fórmula (Ctrl+Shift+M)': '数式（Ctrl+Shift+M）', 'Armar conta': '筆算', 'Gráfico de função': '関数グラフ', 'Química': '化学',
        'Editar': '編集', 'Remover': '削除', 'Fórmula': '数式', 'Gráfico': 'グラフ', 'Fechar': '閉じる', 'Fechar (Esc)': '閉じる（Esc）',
        'Mais usados': 'よく使う項目', 'Categorias': 'カテゴリ', 'Formatação da fórmula': '数式の書式', 'Nova linha': '新しい行',
        'Código LaTeX': 'LaTeX コード', 'Operação': '操作', 'Cancelar': 'キャンセル', 'Menos': '少なく', 'Mais': '多く',
        '+ Adicionar': '+ 追加', '+ Adicionar ponto': '+ 点を追加', 'Remover ponto': '点を削除', 'Outra cor': 'その他の色',
        'Inserir {0}': '{0} を挿入', '{0} do ponto {1}': '点 {1} の {0}', 'Texto': 'テキスト', 'Atualizar': '更新', 'Inserir': '挿入',
        'Gerando…': '生成中…', 'Não foi possível gerar a imagem.': '画像を生成できませんでした。', 'Gráfico de {0}': '{0} のグラフ',
        'Fração': '分数', 'Potência': '累乗', 'Raiz quadrada': '平方根', 'Raiz de índice n': 'n乗根', 'Índice (subscrito)': '下付き文字',
        'Parênteses': '丸かっこ', 'Módulo': '絶対値', 'Mais ou menos': 'プラスマイナス', 'Multiplicação (ponto)': '乗算（・）',
        'Multiplicação (×)': '乗算（×）', 'Divisão': '除算', 'Diferente': '等しくない', 'Menor ou igual': '以下', 'Maior ou igual': '以上',
        'Aproximadamente': 'およそ', 'Grau': '度', 'Porcentagem': '百分率', 'Álgebra': '代数', 'Matrizes': '行列', 'Geometria': '幾何',
        'Trigonometria': '三角法', 'Conjuntos': '集合', 'Gregas': 'ギリシャ文字', 'Setas e lógica': '矢印と論理', 'Cálculo': '微積分',
        'Sistema (2 equações)': '連立方程式（2元）', 'Sistema (3 equações)': '連立方程式（3元）', 'Discriminante (Δ)': '判別式（Δ）',
        'Fórmula de Bhaskara': '二次方程式の解の公式', 'Colchetes': '角かっこ', 'Chaves': '波かっこ', 'Logaritmo na base': '底のある対数',
        'Logaritmo decimal': '常用対数', 'Logaritmo natural': '自然対数', 'Fatorial': '階乗', 'Binomial': '二項係数', 'Infinito': '無限大',
        'Intervalo fechado': '閉区間', 'Intervalo aberto': '開区間', 'Proporcional': '比例', 'Transposta': '転置', 'Inversa': '逆行列',
        'Ângulo': '角', 'Segmento': '線分', 'Reta': '直線', 'Semirreta / vetor': '半直線／ベクトル', 'Vetor': 'ベクトル', 'Arco': '弧',
        'Triângulo': '三角形', 'Paralelo': '平行', 'Perpendicular': '垂直', 'Congruente': '合同', 'Semelhante': '相似',
        'Seno': '正弦', 'Cosseno': '余弦', 'Tangente': '正接', 'Cotangente': '余接', 'Secante': '正割', 'Cossecante': '余割',
        'Seno ao quadrado': '正弦の二乗', 'Arco-seno': '逆正弦', 'Teta': 'シータ', 'Alfa': 'アルファ', 'Beta': 'ベータ',
        'Pertence': '属する', 'Não pertence': '属さない', 'Está contido': '部分集合である', 'Não está contido': '部分集合でない',
        'Contém': '含む', 'União': '和集合', 'Interseção': '共通部分', 'Diferença': '差集合', 'Conjunto vazio': '空集合',
        'Naturais': '自然数', 'Inteiros': '整数', 'Racionais': '有理数', 'Reais': '実数', 'Complexos': '複素数',
        'Para todo': 'すべての', 'Existe': '存在する', 'Seta': '矢印', 'Implica': 'ならば', 'Se e somente se': '必要十分条件',
        'E': 'かつ', 'Ou': 'または', 'Não': '否定', 'Para cima': '上', 'Para baixo': '下', 'Limite': '極限', 'Somatório': '総和',
        'Produtório': '総乗', 'Integral definida': '定積分', 'Integral': '積分', 'Derivada': '導関数', 'Derivada parcial': '偏導関数',
        'Dividendo': '被除数', 'Divisor': '除数', 'Quociente': '商', 'Resto': '余り', 'Multiplicação': '乗算', 'Produto': '積',
        'Adição': '加算', 'Soma': '和', 'Subtração': '減算', 'Aritmética': '算数', 'MMC e MDC': '最小公倍数と最大公約数',
        'Números': '数', 'Calcular': '計算', 'Fatoração': '因数分解', 'Número': '数', 'Frações': '分数', 'Regra de três': '比例計算',
        'Proporção': '比', 'Direta': '正比例', 'Inversa': '反比例', 'Equação': '方程式', 'Método': '方法', 'Substituição': '代入法',
        'Coeficientes': '係数', 'Funções': '関数', 'Tabela de valores': '値の表', 'Função': '関数', 'Valores de x': 'x の値',
        'Raízes': '解', 'Vértice / máx. e mín.': '頂点／最大・最小', 'Interseções': '交点', 'Pontos': '点', 'Legenda': '凡例',
        'Pequeno': '小', 'Médio': '中', 'Grande': '大', 'Equação química': '化学反応式', 'Fórmula ou equação': '化学式または反応式',
        'Balancear automaticamente': '自動で係数をそろえる', 'Equação balanceada': '係数がそろった反応式', 'Massa molar': 'モル質量',
        'Massas atômicas': '原子量', 'Calcular também': '併せて計算', 'resultado': '結果', 'Distribuição eletrônica': '電子配置',
        'Carga do íon': 'イオンの電荷', 'Tabela periódica': '周期表', 'Símbolo': '記号', 'Nome': '名称', 'Cor': '色', 'Rótulo': 'ラベル',
        'Laboratório': '実験室', 'Vidrarias': '実験器具', 'Tipo': '種類', 'Titulação': '滴定', 'Atomística': '原子構造',
        'Diagrama de Pauling': 'パウリング図', 'Orgânica': '有機化学', 'Funções orgânicas': '官能基', 'Cadeia carbônica': '炭素鎖',
        'Cadeia': '鎖', 'Mais contas': 'その他の計算', 'Mais química': 'その他の化学',
        'Número inválido: "{0}".': '無効な数値: 「{0}」。', 'O divisor não pode ser zero.': '除数を 0 にすることはできません。',
        'Informe ao menos duas parcelas.': '少なくとも 2 つの加数を入力してください。', 'Ferro': '鉄', 'Parêntese sem fechar': '閉じていないかっこ',
        'Elemento desconhecido "{0}"': '未知の元素「{0}」', 'Símbolo inesperado "{0}"': '予期しない記号「{0}」',
        'Fórmula vazia': '空の化学式', 'Elemento': '元素', 'Reagentes': '反応物', 'Produtos': '生成物',
        'Desfazer (Ctrl+Z)': '元に戻す（Ctrl+Z）', 'Refazer (Ctrl+Y)': 'やり直す（Ctrl+Y）', '+ Adicionar função': '+ 関数を追加',
        '+ Adicionar parcela': '+ 加数を追加', 'MMC': '最小公倍数', 'MDC': '最大公約数', 'Destaque': 'ハイライト', 'Estilo': 'スタイル',
        'Matriz / sistema': '行列／連立方程式', 'Cor {0}': '色 {0}', 'Tirar a cor': '色を消す', 'Marca-texto': '蛍光ペン',
        'Tirar o destaque': 'ハイライトを消す', 'Negrito': '太字', 'Letra reta (sem itálico)': '立体文字（斜体なし）',
        '+ linha': '+ 行', '+ coluna': '+ 列', 'Remover a linha': '行を削除', 'Remover a coluna': '列を削除',
        'Metais alcalinos': 'アルカリ金属', 'Metais alcalinoterrosos': 'アルカリ土類金属', 'Metais de transição': '遷移金属',
        'Outros metais': 'その他の金属', 'Semimetais': '半金属', 'Não metais': '非金属', 'Halogênios': 'ハロゲン',
        'Gases nobres': '希ガス', 'Lantanídeos': 'ランタノイド', 'Actinídeos': 'アクチノイド'
    }), {
        H: '水素', He: 'ヘリウム', Li: 'リチウム', Be: 'ベリリウム', B: 'ホウ素', C: '炭素', N: '窒素', O: '酸素', F: 'フッ素', Ne: 'ネオン',
        Na: 'ナトリウム', Mg: 'マグネシウム', Al: 'アルミニウム', Si: 'ケイ素', P: 'リン', S: '硫黄', Cl: '塩素', Ar: 'アルゴン', K: 'カリウム', Ca: 'カルシウム',
        Sc: 'スカンジウム', Ti: 'チタン', V: 'バナジウム', Cr: 'クロム', Mn: 'マンガン', Fe: '鉄', Co: 'コバルト', Ni: 'ニッケル', Cu: '銅', Zn: '亜鉛',
        Ga: 'ガリウム', Ge: 'ゲルマニウム', As: 'ヒ素', Se: 'セレン', Br: '臭素', Kr: 'クリプトン', Rb: 'ルビジウム', Sr: 'ストロンチウム', Y: 'イットリウム', Zr: 'ジルコニウム',
        Nb: 'ニオブ', Mo: 'モリブデン', Tc: 'テクネチウム', Ru: 'ルテニウム', Rh: 'ロジウム', Pd: 'パラジウム', Ag: '銀', Cd: 'カドミウム', In: 'インジウム', Sn: 'スズ',
        Sb: 'アンチモン', Te: 'テルル', I: 'ヨウ素', Xe: 'キセノン', Cs: 'セシウム', Ba: 'バリウム', La: 'ランタン', Ce: 'セリウム', Pr: 'プラセオジム', Nd: 'ネオジム',
        Pm: 'プロメチウム', Sm: 'サマリウム', Eu: 'ユウロピウム', Gd: 'ガドリニウム', Tb: 'テルビウム', Dy: 'ジスプロシウム', Ho: 'ホルミウム', Er: 'エルビウム', Tm: 'ツリウム', Yb: 'イッテルビウム',
        Lu: 'ルテチウム', Hf: 'ハフニウム', Ta: 'タンタル', W: 'タングステン', Re: 'レニウム', Os: 'オスミウム', Ir: 'イリジウム', Pt: '白金', Au: '金', Hg: '水銀',
        Tl: 'タリウム', Pb: '鉛', Bi: 'ビスマス', Po: 'ポロニウム', At: 'アスタチン', Rn: 'ラドン', Fr: 'フランシウム', Ra: 'ラジウム', Ac: 'アクチニウム', Th: 'トリウム',
        Pa: 'プロトアクチニウム', U: 'ウラン', Np: 'ネプツニウム', Pu: 'プルトニウム', Am: 'アメリシウム', Cm: 'キュリウム', Bk: 'バークリウム', Cf: 'カリホルニウム', Es: 'アインスタイニウム', Fm: 'フェルミウム',
        Md: 'メンデレビウム', No: 'ノーベリウム', Lr: 'ローレンシウム', Rf: 'ラザホージウム', Db: 'ドブニウム', Sg: 'シーボーギウム', Bh: 'ボーリウム', Hs: 'ハッシウム', Mt: 'マイトネリウム', Ds: 'ダームスタチウム',
        Rg: 'レントゲニウム', Cn: 'コペルニシウム', Nh: 'ニホニウム', Fl: 'フレロビウム', Mc: 'モスコビウム', Lv: 'リバモリウム', Ts: 'テネシン', Og: 'オガネソン'
    });
})(typeof window !== 'undefined' ? window : globalThis);
// limite do plano
Object.assign((typeof window !== 'undefined' ? window : globalThis).FormulixI18n.DIC['ja'], {
    'O limite mensal de inserções do plano acabou. Veja os planos no painel do Formulix.': 'プランの月間挿入上限に達しました。Formulix のダッシュボードでプランをご確認ください。',
    'Ver planos': 'プランを見る'
});
