import envParsed from "@/envParsed";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { X, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function EmergencyButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedCommand(text);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full bg-yellow-500 text-white hover:bg-yellow-400">
          Try Emergency Process
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        hideCloseButton
      >
        <DialogHeader className="flex flex-row justify-between">
          <DialogTitle className="text-2xl text-primary">
            <span className="font-extralight">Emergency Process: </span>
            <span className="font-medium">Terminal Guide</span>
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={() => setIsDialogOpen(false)}>
            <X className="size-6 text-primary stroke-[1]" />
          </Button>
        </DialogHeader>

        <div className="mt-4 space-y-4 flex-1 flex flex-col overflow-y-auto pr-2 -mr-2">
          <div className="w-full rounded-3xl border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium">Prerequisites</h3>
              <span className="text-xs text-muted-foreground">
                (Node.js v22.16.0+ & npm v10.9.2+)
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Install Node.js from{" "}
                <a
                  href="https://nodejs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  nodejs.org
                </a>{" "}
                if needed
              </p>
              <p className="text-sm text-muted-foreground">
                Run this command in your terminal to check your Node.js and npm versions:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <div className="bg-slate-100 p-2 rounded-lg flex items-center justify-between group">
                    <code className="text-sm">node --version</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard("node --version")}
                    >
                      {copiedCommand === "node --version" ? (
                        <Check className="size-3 text-green-600" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="bg-slate-100 p-2 rounded-lg flex items-center justify-between group">
                    <code className="text-sm">npm --version</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard("npm --version")}
                    >
                      {copiedCommand === "npm --version" ? (
                        <Check className="size-3 text-green-600" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full rounded-3xl border bg-card p-4 space-y-3">
            <h3 className="text-lg font-medium">Run Emergency Tool</h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Run this command in your terminal:</p>
                <div className="bg-slate-100 p-2 rounded-lg flex items-center justify-between group">
                  <code className="text-sm">npx @wakeuplabs/arbitrum-connect@latest</code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => copyToClipboard("npx @wakeuplabs/arbitrum-connect@latest")}
                  >
                    {copiedCommand === "npx @wakeuplabs/arbitrum-connect@latest" ? (
                      <Check className="size-3 text-green-600" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Then follow these steps:</p>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li className="pl-2">
                    <span className="font-medium">Connect your wallet</span> - Select or add your
                    wallet
                  </li>
                  <li className="pl-2">
                    <span className="font-medium">Enter your private key</span> - Must start with
                    &quot;0x&quot;
                  </li>
                  <li className="pl-2">
                    <span className="font-medium">Initiate a new withdrawal</span> - Follow the
                    prompts
                  </li>
                </ol>
              </div>
            </div>
          </div>

          <div className="p-3 text-sm text-center rounded-lg bg-blue-50 text-blue-900">
            <p className="font-medium">Need help?</p>
            <p className="font-extralight">
              Visit our{" "}
              <a
                href={envParsed().DOCS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                documentation
              </a>
            </p>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button
            onClick={() => setIsDialogOpen(false)}
            className="w-full bg-blue-500 text-white hover:bg-blue-400"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
