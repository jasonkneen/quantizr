package quanta.model;

import java.util.LinkedList;
import quanta.mongo.model.SubNode;

public class TreeNode {

    public TreeNode(SubNode node) {
        this.node = node;
    }

    public SubNode node;
    public TreeNode parent;
    public LinkedList<TreeNode> children;
    public int figNumStart;
}
