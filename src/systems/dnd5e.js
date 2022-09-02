import System from "../modules/system.js";
import ItemsData from "./dnd5e/ItemsData_dnd5e.svelte";
import SpellsData from "./dnd5e/SpellsData_dnd5e.svelte";
import NPCData from "./dnd5e/NPCData_dnd5e.svelte";
import FeatsData from "./dnd5e/FeatsData_dnd5e.svelte";



function getDamageTypes(damage) {
  const types = damage?.parts?.map(a => a[1]) || ["none"];
  if (types.length == 0) {
    return ["none"]; //to detect "no damage"
  }
  return types;
}

const damageTypes = [
  {
    "value": "\"none\"",
    "label": "None"
  },
  {
    "value": "\"acid\"",
    "label": "Acid"
  },
  {
    "value": "\"fire\"",
    "label": "Fire"
  },
  {
    "value": "\"piercing\"",
    "label": "Piercing"
  },
  {
    "value": "\"poison\"",
    "label": "Poison"
  },
  {
    "value": "\"slashing\"",
    "label": "Slashing"
  },
  {
    "value": "\"bludgeoning\"",
    "label": "Bludgeoning"
  },
  {
    "value": "\"necrotic\"",
    "label": "Necrotic"
  },
  {
    "value": "\"force\"",
    "label": "Force"
  },
  {
    "value": "\"radiant\"",
    "label": "Radiant"
  },
  {
    "value": "\"cold\"",
    "label": "Cold"
  },
  {
    "value": "\"thunder\"",
    "label": "Thunder"
  },
  {
    "value": "\"lightning\"",
    "label": "Lightning"
  },
  {
    "value": "\"psychic\"",
    "label": "Psychic"
  },
  {
    "value": "\"healing\"",
    "label": "Healing"
  },
  {
    "value": "\"temphp\"",
    "label": "Temphp"
  },
];

