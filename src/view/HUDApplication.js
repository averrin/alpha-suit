import { logger, setting } from "crew-components/helpers";
import { moduleId, SETTINGS } from "../modules/constants";

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
      logger.info("toggle HUD");
        if (setting(SETTINGS.SHOW_HUD)) {
            this.hide();
        } else {
            this.show();
        }
        globalThis.game.settings.set(moduleId, SETTINGS.SHOW_HUD, !setting(SETTINGS.SHOW_HUD))
    }

    async start() {
      logger.info("HUD started")
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

