<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle. If not, see <http://www.gnu.org/licenses/>.

/**
 * Strings de idioma inglês exigidas pelo catálogo Moodle.
 *
 * @package tiny_formulix
 * @copyright 2026 Formulix contributors
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
$string['pluginname'] = 'Formulix';
$string['servidor'] = 'Formulix API URL (HTTPS)';
$string['servidor_desc'] = 'External service used for previews, calculations, chemistry, graphs and Word conversion. Enter the HTTPS base URL without credentials, query or fragment. Leave empty to disable. Review service terms and privacy before enabling.';
$string['chave'] = 'Public domain-restricted Formulix key';
$string['chave_desc'] = 'Optional. Without a key, your Moodle domain uses the free quota; when it runs out, register the domain and choose a plan at https://painel.for-muli-x.com. A key is a public browser key restricted to your domain, visible to editor users; never enter an administrative secret.';
$string['formulix:use'] = 'Use Formulix and send content to its external service';
$string['invalidserver'] = 'Enter an HTTPS base URL without credentials, query or fragment, or leave empty.';
$string['invalidupload'] = 'A valid PNG upload, draft item and authorised context are required.';
$string['invalidpng'] = 'Upload a PNG within the site/course size limit, up to 10 MiB and 8192 pixels per dimension.';
$string['uploaderror'] = 'Formulix image upload failed.';
$string['uploadnotallowed'] = 'Images are not allowed in this field.';
$string['privacy:metadata'] = 'Formulix exchanges data with the configured external API and uses the Moodle file subsystem for draft images. It has no personal data tables of its own.';
$string['privacy:metadata:core_files'] = 'Generated PNG images are stored in the current user draft area. After saving, the host activity manages the files and content, including export and deletion.';
$string['privacy:metadata:formulix'] = 'The browser sends content to the configured Formulix API during previews, Word conversion and confirmed insertions. Content may include personal data entered by the author. The service receives connection metadata and measures insertion usage.';
$string['privacy:metadata:formulix:content'] = 'Formula, calculation, graph, chemistry or pasted Word content entered by the author, including any personal data in that content.';
$string['privacy:metadata:formulix:apikey'] = 'Public domain-restricted API key identifying the service account for access and usage accounting.';
$string['privacy:metadata:formulix:origin'] = 'Site origin sent by the browser for domain authorisation. Browser referrer metadata may also be sent according to the site policy.';
$string['privacy:metadata:formulix:ipaddress'] = 'Network address visible to the external service when the browser connects.';
$string['privacy:metadata:formulix:language'] = 'Interface language used to request localised results.';
$string['privacy:metadata:formulix:notation'] = 'Mathematical notation preferences, including decimal separator and trigonometric names.';
$string['privacy:metadata:formulix:operation'] = 'Requested operation or insertion type, used to produce the result and measure insertions.';
