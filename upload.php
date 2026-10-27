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
 * Upload autenticado de PNG para o rascunho do próprio usuário.
 *
 * @package tiny_formulix
 * @copyright 2026 Formulix contributors
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
// A cópia em source/ do ZIP fica em outra profundidade: responde 404 em vez de um erro fatal que expõe o caminho.
if (!is_file(__DIR__ . '/../../../../../config.php')) {
    http_response_code(404);
    exit;
}
define('AJAX_SCRIPT', true);
require_once(__DIR__ . '/../../../../../config.php');
require_once($CFG->libdir . '/filelib.php');

require_login();
require_sesskey();
if (!data_submitted() || isguestuser()) {
    throw new moodle_exception('invalidupload', 'tiny_formulix');
}
$contextid = required_param('contextid', PARAM_INT);
[$context, $course, $cm] = get_context_info_array($contextid);
require_login($course, false, $cm, false, true);
$PAGE->set_context($context);
require_capability('tiny/formulix:use', $context);
$usercontext = context_user::instance($USER->id);
if ($context->contextlevel === CONTEXT_USER && $context->id !== $usercontext->id) {
    throw new moodle_exception('invalidupload', 'tiny_formulix');
}
$itemid = required_param('itemid', PARAM_INT);
$file = $_FILES['image'] ?? null;
if ($itemid <= 0 || !is_array($file) || ($file['error'] ?? null) !== UPLOAD_ERR_OK
        || !is_string($file['tmp_name'] ?? null) || !is_uploaded_file($file['tmp_name'])) {
    throw new moodle_exception('invalidupload', 'tiny_formulix');
}
$bytes = filesize($file['tmp_name']);
$limit = get_user_max_upload_file_size($context, $CFG->maxbytes, $course->maxbytes ?? 0, 10 * 1024 * 1024);
if (!$bytes || ($limit > 0 && $bytes > $limit) || $bytes > 10 * 1024 * 1024) {
    throw new moodle_exception('invalidpng', 'tiny_formulix');
}
$size = @getimagesize($file['tmp_name']);
if (!$size || $size[2] !== IMAGETYPE_PNG || $size[0] > 8192 || $size[1] > 8192) {
    throw new moodle_exception('invalidpng', 'tiny_formulix');
}
if (file_is_draft_areas_limit_reached($USER->id)) {
    throw new file_exception('maxdraftitemids');
}
\core\antivirus\manager::scan_file($file['tmp_name'], 'formulix.png', true);
$name = 'formulix-' . bin2hex(random_bytes(12)) . '.png';
// O itemid é sempre relativo ao usuário atual, nunca ao contexto enviado pelo cliente.
$record = [
    'contextid' => $usercontext->id,
    'component' => 'user',
    'filearea' => 'draft',
    'itemid' => $itemid,
    'filepath' => '/',
    'filename' => $name,
    'userid' => $USER->id,
    'mimetype' => 'image/png',
];
get_file_storage()->create_file_from_pathname($record, $file['tmp_name']);
header('Content-Type: application/json; charset=utf-8');
echo json_encode(['url' => moodle_url::make_draftfile_url($itemid, '/', $name)->out(false)]);
