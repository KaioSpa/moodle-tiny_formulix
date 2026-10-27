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
 * Integração do Formulix com o editor TinyMCE do Moodle.
 *
 * @package tiny_formulix
 * @copyright 2026 Formulix contributors
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
namespace tiny_formulix;

defined('MOODLE_INTERNAL') || die();

/** Expõe os botões e as opções públicas ao TinyMCE. */
class plugininfo extends \editor_tiny\plugin implements \editor_tiny\plugin_with_buttons, \editor_tiny\plugin_with_configuration {
    /**
     * Lista os botões registrados pelo adaptador.
     *
     * @return array Nomes dos botões.
     */
    public static function get_available_buttons(): array {
        return ['equacao', 'contaarmada', 'grafico', 'quimica'];
    }

    /**
     * Verifica autenticação, capacidade e configuração mínima.
     *
     * @param \context $context Contexto do editor.
     * @param array $options Opções do formulário.
     * @param array $fpoptions Opções de arquivos.
     * @param \editor_tiny\editor|null $editor Editor ativo.
     * @return bool Disponibilidade.
     */
    public static function is_enabled(
        \context $context,
        array $options,
        array $fpoptions,
        ?\editor_tiny\editor $editor = null
    ): bool {
        return isloggedin() && !isguestuser() && has_capability('tiny/formulix:use', $context)
            && !empty(get_config('tiny_formulix', 'servidor')) && !empty(get_config('tiny_formulix', 'chave'));
    }

    /**
     * Retorna apenas opções destinadas ao navegador.
     *
     * @param \context $context Contexto do editor.
     * @param array $options Opções do formulário.
     * @param array $fpoptions Opções de arquivos.
     * @param \editor_tiny\editor|null $editor Editor ativo.
     * @return array Configuração pública.
     */
    public static function get_plugin_configuration_for_context(
        \context $context,
        array $options,
        array $fpoptions,
        ?\editor_tiny\editor $editor = null
    ): array {
        return [
            'servidor' => get_config('tiny_formulix', 'servidor'),
            'chave' => get_config('tiny_formulix', 'chave'),
            'contextid' => $context->id,
            'upload' => !empty($options['maxfiles']),
        ];
    }
}
