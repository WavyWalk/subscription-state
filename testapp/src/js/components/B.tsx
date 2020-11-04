import {SampleState, sampleState} from "../state/SampleState"
import {sampleProvidableState} from "../state/SampleProvidableState"
import {TestStats} from "../state/TestStats"
import {useMemo} from "react"
import React from "react"

export const B = ({sampleState, stats}: {sampleState: SampleState, stats: TestStats}) => {

    const state = sampleState.use()
    stats.bRendered += 1

    return <div>
        <p>A</p>
        <p>name: {state.name}, email: {state.email}</p>
        <div id="bName">
            {state.name}
        </div>
        <div id="bEmail">
            {state.email}
        </div>
        <button
            onClick={()=>{
                state.name = "name B"
                state.update()
            }}
        >
            update
        </button>
    </div>

}