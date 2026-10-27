# Changes

## 0.1.1 (2026102700)

- Stable release for Moodle 4.5.

## 0.1.0 (2026101500)

First public release for Moodle 4.5.

- Formulas, long-hand arithmetic, algebra, graphs and chemistry in TinyMCE, plus Word equation paste.
- Settings: HTTPS API URL (no credentials, query or fragment) and public key; empty values disable the buttons.
- Capability `tiny/formulix:use`; guests never get the buttons.
- Graph upload to the current user's draft area only: POST, login, sesskey, capability, context access, real HTTP upload, PNG/size/dimension checks, site/course and draft limits, antivirus.
- Privacy API declares the external service and `core_files`.
- Third-party libraries listed with exact versions in `thirdpartylibs.xml`; sources and rebuild script in `source/`.
