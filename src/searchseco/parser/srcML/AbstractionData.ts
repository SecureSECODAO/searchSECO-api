import { Node } from './Node'

export default class AbstractionData {
    private _data: string
    private _funcName: string

    constructor(string: string = '', funcName: string = '') {
        this._string = string
        this._funcName = funcName
    }

    private static collapseNodes(node: Node, abstraction: AbstractionData, inFunction: boolean) {
        const children = node.GetBranches()
        AbstractionData.nodeToString(node, abstraction, inFunction)

        children.forEach((child: Node) => {
            AbstractionData.collapseNodes(child, abstraction, inFunction)
        })
    }

    private static nodeToString(node: Node, abstraction: AbstractionData, inFunction: boolean) {
        if (node.GetBranches().length > 0)
            return
        
        const content = node.GetContent()
        if (!content)
            return
        
        const tag = node.GetTag()
        switch (tag) {
            case "name": {
                let parent = node.GetPrevious()
                if (parent) {
                    while (parent.GetTag() === "name") 
                        parent = parent.GetPrevious()
                    if (parent.GetTag() === "type") {
                        if (inFunction) 
                            abstraction.AddString(content)
                        return
                    } else if (parent.GetTag() === "call") {
                        if (inFunction)
                            abstraction.AddString("funccall")
                        return
                    } else if (parent.GetTag() === "function") {
                        abstraction.SetFunctionName("funcname")
                    }
                    
                }
            }
        }
    }

	public static GetHashable(node: Node): AbstractionData {
        const abstraction = new AbstractionData()
        node.GetBranches().forEach((child: Node) => {
            if (child.GetTag() === "block") {
                child.GetBranches().forEach((grandChild: Node) => {
                    if (grandChild.GetTag() === "block_content") {
                        AbstractionData.collapseNodes(grandChild, abstraction, true)
                    }
                })
            }
        })
        return abstraction
    }

    public AddString(str: string) {
        this._data.concat(str)
    }

    public SetFunctionName(name: string) {
        this._funcName = name
    }
}