"use strict";
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = buildExtension;
const react_1 = __importStar(require("react"));
const ui_extensions_1 = require("@hubspot/ui-extensions");
const useMutation_1 = require("./useMutation");
const useQuery_1 = require("./useQuery");
function buildExtension(Extension) {
    const ExtensionContext = (0, react_1.createContext)(null);
    // Define a functional component that will consume the context
    const ExtensionProvider = ({ api }) => {
        return (react_1.default.createElement(ExtensionContext.Provider, { value: api },
            react_1.default.createElement(Extension, { context: api })));
    };
    // Register the extension with Hubspot and return the wrapped component
    ui_extensions_1.hubspot.extend((api) => {
        return react_1.default.createElement(ExtensionProvider, { api: api });
    });
    // Return a hook to use within the component
    return function useExtension() {
        const context = (0, react_1.useContext)(ExtensionContext);
        if (!context) {
            throw new Error("useExtension must be used within ExtensionContext.Provider");
        }
        return {
            ...context,
            useMutation: (0, useMutation_1.useMutation)(context),
            useQuery: (0, useQuery_1.useQuery)(context),
        };
    };
}
