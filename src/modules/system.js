export default class System {
  constructor(data) {
    this.id = data.id;
    this.init = data.init;
    this.tabs = data.tabs;
    this.aliases = data.aliases;
    this.indexFields = data.indexFields;
    this.data = data;
  }

};
