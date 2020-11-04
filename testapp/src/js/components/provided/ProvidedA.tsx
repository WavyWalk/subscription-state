import React from "react"
import {ProvidableState} from "../../../../../src/ProvidableState"
import {TestStats} from "../../state/TestStats"
import {SampleProvidableState} from "../../state/SampleProvidableState"
import {SubChild} from "../SubChild"
import {ProvidedSubChild} from "./ProvidedSubchild"

export const ProvidedA = ({sampleState, stats}: {sampleState: SampleProvidableState, stats: TestStats}) => {

    stats.aRendered += 1

    const state = sampleState.use()

    return <div>
        <p>A</p>
        <p>name: {state.name}, email: {state.email}</p>
        <div id="aName">
            {state.name}
        </div>
        <div id="aEmail">
            {state.email}
        </div>
        <ProvidedSubChild stats={stats} state={state}/>
        <button
            onClick={()=>{
                state.name = "name A"
                state.dispatch()
            }}
        >
            update
        </button>
    </div>

}