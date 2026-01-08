import { cn } from "@/lib/utils";
import Pager from "./pager";

import BrandPng from "../app/assets/brand.png";

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type MainNavItem = NavItem;

interface MainNavProps {
  className?: string;
  handlePrint?: () => void;
  isPrinting?: boolean;
}

export function MainNav({ className, handlePrint: _handlePrint, isPrinting: _isPrinting }: MainNavProps) {
  return (
    <div
      className={cn(
        "flex gap-4 md:gap-10 justify-between items-center",
        className
      )}
    >
      <div className="flex gap-4">
          {/* <Icons.logo /> */}
          <img
            src={BrandPng}
            width={32}
            height={32}
            className="w-8 h-8"
            alt="Brand"
          />
          <span className="hidden font-bold md:inline-block text-blue-800">
            GrowReach Carousel Generator Tool
          </span>

        {/* <EditorMenubar /> */}
      </div>
      <div className="hidden lg:block">
        <Pager />
      </div>
      <div className="flex gap-2 items-center">
        {/* <div className="hidden md:block">
          <FilenameForm />
        </div> */}
        {/* <Button variant="ghost" size={"icon"} onClick={handlePrint}>
          <div className="flex flex-row gap-1 items-center">
            {isPrinting ? (
              <Loader2Icon className="w-4 h-4 animate-spin" />
            ) : (
              <Download />
            )}
          </div>
        </Button> */}
        {/* <StarOnGithub /> */}
        {/* <Link
          className="block lg:hidden"
          href={"https://github.com/FranciscoMoretti/carousel-generator"}
          target="_blank"
          rel="noreferrer"
        >
          <div
            className={cn(
              buttonVariants({
                variant: "ghost",
              }),
              "w-9 px-0"
            )}
          >
            <Icons.gitHub className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </div>
        </Link> */}
        {/* // TODO: Re-enable your own keys system  */}
        {/* <BringYourKeysDialog
          triggerButton={
            <Button variant="ghost" size={"icon"}>
              <div className="flex flex-row gap-1 items-center">
                <Settings />
              </div>
            </Button>
          }
        /> */}
      </div>
    </div>
  );
}
