import {SampleState} from "../state/SampleState"
import {sampleProvidableState} from "../state/SampleProvidableState"
import {TestStats} from "../state/TestStats"
import React from "react"
import {SubChild} from "./SubChild"

export const A = ({sampleState, stats}: {sampleState: SampleState, stats: TestStats}) => {

    stats.aRendered += 1

    const state = sampleState.use({
        makeSnapshot: (it)=>{return {name: it.name}},
        shouldUpdate: (it, snapShot) => {
            return it.name !== snapShot.name
        }
    })

    return <div>
        <p>A</p>
        <p>name: {state.name}, email: {state.email}</p>
        <div id="aName">
            {state.name}
        </div>
        <div id="aEmail">
            {state.email}
        </div>
        <SubChild stats={stats} state={state}/>
        <button
            onClick={()=>{
                state.name = "name A"
                state.update()
            }}
        >
            update
        </button>
    </div>

}