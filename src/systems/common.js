import System from "../modules/system.js";

const common = new System({
  id: "*",
  common: true,
  tabs: [
    { title: "Actors", icon: "fa-solid:users", type: "Actor", subtypes: [] },
    {
      title: "Items",
      icon: "fa-solid:suitcase",
      type: "Item",
      subtypes: [],
    },
  ],
});

export default common;
