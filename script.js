/*
CANVAS
*/

const canvas = document.querySelector("#canvas");//cela nous permet de prendre toutes les informations nécessaires.
const width = canvas.width = 700;
const height = canvas.height = 700;
const ctx = canvas.getContext('2d');//l'environnement du canvas, ici en deux dimensions.

/*
GENERALS VARIABLES
*/

const nbCase = 8;
//les joueurs
const Player = {
    White: 'W',
    Black: 'B'
}
const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
let currentPiece;
let currentPiecePosition;
let atStart = true;
let iStopX = [];
let iStopY = [];
let xDontWork;
let yDontWork;
let IsIgnore1 = false;
let IsIgnore2 = false;
let IsIgnore3 = false;
let IsIgnore4 = false;
/*
GENERALS FUNCTIONS
*/

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
function goTopCalc(y, i) {
    let a = y - 1 - 1 * i;
    if (a > -1) {
        return a;
    }
}
function goDownCalc(y, i) {
    let a = y + 1 + 1 * i;
    if (a < 8) {
        return a;
    }
}
function goLeftCalc(x, i) {
    let a = x - 1 - 1 * i;
    if (a > -1) {
        return a;
    }
}
function goRightClac(x, i) {
    let a = x + 1 + 1 * i;
    if (a < 8) {
        return a;
    }
}
function createFalseArray() {
    let array = [[], [], [], [], [], [], [], []];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            array[j][i] = false;
        }
    }
    return array;
}

/*
BOARD
*/

