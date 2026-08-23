const { setWorldConstructor, World } = require('@cucumber/cucumber');

class DevRadarWorld extends World {
  constructor(options) {
    super(options);
    this.app = null;
    this.server = null;
    this.response = null;
    this.sockets = []; // open socket.io-client connections, closed in an After hook
    this.receivedEvents = {}; // socketAlias -> [{event, payload}]
  }
}

setWorldConstructor(DevRadarWorld);
