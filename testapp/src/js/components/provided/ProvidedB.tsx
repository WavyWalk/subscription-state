import React from "react"
import {ProvidableState} from "../../../../../src/ProvidableState"
import {TestStats} from "../../state/TestStats"
import {SampleProvidableState} from "../../state/SampleProvidableState"
import {SubChild} from "../SubChild"
import {ProvidedSubChild} from "./ProvidedSubchild"

export const ProvidedB = ({sampleState, stats}: { sampleState: SampleProvidableState, stats: TestStats }) => {

    stats.bRendered += 1

    const state = sampleState.use()

    return <div>
        <p>B</p>
        <p>name: {state.name}, email: {state.email}</p>
        <div id="aName">
            {state.name}
        </div>
        <div id="aEmail">
            {state.email}
        </div>
        <ProvidedSubChild stats={stats} state={state}/>
        <button
            onClick={() => {
                state.name = "name B"
                state.dispatch()
            }}
        >
            update
        </button>
    </div>

}