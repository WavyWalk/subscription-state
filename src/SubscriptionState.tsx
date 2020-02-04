import {MutableRefObject, useEffect, useMemo, useRef, useState} from "react"

export class SubscriptionState {

    protected lastSubscribedComponentId = 0

    protected subscribedComponents: { [id: number]: any } = {}

    private generateIdAndSubscribe = (
        updateState: (...args: any)=>any,
        options?: {
            afterUnsubscribed?: ()=>any,
            shouldUpdate?: ()=>boolean,
        }
    ) => {
        const id = this.getNextSubscribedComponentId()
        this.subscribedComponents[id] = {
            updateState,
            ...options
        }
        return id
    }

    public use(options?: {
        afterUnsubscribed?: ()=>void,
        shouldUpdate?: () => boolean,
    }): this {
        let [{state}, updateState] = useState({state: this})
        let id = useMemo(()=>{return this.generateIdAndSubscribe(updateState, options)},[])
        useEffect(() => {
            return () => {
                this.unsubscribe(id)
                options?.afterUnsubscribed?.()
            }
        }, [])
        return this
    }

    protected getNextSubscribedComponentId() {
        return this.lastSubscribedComponentId += 1
    }

    protected subscribe(id: number, updateFunction: any) {
        this.subscribedComponents[id] = updateFunction
    }

    protected unsubscribe(id: number) {
        delete this.subscribedComponents[id]
    }

    protected updateSubscribedComponents = () => {
        const stateValue = {state: this}
        for (let id of Object.keys(this.subscribedComponents)) {
            const updateFunction = this.subscribedComponents[id as any]
            if (updateFunction?.shouldUpdate?.() ?? true) {
                updateFunction?.updateState(stateValue)
            }
        }
    }

    triggerUpdate = () => {
        this.updateSubscribedComponents()
    }
}
