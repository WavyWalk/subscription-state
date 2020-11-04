* [whats it](#what-is-it)
* [why](#why)
* [how](#How)
* [optimizations](#optimizations)
* [immutability](#immutability)
* [Bonus](#Bonus)

# what is it 
Yet another react state management micro lib.

# why
Let's imagine we know nothing of react, and we just got a ticket to share some counter between two components in header and footer,
our intuition will tell is something like this: 
```typescript jsx
class MyState {
    
    counter = 0
    
    incrementCounter() {
        counter += 1
    }   
}
```
looking at class above you just immediately get your head around the code because it's pretty straightforward.
And let's imagine that we use `Mystate#counter` in several components and wherever we call `incrementCounter` we expect our components to update.
like:
```typescript jsx
const myState = new MyState()

const Foo = () => {
    return <div>
        {myState.counter}
        <button onClick={()=>{myState.incrementCounter()}}>
            increment
        </button>
    </div>
}

const Bar = () => {
    return <div>
        {myState.counter}
    </div>
}
```  
although it would not work (but let's imagine it is working), for any programmer the thing above is self explainable,
and if one would not even know React, he could read the code and just assume what will happen.

But unfortunately there is no such thing, to implement the minimal sample as above we'll have to
do quite a work. Let's say we use redux for that, and for a single property it begins: 
we want to impress our colleagues don't we?:
stores, reducers, hocs, writing hundreds lines, and etc.
if we want anything async, or state depending on another state, or some synchronization between them, 
say goodbye to sanity and wish best of luck to whom will maintain it afterwards. (though in some cases such ceremony is ok and even necessary).

This lib allows you to do pragmatic state management and at the same time allow you to write it in any style you want.

# How
just define your state as follows:

```typescript jsx
class Counter extends SubscriptionState {

    static instance = new Counter() // let's make a singleton for brevity.
    
    counter = 0
    
    incrementCounter() {
        this.counter += 1
        this.update() // will update all subscribed components
    }
    
    // async example
    async incrementCounterAsync() {
        this.counter = await SomeCounterService.increment()
        this.update() 
    }    

}
```
to make it work your state class should only do two things: 
extend from `SubscriptionState`, 
in any method you wish subscribed components to update - call `this.update()`

now lets rewrite the initial example:
```typescript jsx

const Foo = () => {
    const counterState = MyState.instance.use() // <=== that's the only thing you should do in your component to make it work
    return <div>
        {counterState.counter}
        <button onClick={()=>{counterState.incrementCounter()}}>
            increment
        </button>
    </div>
}
const Bar = () => {
    const counterState = MyState.instance.use() 
    
    return <div>
        {counterState.counter}
        <button
            onClick={()=>{counterState.incrementCounterAsync()}}
        >
            inrement async
        </button>
    </div>
}
```
and it will just work. Whenever you'll press a button all components that `.use()` your `myState`, will update.
 
With minimal intervention, you have explicit, easy to implement and to maintain state. You just write it in standard OOP way.

Recap, you call `${yourStateClassInstance}.use()` in your component, and it will subscribe to the state. Whenever `update()` is called in your
state class all the subscribed components will be updated. On unmount, component will be automatically be unsubscribed.

you may pass an instance around or have a singleton for "global" state

# optimizations

lib handles the cases for nested subscribed components insuring that they will always be rendered once for each state version.
So e.g. if you use context, and some of the child of context user is also uses same context, it be rendered for each time parent rendered,
plus own renders, this lib excludes such cases.

for niche cases you can as well pass following options to have fine-grained control over the update
```typescript jsx
const myComp = () => {
    
    const myState = YourState.instance.use({
        makeSnapShot: (state)=>{return {counter: state.counter}}, // make snapshot of data used by this component, it will be yielded in next update and be made on each update
        shouldUpdate: (state, snapshot)=>{ // will yield last snapshot? made by makeSnapshot
            return state.counter !== snapshot.counter //: boolean, component will be updated only if true was returned
        },
        afterUnsubscribed = () => {
            //do here any cleanup or any logic you want to run when 
        }       
    })    
    return <div>foo {myState.foo}</div>
}

//all options are optional
```

almost real world example:

```typescript jsx
class UsersState extends SubscriptionState {
    
    users?: User[]    

    async loadUsers() {
        this.users = await User.fetchUsers()
        this.update()
    }
}

export const myStateInstance = new MyState()

const UsersIndex = () => {
    
    const myState = myStateInstance.use()

    useEffect(()=>{
        myState.loadUsers()
    }, [])
    
    if (!myState.users) {
        return <p>loading</p>
    }
    return <div>
        {myState.users.map((user)=>{
            <p key={user.id}>{user.name}</p>
        })}       
    </div>
}

const UserAddressIndex = () => {
    const myState = myStateInstance.use()

    return <div>
        {myState.users?.map((user)=>{
            <p key={user.address.id}>{user.address.city}</p>
        })}       
    </div>
}
```
in above example, after users loaded it will update both `UsersIndex` and `UserAddressIndex`

# immutability

lib doesn't stand in your way and has no opinions how you use it at all. 

E.g. it allows to not only have primitive objects in state, but instances of classes and etc.

as well if you want immutability, and e.g. state versioning aka time machine debugging0 : 
```typescript
export class SampleState extends SubscriptionState {

    data = {name: 'joe', id: 3}
    
    history = []
    
    setName(name: string) {
        this.history.push(this.data) // if you want e.g. versioning for debugging etc.
        this.data = {...this.data, ...{name}} //do it immutable way
        this.update()
    }
    
}
```

# can i use it in prod?

if you feel adventurous.

lib was used in quite big SPAs with over 9000 hardcore state management related problems, so it's battle tested.

and it just fun to play around with it.

without comments and whitespace it's < 50 lines.

# Bonus
if lib looks strange it includes a bonus `ProvidableState` which shares almost same interface and behaves almost same,
but uses react's context underhood.

Absolutely no magic, just oopified context usage.

```typescript
export class SampleProvidableState extends ProvidableState {

    name = "bar"

    setName(value: string) {
        this.name = value
        this.dispatch()
    }

}

const state = new SampleProvidableState()

const Foo = () => {
    state.use()
    return <p>state.name</p>    
}

const Bar = () => {
    <button
        onclick={()=>{state.setName("joe")}}
    >change</button>
}

const App = () => {
    return <providableState.provider>
        <Foo/>
    </providableState.provider>    
}
```

# how it works

see SubscriptionState#use() doc comments

# licence
MIT