import { buildHelpTree, helpTree } from './modules/stores.js';
import { addTool } from "./tools";
import { notify } from "./modules/notify";
import { helpContent } from "./modules/help_content.js"
import { getApp } from './apps.js';

export function createAPI() {
  window.AlphaSuit = {
    showHelp: () => getApp("help").show(),
    showSettings: _ => getApp("settings").show(),
    addTool: (tool) => {
      addTool(tool);
    },
    addHelp: (data) => {
      helpContent.children.push(data);
      helpTree.set(buildHelpTree())
    },
    notify,
  }
}
