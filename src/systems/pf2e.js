import System from "../modules/system.js";

const pf2e = new System({
  id: "pf2e",
  tabs: [
    { title: "NPC", icon: "fa-solid:users", type: "Actor", subtypes: ['npc', 'hazard', 'vehicle', /*'character',*/ 'familiar'] },
    {
      title: "Items",
      icon: "fa-solid:suitcase",
      type: "Item",
      subtypes: ['equipment', 'consumable', 'armor', 'weapon', 'kit', 'treasure', 'backpack'],
    },
    { title: "Spells", icon: "fa-solid:magic", type: "Item", subtypes: ["spell"] },
    { title: "Feats", icon: "fa-solid:star", type: "Item", subtypes: ["feat"] },
  ],
  aliases: {
    "Common": {},
    "Items": {
      "level": "data.level.value",
    },
    "NPC": {
      "level": "data.details.level.value",
    },
  },
  sortings: {
    "Items": [
      {
        label: "type",
        query: "@type",
        show: false,
        asc: true, desc: true,
      },
      {
        label: "level",
        query: "@level",
        show: true,
        asc: true, desc: true,
      },
    ],
    "NPC": [
      {
        label: "level",
        query: "@level",
        show: true,
        asc: true, desc: true,
      },
    ]
  },
  filters: {
    "Items": {
      "General": [
        {
          label: "Rarity",
          control: "select",
          options: [
            { value: ``, label: "" }, // TODO: add empty option automatically
            { value: `@data.traits.rarity == "common"`, label: "Common" },
            { value: `@data.traits.rarity == "uncommon"`, label: "Uncommon" },
          ]
        },
        {
          label: "Level",
          control: "compare-int",
          attribute: "@data.level.value"
        }
      ]
    }
  }
});
export default pf2e;
