import { moduleId, SETTINGS } from "./modules/constants.js";
import { theme, scale } from "crew-components/stores";

import CreateApplication from 'crew-components/AlphaApplication';
import BrowserUI from './view/BrowserUI.svelte';
import TreeUI from './view/TreeUI.svelte';
import HelpUI from './view/HelpUI.svelte';
import SettingsUI from './view/SettingsUI.svelte';
import FilesUI from './view/FilesUI.svelte';
// import HUDApplication from './view/HUDApplication.js';
import GridUI from './view/GridUI.svelte';
import CreatorUI from './view/CreatorUI.svelte';
import DrawUI from './view/DrawUI.svelte';
import EditWidgetDialog from "./view/EditWidgetDialog.svelte";
import TrialDialog from "./view/TrialDialog.svelte"
import { isPremiumClean, isTrial } from "crew-components/premium";
import { setting } from "crew-components/helpers";

const apps = {};
const appSpecs = [
  { app_id: "tree", title: "Alpha Tree", component: TreeUI, isGM: true },
  { app_id: "browser", title: "Alpha Browser", component: BrowserUI, isGM: true },
  { app_id: "help", title: "Alpha Help Center", component: HelpUI, isGM: true },
  { app_id: "settings", title: "Alpha Settings", component: SettingsUI, isGM: true },
  { app_id: "files", title: "Alpha File Manager [BETA]", component: FilesUI, isGM: true },
  { app_id: "grid", title: "Alpha Grid [ALPHA]", component: GridUI, isGM: false, trackSize: true },
  { app_id: "creator", title: "Alpha Creator [ALPHA]", component: CreatorUI, isGM: true },
  {
    app_id: "edit-widget",
    title: "Edit widget",
    component: EditWidgetDialog,
    height: 600,
    width: 600,
    isTemp: true,
  },
  {
    app_id: "draw",
    title: "Alpha Draw",
    component: DrawUI,
    height: 150,
    width: 360,
    isGM: false,
    hidden: true,
  },
  {
    app_id: "trial",
    title: "Merry Christmas!",
    component: TrialDialog,
    height: Math.min(window.innerHeight * 0.9, 900),
    width: 600,
    isTemp: true,
    showIf: _ => !isPremiumClean() && isTrial() && !setting(SETTINGS.HIDE_TRIAL_2023),
    isGM: true,
  }
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
      getApp(spec.app_id).start(spec.hidden)
      if (spec.showIf && spec.showIf()) {
        getApp(spec.app_id).show();
      }
    }
  }
}

export function startGMApps() {
  for (const spec of appSpecs) {
    if (spec.isGM) {
      getApp(spec.app_id).start(spec.hidden)
      if (spec.showIf && spec.showIf()) {
        getApp(spec.app_id).show();
      }
    }
  }

}

export function getApp(id) {
  return apps[id];
}
