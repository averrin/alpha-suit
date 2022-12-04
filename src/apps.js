import { moduleId } from "./modules/constants.js";
import { theme, scale } from "crew-components/stores";

import CreateApplication from 'crew-components/AlphaApplication';
import BrowserUI from './view/BrowserUI.svelte';
import TreeUI from './view/TreeUI.svelte';
import HelpUI from './view/HelpUI.svelte';
import SettingsUI from './view/SettingsUI.svelte';
import FilesUI from './view/FilesUI.svelte';
// import HUDApplication from './view/HUDApplication.js';
import GridUI from './view/GridUI.svelte';

const apps = {};
const appSpecs = [
  { app_id: "tree", title: "Alpha Tree", component: TreeUI, isGM: true },
  { app_id: "browser", title: "Alpha Browser", component: BrowserUI, isGM: true },
  { app_id: "help", title: "Alpha Help Center", component: HelpUI, isGM: true },
  { app_id: "settings", title: "Alpha Settings", component: SettingsUI, isGM: true },
  { app_id: "files", title: "Alpha File Manager [BETA]", component: FilesUI, isGM: true },
  { app_id: "grid", title: "Alpha Grid [ALPHA]", component: GridUI, isGM: false, trackSize: true},
]

export function createApps() {
  for (const spec of appSpecs) {
    spec.moduleId = moduleId;
    const props = {}
    const app = new (CreateApplication(spec, props))();
    apps[spec.app_id] = app;
  }
  return apps;
}

export function startUserApps() {
  for (const spec of appSpecs) {
    if (!spec.isGM) {
      getApp(spec.app_id).start()
    }
  }
}

export function startGMApps() {
  for (const spec of appSpecs) {
    if (spec.isGM) {
      getApp(spec.app_id).start()
    }
  }

}

export function getApp(id) {
  return apps[id];
}
