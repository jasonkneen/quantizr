import { Comp } from "../base/Comp";
import { Div } from "./Div";
import { Span } from "./Span";

interface LS { // Local State
    expanded?: boolean;
}

export class CollapsiblePanel extends Comp {

    constructor(private collapsedButtonText: string,
        private expandedButtonText: string,
        attribs: any = {},
        private compChildren: Comp[] = null,
        private textLink: boolean = false,
        private stateCallback: (exp: boolean) => void = null,
        expanded: boolean = false,
        private extraToggleButtonClass = "",
        private extraDivStyleExpanded: string = "",
        private extraDivStyleCollapsed: string = "",
        elementName: string = "div") {
        super(attribs);
        this.collapsedButtonText = collapsedButtonText || "More ";
        this.expandedButtonText = expandedButtonText || "Less ";
        this.mergeState<LS>({ expanded });
        this.tag = elementName;
    }

    setExpanded(expanded: boolean) {
        this.mergeState<LS>({ expanded });
    }

    override preRender(): boolean | null {
        const state = this.getState<LS>();
        const style = this.textLink ? "collapsePanelLink" : "";
        const collapseClass = state.expanded ? "expand" : "collapse";

        /* If the component is expanded we render the button INSIDE the main area,
        which is the area that would be HIDDEN when the component is NOT expanded. */
        if (state.expanded) {
            this.attribs.className = this.extraDivStyleExpanded;
            this.children = [
                // This div and it's children holds the actual collapsible content.
                new Div(null, {
                    className: collapseClass
                }, [
                    // This span is the expande/collapse button itself
                    new Span(this.expandedButtonText === "n/a" ? null : (this.expandedButtonText + "   "), {
                        className: style + " " + this.extraToggleButtonClass + (state.expanded ? " iconUp" : " iconDown"),
                        // Warning: This can't be camel case!
                        "data-bs-toggle": collapseClass,
                        onClick: this._onToggle
                    }),
                    ...this.compChildren
                ])
            ];
        }
        else {
            this.attribs.className = this.extraDivStyleCollapsed;
            this.children = [
                // This span is the expande/collapse button itself
                new Span(this.collapsedButtonText === "n/a" ? null : (this.collapsedButtonText + "   "), {
                    className: style + " " + this.extraToggleButtonClass + (state.expanded ? " iconUp" : " iconDown"),
                    // Warning: This can't be camel case!
                    "data-bs-toggle": collapseClass,
                    onClick: this._onToggle
                }),

                // This div and it's children holds the actual collapsible content.
                new Div(null, {
                    className: collapseClass
                },
                    this.compChildren)
            ];
        }
        return true;
    }

    _onToggle = () => {
        const expanded = !this.getState<LS>().expanded;
        this.setExpanded(expanded);
        if (this.stateCallback) {
            this.stateCallback(expanded);
        }
    }
}
