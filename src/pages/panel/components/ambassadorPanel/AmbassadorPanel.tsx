//components & hooks
import { useState, useCallback, Fragment } from 'react'
import AmbassadorButton from '../../../../utils/global/ambassadorButton/AmbassadorButton'
import AmbassadorCardOverlay from '../ambassadorCardOverlay/AmbassadorCardOverlay'
import useChatCommand from '../../../../utils/chatCommand'

//css
import styles from './ambassadorPanel.module.css'

//data
import { sortedAmbassadors, isAmbassadorKey, type AmbassadorKey } from '../../../../utils/ambassdaors'

export default function AmbassadorPanel() {
  // Allow chat commands to select an ambassador, as well as the user
  const [ambassadorCard, setAmbassadorCard] = useState<AmbassadorKey>()
  useChatCommand(useCallback((command: string) => {
    if (isAmbassadorKey(command))
      setAmbassadorCard(command)
  }, []))

  return (
    <main className={styles.ambassadors}>
      {sortedAmbassadors.map(([key, ambassador]) => (
        <Fragment key={key}>
          {ambassadorCard === key && (
            <AmbassadorCardOverlay
              ambassadorCard={{ ambassadorKey: key, ambassador }}
              close={() => setAmbassadorCard(undefined)}
            />
          )}

          <AmbassadorButton
            ambassadorKey={key}
            ambassador={ambassador}
            ClassName={styles.item}
            getCard={() => setAmbassadorCard(key)}
          />
        </Fragment>
      ))}
    </main>
  )
}
