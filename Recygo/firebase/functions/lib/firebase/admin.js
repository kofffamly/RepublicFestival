"use strict";
/**
 * Initialisation Firebase Admin SDK
 *
 * Utilise les émulateurs en développement.
 * Singleton réutilisable dans toutes les fonctions.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = void 0;
exports.getFirebaseApp = getFirebaseApp;
exports.getFirestore = getFirestore;
exports.getAuth = getAuth;
exports.getStorage = getStorage;
const admin = __importStar(require("firebase-admin"));
exports.admin = admin;
const config_1 = require("../config");
let app = null;
/**
 * Obtient l'instance Firebase Admin (singleton)
 */
function getFirebaseApp() {
    if (app)
        return app;
    app = admin.initializeApp({
        projectId: config_1.firebaseConfig.projectId,
        storageBucket: config_1.firebaseConfig.storageBucket,
        credential: admin.credential.applicationDefault(),
    });
    // En développement, utiliser les émulateurs
    if ((0, config_1.isDev)()) {
        process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
        process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
        process.env.FIREBASE_STORAGE_EMULATOR_HOST = 'localhost:9199';
        process.env.FIREBASE_FUNCTIONS_EMULATOR_HOST = 'localhost:5001';
    }
    return app;
}
/**
 * Obtient Firestore (initialisé)
 */
function getFirestore() {
    return getFirebaseApp().firestore();
}
/**
 * Obtient Auth (initialisé)
 */
function getAuth() {
    return getFirebaseApp().auth();
}
/**
 * Obtient Storage (initialisé)
 */
function getStorage() {
    return getFirebaseApp().storage();
}
exports.default = getFirebaseApp;
//# sourceMappingURL=admin.js.map