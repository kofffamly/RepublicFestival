"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = exports.getStorage = exports.getAuth = exports.getFirestore = exports.getFirebaseApp = void 0;
/**
 * Barrel pour Firebase
 */
var admin_1 = require("./admin");
Object.defineProperty(exports, "getFirebaseApp", { enumerable: true, get: function () { return admin_1.getFirebaseApp; } });
Object.defineProperty(exports, "getFirestore", { enumerable: true, get: function () { return admin_1.getFirestore; } });
Object.defineProperty(exports, "getAuth", { enumerable: true, get: function () { return admin_1.getAuth; } });
Object.defineProperty(exports, "getStorage", { enumerable: true, get: function () { return admin_1.getStorage; } });
Object.defineProperty(exports, "admin", { enumerable: true, get: function () { return admin_1.admin; } });
//# sourceMappingURL=index.js.map