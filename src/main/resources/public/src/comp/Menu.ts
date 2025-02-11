import { asyncDispatch, getAs } from "../AppContext";
import { S } from "../Singletons";
import { Comp } from "./base/Comp";
import { Div } from "./core/Div";

export class Menu extends Comp {
    constructor(public name: string, public menuItems: Comp[], private func: () => void = null, private floatRightComp: Comp = null, private moreClasses: string = "", private subMenu: boolean = false) {
        super({ key: name, className: "menu" });
        this.moreClasses = moreClasses || "";
    }

    override preRender(): boolean | null {
        const ast = getAs();
        const expanded = ast.expandedMenus.has(this.name);
        const clazz = this.subMenu ? (expanded ? "subMenuItemExpanded" : "subMenuItem") : (expanded ? "menuItemExpanded" : "menuItem");
        const renderName = this.subMenu ? this.name + ":" : this.name;
        this.children = [
            new Div(null, {
                className: clazz + " " + this.moreClasses,
                id: "heading" + this.getId(),
                onClick: () => {
                    asyncDispatch("ToggleExpansion", s => S.nav.changeMenuExpansion(s, "toggle", this.name));
                    if (this.func) {
                        this.func();
                    }
                }
            }
                , [renderName, expanded ? this.floatRightComp : null]),

            expanded ? new Div(null, {
                id: "itemsCont-" + this.getId(),
                className: "menuBody"
            }, [
                new Div(null, {
                    id: "items-" + this.getId(),
                    className: "menuPanelItems"
                }, this.menuItems)]) : null
        ];
        return true;
    }
}
