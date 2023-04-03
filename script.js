/*CANVAS*/

var canvas = document.querySelector("#canvas");//cela nous permet de prendre toutes les informations nécessaires.
var width = canvas.width = 700;
var height = canvas.height = 700;
var ctx = canvas.getContext('2d');//l'environnement du canvas, ici en deux dimensions.

/*variables générales*/

var nbCase = 8;

//les joueurs
const Player = {
    White: 'W',
    Black: 'B'
}

/*BOARD*/

function Board(config) {
    this.x = config.x;
    this.y = config.y;
    this.dimension = config.dimension;
    this.color1 = config.color1 || 'rgb(205, 97, 51)';
    this.color2 = config.color2 || 'rgb(192, 190, 190)';
    this.pieces = [[], [], [], [], [], [], [], []];
}

Board.prototype.draw = function () {

    //Les cases et les cordonnées

    for (let h = 0; h < nbCase; h++) {
        if (h % 2 === 0) {//les colonnes paires
            for (let i = 0; i < nbCase; i++) {
                //choix de la couleur en fonction de i
                if (i % 2 === 0) {
                    ctx.fillStyle = this.color2;
                } else {
                    ctx.fillStyle = this.color1;
                }
                ctx.beginPath();
                ctx.rect(this.x + i * this.dimension, this.y + h * this.dimension, this.dimension, this.dimension);
                ctx.fill();
            }
        } else {//les colonnes impaires
            for (let i = 0; i < nbCase; i++) {
                //choix de la couleur en fonction de i
                if (i % 2 === 0) {
                    ctx.fillStyle = this.color1;
                } else {
                    ctx.fillStyle = this.color2;
                }
                ctx.beginPath();
                ctx.rect(this.x + i * this.dimension, this.y + h * this.dimension, this.dimension, this.dimension);
                ctx.fill();
                //les lettres en lignes
                if (i === 7 && h === 7) {
                    for (let j = 0; j < nbCase; j++) {
                        let Alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
                        ctx.fillStyle = 'rgb(255, 255, 255)';
                        ctx.fillText(Alphabet[j], this.x + 38 + j * this.dimension, this.y + 25 + (h + 1) * this.dimension);
                    }
                }
            }
        }
        //les chiffres en colonnes
        ctx.fillStyle = 'rgb(255,255,255)';
        ctx.font = '20px sans-serif';
        ctx.fillText(8 - h, this.x - 25, this.y + 38 + h * this.dimension);
    }
    //ajout des pièces de manière automatique
    for (let i = 0; i < nbCase; i++) {
        for (let j = 0; j < nbCase; j++) {
            if (i === 0) {
                if (j === 0 || j === 7) {
                    this.pieces[i][j] = new Rook(Player.Black);
                }
                if (j === 1 || j === 6) {
                    this.pieces[i][j] = new Knight(Player.Black);
                }
                if (j === 2 || j === 5) {
                    this.pieces[i][j] = new Bishop(Player.Black);
                }
                if (j === 3) {
                    this.pieces[i][j] = new Queen(Player.Black);
                }
                if (j === 4) {
                    this.pieces[i][j] = new King(Player.Black);
                }
            }
            if (i === 1) {
                this.pieces[i][j] = new Pawn(Player.Black);
            }
            if (i === 6) {
                this.pieces[i][j] = new Pawn(Player.White);
            }
            if (i === 7) {
                if (j === 0 || j === 7) {
                    this.pieces[i][j] = new Rook(Player.White);
                }
                if (j === 1 || j === 6) {
                    this.pieces[i][j] = new Knight(Player.White);
                }
                if (j === 2 || j === 5) {
                    this.pieces[i][j] = new Bishop(Player.White);
                }
                if (j === 3) {
                    this.pieces[i][j] = new Queen(Player.White);
                }
                if (j === 4) {
                    this.pieces[i][j] = new King(Player.White);
                }
            }
        }
    }
    //l'integration des pièces dans le tableau qui représente les cases
    for (let i = 0; i < this.pieces.length; i++) {//première dimension (lignes)
        for (let j = 0; j < this.pieces[i].length; j++) {//deuxième dimension (colonnes)
            let piece = this.pieces[i][j];
            if (piece !== null) {
                piece.draw(j * this.dimension + 50, i * this.dimension + 50);//dessin de la pièce en fonction de ses propriétés
            }
        }
    }
    console.log(this.pieces);
}

/*Les pièces*/

//PIECE DE JEU

//c'est la pièce de base, son but est d'être le "parent" des autres pièces et ainsi de leur donner ces attributs.
function PieceRef(player) {
    this.player = player;
    this.image = new Image();
    this.image.src = 'img/Theme1/' + this.constructor.name + player + '.png';
}

//fonction qui la dessine
PieceRef.prototype.draw = function (x, y) {
    ctx.drawImage(this.image, x, y);
}

//PION
function Pawn(player) {
    PieceRef.call(this, player);
    //la fonction call() permet d'avoir les mêmes attribut que le PieceRef. Plus info: https://developer.mozilla.org/fr/docs/Learn/JavaScript/Objects/Classes_in_JavaScript
}
Pawn.prototype = Object.create(PieceRef.prototype);
//permet à Pawn d'avoir toutes les méthodes de PieceRef(la fonction draw).
Pawn.prototype.constructor = Pawn;
//fait que le constructeur de Pawn soit Pawn et non PieceRef

//TOUR
function Rook(player) {
    PieceRef.call(this, player);
}
Rook.prototype = Object.create(PieceRef.prototype);
Rook.prototype.constructor = Rook;

//FOU
function Bishop(player) {
    PieceRef.call(this, player);
}
Bishop.prototype = Object.create(PieceRef.prototype);
Bishop.prototype.constructor = Bishop;

//CHEVAL
function Knight(player) {
    PieceRef.call(this, player);
}
Knight.prototype = Object.create(PieceRef.prototype);
Knight.prototype.constructor = Knight;

//REINE
function Queen(player) {
    PieceRef.call(this, player);
}
Queen.prototype = Object.create(PieceRef.prototype);
Queen.prototype.constructor = Queen;

//ROI
function King(player) {
    PieceRef.call(this, player);
}
King.prototype = Object.create(PieceRef.prototype);
King.prototype.constructor = King;

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