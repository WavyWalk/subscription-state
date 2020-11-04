import {useMemo} from "react"
import React from "react"
import {SampleProvidableState} from "../../state/SampleProvidableState"
import {TestStats} from "../../state/TestStats"

export const ProvidedSubChild = ({state, stats}: {state: SampleProvidableState, stats: TestStats}) => {

    state.use()
    stats.subChildRendered += 1

    return <div>
        <p>SubChild</p>
        <p>name: {state.name}, email: {state.email}</p>
        <div id="bName">
            {state.name}
        </div>
        <div id="bEmail">
            {state.email}
        </div>
        <button
            onClick={()=>{
                state.name = "name Subchild"
                state.dispatch()
            }}
        >
            update
        </button>
    </div>

}