const dnd5e = new System({
  id: "dnd5e",
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

  extraInfo: {
    "Items": { component: ItemsData, index: ["data.price", "data.weight", "data.armor.value"] },
    "Spells": { component: SpellsData, index: ["data.components", "data.level"] },
    "NPC": { component: NPCData, index: ["data.details.cr"] },
    "Feats": { component: FeatsData, index: ["data.requirements"] },
  },

  aliases: {
    "Common": {

    },
    "Spells": {
      getDamageTypes,
    },
    "Feats": {
      getDamageTypes,
    },

    "Items": {
      "@price": "float(@data.price)",
      "@weight": "@data.weight",
      "@rarity": "@data.rarity",

      getDamageTypes,
    },
    "NPC": {
      "@cr": "@data.details.cr",
    },
  },
  sortings: {
    "Spells": [
      {
        label: "level",
        query: "@data.level",
        show: false,
        asc: true, desc: true,
      },
    ],
    "Items": [
      {
        label: "type",
        query: "@type",
        show: false,
        asc: true, desc: true,
      },
      {
        label: "price",
        query: "@price",
        show: false,
        asc: true, desc: true,
      },
      {
        label: "weight",
        query: "@data.weight",
        show: false,
        asc: true, desc: true,
      },
    ],
    "NPC": [
      {
        label: "CR",
        query: "@cr",
        show: false,
        asc: true, desc: true,
      },
      {
        label: "Size",
        query: "@data.traits.size",
        show: true,
        asc: true, desc: true,
      },
    ]
  },
  filters: {
    "Feats": {
      "General": [
        {
          label: "Damage Type",
          control: "multiselect",
          attribute: "getDamageTypes(@data.damage)",
          template: "${value} in ${attribute}",
          options: [
            { value: ``, label: "" }, // TODO: add empty option automatically
            ...damageTypes
          ], logic: "or"
        },
      ]
    },
    "Spells": {
      "General": [

        {
          label: "Level",
          control: "compare-int",
          attribute: "@data.level"
        },
        {
          label: "Type",
          control: "select",
          attribute: "@data.actionType",
          options: [
            { value: ``, label: "" }, // TODO: add empty option automatically
            {
              "value": "\"rsak\"",
              "label": "Ranged Spell Attack"
            },
            {
              "value": "\"msak\"",
              "label": "Melee Spell Attack"
            },
            {
              "value": "\"rwak\"",
              "label": "Ranged Weapon Attack"
            },
            {
              "value": "\"mwak\"",
              "label": "Melee Weapon Attack"
            },
            {
              "value": "\"heal\"",
              "label": "Heal"
            },
            {
              "value": "\"other\"",
              "label": "Other"
            },
            {
              "value": "\"save\"",
              "label": "Save"
            },
            {
              "value": "\"abil\"",
              "label": "Ability Check"
            },
            {
              "value": "\"util\"",
              "label": "Utility"
            },
          ]
        },

        {
          label: "School",
          control: "select",
          attribute: "@data.school",
          options: [
            { value: ``, label: "" }, // TODO: add empty option automatically
            {
              "value": "\"abj\"",
              "label": "Abjuration"
            },
            {
              "value": "\"con\"",
              "label": "Conjuration"
            },
            {
              "value": "\"div\"",
              "label": "Divination"
            },
            {
              "value": "\"enc\"",
              "label": "Enchantment"
            },
            {
              "value": "\"evo\"",
              "label": "Evocation"
            },
            {
              "value": "\"ill\"",
              "label": "Illusion"
            },
            {
              "value": "\"nec\"",
              "label": "Necromancy"
            },
            {
              "value": "\"trs\"",
              "label": "Transmutation"
            },
          ]
        },

        {
          label: "Damage Type",
          control: "multiselect",
          attribute: "getDamageTypes(@data.damage)",
          template: "${value} in ${attribute}",
          options: [
            { value: ``, label: "" }, // TODO: add empty option automatically
            ...damageTypes
          ], logic: "or"
        },
      ],
    },
    "NPC": {
      "General": [
        {
          label: "CR",
          control: "compare-int",
          attribute: "@cr"
        },

        {
          label: "Type",
          control: "multiselect",
          attribute: "@data.details.type.value",
          options: [
            { value: ``, label: "" }, // TODO: add empty option automatically
            {
              "value": "\"aberration\"",
              "label": "Aberration"
            },
            {
              "value": "\"humanoid\"",
              "label": "Humanoid"
            },
            {
              "value": "\"dragon\"",
              "label": "Dragon"
            },
            {
              "value": "\"elemental\"",
              "label": "Elemental"
            },
            {
              "value": "\"monstrosity\"",
              "label": "Monstrosity"
            },
            {
              "value": "\"construct\"",
              "label": "Construct"
            },
            {
              "value": "\"beast\"",
              "label": "Beast"
            },
            {
              "value": "\"undead\"",
              "label": "Undead"
            },
            {
              "value": "\"plant\"",
              "label": "Plant"
            },
            {
              "value": "\"fiend\"",
              "label": "Fiend"
            },
            {
              "value": "\"ooze\"",
              "label": "Ooze"
            },
            {
              "value": "\"fey\"",
              "label": "Fey"
            },
            {
              "value": "\"giant\"",
              "label": "Giant"
            },
            {
              "value": "\"celestial\"",
              "label": "Celestial"
            },
            {
              "value": "\"custom\"",
              "label": "Custom"
            }
          ], logic: "or"
        },

        {
          label: "Size",
          control: "multiselect",
          attribute: "@data.traits.size",
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
      ]
    },
    "Items": {
      "General": [
        {
          label: "Type",
          control: "multiselect",
          attribute: "@type",
          options: [
            { value: ``, label: "" }, // TODO: add empty option automatically
            { value: `"loot"`, label: "Loot" },
            { value: `"weapon"`, label: "Weapon" },
            { value: `"tool"`, label: "Tool" },
            { value: `"equipment"`, label: "Equipment" },
            { value: `"consumable"`, label: "Consumable" },
          ], logic: "or"
        },

        {
          label: "Weight",
          control: "compare-int",
          attribute: "@data.weight"
        },
      ],
      "Type-specific": [
        {
          label: "Armor Type",
          control: "multiselect",
          attribute: "@data.armor.type",
          options: [
            { value: ``, label: "" }, // TODO: add empty option automatically
            { value: `"trinket"`, label: "Trinket" },
            { value: `"clothing"`, label: "Clothing" },
            { value: `"light"`, label: "Light" },
            { value: `"medium"`, label: "Medium" },
            { value: `"heavy"`, label: "Heavy" },
            { value: `"shield"`, label: "Shield" },
          ], logic: "or"
        },
        {
          label: "Weapon Type",
          control: "multiselect",
          attribute: "@data.weaponType",
          options: [
            { value: ``, label: "" }, // TODO: add empty option automatically
            {
              "value": "\"martialM\"",
              "label": "Martial Melee"
            },
            {
              "value": "\"martialR\"",
              "label": "Martial Ranged"
            },
            {
              "value": "\"simpleM\"",
              "label": "Simple Melee"
            },
            {
              "value": "\"natural\"",
              "label": "Natural"
            },
            {
              "value": "\"simpleR\"",
              "label": "Simple Ranged"
            }
          ], logic: "or"
        },

        {
          label: "Damage Type",
          control: "multiselect",
          attribute: "getDamageTypes(@data.damage)",
          template: "${value} in ${attribute}",
          options: [
            { value: ``, label: "" }, // TODO: add empty option automatically
            ...damageTypes
          ], logic: "or"
        },
        {
          label: "AC",
          control: "compare-int",
          attribute: "@data.armor.value"
        },
        {
          label: "Consumable Type",
          control: "multiselect",
          attribute: "@data.consumableType",
          options: [
            { value: ``, label: "" }, // TODO: add empty option automatically
            {
              "value": `"potion"`,
              "label": "Potion"
            },
            {
              "value": `"trinket"`,
              "label": "Trinket"
            },
            {
              "value": `"ammo"`,
              "label": "Ammo"
            },
            {
              "value": `"food"`,
              "label": "Food"
            },
            {
              "value": `"rod"`,
              "label": "Rod"
            },
            {
              "value": `"poison"`,
              "label": "Poison"
            },
            {
              "value": `"scroll"`,
              "label": "Scroll"
            },
            {
              "value": `"wand"`,
              "label": "Wand"
            }
          ], logic: "or"
        },
      ],
      "Value": [
        // {
        //   label: "Rarity",
        //   control: "select",
        //   options: [
        //     { value: ``, label: "" }, // TODO: add empty option automatically
        //     { value: `@rarity == "common"`, label: "Common" },
        //     { value: `@rarity == "uncommon"`, label: "Uncommon" },
        //   ]
        // },

        {
          label: "Attunement",
          control: "select",
          options: [
            { value: ``, label: "" }, // TODO: add empty option automatically
            { value: `@data.attunement != 1`, label: "Not Required" },
            { value: `@data.attunement == 1`, label: "Required" },
          ]
        },
        {
          label: "Rarity",
          control: "multiselect",
          attribute: "@rarity",
          options: [
            { value: ``, label: "" }, // TODO: add empty option automatically
            { value: `"common"`, label: "Common" },
            { value: `"uncommon"`, label: "Uncommon" },
            { value: `"rare"`, label: "Rare" },
            { value: `"veryRare"`, label: "Very Rare" },
            { value: `"legendary"`, label: "Legendary" },
          ], logic: "or"
        },
        {
          label: "Price",
          control: "compare-int",
          attribute: "@price"
        },
      ]
    }
  }
});
export default dnd5e;

