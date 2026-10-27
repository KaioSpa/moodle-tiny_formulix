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
 * Validação da configuração da API.
 *
 * @package tiny_formulix
 * @copyright 2026 Formulix contributors
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
namespace tiny_formulix;

defined('MOODLE_INTERNAL') || die();

/** Valida o endereço HTTPS do serviço externo. */
class admin_setting_apiurl extends \admin_setting_configtext {
    /**
     * Permite vazio para desativar a integração.
     *
     * @param string $data Endereço informado pelo administrador.
     * @return bool|string Verdadeiro ou mensagem de validação.
     */
    public function validate($data) {
        if ($data === '') {
            return true;
        }
        $parts = parse_url($data);
        if (!filter_var($data, FILTER_VALIDATE_URL) || !$parts || ($parts['scheme'] ?? '') !== 'https'
                || empty($parts['host']) || isset($parts['user']) || isset($parts['pass'])
                || isset($parts['query']) || isset($parts['fragment'])) {
            return get_string('invalidserver', 'tiny_formulix');
        }
        return true;
    }
}
