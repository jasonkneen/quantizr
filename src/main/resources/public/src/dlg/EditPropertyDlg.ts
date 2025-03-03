import { asyncDispatch, dispatch, getAs } from "../AppContext";
import { Comp } from "../comp/base/Comp";
import { Button } from "../comp/core/Button";
import { ButtonBar } from "../comp/core/ButtonBar";
import { Checkbox } from "../comp/core/Checkbox";
import { Div } from "../comp/core/Div";
import { TextField } from "../comp/core/TextField";
import { SchemaOrgPropsTable } from "../comp/SchemaOrgPropsTable";
import { DialogBase } from "../DialogBase";
import * as J from "../JavaIntf";
import { NodeInfo } from "../JavaIntf";
import { S } from "../Singletons";
import { ValHolder } from "../ValHolder";

export interface LS { // Local State
    selections?: Map<string, J.SchemaOrgProp>;
}

/* When this dialog returns the caller should be able to either get one property name from
nameState, or else get the list of properties from LS.selections, depending on which user has
selected. */
export class EditPropertyDlg extends DialogBase {

    nameState: ValHolder = new ValHolder("");

    constructor(private editNode: NodeInfo) {
        super("Add Property", "appModalContMediumWidth");
        this.validatedStates = [this.nameState];
        const type = S.plugin.getType(this.editNode.type);
        if (type) {
            this.title = type.getName() + ": Add Property";
        }
        this.mergeState<LS>({ selections: new Map<string, J.SchemaOrgProp>() });

        // if this is a schema.org node go ahead and turn on the display of all those properties
        // automatically
        if (type.schemaOrg) {
            asyncDispatch("SetSchemaOrgProps", s => { s.showSchemaOrgProps = true; });
        }
    }

    renderDlg(): Comp[] {
        const type = S.plugin.getType(this.editNode.type);
        const ast = getAs();
        const showSchemaOrg = ast.showSchemaOrgProps;
        let textField: TextField = null;
        const ret = [
            !ast.showSchemaOrgProps
                ? new Div(null, { className: "mb-3" }, [
                    textField = new TextField({
                        label: "Name",
                        val: this.nameState
                    })
                ]) : null,

            type?.schemaOrg?.props ? new Checkbox("Schema.org Props", { className: "mr-3" }, {
                setValue: (checked: boolean) => dispatch("SetSchemaOrgProps", s => { s.showSchemaOrgProps = checked; }),
                getValue: (): boolean => ast.showSchemaOrgProps
            }) : null,

            showSchemaOrg && type?.schemaOrg?.props ? new SchemaOrgPropsTable(type.schemaOrg.props, this) : null,

            new ButtonBar([
                new Button("Save", this._save, null, "-primary"),
                new Button("Cancel", this._close)
            ], "mt-3")
        ];

        this.onMount(() => textField.focus());
        return ret;
    }

    _save = () => {
        const name = this.nameState.getValue();

        /* verify first that this property doesn't already exist */
        if (name && S.props.getProp(name, this.editNode)) {
            S.util.showMessage("Property already exists: " + name, "Warning");
            return;
        }
        this.close();
    }
}
