import {MutableRefObject, useEffect, useMemo, useRef, useState} from "react"

type ISubscribeOptions<THIS_T> = {
    makeSnapshot?: (state: THIS_T)=>any,
    afterUnsubscribed?: ()=>any,
    shouldUpdate?: (state: THIS_T, snapshot?: any)=>boolean,
}

type IUpdateStateFunc = (...args: any) => any

interface ISubscribedEntry extends ISubscribeOptions<any> {
    updateState: IUpdateStateFunc,
    snapshot?: any,
    lastVersion: number
}

/**
 * subscribes components calling use() on instance of it,
 * anytime update is called will rerender each subscribed component.
 * on component unmount, the component will automatically be unsubscribed.
 *
 * @see use
 */
export class SubscriptionState {

    /**
     * state version be incremented on each trigger update
     * each time component renders, it's entry be updated with the version of this state.
     * when it comes to decision if component should be updated,
     * the version of update be compared to last rendered version,
     * if they're same, or rendered version is bigger than state version it will be skipped.
     * effectively this insures that component be updated exactly once for each version, preventing
     * rerendering for e.g. nested components subscribed for same state.
     */
    protected version = 0

    /**
     * tracks last subscribed component key reference,
     * each time component subscribes value be incremented, and such incremented value be used
     * as key under which component will be subscribed
     */
    protected lastSubscribedComponentKey = 0

    /**
     * will use
     * @see lastSubscribedComponentKey
     * and put under it
     * @see ISubscribedEntry
     */
    protected subscribedEntries: { [key: number]: ISubscribedEntry } = {}

    /**
     * subscribes component to this state represented by extending instance,
     * behind the scenes will call useState using {state: this} as it's initial state.
     * the updateState from called useState and supplied options,
     * will be stored under generated key on subscribed entries (simple object on this instance),
     * any time update is called, all entries be traversed and corresponding
     * update func be called, leading to update.
     * on unmound entry will be deleted by the key it was subscribed under.
     *
     * as options may be passed:
     *
     * shouldUpdate: function with this, and optional state snapshot, if returns false, update be skipped,
     *
     * makeSnapshot: function with this arg, will be called on each new update, where data used for shouldUpdate be
     * used, last calls return value will be yielded to should update along with this.
     *
     * afterUnsubscribed: any cleanup function.
     *
     * e.g.
     * someState.use({
     *     makeSnapshot: (state)=>{return {name: state.name}},
     *     shouldUpdate: (state, snapshot)=>{return state.name !== snapshot.name}
     * })
     * options are optional
     */
    public use(options?: ISubscribeOptions<this>): this {
        /**
         * {this: state} is object, due to that updateState be called with same literal, will always be considered
         * by react as new state (if just pass this, react ignore it because than this will be === this).
         * the update function for calling component be stored in corresponding entry and be called on update
         * */
        let [{state}, updateState] = useState({state: this})

        let id = useMemo(()=>{
                /** increment internal last key and return it */
                const id = this.getNextSubscribedComponentId()
                /** will write entry with updateState func under generated key */
                this.subscribe(id, updateState, options)
                return id
            }, []
        )

        /**
         * because use runs on each render, the entry of this object on state be updated with the version of state
         * existing at the moment of render, later that version be used to prevent unnecessary rerenders.
         * */
        this.subscribedEntries[id].lastVersion = this.version

        useEffect(() => {
            return () => {
                /** removes entry under the key */
                this.unsubscribe(id)
                /** your cleanup func if provided */
                options?.afterUnsubscribed?.()
            }
        }, [])
        return this
    }

    /**
     * takes next unoccupied key, and puts
     * @see ISubscribedEntry
     * under it in
     * @see subscribedEntries
     */
    private subscribe = (
        id: number,
        updateState: (...args: any)=>any,
        options?: ISubscribeOptions<this>,
    ) => {
        this.subscribedEntries[id] = {
            updateState,
            snapshot: options?.makeSnapshot?.(this),
            lastVersion: this.version,
            ...options,
        }
    }

    protected getNextSubscribedComponentId() {
        return this.lastSubscribedComponentKey += 1
    }

    protected unsubscribe(id: number) {
        delete this.subscribedEntries[id]
    }

    private incrementVersion() {
        this.version += 1
        return this.version
    }

    /**
     * exists for cases when you need to override it.
     */
    update = () => {
        this._update()
    }

    protected _update() {
        /** increment the version, the value be used for should update logic */
        this.incrementVersion()

        /** not just "this", because otherwise react ignore it, we need a new object */
        const stateValue = {state: this}

        for (let id of Object.keys(this.subscribedEntries)) {

            const subscribedEntry = this.subscribedEntries[id as any]
            const {shouldUpdate, snapshot, makeSnapshot, lastVersion, updateState} = subscribedEntry

            /** if component was already rendered with this version - ignore (e.g. was rendered as child of parent which
             * subscribed to same state) */
            if (lastVersion >= this.version) {
                continue
            }

            /** if should update option was provided on use() and returns false - ignore rerender */
            if (shouldUpdate && !shouldUpdate(this, snapshot)) {
                continue
            }

            /** make user defined snapshot of current state for later comparison in should update
             * and store it on entry
             * */
            subscribedEntry.snapshot = makeSnapshot?.(this)

            updateState(stateValue)
        }

    }

}