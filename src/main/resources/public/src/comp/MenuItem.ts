import { S } from "../Singletons";
import { Span } from "../comp/core/Span";
import { Comp } from "./base/Comp";
import { Checkbox } from "./core/Checkbox";
import { RadioButton } from "./core/RadioButton";
import { Tag } from "./core/Tag";

interface LS { // Local State
    visible: boolean;
    enabled: boolean;
}

export class MenuItem extends Comp {

    constructor(public name: string, public clickFunc: () => void, enabled: boolean = true, private stateFunc: () => boolean = null,
        private treeOp: boolean = null, private moreClasses: string = "", private radioGroup: string = null, private floatRightComps: Comp[] = null) {
        super({ key: name });
        this.mergeState({ visible: true, enabled });
        this.floatRightComps = this.floatRightComps || [];
    }

    override preRender(): boolean | null {
        const state: LS = this.getState<LS>();
        const enablementClass = state.enabled ? " mainMenuItemEnabled" : " disabled mainMenuItemDisabled";
        let innerSpan: Comp;
        let innerClazz: string;
        if (this.stateFunc) {
            if (this.radioGroup) {
                innerSpan = new RadioButton(this.name, this.stateFunc(), this.radioGroup, { className: "mt-2 mr-3" }, {
                    setValue: this._onClick,
                    getValue: this.stateFunc
                });
            }
            else {
                innerSpan = new Checkbox(this.name, { className: "mt-2 mr-3" }, {
                    setValue: this._onClick,
                    getValue: this.stateFunc
                });
            }
            innerClazz = "listGroupMenuItemCompact " + this.moreClasses;
        }
        else {
            innerSpan = new Span(this.name);
            innerClazz = "listGroupMenuItem " + this.moreClasses;
        }

        this.children = [
            this.treeOp || this.floatRightComps ? new Span(null, { className: "float-right" }, [
                ...this.floatRightComps,
                this.treeOp ? new Tag("i", {
                    className: "fa fa-caret-right fa-lg  " + (state.enabled ? "menuIcon" : "menuIconDisabled"),
                    title: "Operates on the selected Tree Nodes(s)",
                }) : null
            ]) : null,
            innerSpan,
        ];

        if (state.enabled) {
            this.attribs.disabled = "disabled";
        }

        this.attribs.style = { display: (state.visible ? "" : "none") };
        this.attribs.className = innerClazz + enablementClass + "  listGroupTransparent " +
            + this.moreClasses;
        this.attribs.onClick = this._onClick
        return true
    }

    _onClick = (): void => {
        const state = this.getState<LS>();
        if (!state.enabled) return;

        if (S.quanta.mainMenu) {
            S.quanta.mainMenu.close();
        }
        this.clickFunc();
    }
}
