import { useMemo } from 'react'

import { classes } from '../../../../utils/classes'

import styles from './buttons.module.scss'

type ButtonsOptions = Readonly<{ key: string, title: string, type: "primary" | "secondary", icon: string, hoverText: string }[]>;

interface ButtonsProps<T extends ButtonsOptions> {
  options: T;
  onClick: (key: T[number]["key"] | undefined) => void;
  active?: string;
}

export default function Buttons<T extends ButtonsOptions = ButtonsOptions>(props: ButtonsProps<T>) {
  const { options, onClick, active } = props;

  // Add onClick handlers to each, sort by primary/secondary (using current order as tiebreaker)
  const optionsWithOnClick = useMemo(() => options.map(option => ({
    ...option,
    onClick: () => onClick(active === option.key ? undefined : option.key),
    active: active === option.key,
  })).sort((a, b) => {
    if (a.type === b.type) return 0;
    return a.type === "primary" ? -1 : 1
  }), [options, onClick, active]);

  return (
    <div className={styles.activationButtons}>
      {optionsWithOnClick.map(option => (
        <button
          key={option.key}
          onClick={option.onClick}
          className={classes(option.active && styles.highlighted, option.type === "secondary" && styles.secondary)}
          data-te-toggle="tooltip"
          title={option.hoverText}
        >
          <img src={option.icon} alt={option.title} />
        </button>
      ))}
    </div>
  )
}
