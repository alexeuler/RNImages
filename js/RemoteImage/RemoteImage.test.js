const RemoteImage = require("./RemoteImage")
// @ponicode
describe("componentDidMount", () => {
    let inst

    beforeEach(() => {
        inst = new RemoteImage.default()
    })

    test("0", () => {
        let callFunction = () => {
            inst.componentDidMount()
        }
    
        expect(callFunction).not.toThrow()
    })
})
