import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application';

import TokensWidget from './TokensWidget.svelte';
import WidgetApp from '../Widget.js';
import { actionsStore, tokensStore, targetsStore } from '../../modules/stores.js';
import { moduleId, SETTINGS } from "../../constants.js";

export default class SelectedWidgetApp extends WidgetApp {

  #HOOKS = [
    'controlToken',
    'updateToken',
    'updateActor',
    'updateItem',
    'targetToken',
    'createCombatant',
    'deleteCombatant',
  ];
  constructor(options) {
    super({ widgetId: "selected" });
  }

  installHooks() {
    Hooks.on('renderTokenActionHUD', (_, __, data) => {
      this.onUpdateActions(data.actions);
    });
    for (let hook of this.#HOOKS) {
      Hooks.on(hook, this.onUpdateTokens.bind(this));
    }
  }

  /**
   * Default Application options
   *
   * @returns {object} options - Application options.
   * @see https://foundryvtt.com/api/Application.html#options
   */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      width: 'auto',
      height: 'auto',
      resizable: false,
      minimizable: false,
      headerButtonNoClose: true,
      popOut: false,
      zIndex: 95,

      svelte: {
        class: TokensWidget,
        target: document.body,
        props: function() {
          return {
            settingStore: this.getPositionStore(),
            store: tokensStore,
            hideHP: globalThis.game.settings.get(moduleId, SETTINGS.HIDE_SELECTED_HP),
            widgetId: this.widgetId,
            placeholderText: "Please select a token."
          };
        }
      }
    });
  }

  async refresh() {
    await super.refresh();
  }

  onUpdateTokens() {
    if (!this.enabled || !this.svelte.applicationShell) return;
    this.svelte.applicationShell.widgetId = this.widgetId;
    tokensStore.set(canvas.tokens.controlled);
    const showTargets = globalThis.game.settings.get(moduleId, SETTINGS.SHOW_TARGETS);
    if (showTargets) targetsStore.set(game.user.targets);
  }
  onUpdateActions(actions) {
    const showActions = typeof game.tokenActionHUD !== 'undefined' && game.settings.get(moduleId, SETTINGS.SHOW_ACTIONS);
    if (!this.enabled || !showActions || !this.svelte.applicationShell) return;
    actionsStore.set(actions);
    this.onUpdateTokens();
  }
}
