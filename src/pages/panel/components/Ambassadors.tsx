import { useState, useCallback, Fragment, useMemo } from "react";

import AmbassadorCard from "../../../components/AmbassadorCard";
import AmbassadorButton from "../../../components/AmbassadorButton";

import { useAmbassadors } from "../../../hooks/useAmbassadors";

import useChatCommand from "../../../hooks/useChatCommand";
import { typeSafeObjectEntries } from "../../../utils/helpers";

import Overlay from "./Overlay";

export default function Ambassadors() {
  const rawAmbassadors = useAmbassadors();
  const ambassadors = useMemo(
    () => typeSafeObjectEntries(rawAmbassadors ?? {}),
    [rawAmbassadors],
  );

  // Allow chat commands to select an ambassador, as well as the user
  const [ambassadorCard, setAmbassadorCard] = useState<string>();
  useChatCommand(
    useCallback(
      (command: string) => {
        if (Object.keys(rawAmbassadors ?? {}).includes(command))
          setAmbassadorCard(command);
      },
      [rawAmbassadors],
    ),
  );

  return (
    <main className="relative scrollbar flex max-h-full flex-wrap justify-center gap-4 overflow-x-hidden overflow-y-auto px-2 pt-16 pb-4 scrollbar-thumb-alveus-green scrollbar-track-alveus-tan md:px-4">
      <div className="absolute inset-x-0 top-0 h-12 w-screen bg-alveus-green" />

      {ambassadors.map(([key]) => (
        <Fragment key={key}>
          <Overlay
            show={ambassadorCard === key}
            onClose={() => setAmbassadorCard(undefined)}
          >
            <AmbassadorCard
              ambassador={key}
              onClose={() => setAmbassadorCard(undefined)}
            />
          </Overlay>

          <AmbassadorButton
            ambassador={key}
            onClick={() => setAmbassadorCard(key)}
            className="w-32 max-w-full md:w-48"
          />
        </Fragment>
      ))}
    </main>
  );
}
