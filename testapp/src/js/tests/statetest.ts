import mocha from "mocha"
import {expect} from "chai"
import {TestStats} from "../state/TestStats"
import {sampleState, SampleState} from "../state/SampleState"
import { mount } from "enzyme"
import { configure } from 'enzyme';

import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

export const stateTests = (stats: TestStats, state: SampleState, comp: any) => {
    mocha.setup('bdd')

    it('works', async () => {
        let component = mount(comp)

        stats.resetRenderCount()
        state.name = 'foo'
        state.update()
        expect([stats.aRendered, stats.bRendered]).eql([1, 1], 'rerenders the components on update')

        state.name = "1"
        stats.resetRenderCount()
        Array(10).fill(undefined).forEach(()=>{
            state.name += '1'
            state.update()
        })
        expect([stats.aRendered, stats.bRendered]).eql([10, 10], 'renders exactly times trigger called')

        state.name = "foo"
        state.update()
        stats.resetRenderCount()
        state.update()

        expect(stats.aRendered).equal(0, 'should update ignores update')
        expect(stats.bRendered).equal(1)

        state.name = "foo1"
        stats.resetRenderCount()
        Array(10).fill(undefined).forEach(()=>{
            state.name += '1'
            state.update()
        })
        expect(
            [stats.aRendered, stats.bRendered, stats.subChildRendered]
        ).eql([10, 10, 10], 'does not trigger for nested subscribed unnecessary renders')

        state.name = "foo"
        state.update()
        const aName = component.find('#aName')
        const bName = component.find('#bName')
        const childName = component.find('#subChildName')
        expect([aName.text(), bName.text(), childName.text()]).eql(Array(3).fill('foo'),
            'state values are correctly rendered'
        )

    })

    mocha.run()
}