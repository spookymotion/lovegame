let PLANT_SIZE = 16;

let plant_sprites = [new Image(), new Image(), new Image()];
plant_sprites[0].src = "plant1.svg";
plant_sprites[1].src = "plant2.svg";
plant_sprites[2].src = "plant3.svg";

let PlantInstance = function(x_location, y_location) {
    this.x_location = x_location;
    this.y_location = y_location;
    this.image = plant_sprites[Math.floor(Math.random() * 3)];
};

PlantInstance.prototype = {
    render: function () {
        viewbuffer.drawImage(this.image, this.x_location, this.y_location, PLANT_SIZE, PLANT_SIZE,
            Math.floor(this.x_location), Math.floor(this.y_location),
            PLANT_SIZE, PLANT_SIZE);
    }
};