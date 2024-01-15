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
		<style>
			body {
				font-family: Arial, sans-serif;
				margin: 0;
				padding: 10px;
				background-color: #f4f4f4;
			}
			#question {
				margin-top: 20px;
				width: calc(100% - 130px);
				padding: 10px;
				font-size: 16px;
				border: 1px solid #ccc;
				border-radius: 4px;
			}
			button {
				margin-top: 20px;
				width: 100px;
				padding: 10px;
				background-color: #0078D7;
				color: white;
				border: none;
				border-radius: 4px;
				cursor: pointer;
			}
			button:hover {
				background-color: #0056b3;
			}
			#chat {
				background-color: white;
				border-radius: 4px;
				padding: 10px;
				height: calc(100vh - 100px);
				overflow-y: auto;
				border: 1px solid #ccc;
			}
			.message {
				padding: 5px;
				margin-bottom: 10px;
				border-radius: 4px;
			}
			.user-message {
				background-color: #e1f3fb;
				margin-left: 20px;
				color: black;
			}
			.bot-message {
				background-color: #e5e5e5;
				margin-right: 20px;
				color: black;
			}
		</style>
	</head>
	<body>
	<div id="chat"></div>
		<input type="text" id="question" placeholder="Type your question here...">
		<button onclick="askQuestion()">Ask</button>
		
			
			

            <script>
			const vscode = acquireVsCodeApi();
            function askQuestion() {
                const question = document.getElementById('question').value;
                const chatElement = document.getElementById('chat');
                const userMessage = document.createElement('div');
                userMessage.classList.add('message', 'user-message');
                userMessage.textContent = 'You: ' + question;
                chatElement.appendChild(userMessage);

                vscode.postMessage({
                    command: 'askQuestion',
                    text: question
                });
            }

            window.addEventListener('message', event => {
                const message = event.data;
                switch (message.command) {
                    case 'showResponse':
                        const chatElement = document.getElementById('chat');
                        const botMessage = document.createElement('div');
                        botMessage.classList.add('message', 'bot-message');
                        botMessage.textContent = 'Bot: ' + message.text;
                        chatElement.appendChild(botMessage);
                        break;
                }
            });
            </script>
        </body>
        </html>
    `;
}



export function deactivate() {}


