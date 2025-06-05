import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { ChainSelectorProps } from "@/hoc/useChainSelector";
import { ChevronDown, CircleArrowRight, Info, Search, X } from "lucide-react";

export default function ChainSelector({
  childChain,
  setChildChain,
  parentChain,
  isOpen,
  setIsOpen,
  search,
  setSearch,
  showTestnets,
  setShowTestnets,
  filteredFeaturedChains,
  filteredOrbitChains,
}: ChainSelectorProps) {
  return (
    <section className="flex items-center gap-4 rounded-2xl border bg-card p-4 w-full flex-wrap">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="flex-1 flex items-center justify-between gap-2 border-0 bg-white hover:bg-accent p-8"
            onClick={() => setSearch("")}
          >
            <div className="flex items-center gap-2 w-full">
              <img
                src={childChain.bridgeUiConfig.network.logo}
                alt={childChain.name}
                className="size-8 self-start mt-1"
              />
              <div className="flex flex-col items-start w-full">
                <span className="text-xs text-muted-foreground">From</span>
                <div className="flex items-center gap-2 w-full justify-between">
                  <span className="font-medium text-2xl text-primary">{childChain.name}</span>
                  <ChevronDown className="size-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl sm:h-3/4 flex flex-col" hideCloseButton>
          <DialogHeader className="flex flex-row justify-between">
            <DialogTitle className="text-2xl text-primary">
              <span className="font-extralight">Selected Chain: </span>
              <span className="font-medium">{childChain.name}</span>
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="size-6 text-primary stroke-[1]" />
            </Button>
          </DialogHeader>

          <div className="mt-6 space-y-6 flex-1 flex flex-col">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-primary" />
                <Input
                  placeholder="Search"
                  className="pr-10 rounded-full"
                  value={search}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extralight text-muted-foreground">
                  Enable Testnets
                </span>
                <Switch checked={showTestnets} onCheckedChange={setShowTestnets} />
              </div>
            </div>

            <div className="space-y-6 overflow-y-auto flex-1">
              {filteredFeaturedChains.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-extralight text-primary bg-neutral-100 py-2 px-4 border-y-[1px]">
                    Featured
                  </h3>
                  <div className="space-y-1 px-1">
                    {filteredFeaturedChains.map((chain) => (
                      <Button
                        key={chain.chainId}
                        variant="ghost"
                        className="w-full flex items-center justify-start gap-2 p-3 h-auto"
                        onClick={() => {
                          setChildChain(chain);
                          setIsOpen(false);
                        }}
                      >
                        <img
                          src={chain.bridgeUiConfig.network.logo}
                          alt={chain.name}
                          className="size-8"
                        />
                        <span className="font-normal">{chain.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {filteredOrbitChains.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 bg-neutral-100 py-2 px-4 border-y-[1px]">
                    <h3 className="text-sm font-extralight text-primary">Orbit Chains</h3>
                    <Popover>
                      <PopoverTrigger>
                        <Info className="size-4 text-muted-foreground hover:text-primary transition-colors" />
                      </PopoverTrigger>
                      <PopoverContent className="w-48" side="bottom">
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">
                            External chains not maintained by Arbitrum.
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Please bridge with caution.
                          </p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-1 max-h-[240px] px-1">
                    {filteredOrbitChains.map((chain) => (
                      <Button
                        key={chain.chainId}
                        variant="ghost"
                        className="w-full flex items-center justify-start gap-2 p-3 h-auto"
                        onClick={() => {
                          setChildChain(chain);
                          setIsOpen(false);
                        }}
                      >
                        <img
                          src={chain.bridgeUiConfig.network.logo}
                          alt={chain.name}
                          className="size-8"
                        />
                        <span className="font-normal">{chain.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {filteredFeaturedChains.length === 0 && filteredOrbitChains.length === 0 && (
                <div className="text-sm font-extralight text-primary">No chains found</div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CircleArrowRight className="size-8 text-primary hidden sm:block stroke-[1]" />

      <div className="flex-1 flex w-full items-center justify-between gap-2 border-0 bg-white px-8 py-6">
        <div className="flex items-center gap-2">
          <img
            src={parentChain?.bridgeUiConfig.network.logo}
            alt={parentChain?.name}
            className="size-8 self-start mt-1"
          />
          <div className="flex flex-col items-start">
            <span className="text-xs text-muted-foreground">To</span>
            <span className="font-medium text-2xl text-primary">{parentChain?.name}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
