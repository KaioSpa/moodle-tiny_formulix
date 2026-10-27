import DOMPurify from 'dompurify';

export function limpar(html) {
    if (typeof html !== 'string' || html.length > 8 * 1024 * 1024) throw new Error('Conteúdo Formulix inválido.');
    const fragmento = DOMPurify.sanitize(html, {USE_PROFILES:{html:true,mathMl:true},RETURN_DOM_FRAGMENT:true});
    fragmento.querySelectorAll('[style]').forEach(el => {
        if (/url\s*\(|expression\s*\(|@import|behavior\s*:/i.test(el.getAttribute('style'))) el.removeAttribute('style');
    });
    let raiz = fragmento.firstElementChild;
    if (raiz?.matches('[data-formulix]')) raiz = raiz.firstElementChild;
    if (!raiz || !raiz.matches('math,div.conta-armada,img[data-grafico],img[data-quimica]')) throw new Error('Item Formulix desconhecido.');
    if (raiz.matches('img') && !/^(https?:|blob:|data:image\/png;base64,)/i.test(raiz.getAttribute('src') || '')) throw new Error('Imagem Formulix inválida.');
    return raiz.outerHTML;
}

export function alvoDe(html) {
    const caixa = document.createElement('div'); caixa.innerHTML = limpar(html);
    const el = caixa.firstElementChild;
    if (el.matches('math')) {
        const alvo = document.createElement('span'); alvo.className = 'eqx';
        alvo.setAttribute('data-mathml', el.outerHTML);
        if (el.getAttribute('display') === 'block') alvo.setAttribute('data-bloco', '1');
        return alvo;
    }
    return el;
}

export async function imagem(blob, resultado, atributo, upload) {
    if (typeof upload !== 'function') throw new Error('Configure o upload de imagens do Formulix.');
    const resposta = await upload(blob);
    const recebida = typeof resposta === 'string' ? resposta : resposta?.urls?.default || resposta?.default;
    if (typeof recebida !== 'string' || !recebida.trim()) throw new Error('URL de upload inválida.');
    const url = new URL(recebida,document.baseURI).href;
    if (!/^(https?:|blob:|data:image\/png;base64,)/i.test(url)) throw new Error('URL de upload inválida.');
    const escape = window.FormulixUI.escAttr;
    // Drupal uses these attributes to make an uploaded file permanent when the entity is saved.
    const arquivo = resposta?.response;
    const entidade = arquivo?.entity_type === 'file' && /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(arquivo.uuid || '')
        ? ' data-entity-type="file" data-entity-uuid="' + escape(arquivo.uuid) + '"' : '';
    return limpar('<img src="' + escape(url) + '" width="' + resultado.w + '" height="' + resultado.h + '" alt="' + escape(resultado.alt || 'Gráfico ou desenho de química') + '" ' + atributo + entidade + '>');
}
