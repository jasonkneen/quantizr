import { Comp } from "../comp/base/Comp";
import { Button } from "../comp/core/Button";
import { ButtonBar } from "../comp/core/ButtonBar";
import { Checkbox } from "../comp/core/Checkbox";
import { Div } from "../comp/core/Div";
import { TextField } from "../comp/core/TextField";
import { DialogBase } from "../DialogBase";
import { S } from "../Singletons";
import { ValHolder, ValidatorRuleName } from "../ValHolder";

interface LS { // Local State
    recursive: boolean;
}

export class SearchAndReplaceDlg extends DialogBase {

    searchState: ValHolder = new ValHolder("", [{ name: ValidatorRuleName.REQUIRED }]);
    replaceState: ValHolder = new ValHolder("", [{ name: ValidatorRuleName.REQUIRED }]);

    constructor() {
        super("Search and Replace", "appModalContNarrowWidth");
        this.mergeState<LS>({ recursive: true });
        this.validatedStates = [this.searchState, this.replaceState];
    }

    renderDlg(): Comp[] {
        return [
            new Div(null, null, [
                new TextField({ label: "Search for", val: this.searchState }),
                new TextField({ label: "Replace with", val: this.replaceState }),
                new Div(null, { className: "mt-3" }, [
                    new Checkbox("Include Sub-Nodes", null, {
                        setValue: (checked: boolean) => this.mergeState<LS>({ recursive: checked }),
                        getValue: (): boolean => this.getState<LS>().recursive
                    })
                ]),
                new ButtonBar([
                    new Button("Replace", this._replace, null, "-primary"),
                    new Button("Close", this._close, null, "float-right")
                ], "mt-3")
            ])
        ];
    }

    _replace = () => {
        if (!this.validate()) {
            return;
        }

        const node = S.nodeUtil.getHighlightedNode();
        if (!node) {
            S.util.showMessage("No node was selected.", "Warning");
            return;
        }

        S.srch.searchAndReplace(this.getState<LS>().recursive, node.id, this.searchState.getValue(), this.replaceState.getValue());
        this.close();
    }
}
