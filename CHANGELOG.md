# Changelog

All notable changes to this project will be documented in this file. Dates are displayed in UTC.

## [Unreleased]
## [0.2.1 - 0.2.2](https://github.com/averrin/alpha-suit/compare/0.2.1...0.2.2)
Fixed:
  * Compendium folders icons are broken

## [0.2.0 - 0.2.1](https://github.com/averrin/alpha-suit/compare/0.2.0...0.2.1)
Fixed:
  * Auto height failed when tabbars changes height
  * Filters don't clear

Added:
  * More system-specific info for selected documents [dnd5e]
  * Using ProseMirror to show description in the right way [v10 only]
  * "Environment" filter for NPCs in the Browser
  * Search in description filter from Items/Spells/Feats in the Browser [dnd5e]
  * Settings for windows width
  * Tooltips with description for items in system-specific info widgets
  * Rarity for items in Browser [dnd5e]

## [0.1.8 - 0.2.0](https://github.com/averrin/alpha-suit/compare/0.1.8...0.2.0)
Fixed:
  * Tool buttons for v10
  * Wrong icons for copy buttons
  * Missed Item Piles blocks features and effects lists

Added:
  * Spells list for selected actor
  * Icons in selected actor are now draggable
  * Titles for copy buttons contains value
  * Tag icons are now from the Game Icons set (unfortunately, very slow)
  * Tokens in tree view respects tint
  * Updating tree view actor info on updateActor/deleteItem/createItem
  * Selected item's description in the tree
  * Scenes tab

## [0.1.7 - 0.1.8](https://github.com/averrin/alpha-suit/compare/0.1.7...0.1.8)
Fixed:
  * I can bet that i fixed something. But i forgot.

Added:
  * More info for selected actors (system-specific)
  * Separate Settings window
  * Items Pile integration (optional)

## [0.1.6 - 0.1.7](https://github.com/averrin/alpha-suit/compare/0.1.6...0.1.7)
Fixed:
  * crew-components dependency causes broken styles in release build

## [0.1.5 - 0.1.6](https://github.com/averrin/alpha-suit/compare/0.1.5...0.1.6)
Added:
  * Compendium name for each item in the browser
  * Help pages for the browser

Fixed:
  * UI layout issues in the filter panel
  * Hovered button's color in dark mode

## [0.1.4 - 0.1.5](https://github.com/averrin/alpha-suit/compare/0.1.4...0.1.5)
Added:
  * GUI Dark theme

## [0.1.3 - 0.1.4](https://github.com/averrin/alpha-suit/compare/0.1.3...0.1.4)
Fixed:
  * crash on item selection in the tree
Added:
  * ability to move item(s) to folder from the selection mode

## [0.1.2 - 0.1.3](https://github.com/averrin/alpha-suit/compare/0.1.2...0.1.3)
Fixed:
  * Style leakage
  * A couple of crashes
  * Many v10 related problems (e.g. with updated dnd5e system)
  * Filtering issues

Added:
  * Buttons for "onScene" and "fav" filters
  * Button for "fav" toggling
  * BREAKING: inverted left and right clicks for trees. You can enable the old behaviour in the settings
  * A little more help text about Alpha Tree
