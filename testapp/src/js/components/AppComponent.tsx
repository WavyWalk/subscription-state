import * as React from 'react'
import {stateTests} from "../tests/statetest"
import {useEffect, useMemo, useState} from "react"
import {SampleState, sampleState} from "../state/SampleState"
import {testStats, TestStats} from "../state/TestStats"
import {A} from "./A"
import {B} from "./B"
import {providedStateTest} from "../tests/providedStateTests"
import {SampleProvidableState} from "../state/SampleProvidableState"
import {ProvidedA} from "./provided/ProvidedA"
import {ProvidedB} from "./provided/ProvidedB"


export const AppComponent: React.FC = () => {

    const [started, setStarted] = useState(false)
    const state = useMemo(()=>sampleState, []).use()
    const stats = useMemo(()=>testStats, [])

    const providedState = new SampleProvidableState()
    const providedStats = new TestStats()

    return <div>
        <button
            onClick={()=>{
                stateTests(stats, state,
                    <div>
                        <A stats={stats} sampleState={state}/>
                        <B stats={stats} sampleState={state}/>
                    </div>
                )
            }}
        >
            test subscription state
        </button>

        <button
            onClick={()=>{
                providedStateTest(providedStats, providedState,
                    <div>
                        <providedState.provider>
                            <ProvidedA stats={providedStats} sampleState={providedState}/>
                            <ProvidedB sampleState={providedState} stats={providedStats}/>
                        </providedState.provider>
                    </div>
                )
            }}
        >
            test providable state
        </button>
    </div>

}


