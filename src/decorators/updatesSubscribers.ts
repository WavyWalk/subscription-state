export function updatesSubscribers(config?: {async: boolean}) {

    return function (this: any, target: any, propertyKey: string, descriptor?: any) {
        let original = descriptor.value
        let patchedFunction

        if (config && config.async) {
            patchedFunction = async function(this: any, ...args: any[]) {
                await original.apply(this, args)
                this.updateSubscribedComponents()
            }
        } else {
            patchedFunction = function (this: any, ...args: any[]) {
                original.apply(this, args)
                this.updateSubscribedComponents()
            }
        }
        descriptor.value = patchedFunction
    }

}