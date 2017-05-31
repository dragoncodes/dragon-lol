const EventTypes = {
    ChampionKill: 'CHAMPION_KILL'
}

export class FrameData {
    constructor (rawFrame) {

        this._data = [];

        this.timestamp = rawFrame.timestamp;

        const { participantFrames } = rawFrame;

        for (let participantId in participantFrames) {

            if (!participantFrames.hasOwnProperty(participantId)) {
                continue;
            }

            const participantFrame = participantFrames[ participantId ];

            try {

                const isDead = !participantFrame.position;

                this._data.push({
                    x: !isDead ? participantFrame.position.x : 0,
                    y: !isDead ? participantFrame.position.y : 0,
                    isDead,
                    creepScore: participantFrame.minionsKilled + participantFrame.jungleMinionsKilled,
                    level: participantFrame.level,
                    gold: participantFrame.currentGold,
                    totalGold: participantFrame.totalGold
                });
            }
            catch (e) {
                console.log(participantFrames[ participantId ]);
                console.error(e);
            }
        }

        const { events } = rawFrame;
        this._killFeed = [];

        if (!!events) {
            for (let i = 0; i < events.length; i++) {

                const event = events[ i ];
                switch (event.type) {
                    case EventTypes.ChampionKill:
                        this._killFeed.push({
                            killerId: event.killerId,
                            victimId: event.victimId,
                            assists: event.assistingParticipantIds || []
                        });
                        break;

                    default:
                        break;
                }
            }
        }
    }

    getKillFeed () {
        return this._killFeed;
    }

    getParticipantFrame (participantId) {

        if (participantId < 0 && participantId >= this._data.length) {
            return {};
        }

        return this._data[ participantId ];
    }
}