import { getAs } from "../../AppContext";
import { Comp } from "../../comp/base/Comp";
import { ButtonBar } from "../../comp/core/ButtonBar";
import { Constants as C } from "../../Constants";
import { TabBase } from "../../intf/TabBase";
import * as J from "../../JavaIntf";
import { S } from "../../Singletons";
import { Button } from "../core/Button";

export class NodeCompMainList extends Comp {
    constructor(private tabData: TabBase<any>) {
        super({ key: "nodeCompMaiList" });
    }

    override preRender(): boolean | null {
        const ast = getAs();

        const children: Comp[] = [];
        if (ast.node?.children) {
            this.addPaginationButtons(children, ast.endReached, "", true);

            const orderByProp = S.props.getPropStr(J.NodeProp.ORDER_BY, ast.node);
            const isMineOrImAdmin = ast.isAdminUser || S.props.isMine(ast.node);
            const allowNodeMove: boolean = !orderByProp && isMineOrImAdmin;
            children.push(S.render.renderChildren(ast.node, this.tabData, 1, allowNodeMove));

            this.addPaginationButtons(children, ast.endReached, "mt-3 mb-3", false);
        }

        this.children = children;
        return true;
    }

    addPaginationButtons(children: Comp[], endReached: boolean, moreClasses: string, pageTop: boolean) {
        let firstButton: Button;
        let prevButton: Button;
        let moreButton: Button;
        const firstChild = S.edit.getFirstChildNode();

        if (firstChild && firstChild.logicalOrdinal > 1) {
            firstButton = new Button(null, S.view._firstPage, {
                title: "First Page"
            }, null, "fa-angle-double-left");
        }

        if (firstChild && firstChild.logicalOrdinal > 0) {
            prevButton = new Button(null, S.view._prevPage, {
                title: "Previous Page"
            }, null, "fa-angle-left");
        }

        if (!endReached) {
            moreButton = new Button("More", (event: Event) => {
                event.stopPropagation();
                event.preventDefault();
                S.view.nextPage();
            }, {
                title: "Next Page"
            }, null, "fa-angle-right");

            const buttonCreateTime: number = new Date().getTime();

            if (C.TREE_INFINITE_SCROLL && !pageTop) {
                // If nextButton is the one at the bottom of the page we watch it so we can
                // dynamically load in new content when it scrolls info view. What's happening here
                // is that once the nextButton scrolls into view, we load in more nodes!
                moreButton.onMount((elm: HTMLElement) => {
                    const observer = new IntersectionObserver(entries => {
                        /* We have to STILL check these conditions because this observer can be
                         getting called any time and these conditions will always apply about
                         control if we want to grow page or not. */
                        const ast = getAs();

                        if (!ast.editNode) {
                            entries.forEach(entry => {
                                if (entry.isIntersecting) {
                                    // if this button comes into visibility within 2 seconds of it
                                    // being created that means it was rendered visible without user
                                    // scrolling so in this case we want to disallow the auto
                                    // loading
                                    if (new Date().getTime() - buttonCreateTime < 2000) {
                                        observer.disconnect();
                                    }
                                    // otherwise the 'more' button came into view because the user
                                    // had to have scrolled to it, so we scroll in the new nodes to
                                    // display (infinite scrolling)
                                    else {
                                        moreButton.replaceWithWaitIcon();
                                        S.view.growPage();
                                    }
                                }
                            });
                        }
                    });
                    observer.observe(elm);
                });
            }
        }

        if (firstButton || prevButton || moreButton) {
            children.push(new ButtonBar([firstButton, prevButton, moreButton], "mt-3 mb-3 text-center " + moreClasses));
        }
    }
}
