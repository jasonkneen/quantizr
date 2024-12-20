import { Comp } from "../comp/base/Comp";
import { ConfigProp, EditorOptions } from "../Interfaces";
import * as J from "../JavaIntf";
import { NodeInfo } from "../JavaIntf";
import { TabBase } from "./TabBase";

/* This interface is how Type Plugins are handled */
export interface TypeIntf {
    ordinal: number;
    schemaOrg: J.SchemaOrgClass;
    getTypeName(): string;
    getName(): string;
    render(node: NodeInfo, tabData: TabBase<any>, rowStyling: boolean, isTreeView: boolean): Comp;
    getIconClass(): string;
    allowAction(action: NodeActionType, node: NodeInfo): boolean;
    allowDeleteProperty(prop: string): boolean;
    getAllowRowHeader(): boolean;
    getAutoExpandProps(node: NodeInfo): boolean;
    allowPropertyEdit(typeName: string): boolean;
    domPreUpdateFunction(parent: Comp): void;

    // if this returns a list of props, then these props are all the EditNodeDlg is allowed to show AND
    // they will all be put outside the collapsible panel if they'd normally be inside he collapse panel
    getCustomProperties(): string[];
    ensureDefaultProperties(node: NodeInfo): void;
    getAllowPropertyAdd(): boolean;
    getAllowContentEdit(): boolean;
    getEditLabelForProp(node: NodeInfo, propName: string): string;
    getEditorRowsForProp(propName: string): number;
    getAllowUserSelect(): boolean;
    hasCustomProp(prop: string): boolean;
    hasSelectableProp(prop: string): boolean;
    getEditorHelp(): string;
    isSpecialAccountNode(): boolean;

    // for sorting on client side (namely for items packaged in a collapsable panel on account root page.)
    subOrdinal(): number;
    renderEditorSubPanel(node: NodeInfo): Comp;
    getEditorOptions(): EditorOptions;
    getType(prop: string): string;

    getPropConfig(prop: string): ConfigProp;
    getSchemaOrgPropComment(prop: string): string;
}

export enum NodeActionType {
    addChild, editNode, insert, upload, delete, share
}
