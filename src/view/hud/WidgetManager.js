import { moduleId, SETTINGS } from "../constants.js";
import { setting } from "../modules/settings.js";

export default class WidgetManager
{
    #widgets = [];

    add(widget) {
        this.#widgets.push(widget);
    }

    async show() {
        for (const widget of this.#widgets) {
            await widget.show();
        }
    }
    async hide() {
        for (const widget of this.#widgets) {
            await widget.hide();
        }
    }

    toggle() {
        if (setting(SETTINGS.SHOW)) {
            this.hide();
        } else {
            this.show();
        }
        globalThis.game.settings.set(moduleId, SETTINGS.SHOW, !setting(SETTINGS.SHOW))
    }

    async start() {
        for (const widget of this.#widgets) {
            widget.installHooks();
        }
    }

    refreshWidgets() {
        for (const widget of this.#widgets) {
            widget.refresh();
        }
    }

    updateConfig() {
        this.refreshWidgets();
    }
}
