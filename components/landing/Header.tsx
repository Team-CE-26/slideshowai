import { Logo } from "./Logo";
import { Button } from "../ui/Button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Logo />
        <Button href="/dashboard" size="md">
          Get Started
        </Button>
      </div>
    </header>
  );
}
