import { useMemo, type JSX } from "react";

import Tooltip from "../../../components/Tooltip";

import { classes } from "../../../utils/classes";

export interface ButtonsOption {
  key: string;
  type: "primary" | "secondary";
  icon: (props: { size: number; className?: string }) => JSX.Element;
  title: string;
}

type ButtonsOptions = Readonly<ButtonsOption[]>;

interface ButtonsProps<T extends ButtonsOptions> {
  options: T;
  onClick: (key: T[number]["key"] | "") => void;
  active?: string;
}

export default function Buttons<T extends ButtonsOptions = ButtonsOptions>(
  props: ButtonsProps<T>,
) {
  const { options, onClick, active } = props;

  // Add onClick handlers to each, sort by primary/secondary (using current order as tiebreaker)
  const optionsWithOnClick = useMemo(
    () =>
      options
        .map((option) => ({
          ...option,
          onClick: () => onClick(active === option.key ? "" : option.key),
          active: active === option.key,
        }))
        .sort((a, b) => {
          if (a.type === b.type) return 0;
          return a.type === "primary" ? -1 : 1;
        }),
    [options, onClick, active],
  );

  return (
    <div className="z-10 mt-12 flex flex-col gap-4">
      {optionsWithOnClick.map((option, idx) => (
        <Tooltip key={option.key} text={option.title}>
          <button
            onClick={option.onClick}
            className={classes(
              "flex cursor-pointer items-center justify-center rounded-lg bg-alveus-green p-2 shadow-sm outline-highlight transition-[outline,filter] hover:outline-3 hover:brightness-125 focus:outline-3",
              option.type === "primary" ? "h-16 w-16" : "h-12 w-12",
              option.active && "outline-3",
              // If the previous type is not the same, add a margin
              idx > 0 &&
                optionsWithOnClick[idx - 1]!.type !== option.type &&
                "mt-auto",
            )}
          >
            <option.icon
              size={option.type === "primary" ? 48 : 32}
              className="h-full w-full"
            />
          </button>
        </Tooltip>
      ))}
    </div>
  );
}
