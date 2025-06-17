import ConnectWallet from "@/components/connect-wallet";
import { Button } from "@/components/ui/button";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { Bell, Home } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

export const Route = createRootRoute({
  component: () => (
    <div className="w-screen h-screen flex flex-col items-center">
      <div className="flex w-full max-w-screen-xl gap-6 items-center p-6">
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
            <Link to="/activity" className="[&.active]:font-bold w-full max-w-12 sm:max-w-[12rem]">
              <Bell className="size-6" />
              <span className="hidden sm:block">My Activity</span>
            </Link>
          </Button>
          <ConnectWallet className="w-full max-w-12 sm:max-w-[12rem]" />
        </section>
      </div>
      <main className="flex w-full max-w-screen-xl flex-col pb-32">
        <Outlet />
      </main>
      <Toaster position="top-right" richColors />
    </div>
  ),
});
