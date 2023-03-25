/*CANVAS*/

const canvas = document.querySelector("#canvas");//cela nous permet de prendre toutes les informations nécessaires.
const width = canvas.width = 700;
const height = canvas.height = 700;
const ctx = canvas.getContext('2d');//l'environnement du canvas, ici en deux dimensions.

//variable général
const nbCase = 8;

/*BOARD*/

const Board = function(config){
    this.x = config.x;
    this.y = config.y;
    this.dimension = config.dimension;
    this.color1 = config.color1 || 'rgb(192, 190, 190)';
    this.color2 = config.color2 || 'rgb(205, 97, 51)';
    this.pieces = [[],[],[],[],[],[],[],[]];
}

Board.prototype.draw = function(){
    
    //Les cases et les cordonnées
    
    for(let h = 0; h < nbCase; h++){
        if(h % 2 === 0){//les colonnes paires
            for(let i = 0; i < nbCase; i++){
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
            for(let i = 0; i < nbCase; i++){
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
                    for(let j=0; j < nbCase; j++){
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
    //ajout des pions de manière automatique
    for(let i = 0; i < nbCase; i++){
        for(let j = 0; j < nbCase; j++){
            if(i === 1){
                this.pieces[i][j] = new PawnB();
            }
            if(i === 6){
                this.pieces[i][j] = new PawnW();
            }
        }
    }
    //l'integration des pièces dans le tableau qui représente les cases
    for(let i = 0; i < this.pieces.length;i++){//première dimension (lignes)
        for(let j = 0;j < this.pieces[i].length;j++){//deuxième dimension (colonnes)
            let piece = this.pieces[i][j];
            if(piece !== null){
                piece.draw(j * this.dimension + 50, i * this.dimension + 50);//dessin de la pièce en fonction de ses propriétés
            }
        }
    }
    console.log(this.pieces);
}

/*Les pièces*/

//Le pion noir
const PawnB = function(config){
    this.image = new Image();
    this.image.src = 'img/Theme1/PawnB.png';
}

PawnB.prototype.draw = function(x, y){
    console.log('le x: ' + x + '  le y: ' + y);
    ctx.drawImage(this.image, x, y);
}
//le pion blanc sur case noir
const PawnW = function(config){
    this.image = new Image();
    this.image.src = 'img/Theme1/PawnW.png';
}

PawnW.prototype.draw = function(x, y){
    console.log('le x: ' + x + '  le y: ' + y);
    ctx.drawImage(this.image, x, y);
}

const TheBoard = new Board({
    x: 50,
    y: 50,
    dimension: 75,
});

TheBoard.draw();