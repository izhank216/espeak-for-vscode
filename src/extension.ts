import * as vscode from 'vscode';
import path from 'path';

export function activate(context: vscode.ExtensionContext) {
    const output = vscode.window.createOutputChannel('eSpeak');

    try {
        const disposable = vscode.commands.registerCommand('vscode-espeak.speak', async () => {
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
                { enableScripts: true, retainContextWhenHidden: true }
            );

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

    } catch (err: any) {
        output.appendLine(`eSpeak err! ${err.message}`);
        output.show();
    }
}

export function deactivate() {}
