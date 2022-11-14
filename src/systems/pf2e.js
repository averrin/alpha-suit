import System from "../modules/system.js";

let traits = [];
let npc_traits = [];
let npc_types = [];
let spell_traits = [];
let action_traits = [];
const pf2e = new System({
  id: "pf2e",

  init: async () => {
    traits = [
      { value: ``, label: "" },
      ...Array.from(new Set((await game.packs.get("pf2e.equipment-srd").getIndex({ fields: ["system"] })).map(i => i.system.traits?.value).flat())).filter(e => typeof e === "string").map(g => { return { "value": `"${g}"`, label: g[0].toUpperCase() + g.substring(1) } })
    ]
    npc_traits = [
      { value: ``, label: "" },
      ...Array.from(new Set((await game.packs.get("pf2e.pathfinder-bestiary").getIndex({ fields: ["system"] })).map(i => i.system.traits?.value).flat())).filter(e => typeof e === "string").map(g => { return { "value": `"${g}"`, label: g[0].toUpperCase() + g.substring(1) } })
    ]
    npc_types = [
      { value: ``, label: "" },
      Array.from(new Set((await game.packs.get("pf2e.pathfinder-bestiary").getIndex({ fields: ["system"] })).map(i => i.system.details.creatureType))).filter(e => typeof e === "string" && e).map(g => { return { "value": `"${g}"`, label: g[0].toUpperCase() + g.substring(1) } })
    ]

    spell_traits = [
      { value: ``, label: "" },
      ...Array.from(new Set((await game.packs.get("pf2e.spells-srd").getIndex({ fields: ["system"] })).map(i => i.system.traits?.value).flat())).filter(e => typeof e === "string").map(g => { return { "value": `"${g}"`, label: g[0].toUpperCase() + g.substring(1) } })
    ]
    action_traits = [
      { value: ``, label: "" },
      ...Array.from(new Set((await game.packs.get("pf2e.actionspf2e").getIndex({ fields: ["system"] })).map(i => i.system.traits?.value).flat())).filter(e => typeof e === "string").map(g => { return { "value": `"${g}"`, label: g[0].toUpperCase() + g.substring(1) } })
    ]
  },

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
    { title: "Actions", icon: "bi:diamond-half", type: "Item", subtypes: ["action"] },
    { title: "Effects", icon: "icon-park-solid:effects", type: "Item", subtypes: ["effect"] },
    { title: "PC attributes", icon: "ph:user-circle-fill", type: "Item", subtypes: ["ancestry", "background", "class", "heritage"] },
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
    "Actions": {
      "General": [
        {
          label: "Actions",
          control: "compare-int",
          attribute: "@data.actions.value"
        },

        {
          label: "Category",
          control: "select",
          attribute: "@data.actionCategory.value",
          options: [
            { value: ``, label: "" }, // TODO: add empty option automatically
            { "value": "\"defensive\"", "label": "Defensive" }, { "value": "\"offensive\"", "label": "Offensive" }, { "value": "\"interaction\"", "label": "Interaction" }
          ]
        },

        {
          label: "Type",
          control: "select",
          attribute: "@data.actionType.value",
          options: [
            { value: ``, label: "" }, // TODO: add empty option automatically
            { "value": "\"reaction\"", "label": "Reaction" }, { "value": "\"action\"", "label": "Action" }, { "value": "\"passive\"", "label": "Passive" }, { "value": "\"free\"", "label": "Free" }
          ]
        },

        {
          label: "Traits",
          control: "multiselect",
          attribute: "@data.traits.value",
          template: "${value} in ${attribute}",
          options: _ => action_traits, logic: "and"
        },

      ]
    },
    "PC attributes": {
      "General": [
        {
          label: "Rarity",
          control: "select",
          options: [
            { value: ``, label: "" }, // TODO: add empty option automatically
            { value: `@data.traits.rarity == "common"`, label: "Common" },
            { value: `@data.traits.rarity == "uncommon"`, label: "Uncommon" },
            { value: `@data.traits.rarity == "rare"`, label: "Rare" },
            { value: `@data.traits.rarity == "unique"`, label: "Unique" },
          ]
        },
      ]
    },
    "Feats": {
      "General": [
        {
          label: "Level",
          control: "compare-int",
          attribute: "@data.level.value"
        },
        {
          label: "Rarity",
          control: "select",
          options: [
            { value: ``, label: "" }, // TODO: add empty option automatically
            { value: `@data.traits.rarity == "common"`, label: "Common" },
            { value: `@data.traits.rarity == "uncommon"`, label: "Uncommon" },
            { value: `@data.traits.rarity == "rare"`, label: "Rare" },
            { value: `@data.traits.rarity == "unique"`, label: "Unique" },
          ]
        },
      ]
    },
    "Spells": {
      "General": [
        {
          label: "Level",
          control: "compare-int",
          attribute: "@data.level.value"
        },

        {
          label: "Category",
          control: "select",
          attribute: "@data.category.value",
          options: [
            { value: ``, label: "" }, // TODO: add empty option automatically
            { "value": "\"spell\"", "label": "Spell" }, { "value": "\"focus\"", "label": "Focus" }, { "value": "\"ritual\"", "label": "Ritual" }
          ]
        },

        {
          label: "School",
          control: "select",
          attribute: "@data.school.value",
          options: [
            { value: ``, label: "" }, // TODO: add empty option automatically
            { "value": "\"transmutation\"", "label": "Transmutation" }, { "value": "\"enchantment\"", "label": "Enchantment" }, { "value": "\"conjuration\"", "label": "Conjuration" }, { "value": "\"necromancy\"", "label": "Necromancy" }, { "value": "\"evocation\"", "label": "Evocation" }, { "value": "\"divination\"", "label": "Divination" }, { "value": "\"abjuration\"", "label": "Abjuration" }, { "value": "\"illusion\"", "label": "Illusion" }
          ]
        },
        {
          label: "Traits",
          control: "multiselect",
          attribute: "@data.traits.value",
          template: "${value} in ${attribute}",
          options: _ => spell_traits, logic: "and"
        },
        {
          label: "Rarity",
          control: "select",
          options: [
            { value: ``, label: "" }, // TODO: add empty option automatically
            { value: `@data.traits.rarity == "common"`, label: "Common" },
            { value: `@data.traits.rarity == "uncommon"`, label: "Uncommon" },
            { value: `@data.traits.rarity == "rare"`, label: "Rare" },
            { value: `@data.traits.rarity == "unique"`, label: "Unique" },
          ]
        },
      ]
    },
    "NPC": {
      "General": [
        {
          label: "Level",
          control: "compare-int",
          attribute: "@data.details.level.value"
        },

        {
          label: "Traits",
          control: "multiselect",
          attribute: "@data.traits.value",
          template: "${value} in ${attribute}",
          options: _ => npc_traits, logic: "and"
        },

        {
          label: "Type",
          control: "select",
          attribute: "@data.details.creatureType",
          options: _ => npc_types,
        },

        {
          label: "Alignment",
          control: "select",
          attribute: "@data.details.alignment.value",
          options: [

            { value: ``, label: "" }, // TODO: add empty option automatically
            { "value": "\"NG\"", "label": "NG" }, { "value": "\"N\"", "label": "N" }, { "value": "\"CE\"", "label": "CE" }, { "value": "\"LE\"", "label": "LE" }, { "value": "\"CG\"", "label": "CG" }, { "value": "\"LG\"", "label": "LG" }, { "value": "\"LN\"", "label": "LN" }, { "value": "\"NE\"", "label": "NE" }, { "value": "\"CN\"", "label": "CN" }
          ],
        },
        {

          label: "Size",
          control: "multiselect",
          attribute: "@data.traits.size.value",
          options: [
            { value: ``, label: "" }, // TODO: add empty option automatically

            {
              "value": "\"tiny\"",
              "label": "Tiny"
            },
            {
              "value": "\"sm\"",
              "label": "Small"
            },
            {
              "value": "\"med\"",
              "label": "Medium"
            },
            {
              "value": "\"lg\"",
              "label": "Large"
            },
            {
              "value": "\"huge\"",
              "label": "Huge"
            },
            {
              "value": "\"grg\"",
              "label": "Gargantuan"
            },
          ], logic: "or"
        },

        {
          label: "Rarity",
          control: "select",
          options: [
            { value: ``, label: "" }, // TODO: add empty option automatically
            { value: `@data.traits.rarity == "common"`, label: "Common" },
            { value: `@data.traits.rarity == "uncommon"`, label: "Uncommon" },
            { value: `@data.traits.rarity == "rare"`, label: "Rare" },
            { value: `@data.traits.rarity == "unique"`, label: "Unique" },
          ]
        },
      ]
    },
    "Items": {
      "General": [
        {
          label: "Rarity",
          control: "select",
          options: [
            { value: ``, label: "" }, // TODO: add empty option automatically
            { value: `@data.traits.rarity == "common"`, label: "Common" },
            { value: `@data.traits.rarity == "uncommon"`, label: "Uncommon" },
            { value: `@data.traits.rarity == "rare"`, label: "Rare" },
            { value: `@data.traits.rarity == "unique"`, label: "Unique" },
          ]
        },
        {
          label: "Level",
          control: "compare-int",
          attribute: "@data.level.value"
        },

        {
          label: "Price (gp)",
          control: "compare-int",
          attribute: "@data.price.value.gp"
        },

        {
          label: "Weight",
          control: "compare-int",
          attribute: "float(@data.weight.value)"
        },

        {
          label: "Group",
          control: "select",
          attribute: "@data.group",
          options: [
            { value: ``, label: "" }, // TODO: add empty option automatically
            { "value": "\"bomb\"", "label": "Bomb" }, { "value": "\"club\"", "label": "Club" }, { "value": "\"axe\"", "label": "Axe" }, { "value": "\"firearm\"", "label": "Firearm" }, { "value": "\"bow\"", "label": "Bow" }, { "value": "\"sword\"", "label": "Sword" }, { "value": "\"leather\"", "label": "Leather" }, { "value": "\"spear\"", "label": "Spear" }, { "value": "\"plate\"", "label": "Plate" }, { "value": "\"sling\"", "label": "Sling" }, { "value": "\"knife\"", "label": "Knife" }, { "value": "\"flail\"", "label": "Flail" }, { "value": "\"brawling\"", "label": "Brawling" }, { "value": "\"dart\"", "label": "Dart" }, { "value": "\"polearm\"", "label": "Polearm" }, { "value": "\"chain\"", "label": "Chain" }, { "value": "\"cloth\"", "label": "Cloth" }, { "value": "\"shield\"", "label": "Shield" }, { "value": "\"hammer\"", "label": "Hammer" }, { "value": "\"pick\"", "label": "Pick" }, { "value": "\"composite\"", "label": "Composite" }]
        },
        {
          label: "Category",
          control: "select",
          attribute: "@data.category",
          options: [
            { value: ``, label: "" }, // TODO: add empty option automatically
            { "value": "\"shield\"", "label": "Shield" }, { "value": "\"martial\"", "label": "Martial" }, { "value": "\"simple\"", "label": "Simple" }, { "value": "\"advanced\"", "label": "Advanced" }, { "value": "\"light\"", "label": "Light" }, { "value": "\"heavy\"", "label": "Heavy" }, { "value": "\"medium\"", "label": "Medium" }, { "value": "\"unarmored\"", "label": "Unarmored" }, { "value": "\"unarmed\"", "label": "Unarmed" },
          ]
        },


        {
          label: "Size",
          control: "multiselect",
          attribute: "@data.size",
          options: [
            { value: ``, label: "" }, // TODO: add empty option automatically

            {
              "value": "\"tiny\"",
              "label": "Tiny"
            },
            {
              "value": "\"sm\"",
              "label": "Small"
            },
            {
              "value": "\"med\"",
              "label": "Medium"
            },
            {
              "value": "\"lg\"",
              "label": "Large"
            },
          ], logic: "or"
        },

        {
          label: "Traits",
          control: "multiselect",
          attribute: "@data.traits.value",
          template: "${value} in ${attribute}",
          options: _ => traits, logic: "and"
        },
      ]
    }
  }
});
export default pf2e;
