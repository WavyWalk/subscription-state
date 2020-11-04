import {ProvidableState} from "subscription-state"

export class SampleProvidableState extends ProvidableState {

    name = "bar"
    email = "doe"

    setName(value: string) {
        this.name = value
        this.dispatch()
    }

}

export const sampleProvidableState = new SampleProvidableState()