import {sampleState, SampleState} from "./SampleState"

export class TestStats {

    static id = 0

    id: number

    subChildRendered = 0
    aRendered = 0
    bRendered = 0

    constructor() {
        TestStats.id += 1
        this.id = TestStats.id
    }

    resetRenderCount() {
        this.aRendered = 0
        this.bRendered = 0
        this.subChildRendered = 0
    }

}


export const testStats = new TestStats()