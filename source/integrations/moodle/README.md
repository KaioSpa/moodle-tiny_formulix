# Formulix for Moodle (tiny_formulix)

TinyMCE plugin that adds math formulas, long-hand arithmetic (long division, multiplication with carries, subtraction with borrowing), function graphs and chemistry to Moodle. Built for teachers, schools and educational publishers. Website: https://for-muli-x.com

- **Formulas:** visual editor (no LaTeX needed), aligned step-by-step solutions.
- **Arithmetic as it is taught:** long division, carries and borrowing, aligned decimals.
- **Algebra:** 1st/2nd degree equations, 2×2 systems, LCM/GCD, fractions, rule of three, function tables.
- **Graphs:** up to five functions with roots, vertices and intersections.
- **Chemistry:** equation balancing, molar mass, electron configuration, periodic table.
- **Word:** paste equations from Word (OMML, Equation 3.0, MathType).

Interface in Portuguese, English, Spanish, French, German, Italian, Japanese, Chinese (Simplified and Traditional) and Hindi.

## External service

**This plugin requires the Formulix API.** Calculations, graphs, chemistry and Word conversion run on the service; there is no offline mode. The plugin code is free (GPL-3.0-or-later). The service has a free plan (500 inserts/month) and paid plans; see https://for-muli-x.com/#planos. Live previews do not count as inserts.

1. Create an account at https://painel.for-muli-x.com, register your Moodle domain and copy the public key.
2. Review the [terms](https://for-muli-x.com/docs/termos.html) and [privacy policy](https://for-muli-x.com/docs/privacidade.html).

Saved content is plain HTML and stays readable without the service.

## Requirements

Moodle 4.5 (`requires = 2024100700`). Tested automatically on Moodle 4.5.9 (page, question and forum: install, save, upload and re-edit). Other versions are not declared as supported yet. The MathJax filter (enabled by default) must stay enabled where Formulix is used: formulas are saved as TeX so they survive HTMLPurifier in forums, assignments and student answers.

## Installation

1. Install the ZIP from Site administration → Plugins → Install plugins, or clone this repository into `lib/editor/tiny/plugins/formulix`.
2. Complete the upgrade and purge caches.
3. In Site administration → Plugins → Text editors → TinyMCE editor → Formulix, set the API URL `https://api.for-muli-x.com` and your public key. Leaving either empty disables the buttons.
4. Review who has the `tiny/formulix:use` capability: it allows sending the edited item to the external service. Guests never get the buttons.

The key is public (it is visible in the browser) and only works from the domains registered in your account. Never put administrative credentials in it.

## Data sent to the service

The browser calls the API directly, always with language, notation and the public key (`X-Formulix-Chave` header):

- **Live previews** (`POST /v1/calc`): when a tab opens and while typing, the operation and the item data (values, expressions, chemical equation, graph functions/points). Not metered. Pasting from Word into the formula field also uses `/v1/calc`, with the clipboard HTML and RTF.
- **Pasting from Word into the TinyMCE text** (`POST /v1/inserir`, type `word`): only when the pasted HTML contains Word equations, the whole clipboard HTML and RTF are sent. One insert per converted equation; without quota or connection the original HTML is pasted. Pastes without equations never leave the browser.
- **Confirming an item** (`POST /v1/inserir`): item type and data; one insert.
- **Periodic table** (`GET /v1/tabela`): language only.

Viewing saved content makes no requests. The service receives the origin domain and IP address of the connection. The plugin never adds the user's name, e-mail, id or Moodle session cookies to these requests. This is declared in the Privacy API, together with `core_files`.

Graph PNGs are uploaded **to Moodle**, never to the service: login, sesskey, capability and context access are required; files go only to the current user's draft area, with site/course limits (plus 10 MiB and 8192 px caps), draft-area limits and the configured antivirus.

## Support

Issues: use this repository's issue tracker. E-mail: suporte@for-muli-x.com

## Building

See `readme_moodle.txt` for third-party libraries and how to rebuild `amd/` from `source/`.

## License

GPL-3.0-or-later. © 2026 Formulix contributors.
