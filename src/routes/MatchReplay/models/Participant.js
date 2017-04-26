export class Participant {
    constructor (rawObject, identity) {
        this.championId = rawObject.championId;
        this.name = identity && identity.summonerName;
        this.rank = rawObject.highestAchievedSeasonTier;
        this.id = rawObject.participantId;
        this.summonerSpells = [rawObject.spell1Id, rawObject.spell2Id];

        this.lane = rawObject.timeline.lane;
        this.role = rawObject.timeline.role;
    }
}