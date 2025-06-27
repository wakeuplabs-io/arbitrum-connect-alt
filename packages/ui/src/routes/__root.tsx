import ConnectWallet from "@/components/connect-wallet";
import { Button } from "@/components/ui/button";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { Bell, Home, Heart } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

export const Route = createRootRoute({
  component: () => (
    <div className="h-screen flex flex-col items-center">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-background/40 backdrop-blur-sm z-10">
        <div className="flex w-full max-w-screen-xl gap-6 items-center p-6 mx-auto">
          <Link to="/" className="min-w-8">
            <img
              src="/logo-large.svg"
              alt="Arbitrum Connect"
              className="h-8 min-w-64 hidden sm:block"
            />
            <img src="/logo-small.svg" alt="Arbitrum Connect" className="size-8 sm:hidden" />
          </Link>

          <section className="flex items-center gap-6 flex-1 justify-end">
            <Button variant="outline" asChild>
              <Link to="/" className="[&.active]:font-bold w-full max-w-12 sm:max-w-[12rem]">
                <Home className="size-6" />
                <span className="hidden sm:block">Home</span>
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link
                to="/activity"
                className="[&.active]:font-bold w-full max-w-12 sm:max-w-[12rem]"
              >
                <Bell className="size-6" />
                <span className="hidden sm:block">My Activity</span>
              </Link>
            </Button>
            <ConnectWallet className="w-full max-w-12 sm:max-w-[12rem]" />
          </section>
        </div>
      </header>

      {/* Main content */}
      <main className="flex w-full max-w-screen-xl flex-col pb-32 pt-24">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-background/40 backdrop-blur-sm">
        <div className="flex justify-center items-center py-3 px-6">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with
            <Heart className="size-4 text-red-500 fill-current" />
            by{" "}
            <a
              href="https://www.wakeuplabs.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors underline underline-offset-4 decoration-1 hover:decoration-2"
            >
              WakeUp Labs
            </a>
          </p>
        </div>
      </footer>

      <Toaster position="top-right" richColors />
    </div>
  ),
});
