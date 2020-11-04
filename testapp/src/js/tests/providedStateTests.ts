import mocha from "mocha"
import {expect} from "chai"
import {TestStats} from "../state/TestStats"
import {sampleState, SampleState} from "../state/SampleState"
import { mount } from "enzyme"
import { configure } from 'enzyme';

import Adapter from 'enzyme-adapter-react-16';
import {SampleProvidableState} from "../state/SampleProvidableState"

configure({ adapter: new Adapter() });

export const providedStateTest = (stats: TestStats, state: SampleProvidableState, comp: any) => {
    mocha.setup('bdd')

    it('works', async () => {
        mount(comp)

        stats.resetRenderCount()
        state.name = 'foo'
        state.dispatch()
        expect([stats.aRendered, stats.bRendered]).eql([1, 1], 'rerenders the components on update')

        state.name = "1"
        stats.resetRenderCount()
        Array(10).fill(undefined).forEach(()=>{
            state.name += '1'
            state.dispatch()
        })
        expect([stats.aRendered, stats.bRendered]).eql([10, 10], 'renders exactly times trigger called')

        state.name = "foo"
        state.dispatch()
        stats.resetRenderCount()
        state.dispatch()

    })

    mocha.run()
}