import * as vscode from "vscode";
import { ENV_VALUE_REGEX } from "../utils/patterns";

export class MaskingService {
  private decorationType: vscode.TextEditorDecorationType;

  constructor() {
    this.decorationType = vscode.window.createTextEditorDecorationType({
      color: "transparent",
      backgroundColor: new vscode.ThemeColor("editor.background"),
      before: {
        color: new vscode.ThemeColor("editor.foreground"),
      },
    });
  }

  public computeDecorations(
    document: vscode.TextDocument
  ): vscode.DecorationOptions[] {
    const decorations: vscode.DecorationOptions[] = [];

    for (let i = 0; i < document.lineCount; i++) {
      const line = document.lineAt(i);
      const text = line.text.trim();

      if (!text || text.startsWith("#")) {
        continue;
      }

      const match = ENV_VALUE_REGEX.exec(line.text);
      if (match) {
        const equalIndex = line.text.indexOf("=");
        if (equalIndex === -1) {
          continue;
        }

        const valueStart = equalIndex + 1;
        const valueText = line.text.substring(valueStart).trim();

        if (valueText.length === 0) {
          continue;
        }

        const start = new vscode.Position(i, valueStart);
        const end = line.range.end;

        const maskedValue = "•".repeat(valueText.length);

        decorations.push({
          range: new vscode.Range(start, end),
          renderOptions: {
            before: {
              contentText: maskedValue,
              color: new vscode.ThemeColor("editor.foreground"),
            },
          },
        });
      }
    }

    return decorations;
  }

  public apply(
    editor: vscode.TextEditor,
    decorations: vscode.DecorationOptions[]
  ) {
    editor.setDecorations(this.decorationType, decorations);
  }

  public clear(editor: vscode.TextEditor) {
    editor.setDecorations(this.decorationType, []);
  }

  public dispose() {
    this.decorationType.dispose();
  }
}
