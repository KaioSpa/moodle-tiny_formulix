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
 * Configurações administrativas do serviço externo.
 *
 * @package tiny_formulix
 * @copyright 2026 Formulix contributors
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
defined('MOODLE_INTERNAL') || die();

if ($ADMIN->fulltree) {
    $settings->add(new \tiny_formulix\admin_setting_apiurl(
        'tiny_formulix/servidor',
        get_string('servidor', 'tiny_formulix'),
        get_string('servidor_desc', 'tiny_formulix'),
        '',
        PARAM_RAW_TRIMMED
    ));
    $settings->add(new admin_setting_configtext(
        'tiny_formulix/chave',
        get_string('chave', 'tiny_formulix'),
        get_string('chave_desc', 'tiny_formulix'),
        '',
        PARAM_ALPHANUMEXT
    ));
}
