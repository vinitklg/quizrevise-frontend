import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
export function ThemeToggle() {
    var _a = useTheme(), theme = _a.theme, setTheme = _a.setTheme;
    return (<Button variant="ghost" size="icon" onClick={function () { return setTheme(theme === "dark" ? "light" : "dark"); }} aria-label="Toggle theme">
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"/>
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"/>
      <span className="sr-only">Toggle theme</span>
    </Button>);
}
