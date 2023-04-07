/*CANVAS*/

var canvas = document.querySelector("#canvas");//cela nous permet de prendre toutes les informations nécessaires.
var width = canvas.width = 700;
var height = canvas.height = 700;
var ctx = canvas.getContext('2d');//l'environnement du canvas, ici en deux dimensions.

/*variables générales*/

const nbCase = 8;
//les joueurs
const Player = {
    White: 'W',
    Black: 'B'
}
const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
var currentPiece;
var currentPiecePosition;


/*Les fonctions générales*/
function cordinateToAlgebric(x, y) {
    return String.fromCharCode(x + 97) + (8 - y);
}

function algebricToCordinate(algebric) {
    let charX = algebric.substr(0, 1);
    let charY = algebric.substr(1, 1);
    return {
        x: charX.charCodeAt(0) - 97,
        y: 8 - (parseInt(charY))
    };
}

/*BOARD*/

function Board(config) {
    let me = this;
    this.x = config.x;
    this.y = config.y;
    this.dimension = config.dimension;
    this.color1 = config.color1 || 'rgb(205, 97, 51)';
    this.color2 = config.color2 || 'rgb(192, 190, 190)';
    this.pieces = [[], [], [], [], [], [], [], []];
    canvas.addEventListener('mousedown', (e) => {
        let rect = canvas.getBoundingClientRect();
        let x = Math.floor((e.clientX - rect.left - 50) / this.dimension);//Math.floor arrondi à l'inférieure.
        let y = Math.floor((e.clientY - rect.top - 50) / this.dimension);
        currentPiece = me.pieces[x][y];
        currentPiecePosition = {x: x, y: y};
        let possibilityCurrentPiece = currentPiece.whereCanMove(x, y);
        //reset l'affichage des possibilités de la pièce
        TheBoard.draw();
        //dessin des possibilités si on a appuyé avec le clique gauche
        if (e.which === 1) {
            for (let i = 0; i < possibilityCurrentPiece.length; i++) {
                ctx.fillStyle = '#8e44ad';
                ctx.beginPath();
                ctx.arc(possibilityCurrentPiece[i].x * this.dimension + 50 + Math.round(this.dimension / 2), possibilityCurrentPiece[i].y * this.dimension + 50 + Math.round(this.dimension / 2), 10, 0, 360);
                ctx.fill();
            }
        }
    });
    canvas.addEventListener('mouseup', (e) => {
        let rect = canvas.getBoundingClientRect();
        let x = Math.floor((e.clientX - rect.left - 50) / this.dimension);
        let y = Math.floor((e.clientY - rect.top - 50) / this.dimension);
        let possibilityCurrentPiece = currentPiece.whereCanMove(currentPiecePosition.x, currentPiecePosition.y);
        if (e.which === 1) {
            for (let i = 0; i < possibilityCurrentPiece.length; i++) {
                if(x === possibilityCurrentPiece[i].x && y === possibilityCurrentPiece[i].y){
                    me.pieces[x][y] = currentPiece;
                    me.pieces[currentPiecePosition.x][currentPiecePosition.y] = undefined;
                }
            }
        }   
        TheBoard.draw();
    });
}

