import { Comp } from "../comp/base/Comp";
import { TabBase } from "../intf/TabBase";
import { ResultSetInfo } from "../ResultSetInfo";
import { S } from "../Singletons";
import { ResultSetView } from "./ResultSetView";

export class SearchResultSetView<PT extends ResultSetInfo> extends ResultSetView<PT> {

    constructor(data: TabBase<PT>) {
        super(data);
        data.inst = this;
    }

    override pageChange(delta: number) {
        let page = this.data.props.page;
        if (delta !== null) {
            page = delta === 0 ? 0 : this.data.props.page + delta;
        }

        S.srch.search(null, this.data.props.node.id,
            this.data.props.prop,
            this.data.props.searchText,
            this.data.props.searchType,
            this.data.props.description,
            this.data.props.searchRoot,
            this.data.props.fuzzy,
            this.data.props.caseSensitive,
            page,
            this.data.props.recursive,
            this.data.props.sortField,
            this.data.props.sortDir,
            this.data.props.requirePriority,
            this.data.props.requireAttachment,
            false,
            false,
            false);
    }

    override extraPagingComps(): Comp[] {
        return null;
    }

    override getFloatRightHeaderComp(): Comp {
        return null;
    }
}
