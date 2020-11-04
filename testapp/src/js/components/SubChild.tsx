import {SampleState, sampleState} from "../state/SampleState"
import {sampleProvidableState} from "../state/SampleProvidableState"
import {testStats, TestStats} from "../state/TestStats"
import {useMemo} from "react"
import React from "react"

export const SubChild = ({state, stats}: {state: SampleState, stats: TestStats}) => {

    state.use()
    stats.subChildRendered += 1

    return <div>
        <p>A</p>
        <p>name: {state.name}, email: {state.email}</p>
        <div id="subChildName">
            {state.name}
        </div>
        <div id="subChildEmail">
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