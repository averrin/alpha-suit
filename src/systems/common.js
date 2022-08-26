import System from "../modules/system.js";

const common = new System({
  id: "*",
  common: true,
  tabs: [
    { title: "NPC", icon: "fa-solid:users", type: "Actor", subtypes: ["npc"] },
    {
      title: "Items",
      icon: "fa-solid:suitcase",
      type: "Item",
      subtypes: ["loot", "weapon", "tool", "equipment", "consumable"],
    },
    { title: "Spells", icon: "fa-solid:magic", type: "Item", subtypes: ["spell"] },
    { title: "Feats", icon: "fa-solid:star", type: "Item", subtypes: ["feat"] },
  ],
});

export default common;
