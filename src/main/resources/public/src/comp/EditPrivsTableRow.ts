import { Constants as C } from "../Constants";
import * as J from "../JavaIntf";
import { PrincipalName } from "../JavaIntf";
import { S } from "../Singletons";
import { Button } from "../comp/core//Button";
import { ButtonBar } from "../comp/core/ButtonBar";
import { Div } from "../comp/core/Div";
import { Img } from "../comp/core/Img";
import { ListBoxRow } from "./ListBoxRow";
import { Checkbox } from "./core/Checkbox";
import { Icon } from "./core/Icon";

export class EditPrivsTableRow extends ListBoxRow {

    constructor(private shareNodeToUserFunc: (userName: string, allowAppends: boolean) => void, public aclEntry: J.AccessControlInfo, private removePrivilege: (principalNodeId: string, privilege: string) => void) {
        super();
    }

    renderAclPrivileges(aclEntry: J.AccessControlInfo): Div {
        const writable = S.props.hasPrivilege(this.aclEntry, J.PrivilegeType.WRITE);
        const div = new Div(null, { className: "float-right m-2" });

        aclEntry.privileges.forEach(privilege => {
            div.addChild(
                new Div(null, null, [
                    new ButtonBar([
                        new Checkbox("Allow Replies", { className: "mr-3" }, {
                            setValue: (checked: boolean) => this.shareNodeToUserFunc(this.aclEntry.principalName, checked),
                            getValue: (): boolean => writable
                        }),
                        new Button("Remove", () => {
                            this.removePrivilege(aclEntry.principalNodeId, privilege.privilegeName);
                        })
                    ], "ml-3")
                ])
            );
        });
        return div;
    }

    override preRender(): boolean | null {
        let src: string = null;
        if (this.aclEntry.avatarVer) {
            src = S.render.getAvatarImgUrl(this.aclEntry.principalNodeId, this.aclEntry.avatarVer);
        }

        const userNameDisp = S.util.getFriendlyPrincipalName(this.aclEntry);
        const isPublic = this.aclEntry.principalName === PrincipalName.PUBLIC;

        this.children = [
            new Div(null, null, [
                this.renderAclPrivileges(this.aclEntry),
                new Div(null, { className: "friendListImgDivCont" }, [
                    !isPublic ? new Div(null, { className: "friendListImgDiv centerChild" }, [
                        src ? new Img({
                            className: "friendListImage",
                            src,
                            [C.USER_ID_ATTR]: this.aclEntry.principalNodeId,
                            onClick: S.nav._clickToOpenUserProfile
                        }) : null
                    ]) : null,
                    isPublic ? new Div(null, { className: "friendListImgDiv centerChild" }, [
                        new Icon({
                            className: "fa fa-globe fa-3x sharingIcon m-3",
                            title: "Node is Public"
                        })
                    ]) : null
                ]),
                new Div(null, { className: "sharingDisplayName" }, [
                    isPublic ? new Div("Public (Everyone)", { className: "largeFont" })
                        : new Div(this.aclEntry.displayName, {
                            className: "friendName",
                            [C.USER_ID_ATTR]: this.aclEntry.principalNodeId,
                            onClick: S.nav._clickToOpenUserProfile
                        }),
                    isPublic ? null : new Div(userNameDisp, {
                        [C.USER_ID_ATTR]: this.aclEntry.principalNodeId,
                        onClick: S.nav._clickToOpenUserProfile
                    })
                ])
            ])
        ];
        return true;
    }
}
