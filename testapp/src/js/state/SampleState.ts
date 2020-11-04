import {SubscriptionState} from "subscription-state"

export class SampleState extends SubscriptionState {

    name?: string
    email?: string

}

export const sampleState = new SampleState()