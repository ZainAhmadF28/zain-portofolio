import { cn } from "../lib/utils";
import { AnimatedGradientText } from "./animate-gradient-text";
import { ChevronRight } from "lucide-react";

export function AnimatedGradientTextDemo() {
  return (
    <div className="group relative inline-flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">
      <span
        className={cn(
          "absolute inset-0 block h-full w-50 animate-gradient rounded-[inherit] bg-gradient-to-r from-[#4053ff]/50 via-[#40ecff]/50 to-[#4053ff]/50 bg-[length:300%_100%] p-[1px]"
        )}
        style={{
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "destination-out",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "subtract",
          WebkitClipPath: "padding-box",
        }}
      />
      ✨
      <AnimatedGradientText
        className="text-sm font-medium"
        colorFrom="#4053ffff"
        colorTo="#40ecffff"
      >
        Innovation For the Future
      </AnimatedGradientText>
      <ChevronRight
        className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5"
      />
    </div>
  );
}