import { v4 as uuidv4 } from "uuid";

export class TreeItem {
  constructor() {
    this.id = uuidv4();
    this.name = "New Tree Item"
    this.color;
    this.bgColor;
    this.children = [];
    this.icon = undefined;
    this.thumbnail = undefined;
    this.source = undefined;
    this.selected = false;
  }

  getName() {
    return this.source?.name || this.name;
  }

  toggleSelected(state) {
    if (!state) state = !this.selected;
    this.selected = state;
    this.children.forEach(i => i.toggleSelected(state));
  }

  static from(source) {
    const item = new TreeItem();
    item.id = source.id || source.folder?.id || uuidv4();
    item.name = source.title || source.name || source.folder?.name;
    item.source = source;
    item.thumbnail = source.thumbnail;
    item.icon = source._icon ?? source.icon;
    item.component = source.component;
    item.content = source.content;
    item.expandable = source.expandable;
    item.parent = source.parent;
    return item;
  }
}
