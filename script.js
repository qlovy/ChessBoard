/*CANVAS*/

const canvas = document.querySelector('#canvas');//cela nous permet de prendre toutes les informations nécessaires.
const width = canvas.widht = 800;
const height = canvas.height = 800;
const ctx = canvas.getContext('2d');//l'environnement du canvas, ici en deux dimensions.

/*BOARD*/

const Board = function(config){
    this.x = config.x;
    this.y = config.y;
    this.dimension = config.dimension;
    this.color = config.color1 || 'rgb(255, 255, 255)';
    this.color = config.color2 || 'rgb(0, 0, 0)';
}

Board.prototype.draw = function(){
    
    for(let i = 0; i < 10; i++){
        
        //choix de la couleur en fonction de i
        console.log(i % 2);
        if(i % 2 === 0){
            ctx.fillStyle = this.color1;
        }else{
            ctx.fillStyle = this.color2;
        }
        
        ctx.beginPath();
        ctx.rect(this.x + i * this.dimension, this.y, this.dimension, this.dimension);
        ctx.fill();
    }
}

const TheBoard = new Board({
    x: 0,
    y: 0,
    dimension: 100
});

TheBoard.draw();