Board.prototype.draw = function () {

    //Les cases et les cordonnées

    for (let x = 0; x < nbCase; x++) {
        if (x % 2 === 0) {//les colonnes paires
            for (let y = 0; y < nbCase; y++) {
                //choix de la couleur en fonction de x
                if (y % 2 === 0) {
                    ctx.fillStyle = this.color2;
                } else {
                    ctx.fillStyle = this.color1;
                }
                ctx.beginPath();
                ctx.rect(this.x + y * this.dimension, this.y + x * this.dimension, this.dimension, this.dimension);
                ctx.fill();
            }
        } else {//les colonnes impaires
            for (let y = 0; y < nbCase; y++) {
                //choix de la couleur en fonction de x
                if (y % 2 === 0) {
                    ctx.fillStyle = this.color1;
                } else {
                    ctx.fillStyle = this.color2;
                }
                ctx.beginPath();
                ctx.rect(this.x + y * this.dimension, this.y + x * this.dimension, this.dimension, this.dimension);
                ctx.fill();
                //les lettres en lignes
                if (y === 7 && x === 7) {
                    for (let y = 0; y < nbCase; y++) {
                        ctx.fillStyle = 'rgb(255, 255, 255)';
                        ctx.fillText(letters[y], this.x + 32 + y * this.dimension, this.y + 25 + (x + 1) * this.dimension);
                    }
                }
            }
        }
        //les chiffres en colonnes
        ctx.fillStyle = 'rgb(255,255,255)';
        ctx.font = '20px sans-serif';
        ctx.fillText(8 - x, this.x - 25, this.y + 42 + x * this.dimension);
    }
    //ajout des pièces de manière automatique
    for (let x = 0; x < nbCase; x++) {
        for (let y = 0; y < nbCase; y++) {
            if (y === 0) {
                if (x === 0 || x === 7) {
                    this.pieces[x][y] = new Rook(Player.Black);
                }
                if (x === 1 || x === 6) {
                    this.pieces[x][y] = new Knight(Player.Black);
                }
                if (x === 2 || x === 5) {
                    this.pieces[x][y] = new Bishop(Player.Black);
                }
                if (x === 3) {
                    this.pieces[x][y] = new Queen(Player.Black);
                }
                if (x === 4) {
                    this.pieces[x][y] = new King(Player.Black);
                }
            }
            if (y === 1) {
                this.pieces[x][y] = new Pawn(Player.Black);
            }

            if (y === 6) {
                this.pieces[x][y] = new Pawn(Player.White);
            }
            if (y === 7) {
                if (x === 0 || x === 7) {
                    this.pieces[x][y] = new Rook(Player.White);
                }
                if (x === 1 || x === 6) {
                    this.pieces[x][y] = new Knight(Player.White);
                }
                if (x === 2 || x === 5) {
                    this.pieces[x][y] = new Bishop(Player.White);
                }
                if (x === 3) {
                    this.pieces[x][y] = new Queen(Player.White);
                }
                if (x === 4) {
                    this.pieces[x][y] = new King(Player.White);
                }
            }
        }
    }
    //integration des pièces dans le tableau qui représente les cases
    for (let x = 0; x < this.pieces.length; x++) {//première dimension (lignes)
        for (let y = 0; y < this.pieces[x].length; y++) {//deuxième dimension (colonnes)
            let piece = this.pieces[x][y];
            if (piece) {
                piece.draw(x * this.dimension + 50, y * this.dimension + 50);//dessin de la pièce en fonction de ses propriétés
            }
        }
    }
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
    let image = this.image;
    if (image.complete) {
        ctx.drawImage(image, x, y);
    } else {
        image.onload = function () {
            ctx.drawImage(image, x, y);
        }
    }
}

//PION
function Pawn(player) {
    PieceRef.call(this, player);
    //la fonction call() permet d'avoir les mêmes attributs que le PieceRef. Plus info: https://developer.mozilla.org/fr/docs/Learn/JavaScript/Objects/Classes_in_JavaScript
}

Pawn.prototype = Object.create(PieceRef.prototype);
//permet à Pawn d'avoir toutes les méthodes de PieceRef(la fonction draw).
Pawn.prototype.constructor = Pawn;
//fait que le constructeur de Pawn soit Pawn et non PieceRef
//gère les endroits où peut aller le pion
Pawn.prototype.whereCanMove = function (x, y) {
    if (this.player === Player.Black) {
        if (y === 1) {
            return [
                {
                    x: x,
                    y: y + 1
                },
                {
                    x: x,
                    y: y + 2
                }
            ]
        } else {
            return [
                {
                    x: x,
                    y: y + 1
                }
            ]
        }
    } else {
        if (y === 6) {
            return [
                {
                    x: x,
                    y: y - 1
                },
                {
                    x: x,
                    y: y - 2
                }
            ]
        } else {
            return [
                {
                    x: x,
                    y: y - 1
                }
            ]
        }
    }
}

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


/*Changement du thème de fond*/
var changeTheme = document.getElementById('ChangeTheme');
var bodyTheme = document.querySelector('body');
changeTheme.addEventListener('click', function change() {
    let actualColor = bodyTheme.style.backgroundColor;
    let colorPrint = {
        1: 'rgb(52, 73, 94)',
        2: 'rgb(241, 196, 15)'
    };
    if (actualColor !== colorPrint[1]) {
        bodyTheme.style.backgroundColor = colorPrint[1];
    } else {
        bodyTheme.style.backgroundColor = colorPrint[2];
    }
});


/*Application des variables*/

//on donne les valeurs nécessaires à la création de l'échiquier
var TheBoard = new Board({
    //la position dans le canvas
    x: 50,
    y: 50,
    dimension: 75,//c'est la dimension des cases
});

//dessin de l'échiquier
TheBoard.draw();