# what is it? 
Yet another state management micro lib.
# why
Did you ever wonder, why, in order to share 
one single value for state between components you have to write a crazy bunch of unreadable code? 

Let's imagine an ideal most straightforward way of state management: 
```typescript jsx
class MyState {
    
    counter = 0
    
    incrementCounter() {
        counter += 1
    }   
}
```
looking at class above you just immediately get your head around the code. It's just a natural construct.
And let's imagine that we use `Mystate#counter` in several components and wherever we call `incrementCounter` our components update.
like:
```typescript jsx
cosnt myState = new MyState()

const foo = () => {
    return <div>
        {myState.counter}
        <button onClick={()=>{myState.incrementCounter()}}>
            increment
        </button>
    </div>
}
const bar = () => {
    return <div>
        {myState.counter}
    </div>
}
```  
although it would not work (but let's imagine it is working), for any programmer the thing above is self explainable,
and if one would not know React, he could read the code and just assume what will happen.

But unfortunately there is no such things, to implement the minimal sample as above we'll have to
do quite a work. Let's say we use redux for that, and for a single field it begins: stores, reducers, hocs, writing hundreds lines,
to keep your state immutable and etc.

The important thing that with traditional approach, youll spend a lot of time of forcing "functional'ness", e.g. to keep things immutable.
That on it's own introduces quite a complexity and in turn will always be "unpure" because of the single fact - JS is not a functional language! It just does not support immutability 
as a language level feature (unlike the real functional languages).

So instead of solving business problem you have to rape javascript and prove him that he's functional with all the `{...state}` and friends in your hundredlinelong reducers.

# how
just define your state as follows:

```typescript jsx
class Counter extends SubscriptionState {

    static instance = new Counter() // let's make a singleton for a global state. 
    
    counter = 0
    
    @updatesSubscribers // whenever a method decorated with this be called, the components subscribed to this state will be updated
    incrementCounter() {
        this.counter += 1
    }
    
    //or alternatively without decorator (e.g. if you want to trigger update conditionally etc.)
    incrementCounter() {
        this.counter += 1
        if (counter > 10) {
            this.updateSubscribedComponents()
        }
    }    

}
```
to make it work your state class should only do two things: 
extend from `SubscriptionState`, 
have a methods decorated with `@updatesSubscribers`, or the ones that call `this.updateSubscribedComponents()` in their body definitions

now lets rewrite the initial example:
```typescript jsx

const foo = () => {
    const counterState = MyState.instance.use() // <=== that's the only thing you should do in your component to make it work
    return <div>
        {counterState.counter}
        <button onClick={()=>{counterState.incrementCounter()}}>
            increment
        </button>
    </div>
}
const bar = () => {
    const counterState = MyState.instance.use() 
    
    return <div>
        {counterState.counter}
    </div>
}
```
and it will just work. Whenever you'll press a button all components that `.use()` your `myState`, will update.
 
With minimal intervention, you have explicit, easy to implement and to maintain state. You just write it in standard OOP way.

Recap, you call `${yourStateClassInstance}.use()` in your component, and it will subscribe to the state. Whenever `updateSubscribedComponents()` is called in your
state class (or a method decorated with `@updatesSubscribers()`, all the subscribed components will be updated. On unmount, component will be automatically unsubscribed.

Additionally you can pass:
```typescript jsx
const myComp = () => {
    
    const muState = YourState.instance.use({
        shouldUpdate = ()=>{
            return calculateIfShouldUptate() //: boolean, component will be updated only if `true` was returned
        },
        afterUnsubscribed = () => {
            //do here any cleanup or any logic you want to run when 
        }       
    })    
    return <div>foo {myState.foo}</div>
}
```

async example:

```typescript jsx
class MyState extends SubscriptionState {

    static instance = MyState()
    
    users?: User[]    

    @updatesSubscribers({async: true}) // will update after promise resovled if you supply {async: true}
    async loadUsers() {
        this.users = await User.fetchUsers()
    }
    //alternatively
    loadUsers = async () => {
        this.users = await User.fetchUsers()
        this.updateSubscribedComponents()
    }
}

const Users = () => {
    
    const myState = MyState.instance.use()

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

const UserAddressList = () => {
    const myState = MyState.instance.use()

    return <div>
        {myState.users?.map((user)=>{
            <p key={user.id}>{user.address}</p>
        })}       
    </div>
}
```
in above example, after users loaded it will update both `Users` and `UserAddressList`

# That's basically it.

# licence
MIT