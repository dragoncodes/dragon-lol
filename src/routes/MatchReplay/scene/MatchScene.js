import * as PIXI from 'pixi.js'
import { RiotApi } from 'riot-api'

const MAP_DIMENSIONS = {
    10: {
        min: {
            x: 0,
            y: 0
        },
        max: {
            x: 15398, y: 15398
        }
    },
    11: {
        min: {
            x: -120,
            y: -120
        },

        max: {
            x: 14870,
            y: 14980
        }
    },
    12: {
        min: {x: -28, y: -19},
        max: {x: 12849, y: 12858}
    }
}

export class MatchScene {
    constructor (match) {

        this.mapDimensions = MAP_DIMENSIONS[match.mapId];

        this.dimensions = {
            min: {
                x: 0,
                y: 512
            },

            max: {
                x: 512,
                y: 0
            }
        }

        const renderer = this.renderer = PIXI.autoDetectRenderer(512, 512, {
            antialias: false,
            transparent: false,
            resolution: 1
        });

        this.stage = new PIXI.Container();

        this.participants = match.participants;

        this.prepareChampionSprites();

        this.imageUrl = `http://ddragon.leagueoflegends.com/cdn/6.8.1/img/map/map${match.mapId}.png`;

        if (!PIXI.loader.resources[ this.imageUrl ]) {
            PIXI.loader
                .add(this.imageUrl)
                .load(()=> {
                    this.createMap()
                });
        } else {
            this.createMap();
        }

        this.render();
    }

    setNode (rootNode) {
        if (!!rootNode) {
            rootNode.appendChild(this.renderer.view);
        }
    }

    createMap () {

        this.map = new PIXI.Sprite(
            PIXI.loader.resources[ this.imageUrl ].texture
        );

        //Add the cat to the stage
        this.stage.addChild(this.map);

        this.render();
    }

    prepareChampionSprites () {
        const { participants } = this;

        this.champions = [];

        const promises = [];

        for (let i = 0; i < participants.length; i++) {
            promises.push(RiotApi.Instance.Champions.ById(participants[ i ].championId));
        }

        Promise.all(promises).then((data) => {

            for (let i = 0; i < participants.length; i++) {

                const image = document.querySelector(`img[src='${data[ i ].image}']`);
                const baseTexture = new PIXI.BaseTexture(image);
                const sprite = new PIXI.Sprite(new PIXI.Texture(baseTexture));

                sprite.scale.x = .2;
                sprite.scale.y = .2;

                sprite.anchor.x = .5;
                sprite.anchor.y = .5;

                this.champions.push(
                    sprite
                );

                this.stage.addChild(this.champions[ i ]);
            }

            if (!!this.renderedFrame) {
                this.renderFrameData();
            }

            //PIXI.loader
            //    .add(data.reduce((a, b) => {
            //        a.push(b.image);
            //        return a;
            //    }, []))
            //    .load(()=> {
            //
            //    });


        });
    }

    render () {

        //requestAnimationFrame(this.render.bind(this))

        this.renderer.render(this.stage);
    }

    set frameData (frames) {

        this.renderedFrame = frames;

        this.renderFrameData();
    }

    renderFrameData () {
        const frames = this.renderedFrame;
        for (let i = 0; i < this.champions.length; i++) {
            const frame = frames.getParticipantFrame(i);

            this.champions[ i ].x = this.worldToLocalPositionX(frame.x);
            this.champions[ i ].y = this.worldToLocalPositionY(frame.y);
        }

        this.render();
    }

    worldToLocalPositionX (x) {

        const min = this.mapDimensions.min.x;
        const max = this.mapDimensions.max.x;

        return (x - min) * (this.dimensions.max.x - this.dimensions.min.x) / (max - min) + this.dimensions.min.x;
    }

    worldToLocalPositionY (y) {
        const min = this.mapDimensions.min.y;
        const max = this.mapDimensions.max.y;

        return (y - min) * (this.dimensions.max.y - this.dimensions.min.y) / (max - min) + this.dimensions.min.y;
    }
}