import {
  interpolate,
  wcagContrast,
  Oklch,
  Color,
  rgb,
  formatHex,
  parse,
} from "culori";
import { Theme } from "@/lib/themes";
import { ColorSchema } from "@/lib/validation/theme-schema";
import * as z from "zod";

const isDark = (color: Color | string) => {
  try {
    if (wcagContrast(color, "black") < wcagContrast(color, "white")) {
      return true;
    }
    return false;
  } catch {
    // colorIsInvalid(color)
    return false;
  }
};

export const generateForegroundColorFrom = function (
  input: Color | string,
  percentage = 0.8
) {
  const result = interpolate(
    [input, isDark(input) ? "white" : "black"],
    "oklch"
  )(percentage);
  return colorObjToString(result);
};

export const colorObjToString = function (input: Oklch) {
  const rbgColor = rgb(input);

  return `${formatHex(rbgColor)}`;
};

export type Colors = z.infer<typeof ColorSchema>;

type Pallette = {
  [colorName: string]: Colors;
};

export function ThemeToColors(theme: Theme): {
  primary: string;
  secondary: string;
  background: string;
} {
  return {
    // Simplification of Daisy UI color scheme
    primary:
      (theme["primary"] && formatHex(parse(theme["primary"]))) ||
      generateForegroundColorFrom(theme.primary),
    secondary: generateForegroundColorFrom(theme["base-100"]),
    background: formatHex(parse(theme["base-100"])) || theme["base-100"],
  };
}

export function CreateColorPallette(theme: Theme): Pallette {
  const colorNames = Object.keys(theme).filter((key) => key.includes("-"));
  const pallette: Pallette = {};

  for (const colorName of colorNames) {
    const baseColor = colorName.split("-")[0];
    const colorValue = theme[colorName as keyof Theme];

    if (colorValue) {
      pallette[baseColor] = {
        ...pallette[baseColor],
        [colorName.split("-")[1]]: colorValue,
      };
    }
  }

  return pallette;
}
