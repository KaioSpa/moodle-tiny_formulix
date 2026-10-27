Third-party code in the Formulix AMD bundle
===========================================

amd/src/bundle.js contains, unmodified:

* MathLive 0.111.0 (MIT) - https://github.com/arnog/mathlive/tree/v0.111.0
  Includes its KaTeX fonts and static styles, inlined as data URIs.
* mathml-to-latex 1.8.0 (MIT), file dist/bundle.min.js -
  https://github.com/asnunes/mathml-to-latex
  It bundles @xmldom/xmldom 0.9.x (MIT) - https://github.com/xmldom/xmldom

Their license notices are kept in the header of amd/src/bundle.js.
The Formulix code itself is GPL-3.0-or-later.

Rebuilding
----------

The source/ folder holds everything needed to rebuild amd/:

  cd source
  npm install
  npm run build

This uses esbuild to join src/vendor, src/i18n.js, src/locales,
src/formulix-ui.js and src/plugin.js, inline styles and fonts, wrap the UMD
code in an AMD module and write amd/src/bundle.js and amd/build/*.min.js.
Administrators installing the plugin do not need Node.js.

Upgrading a library: replace the file in src/vendor, update the version in
thirdpartylibs.xml and this file, rebuild and run the tests.