function Board(config) {
    let me = this;
    this.x = config.x;
    this.y = config.y;
    this.dimension = config.dimension;
    this.color1 = config.color1 || 'rgb(205, 97, 51)';
    this.color2 = config.color2 || 'rgb(192, 190, 190)';
    this.pieces = [[], [], [], [], [], [], [], []];

    //événement qui gère quand on appuie sur le bouton de la souris
    canvas.addEventListener('mousedown', (e) => {

        let rect = canvas.getBoundingClientRect();//les cordonnées de placement du canvas
        let x = Math.floor((e.clientX - rect.left - 50) / this.dimension);//Math.floor arrondi à l'inférieure.
        let y = Math.floor((e.clientY - rect.top - 50) / this.dimension);
        currentPiece = me.pieces[x][y];//la pièce séléctionnée par le joueur
        currentPiecePosition = { x: x, y: y };//Ses cordonnées sur l'échiquier
        let whereCanMove = currentPiece.whereCanMove(x, y);
        let whereCanEat = currentPiece.whereCanEat(x, y);

        //reset l'affichage des possibilités de la pièce
        TheBoard.draw();

        //dessin des possibilités si on a appuyé avec le clique gauche
        if (e.which === 1) {
            if (currentPiece.ID === "pawn") {//Pour le pion
                //montre les possibilités de déplacement
                for (let i = 0; i < whereCanMove.length; i++) {
                    if (me.pieces[whereCanMove[i].x][whereCanMove[i].y] === undefined) {//vérifie que les possibilités de déplacement correspondent à des endroits libres.
                        ctx.fillStyle = '#8e44ad';
                        ctx.beginPath();
                        ctx.arc(whereCanMove[i].x * this.dimension + 50 + Math.round(this.dimension / 2), whereCanMove[i].y * this.dimension + 50 + Math.round(this.dimension / 2), 10, 0, 360);
                        ctx.fill();
                    }
                }
                //montre les possibilités pour manger.
                for (let i = 0; i < whereCanEat.length; i++) {
                    if (me.pieces[whereCanEat[i].x][whereCanEat[i].y] !== undefined) {//vérifie que les possibilités de déplacement correspondent à des endroits occupés.                        
                        if (currentPiece.player !== me.pieces[whereCanEat[i].x][whereCanEat[i].y].player) {//on ne se mange pas entre pièce de la même couleur.
                            ctx.fillStyle = '#16a085';
                            ctx.beginPath();
                            ctx.arc(whereCanEat[i].x * this.dimension + 50 + Math.round(this.dimension / 2), whereCanEat[i].y * this.dimension + 50 + Math.round(this.dimension / 2), 10, 0, 360);
                            ctx.fill();
                        }
                    }
                }
            } else {//Pour les autres pièces
                console.log(whereCanMove);
                for (let i = 0; i < whereCanMove.length; i++) {
                    for(let j = 0; j < whereCanMove.length; j++){
                        if(whereCanMove[i][j] === true){
                            ctx.fillStyle = '#8e44ad';
                            ctx.beginPath();
                            ctx.arc(i * this.dimension + 50 + Math.round(this.dimension / 2), j * this.dimension + 50 + Math.round(this.dimension / 2), 10, 0, 360);
                            ctx.fill();
                        }
                    } 
                }



                ////triage x
                //for (let i = 0; i < wherePiecesCanMoveX.length; i++) {
                //    if (wherePiecesCanMoveX[i] >= 0 && wherePiecesCanMoveX[i] <= 7) {//les mouvement de la pièce doivent rester dans l'échiquier.
                //        if (me.pieces[wherePiecesCanMoveX[i]][y] !== undefined) {//détecte un obstacle (soit une pièce).
                //            if (me.pieces[x][wherePiecesCanMoveY[i]] !== currentPiece) {
                //                iStopX.push(i);
                //            }
                //        }
                //        xDontWork = iStopX[0];
                //    }
                //}
                ////triage y (même fonctionnement que le triage x)
                //for (let i = 0; i < wherePiecesCanMoveY.length; i++) {
                //    if (wherePiecesCanMoveY[i] >= 0 && wherePiecesCanMoveY[i] <= 7) {
                //        if (me.pieces[x][wherePiecesCanMoveY[i]] !== undefined) {
                //            if (me.pieces[x][wherePiecesCanMoveY[i]] !== currentPiece) {
                //                if(currentPiece.player === Player.Black){
                //                    iStopY.push(i);
                //                }else{
                //                    iStopY.push(wherePiecesCanMoveY.length - 1 - i);
                //                } 
                //            }
                //        }
                //        yDontWork = iStopY[0];
                //    }
                //}
                ////dessin des points de déplacements en x
                //for (let i = 0; i < wherePiecesCanMoveX.length; i++) {
                //    if (wherePiecesCanMoveX[i] >= 0 && wherePiecesCanMoveX[i] <= 7) {
                //        if (me.pieces[wherePiecesCanMoveX[i]][y] !== currentPiece) {//évite que la pièce se déplace sur elle-même.
                //            if (i < xDontWork) {//on dessine jusqu'à la pièce qu y bloque.
                //                //dessine un cercle
                //                ctx.fillStyle = '#8e44ad';
                //                ctx.beginPath();
                //                ctx.arc(wherePiecesCanMoveX[i] * this.dimension + 50 + Math.round(this.dimension / 2), y * this.dimension + 50 + Math.round(this.dimension / 2), 10, 0, 360);
                //                ctx.fill();
                //           }
                //       }
                //    }
                //}
                ////dessin des points de déplacements en y (même fonctionnement que les points de déplacements en x)
                //for (let i = 0; i < wherePiecesCanMoveY.length; i++) {
                //    if (wherePiecesCanMoveY[i] >= 0 && wherePiecesCanMoveY[i] <= 7) {
                //        if (me.pieces[x][wherePiecesCanMoveY[i]] !== currentPiece) {
                //            if (i < yDontWork) {
                //                ctx.fillStyle = '#8e44ad';
                //                ctx.beginPath();
                //                ctx.arc(x * this.dimension + 50 + Math.round(this.dimension / 2), wherePiecesCanMoveY[i] * this.dimension + 50 + Math.round(this.dimension / 2), 10, 0, 360);
                //                ctx.fill();
                //            }
                //        }
                //    }
                //}
            }
            iStopX = [];
            iStopY = [];
        }
    });

    //événement qui gère quand on relâche le bouton de la souris
    canvas.addEventListener('mouseup', (e) => {
        let rect = canvas.getBoundingClientRect();
        let x = Math.floor((e.clientX - rect.left - 50) / this.dimension);
        let y = Math.floor((e.clientY - rect.top - 50) / this.dimension);
        let whereCanMove = currentPiece.whereCanMove(currentPiecePosition.x, currentPiecePosition.y);
        let whereCanEat = currentPiece.whereCanEat(currentPiecePosition.x, currentPiecePosition.y);//seulement pour le pion

        //déplacement de la pièce
        if (e.which === 1) {
            if (currentPiece.ID === "pawn") {
                //déplacement de la pièce sans manger
                for (let i = 0; i < whereCanMove.length; i++) {
                    if (x === whereCanMove[i].x && y === whereCanMove[i].y) {//les cordonnées de la souris doivent correspondre aux mouvement de la pièces.
                        if (me.pieces[x][y] === undefined) {//on doit cliquer sur une place libre. 
                            me.pieces[x][y] = currentPiece;
                            me.pieces[currentPiecePosition.x][currentPiecePosition.y] = undefined;
                        }
                    }
                }
                //déplacement avec manger
                for (let i = 0; i < whereCanEat.length; i++) {
                    if (x === whereCanEat[i].x && y === whereCanEat[i].y) {
                        if (me.pieces[x][y] !== undefined) {//on doit manger qqlch.
                            if (currentPiece.player !== me.pieces[x][y].player) {
                                me.pieces[x][y] = currentPiece;
                                me.pieces[currentPiecePosition.x][currentPiecePosition.y] = undefined;
                            }
                        }
                    }
                }
            }
        }
        //dessin des pièces sur l'échiquier
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
    if (atStart === true) {//s'exécute seulement au départ
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
        atStart = false;
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

Board.prototype.canImoveHere = function (x, y) {
    if (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
        return this.pieces[x][y] === undefined;
    } else {
        return false;
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
    this.ID = "pawn";
}

Pawn.prototype = Object.create(PieceRef.prototype);
//permet à Pawn d'avoir toutes les méthodes de PieceRef(la fonction draw).
Pawn.prototype.constructor = Pawn;
//fait que le constructeur de Pawn soit Pawn et non PieceRef
//gère les endroits où peut aller le pion
Pawn.prototype.whereCanMove = function (x, y) {
    if (this.player === Player.Black) {
        if (y !== 7) {
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
        }
    } else {
        if (y !== 0) {
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
}
Pawn.prototype.whereCanEat = function (x, y) {
    if (this.player === Player.Black) {
        if (y !== 7) {
            if (x === 0) {
                return [
                    {
                        x: x + 1,
                        y: y + 1
                    }
                ]
            } if (x === 7) {
                return [
                    {
                        x: x - 1,
                        y: y + 1
                    }
                ]
            } else {
                return [
                    {
                        x: x - 1,
                        y: y + 1
                    },
                    {
                        x: x + 1,
                        y: y + 1
                    }
                ]
            }
        }
    } else {
        if (y !== 0) {
            if (x === 0) {
                return [
                    {
                        x: x + 1,
                        y: y - 1
                    }
                ]
            } if (x === 7) {
                return [
                    {
                        x: x - 1,
                        y: y - 1
                    }
                ]
            } else {
                return [
                    {
                        x: x - 1,
                        y: y - 1
                    },
                    {
                        x: x + 1,
                        y: y - 1
                    }
                ]
            }
        }
    }
}


//TOUR
function Rook(player) {
    PieceRef.call(this, player);
}

Rook.prototype = Object.create(PieceRef.prototype);
Rook.prototype.constructor = Rook;
Rook.prototype.whereCanMove = function (x, y) {
    let array = createFalseArray();
    let state = 0;
    while (state <= 3) {
        let stop = false;
        for (let i = 1; i < 8; i++) {
            //vers la droite
            if (state === 0 && stop === false) {
                if (TheBoard.canImoveHere(x + i * 1, y) === true) {
                    array[x + i * 1][y] = true;
                } else {
                    stop = true;
                }
            }
            //vers la gauche
            if (state === 1 && stop === false) {
                if (TheBoard.canImoveHere(x - i * 1, y) === true) {
                    array[x - i * 1][y] = true;
                } else {
                    stop = true;
                }
            }
            //vers le bas
            if (state === 2 && stop === false) {
                if (TheBoard.canImoveHere(x, y + i * 1) === true) {
                    array[x][y + i * 1] = true;
                } else {
                    stop = true;
                }
            }
            //vers le haut
            if (state === 3 && stop === false) {
                if (TheBoard.canImoveHere(x, y - i * 1) === true) {
                    array[x][y - i * 1] = true;
                } else {
                    stop = true;
                }
            }
        }
        state++;
    }
    return array;//on renvoie le tableau contenant les cordonnées de déplacement.(x puis y)
};
Rook.prototype.whereCanEat = function (x, y) {
    return this.whereCanMove(x, y);
};

//FOU
function Bishop(player) {
    PieceRef.call(this, player);
}

Bishop.prototype = Object.create(PieceRef.prototype);
Bishop.prototype.constructor = Bishop;
Bishop.prototype.whereCanEat = function () { }
Bishop.prototype.whereCanEat = function (x, y) {
    return this.whereCanMove(x, y);
}

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