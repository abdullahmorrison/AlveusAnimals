import { type MouseEventHandler } from "react";

import {
  getAmbassadorImages,
  type AmbassadorKey,
  type Ambassador as AmbassadorType,
} from "../../utils/ambassadors";
import { classes } from "../../utils/classes";

import styles from "./ambassadorButton.module.scss";

interface AmbassadorButtonProps {
  ambassadorKey: AmbassadorKey;
  ambassador: AmbassadorType;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

export default function AmbassadorButton(props: AmbassadorButtonProps) {
  const { ambassadorKey, ambassador, onClick, className } = props;
  const images = getAmbassadorImages(ambassadorKey);

  return (
    <button
      className={classes(styles.ambassador, className)}
      id={ambassadorKey}
      onClick={onClick}
      type="button"
    >
      <img
        className={styles.img}
        src={images[0].src}
        alt={images[0].alt}
        style={{ objectPosition: images[0].position }}
      />

      <div className={styles.info}>
        <h2 className={styles.name}>{ambassador.name}</h2>
        <h3 className={styles.species}>{ambassador.species}</h3>
      </div>
    </button>
  );
}
