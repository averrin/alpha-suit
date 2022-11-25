# Changelog

All notable changes to this project will be documented in this file. Dates are displayed in UTC.

## [Unreleased]
## [0.4.14 - 0.5.0](https://github.com/averrin/alpha-suit/compare/0.4.14...0.5.0)
Added:
  * New Grid feature. Available for DM and players (you can disable it in the settings)
  * [Premium] You can have more than one grid.

## [0.4.13 - 0.4.14](https://github.com/averrin/alpha-suit/compare/0.4.13...0.4.14)
Added:
  * "Folders white list" option for the File Manager. Only these folders will be indexed.
  * "On demand" mode for file indexing. Starts the process only on a window opening. **Now this option is default**

## [0.4.12 - 0.4.13](https://github.com/averrin/alpha-suit/compare/0.4.12...0.4.13)
Fixed: 
  * File search input is hidden when there is no favs
  * Faving search breaks the file manager
  * Browser export is broken in v10

## [0.4.11 - 0.4.12](https://github.com/averrin/alpha-suit/compare/0.4.11...0.4.12)
Fixed:
  * File manager doesn't launch
  * ArgInputs' autocomplete preventing fails

## [0.4.10 - 0.4.11](https://github.com/averrin/alpha-suit/compare/0.4.10...0.4.11)
Changed:
  * File index settings like "excluded folders" switched from "client" to "world". IMPORTANT: check these settings if you changed them

## [0.4.9 - 0.4.10](https://github.com/averrin/alpha-suit/compare/0.4.9...0.4.10)
Fixed:
  * Ui Scale doenst apply
  * Drag and drop actors & items from Browser doesn't work (fixed actor to canvas and items to an actor sheet)

## [0.4.8 - 0.4.9](https://github.com/averrin/alpha-suit/compare/0.4.8...0.4.9)
Fixed:
  * Doraco UI breaks notification style

Added:
  * Koboldworks Data Inspector integration
  * Better pf2e support (Browser filters and tabs)

## [0.4.7 - 0.4.8](https://github.com/averrin/alpha-suit/compare/0.4.7...0.4.8)
Fixed:
  * Stored index stats update
  * Minor UI issues
  * Browser filter with zero value (e.g. spell level for cantrips)

Added:
  * A link to the page with the Unlocker module

## [0.4.6 - 0.4.7](https://github.com/averrin/alpha-suit/compare/0.4.6...0.4.7)
Fixed:
  * Compendium folders aren't sorted
  * Extra compendium items in its root
  * Custom compendiums created in v9 ignored by filters

Added:
  * [Premium] "Stored index" mode. You can index your files once and use this index for searching even after page refresh
  * [Premium] Fuzzy search for files

## [0.4.5 - 0.4.6](https://github.com/averrin/alpha-suit/compare/0.4.5...0.4.6)
Fixed:
  * Pagination in some cases cannot navigate to the last page
  * Incorrect test for installed Sequencer
  * Missed handlers for some possible errors
  * Audio files with extensions like "mp3" (non-video) dont treat like media

## [0.4.4 - 0.4.5](https://github.com/averrin/alpha-suit/compare/0.4.4...0.4.5)
Fixed:
  * Tokens layout is broken if they dont fit into one line

Added:
  * Button for starting file indexing right next to the search field
  * A little color tweak for the light theme


## [0.4.3 - 0.4.4](https://github.com/averrin/alpha-suit/compare/0.4.3...0.4.4)
Fixed:
  * Broken s3 in the File Manager 
  * Wrong Discord links

Added:
  * The first supporter in the Support Tab!

## [0.4.2 - 0.4.3](https://github.com/averrin/alpha-suit/compare/0.4.2...0.4.3)
Added:
  * Files & Director integration
  * More Director settings

Fixed:
  * File indexing stuck at Forge

## [0.4.1 - 0.4.2](https://github.com/averrin/alpha-suit/compare/0.4.1...0.4.2)
Fixed:
  * Notifications block ESC menu (again =) )

Added:
  * Settings page for Director
  * [Premium] Default path for the File Manager

## [0.4.0 - 0.4.1](https://github.com/averrin/alpha-suit/compare/0.4.0...0.4.1)
Fixed:
  * Notifications block ESC menu
  * Broken tokens layout if there are a lot

Added:
  * Dropping images onto thumbs in the tree changing them
  * Dropping images onto thumbs in the browser changing them if compendium is unlocked
  * You also can drop images onto "profile" pics in actor/item sheets
  * [Premium] For actors you also can change token/prototypeToken art

## [0.3.1 - 0.4.0](https://github.com/averrin/alpha-suit/compare/0.3.1...0.4.0)
Added:
  * File search. Yes among all your files. Yes, indexing takes time. Yeah, you can disable it.
  * Better notification system (not fully supported yet)
  * File selecting. For now its just a bit more robust way to see a preview and copy path
  * [Premium] File tagging. Global search also looks into tags.
  * [Premium] "Copy image to clipboard" button.

## [0.3.0 - 0.3.1](https://github.com/averrin/alpha-suit/compare/0.3.0...0.3.1)
Fixed:
  * `Sequencer.Database.inverseFlattenedEntries` isnt present in v9
  * Folder with big images can cause browser crash

## [0.2.2 - 0.3.0](https://github.com/averrin/alpha-suit/compare/0.2.2...0.3.0)
Fixed:
  * Tool button duplication (I hope. Still cannot reproduce)

Added:
  * File Manager beta release

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
