import { useCallback, useEffect, useRef, type Ref } from "react";
import type { CreateTypes } from "canvas-confetti";
import Confetti from "react-canvas-confetti";

import { calculateAge, formatDate, isBirthday } from "../utils/dateManager";
import { useAmbassador } from "../hooks/useAmbassadors";
import { camelToKebab } from "../utils/helpers";
import { classes } from "../utils/classes";

import IconInfo from "./icons/IconInfo";

import Tooltip from "./Tooltip";

import moderatorBadge from "../assets/mod.svg";
import partyHat from "../assets/party.svg";

const headingClass = "text-base text-alveus-green-400";

const offsetPosition = (position?: `${number}% ${number}%`) => {
  const [x, y] = (position || "50% 50%").split(" ") as [
    `${number}%`,
    `${number}%`,
  ];

  const yPct = Number(y.replace("%", ""));
  if (yPct <= 50) return `${x} min(calc(${y} + 1.5rem), 0%)`;

  return `${x} ${y}`;
};

const stringifyLifespan = (value: number | { min: number; max: number }) => {
  return typeof value === "number" ? `${value}` : `${value.min}-${value.max}`;
};

export interface AmbassadorCardProps {
  ambassador: string;
  onClose?: () => void;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

export default function AmbassadorCard(props: AmbassadorCardProps) {
  const {
    ambassador: ambassadorKey,
    onClose,
    className,
    ref,
    ...extras
  } = props;
  const ambassador = useAmbassador(ambassadorKey);

  const mod =
    window?.Twitch?.ext?.viewer?.role === "broadcaster" ||
    window?.Twitch?.ext?.viewer?.role === "moderator";

  const birthday = ambassador?.birth && isBirthday(ambassador.birth);
  const age = ambassador?.birth ? calculateAge(ambassador.birth) : "Unknown";
  const birth = ambassador?.birth ? formatDate(ambassador.birth) : "Unknown";

  const internalRef = useRef<HTMLDivElement>(null);
  const callbackRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (ref) {
        if (typeof ref === "function") ref(node);
        else ref.current = node;
      }
      internalRef.current = node;
    },
    [ref],
  );

  const timeout = useRef<NodeJS.Timeout>(null);
  const confettiInit = useCallback(
    ({ confetti }: { confetti: CreateTypes }) => {
      const node = internalRef.current;
      if (
        !node ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        return;

      timeout.current = setTimeout(() => {
        const rect = node.getBoundingClientRect();
        const origin = {
          x: (rect.x + rect.width / 2) / window.innerWidth,
          y: (rect.y + rect.height / 2) / window.innerHeight,
        };

        confetti({
          spread: 26,
          startVelocity: 55,
          origin,
          particleCount: Math.floor(200 * 0.25),
        });
        confetti({
          spread: 60,
          origin,
          particleCount: Math.floor(200 * 0.2),
        });
        confetti({
          spread: 100,
          decay: 0.91,
          scalar: 0.8,
          origin,
          particleCount: Math.floor(200 * 0.35),
        });
        confetti({
          spread: 120,
          startVelocity: 25,
          decay: 0.92,
          scalar: 1.2,
          origin,
          particleCount: Math.floor(200 * 0.1),
        });
        confetti({
          spread: 120,
          startVelocity: 45,
          origin,
          particleCount: Math.floor(200 * 0.1),
        });
      }, 500);
    },
    [origin],
  );
  useEffect(() => () => clearTimeout(timeout.current ?? undefined), []);

  if (!ambassador) return null;

  return (
    <>
      {birthday && <Confetti onInit={confettiInit} />}
      <div
        className={classes(
          "relative flex max-h-full min-h-[min(28rem,100%)] w-80 max-w-full flex-col justify-start rounded-lg bg-alveus-green-900 align-top text-xs shadow-xl",
          className,
        )}
        ref={callbackRef}
        {...extras}
      >
        {birthday && (
          <img
            src={partyHat}
            alt=""
            className="absolute top-0 left-1/2 z-10 h-auto w-16 -translate-x-1/2 -translate-y-[85%]"
          />
        )}
        <div className="relative w-full overflow-hidden rounded-t-lg">
          <img
            className="peer aspect-[2.2] w-full object-cover sm:aspect-[1.8]"
            src={ambassador.image.src}
            alt={ambassador.image.alt}
            style={{
              objectPosition: offsetPosition(ambassador.image.position),
            }}
            loading="lazy"
          />

          <div className="absolute inset-x-0 top-0 flex h-9 w-full bg-alveus-green-900/50 backdrop-blur-xs transition-[opacity,backdrop-filter] peer-hover:opacity-10 peer-hover:backdrop-blur-[calc(var(--blur-xs)/2)]">
            {props.onClose && (
              <button
                className="absolute top-1/2 right-1 block w-8 -translate-y-1/2 cursor-pointer text-center text-2xl transition-colors hover:text-highlight focus:text-highlight"
                onClick={onClose}
                type="button"
                aria-label="Close"
              >
                &times;
              </button>
            )}

            <h2
              className="w-full shrink-0 self-center overflow-hidden py-1 pr-10 pl-2 text-xl text-nowrap overflow-ellipsis"
              title={ambassador.name}
            >
              {ambassador.name}
            </h2>
          </div>
        </div>

        <div className="mb-2 scrollbar-thin flex flex-auto flex-col gap-1 overflow-y-auto p-2 scrollbar-thumb-alveus-green scrollbar-track-alveus-green-900">
          {mod && (
            <div className="flex items-center gap-2">
              <img
                className="h-6 w-6 object-cover"
                src={moderatorBadge}
                alt="Moderator badge"
              />
              <p>
                Show this card to everyone by using{" "}
                <code>!{ambassador.commands[0]}</code> in chat.
              </p>
            </div>
          )}

          <div>
            <h3 className={headingClass}>Species</h3>
            <p>{ambassador.species.name}</p>
            <p>
              <i>{ambassador.species.scientificName}</i>{" "}
              <span className="text-alveus-green-200">
                ({ambassador.species.class.title})
              </span>
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-1 [&>*]:mr-auto">
            <div>
              <h3 className={headingClass}>Sex</h3>
              <p>{ambassador.sex || "Unknown"}</p>
            </div>
            <div>
              <h3 className={headingClass}>Age</h3>
              <p>
                {age[0] === "~" && (
                  <span className="text-base leading-none" title="Approx.">
                    ~
                  </span>
                )}
                {age.slice(age[0] === "~" ? 1 : 0)}
              </p>
            </div>
            <div>
              <h3 className={headingClass}>Birthday</h3>
              <p>
                {birth[0] === "~" && (
                  <span className="text-base leading-none" title="Approx.">
                    ~
                  </span>
                )}
                {birth.slice(birth[0] === "~" ? 1 : 0)}
              </p>
            </div>
          </div>

          <div>
            <h3 className={headingClass}>Story</h3>
            <p>{ambassador.story}</p>
          </div>

          <div>
            <h3 className={headingClass}>Conservation Mission</h3>
            <p>{ambassador.mission}</p>
          </div>

          <div>
            <Tooltip
              text="An objective assessment system for classifying the status of plants, animals, and other organisms threatened with extinction."
              maxWidth="18rem"
              fontSize="0.9rem"
            >
              <div className="inline-flex items-center gap-2">
                <h3 className={headingClass}>Conservation Status</h3>
                <IconInfo
                  size={20}
                  className="rounded-full text-alveus-green-400 outline-highlight transition-[outline] hover:outline-3"
                />
              </div>
            </Tooltip>
            <p>IUCN: {ambassador.species.iucn.title}</p>
          </div>

          <div>
            <h3 className={headingClass}>Native To</h3>
            <p>{ambassador.species.native.text}</p>
          </div>

          <div>
            <h3 className={headingClass}>Species Lifespan</h3>
            <p>
              Wild:{" "}
              {"wild" in ambassador.species.lifespan &&
              ambassador.species.lifespan.wild !== undefined ? (
                <>
                  <span className="text-base leading-none" title="Approx.">
                    ~
                  </span>
                  {stringifyLifespan(ambassador.species.lifespan.wild)} years
                </>
              ) : (
                "Unknown"
              )}
            </p>
            <p>
              Captivity:{" "}
              {"captivity" in ambassador.species.lifespan &&
              ambassador.species.lifespan.captivity !== undefined ? (
                <>
                  <span className="text-base leading-none" title="Approx.">
                    ~
                  </span>
                  {stringifyLifespan(ambassador.species.lifespan.captivity)}{" "}
                  years
                </>
              ) : (
                "Unknown"
              )}
            </p>
          </div>

          <div>
            <h3 className={headingClass}>Arrived at Alveus</h3>
            <p>
              {ambassador.arrival
                ? formatDate(ambassador.arrival, false)
                : "Unknown"}
            </p>
          </div>

          <div className="mt-3 italic">
            <p>
              Learn more about {ambassador.name} on the{" "}
              <a
                href={`https://www.alveussanctuary.org/ambassadors/${camelToKebab(
                  ambassadorKey,
                )}`}
                rel="noreferrer"
                target="_blank"
                className="text-nowrap text-alveus-green-200 underline transition-colors hover:text-highlight focus:text-highlight"
              >
                Alveus Sanctuary website
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
