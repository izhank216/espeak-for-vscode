"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"));
var import_path = __toESM(require("path"));
function activate(context) {
  const output = vscode.window.createOutputChannel("eSpeak");
  try {
    const disposable = vscode.commands.registerCommand("vscode-espeak.speak", async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage("Open a file or select text to speak.");
        return;
      }
      const selection = editor.selection;
      const text = editor.document.getText(selection) || editor.document.getText();
      const panel = vscode.window.createWebviewPanel(
        "espeak",
        "eSpeak TTS",
        vscode.ViewColumn.One,
        { enableScripts: true, retainContextWhenHidden: true }
      );
      const speakjs = panel.webview.asWebviewUri(
        vscode.Uri.file(import_path.default.join(context.extensionPath, "speakjs", "speakClient.js"))
      );
      panel.webview.html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: sans-serif; margin: 0; display: flex; flex-direction: column; height: 100vh; }
                    #console { flex: 1; background: #1e1e1e; color: #d4d4d4; padding: 10px; overflow-y: auto; font-family: monospace; }
                    #status { padding: 5px; background: #333; color: white; }
                </style>
            </head>
            <body>
                <div id="status">eSpeak console:</div>
                <div id="console"></div>

                <script src="${speakjs}"></script>
                <script>
                    const consoleDiv = document.getElementById('console');
                    (function() {
                        const origLog = console.log;
                        console.log = function(...args) {
                            origLog(...args);
                            args.forEach(arg => {
                                const msg = document.createElement('div');
                                msg.textContent = arg;
                                consoleDiv.appendChild(msg);
                            });
                            consoleDiv.scrollTop = consoleDiv.scrollHeight;
                        };
                    })();
                    try {
                        speak(\`${text}\`);
                    } catch (err) {
                        console.log('eSpeak error:', err.message);
                    }
                </script>
            </body>
            </html>
            `;
    });
    context.subscriptions.push(disposable);
  } catch (err) {
    output.appendLine(`eSpeak err! ${err.message}`);
    output.show();
  }
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map