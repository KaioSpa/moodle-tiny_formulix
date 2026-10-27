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
 * Metadados de privacidade do Formulix.
 *
 * @package tiny_formulix
 * @copyright 2026 Formulix contributors
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
namespace tiny_formulix\privacy;

use core_privacy\local\metadata\collection;

defined('MOODLE_INTERNAL') || die();

/** Declara o serviço externo e os arquivos gerenciados pelo Moodle. */
class provider implements \core_privacy\local\metadata\provider {
    /**
     * Descreve os dados transmitidos pelo navegador e a área de rascunho.
     *
     * @param collection $collection Coleção de metadados.
     * @return collection Metadados do plugin.
     */
    public static function get_metadata(collection $collection): collection {
        $collection->add_subsystem_link('core_files', [], 'privacy:metadata:core_files');
        return $collection->add_external_location_link('formulix', [
            'content' => 'privacy:metadata:formulix:content',
            'apikey' => 'privacy:metadata:formulix:apikey',
            'origin' => 'privacy:metadata:formulix:origin',
            'ipaddress' => 'privacy:metadata:formulix:ipaddress',
            'language' => 'privacy:metadata:formulix:language',
            'notation' => 'privacy:metadata:formulix:notation',
            'operation' => 'privacy:metadata:formulix:operation',
        ], 'privacy:metadata:formulix');
    }
}
