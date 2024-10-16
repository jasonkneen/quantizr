
package quanta.rest.response;

import java.util.LinkedList;
import java.util.List;
/* Holds a list of data to be pushed down to client for signing */
public class NodeSigPushInfo extends ServerPushInfo {
	private Integer workloadId;
	private List<NodeSigData> listToSign;

	public NodeSigPushInfo(Integer workloadId) {
		super("sigPush");
		this.workloadId = workloadId;
		listToSign = new LinkedList<>();
	}
	
	public Integer getWorkloadId() {
		return this.workloadId;
	}
	
	public List<NodeSigData> getListToSign() {
		return this.listToSign;
	}
	
	public void setWorkloadId(final Integer workloadId) {
		this.workloadId = workloadId;
	}
	
	public void setListToSign(final List<NodeSigData> listToSign) {
		this.listToSign = listToSign;
	}

	public NodeSigPushInfo() {
	}
}
