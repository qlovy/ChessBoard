/*CANVAS*/

const canvas = document.querySelector("#canvas");//cela nous permet de prendre toutes les informations nécessaires.
const width = canvas.width = 700;
const height = canvas.height = 700;
const ctx = canvas.getContext('2d');//l'environnement du canvas, ici en deux dimensions.

/*BOARD*/

const Board = function(config){
    this.x = config.x;
    this.y = config.y;
    this.dimension = config.dimension;
    this.color1 = config.color1 || 'rgb(255, 255, 255)';
    this.color2 = config.color2 || 'rgb(0, 0, 0)';
}

Board.prototype.draw = function(){
    
    //Les cases et les cordonnées
    
    for(let h = 0; h < 8; h++){
        if(h % 2 === 0){//les colonnes paires
            for(let i = 0; i < 8; i++){
                //choix de la couleur en fonction de i
                if(i % 2 === 0){
                    ctx.fillStyle = this.color2;
                }else{
                    ctx.fillStyle = this.color1;
                }
                ctx.beginPath();
                ctx.rect(this.x + i * this.dimension, this.y + h * this.dimension, this.dimension, this.dimension);
                ctx.fill();
            }
        }else{//les colonnes impaires
            for(let i = 0; i < 8; i++){
                //choix de la couleur en fonction de i
                if(i % 2 === 0){
                    ctx.fillStyle = this.color1;
                }else{
                    ctx.fillStyle = this.color2;
                }
                ctx.beginPath();
                ctx.rect(this.x + i * this.dimension, this.y + h * this.dimension, this.dimension, this.dimension);
                ctx.fill();
                //les lettres en lignes
                if(i === 7 && h === 7){
                    for(let j=0; j < 8; j++){
                        let Alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
                        ctx.fillStyle = 'rgb(255, 255, 255)';
                        ctx.fillText(Alphabet[j], this.x + 38 + j * this.dimension, this.y + 25 + (h + 1)* this.dimension);
                    }   
                }
            }
        }
    //les chiffres en colonnes
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.font = '20px sans-serif';
    ctx.fillText(8 - h, this.x - 25, this.y + 38 +  h * this.dimension);
    }
}


const TheBoard = new Board({
    x: 50,
    y: 50,
    dimension: 75,
});

TheBoard.draw();