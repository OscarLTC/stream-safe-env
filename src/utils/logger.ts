import * as vscode from "vscode";

let outputChannel: vscode.OutputChannel | undefined;

function getChannel(): vscode.OutputChannel {
  if (!outputChannel) {
    outputChannel = vscode.window.createOutputChannel("EnvMask");
  }
  return outputChannel;
}

export function logInfo(message: string) {
  getChannel().appendLine(`[INFO] ${message}`);
}

export function logError(message: string, error?: unknown) {
  getChannel().appendLine(`[ERROR] ${message}`);
  if (error instanceof Error) {
    getChannel().appendLine(error.stack ?? error.message);
  }
}
