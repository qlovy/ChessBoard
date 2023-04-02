/*CANVAS*/

var canvas = document.querySelector("#canvas");//cela nous permet de prendre toutes les informations nécessaires.
var width = canvas.width = 700;
var height = canvas.height = 700;
var ctx = canvas.getContext('2d');//l'environnement du canvas, ici en deux dimensions.

//variable général
var nbCase = 8;

/*BOARD*/

var Board = function(config){
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

//PIECE DE JEU

//c'est la pièce de base, son but est d'être le "parent" des autres pièces et ainsi de leur donner ces attributs.
var PieceRef = function(src){
    this.image = new Image();
    this.image.src = src;
}

//fonction qui la dessine
PieceRef.prototype.draw = function(x, y){
    ctx.drawImage(this.image, x, y);
}

//PION

//le pion noir
var PawnB = function(){
    PieceRef.call(this, 'img/Theme1/PawnB.png');
    //la fonction call() permet d'avoir les mêmes attribut que le PieceRef. Plus info: https://developer.mozilla.org/fr/docs/Learn/JavaScript/Objects/Classes_in_JavaScript
}
PawnB.prototype = Object.create(PieceRef.prototype);
PawnB.prototype.constructor = PawnB;

//le pion blanc
var PawnW = function(){
    PieceRef.call(this, 'img/Theme1/PawnW.png');
}
PawnW.prototype = Object.create(PieceRef.prototype);
PawnW.prototype.constructor = PawnW;

//FOU

//le fou noir
var BishopB = function(){
    PieceRef.call(this, 'img/Theme1/BishopB.png');
}
BishopB.prototype = Object.create(PieceRef.prototype);
BishopB.prototype.constructor = BishopB;

//le fou blanc
var BishopW = function(){
    PieceRef.call(this, 'img/Theme1/BishopW.png');
}
BishopW.prototype = Object.create(PieceRef.prototype);
BishopW.prototype.constructor = BishopW;

//CHEVAL

//le cheval noir
var KnightB = function(){
    PieceRef.call(this, 'img/Theme1/KnightB.png');
}
KnightB.prototype = Object.create(PieceRef.prototype);
KnightB.prototype.constructor = KnightB;

//le cheval blanc
var KnightW = function(){
    PieceRef.call(this, 'img/Theme1/KnightW.png');
}
KnightW.prototype = Object.create(PieceRef.prototype);
KnightW.prototype.constructor = KnightW;

//REINE

//la reine noir
var QueenB = function(){
    PieceRef.call(this, 'img/Theme1/QueenB.png');
}
QueenB.prototype = Object.create(PieceRef.prototype);
QueenB.prototype.constructor = QueenB;

//la reine blanche
var QueenW = function(){
    PieceRef.call(this, 'img/Theme1/QueenW.png');
}
QueenW.prototype = Object.create(PieceRef.prototype);
QueenW.prototype.constructor = QueenW;

//ROI

//le roi noir
var KingB = function(){
    PieceRef.call(this, 'img/Theme1/KingB.png');
}
KingB.prototype = Object.create(PieceRef.prototype);
KingB.prototype.constructor = KingB;

//le roi blanc
var KingW = function(){
    PieceRef.call(this, 'img/Theme1/KingW.png');
}
KingW.prototype = Object.create(PieceRef.prototype);
KingW.prototype.constructor = KingW;

/*Application des variables*/

//on donne les varleurs nécessaires à la création de l'échiquier
var TheBoard = new Board({
    //la position dans le canvas
    x: 50,
    y: 50,
    dimension: 75,//c'est la dimension des cases
});

//dessin de l'échiquier
TheBoard.draw();