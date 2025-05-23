
package quanta.rest.response;

import java.util.ArrayList;
import quanta.rest.response.base.ResponseBase;

public class GetNodeStatsResponse extends ResponseBase {
    private String stats;
    private ArrayList<String> topWords;
    private ArrayList<HashtagInfo> topTags;
    private ArrayList<String> topVotes;

    public String getStats() {
        return this.stats;
    }

    public ArrayList<String> getTopWords() {
        return this.topWords;
    }

    public ArrayList<HashtagInfo> getTopTags() {
        return this.topTags;
    }

    public ArrayList<String> getTopVotes() {
        return this.topVotes;
    }

    public void setStats(final String stats) {
        this.stats = stats;
    }

    public void setTopWords(final ArrayList<String> topWords) {
        this.topWords = topWords;
    }

    public void setTopTags(final ArrayList<HashtagInfo> topTags) {
        this.topTags = topTags;
    }

    public void setTopVotes(final ArrayList<String> topVotes) {
        this.topVotes = topVotes;
    }

    public GetNodeStatsResponse() {}
}
