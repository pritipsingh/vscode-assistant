import * as vscode from 'vscode';
import { getResponse } from './mindsdb';
export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.askQuestion', () => {
            const panel = vscode.window.createWebviewPanel(
                'askQuestion',
                'Ask a Question',
                vscode.ViewColumn.One,
                {
                    enableScripts: true
                }
            );

            panel.webview.html = getWebviewContent();

            // Handle messages from the webview
            panel.webview.onDidReceiveMessage(
                message => {
                    switch (message.command) {
                        case 'askQuestion':
                            getResponse(message.text).then(response => {
                                panel.webview.postMessage({ command: 'showResponse', text: response });
                            }).catch(error => {
                                console.error(error);
                                panel.webview.postMessage({ command: 'showResponse', text: "Error fetching response" });
                            });
                            return;

                    }
                },
                undefined,
                context.subscriptions
            );
        })
    );
}

function getWebviewContent() {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Ask a Question</title>
        </head>
        <body>
            <input type="text" id="question" placeholder="Type your question here...">
            <button onclick="askQuestion()">Ask</button>
            <fiv
			<div id="chat"></div>
			<div id="response"></div>
			
			

            <script>
                const vscode = acquireVsCodeApi();
                function askQuestion() {
                    const question = document.getElementById('question').value;
                    vscode.postMessage({
                        command: 'askQuestion',
                        text: question
                    });
                }

                window.addEventListener('message', event => {
                    const message = event.data;
                    switch (message.command) {
                        case 'showResponse':
                            const responseElement = document.getElementById('response');
                            responseElement.textContent = message.text;
                            break;
                    }
                });
            </script>
        </body>
        </html>
    `;
}



export function deactivate() {}


