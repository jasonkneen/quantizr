import { DialogBase } from "../DialogBase";
import { ValHolder } from "../ValHolder";
import { Comp, ScrollPos } from "../comp/base/Comp";
import { Button } from "../comp/core/Button";
import { ButtonBar } from "../comp/core/ButtonBar";
import { Div } from "../comp/core/Div";
import { TextArea } from "../comp/core/TextArea";
import * as J from "../JavaIntf";
import { NodeInfo } from "../JavaIntf";
import { S } from "../Singletons";
import { Constants as C } from "../Constants";

export class SendFeedbackDlg extends DialogBase {
    static promptState: ValHolder = new ValHolder();
    promptScrollPos = new ScrollPos();

    constructor(public node: NodeInfo) {
        super("Send Feedback");
    }

    renderDlg(): Comp[] {
        return [
            new Div(null, null, [
                new Div("Send us any feedback, questions, or comments.", { className: "mb-3" }),
                new TextArea("Comments", {
                    rows: 7,
                }, SendFeedbackDlg.promptState, null, false, 3, this.promptScrollPos),
                new ButtonBar([
                    new Button("Send", this._send, null, "-primary"),
                    new Button("Cancel", this._close, null, "float-right")
                ], "mt-3")
            ])
        ];
    }

    _send = async () => {
        const res = await S.rpcUtil.rpc<J.SendFeedbackRequest, J.SendFeedbackResponse>("sendFeedback", {
            message: SendFeedbackDlg.promptState.getValue()
        });

        this.close();

        if (res.code === C.RESPONSE_CODE_OK) {
            S.util.showMessage("Feedback sent. Thank you!");
        }
    }
}
