import * as vscode from "vscode";
import { EnvMaskController } from "./controllers/EnvMaskController";
import { StatusBarToggle } from "./ui/StatusBarToggle";
import { logInfo } from "./utils/logger";

let controller: EnvMaskController | undefined;
let statusBar: StatusBarToggle | undefined;

export function activate(context: vscode.ExtensionContext) {
  logInfo("Stream Safe Env extension activated");

  const savedState = context.globalState.get<boolean>("envMaskEnabled", true);

  controller = new EnvMaskController(savedState, context);
  statusBar = new StatusBarToggle(savedState);

  context.subscriptions.push(
    vscode.commands.registerCommand("envMask.toggle", () => {
      if (controller && statusBar) {
        const newState = !controller.isEnabled();
        controller.setEnabled(newState);
        statusBar.setEnabled(newState);

        context.globalState.update("envMaskEnabled", newState);

        vscode.window.showInformationMessage(
          `Env masking ${newState ? "enabled" : "disabled"}`
        );
      }
    })
  );

  context.subscriptions.push(controller, statusBar);
}

export function deactivate() {
  controller?.dispose();
  statusBar?.dispose();
}
