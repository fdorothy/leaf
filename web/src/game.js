var game = new Phaser.Game(16 * 16, 24 * 16, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

var spiders;
var obstacles;

function preload() {
    game.load.tilemap('level1', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('gametiles', 'assets/basictiles.png');
    game.load.atlasJSONHash('spider', 'assets/characters.png', 'assets/spider.json');
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    map = game.add.tilemap('level1');
    map.addTilesetImage('basictiles', 'gametiles');
    grassLayer = map.createLayer('grass');
    grassLayer2 = map.createLayer('grass2');

    obstacles = map.createLayer('obstacles');
    map.setCollisionBetween(1, 2000, true, 'obstacles');

    grassLayer.resizeWorld();

    spiders = game.add.group();

    game.time.events.loop(Phaser.Timer.SECOND * 0.5, create_spider, this);
    create_spider();
}

function create_spider() {
    if (spiders.children.length < 25) {
        spider = spiders.create(8*16, 12*16, 'spider');
        game.physics.arcade.enable(spider);
        spider.animations.add('run');
        spider.animations.play('run', 10, true);
        spider.body.velocity.y = 60;
        spider.dir = [0, 60];
        console.log("ok, all created");
    }
}

function turnLeft(spider, obstacle) {
    console.log("spider hit obstacle, turning left...");
    spider.body.velocity.x = spider.dir[1];
    spider.body.velocity.y = -spider.dir[0];
    spider.dir[0] = spider.body.velocity.x;
    spider.dir[1] = spider.body.velocity.y;
    return true;
}

function update() {
    game.physics.arcade.collide(spiders, obstacles, turnLeft);
}
