var game = new Phaser.Game(16 * 16, 24 * 16, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

var spiders;
var obstacles;
var arrowsLayer;
var goals;
var redTileId = 98;
var rotation = 0;
var cursors;
var spider_speed = 80;
var max_spiders = 25;

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
    grassLayer.resizeWorld();
    grassLayer2 = map.createLayer('grass2');
    obstacles = map.createLayer('obstacles');
    map.setCollisionBetween(1, 2000, true, 'obstacles');
    goals = map.createLayer('goals');
    map.setCollisionBetween(1, 2000, true, 'goals');
    arrowsLayer = map.createLayer('arrows');
    map.setCollisionBetween(1, 2000, true, 'arrows');
    spiders = game.add.group();
    game.time.events.loop(Phaser.Timer.SECOND * 0.5, create_spider, this);
    game.input.onTap.add(onTap, this);
    cursors = game.input.keyboard.createCursorKeys();
}

function create_spider() {
    if (spiders.children.length < 25) {
        spider = spiders.create(8*16, 12*16, 'spider');
        game.physics.arcade.enable(spider);
        spider.animations.add('run');
        spider.animations.play('run', 10, true);
        spider.body.velocity.y = spider_speed;
        spider.dir = [0, spider_speed];
    }
}

function hitArrow(spider, arrow) {
    if (arrow.index > 0) {
        switch (arrow.dir) {
        case 0:
            spider.body.velocity.x = 0;
            spider.body.velocity.y = -spider_speed;
            break;
        case 90:
            spider.body.velocity.x = spider_speed;
            spider.body.velocity.y = 0;
            break;
        case 180:
            spider.body.velocity.x = 0;
            spider.body.velocity.y = spider_speed;
            break;
        case 270:
            spider.body.velocity.x = -spider_speed;
            spider.body.velocity.y = 0;
            break;
        }
        spider.dir[0] = spider.body.velocity.x;
        spider.dir[1] = spider.body.velocity.y;
    }
}

function hitWall(spider, obstacle) {
    console.log("hitting wall");
    spider.body.velocity.x = spider.dir[1];
    spider.body.velocity.y = -spider.dir[0];
    spider.dir[0] = spider.body.velocity.x;
    spider.dir[1] = spider.body.velocity.y;
    return true;
}

function hitGoal(spider, goal) {
    console.log('goal');
    spiders.remove(spider);
}

function onTap(pointer, doubleTap) {
    var x = obstacles.getTileX(game.input.activePointer.worldX);
    var y = obstacles.getTileY(game.input.activePointer.worldY);
    var obstacleTile = map.getTile(x, y, obstacles);
    var goalTile = map.getTile(x, y, goals);
    var arrowTile = map.getTile(x, y, arrowsLayer);
    if (obstacleTile == null && goalTile == null && arrowTile == null) {
        var tile = map.putTile(redTileId, x, y, arrowsLayer);
        tile.rotation = game.math.degToRad(rotation);
        tile.dir = rotation;
    }
}

function update() {
    game.physics.arcade.collide(spiders, arrowsLayer, null, hitArrow);
    game.physics.arcade.collide(spiders, obstacles, hitWall);
    game.physics.arcade.collide(spiders, goals, hitGoal);

    if (cursors.left.isDown)
    {
        rotation = 270;
    }
    else if (cursors.right.isDown)
    {
        rotation = 90;
    }

    if (cursors.up.isDown)
    {
        rotation = 0;
    }
    else if (cursors.down.isDown)
    {
        rotation = 180;
    }
}
