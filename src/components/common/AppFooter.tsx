import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

function AppFooter() {
  return (
    <footer className="w-full flex flex-col items-center justify-center">
      <div className="w-full max-w-[1328px] flex flex-col gap-6 p-6 pb-18">
        <Separator />
        <div className="w-full flex flex-col items-start justify-between gap-12 md:flex-row md:gap-0">
          <div className="h-full flex flex-col justify-between">
            <div className="flex flex-col">
              <p className="h-10 text-base font-semibold">Contact</p>
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2">
                  <img src="/assets/icons/google.svg" alt="@GOOGLE-LOGO" className="w-4 h-4 brightness-0 dark:invert" />
                  <a href="mailto:ehdclr@gmail.com" target="_blank" rel="noopener noreferrer">
                    ehdclr@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <img src="/assets/icons/github.svg" alt="GitHub" className="w-4 h-4 brightness-0 dark:invert" />
                  <a href="https://github.com/ehdclr" target="_blank" rel="noopener noreferrer">
                    https://github.com/ehdclr
                  </a>
                </div>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">@Developer, Jong all rights reserved</p>
        </div>
      </div>
    </footer>
  );
}

export { AppFooter };
