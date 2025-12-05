/** @type {import('vscode')} */
const vscode = require('vscode');
const path = require('path');

function activate(context) {
    let disposable = vscode.commands.registerCommand('vscode-espeak.speak', async function () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('Open a file or select text to speak.');
            return;
        }

        const selection = editor.selection;
        const text = editor.document.getText(selection) || editor.document.getText();

        const panel = vscode.window.createWebviewPanel(
            'espeak',
            'eSpeak TTS',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        // Convert local speakClient.js to a WebView URI
        const speakjs = panel.webview.asWebviewUri(
            vscode.Uri.file(path.join(context.extensionPath, 'speakjs', 'speakClient.js'))
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
                speak(\`${text}\`);
            </script>
        </body>
        </html>
        `;
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = { activate, deactivate };
