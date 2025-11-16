import * as vscode from "vscode";
import { MaskingService } from "../services/MaskingService";
import { logInfo } from "../utils/logger";

export class EnvMaskController implements vscode.Disposable {
  private disposable: vscode.Disposable;
  private maskingService: MaskingService;
  private enabled: boolean;
  private context: vscode.ExtensionContext;

  constructor(enabled: boolean, context: vscode.ExtensionContext) {
    this.enabled = enabled;
    this.context = context;
    this.maskingService = new MaskingService();

    const subscriptions: vscode.Disposable[] = [];

    subscriptions.push(
      vscode.window.onDidChangeActiveTextEditor((editor) => {
        this.updateMasking(editor);
      })
    );

    subscriptions.push(
      vscode.workspace.onDidChangeTextDocument((event) => {
        const active = vscode.window.activeTextEditor;
        if (!active || event.document !== active.document) {
          return;
        }
        this.updateMasking(active);
      })
    );

    this.updateMasking(vscode.window.activeTextEditor);

    this.disposable = vscode.Disposable.from(...subscriptions);
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    logInfo(`Env masking ${enabled ? "enabled" : "disabled"}`);
    this.updateMasking(vscode.window.activeTextEditor);
  }

  private updateMasking(editor: vscode.TextEditor | undefined) {
    if (!editor) {
      return;
    }

    const document = editor.document;
    const fileName = document.fileName.toLowerCase();

    const isEnvFile =
      fileName.endsWith(".env") ||
      fileName.endsWith(".env.local") ||
      fileName.endsWith(".env.development") ||
      fileName.endsWith(".env.production") ||
      fileName.endsWith(".env.test") ||
      /[/\\]\.env(\.|$)/.test(fileName);

    if (!isEnvFile || !this.enabled) {
      this.maskingService.clear(editor);
      return;
    }

    const decorations = this.maskingService.computeDecorations(document);
    this.maskingService.apply(editor, decorations);
  }

  public dispose() {
    this.disposable.dispose();
  }
}
