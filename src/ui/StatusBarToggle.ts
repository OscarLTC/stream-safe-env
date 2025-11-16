import * as vscode from "vscode";

export class StatusBarToggle implements vscode.Disposable {
  private item: vscode.StatusBarItem;
  private enabled: boolean;

  constructor(initialState: boolean) {
    this.enabled = initialState;

    this.item = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      100
    );
    this.item.command = "envMask.toggle";
    this.item.tooltip = "Toggle Env Masking";
    this.updateText();
    this.item.show();
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    this.updateText();
  }

  private updateText() {
    this.item.text = this.enabled
      ? "$(eye-closed) Env Mask: ON"
      : "$(eye) Env Mask: OFF";
  }

  public dispose() {
    this.item.dispose();
  }
}
