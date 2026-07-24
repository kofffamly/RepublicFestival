"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OFF_TOPIC_DETECTION_PROMPT = exports.ASSISTANT_SYSTEM_PROMPT = exports.ANALYZE_WASTE_SYSTEM_PROMPT = void 0;
/**
 * Barrel pour les prompts
 */
var analyze_waste_1 = require("./analyze-waste");
Object.defineProperty(exports, "ANALYZE_WASTE_SYSTEM_PROMPT", { enumerable: true, get: function () { return analyze_waste_1.ANALYZE_WASTE_SYSTEM_PROMPT; } });
var assistant_1 = require("./assistant");
Object.defineProperty(exports, "ASSISTANT_SYSTEM_PROMPT", { enumerable: true, get: function () { return assistant_1.ASSISTANT_SYSTEM_PROMPT; } });
Object.defineProperty(exports, "OFF_TOPIC_DETECTION_PROMPT", { enumerable: true, get: function () { return assistant_1.OFF_TOPIC_DETECTION_PROMPT; } });
//# sourceMappingURL=index.js.map