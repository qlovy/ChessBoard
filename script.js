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
    let me = this;//
    this.x = config.x;
    this.y = config.y;
    this.dimension = config.dimension;//la dimension des cases
    this.color1 = config.color1 || 'rgb(205, 97, 51)';//couleur "blanc"
    this.color2 = config.color2 || 'rgb(192, 190, 190)';//couleur "noir"
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

        //dessin des possibilités si on a appuie avec le clique gauche
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
                for (let i = 0; i < whereCanMove.length; i++) {
                    for (let j = 0; j < whereCanMove.length; j++) {
                        if (whereCanMove[i][j] === true) {//Si les cordonnées donnent sur un endroit ok
                            ctx.fillStyle = '#8e44ad';
                            ctx.beginPath();
                            ctx.arc(i * this.dimension + 50 + Math.round(this.dimension / 2), j * this.dimension + 50 + Math.round(this.dimension / 2), 10, 0, 360);
                            ctx.fill();
                        }
                        if(whereCanEat[i][j] === true){
                            ctx.fillStyle = '#16a085';
                            ctx.beginPath();
                            ctx.arc(i * this.dimension + 50 + Math.round(this.dimension / 2), j * this.dimension + 50 + Math.round(this.dimension / 2), 10, 0, 360);
                            ctx.fill();
                        }    
                    }
                }
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
        let whereCanEat = currentPiece.whereCanEat(currentPiecePosition.x, currentPiecePosition.y);

        //déplacement de la pièce
        if (e.which === 1) {//Si le clique gauche est relaché
            if (currentPiece.ID === "pawn") {
                //déplacement de du pion sans manger
                for (let i = 0; i < whereCanMove.length; i++) {
                    if (x === whereCanMove[i].x && y === whereCanMove[i].y) {//les cordonnées de la souris doivent correspondre aux possibilitées de mouvements de du pion.
                        if (me.pieces[x][y] === undefined) {//on doit pointer sur une place libre. 
                            me.pieces[x][y] = currentPiece;//on la replace dans le tableau
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
            }else{
                for (let i = 0; i < whereCanMove.length; i++) {
                    for (let j = 0; j < whereCanMove.length; j++) {
                        if ((whereCanMove[i][j] === true || whereCanEat[i][j] === true) && x === i && y === j) {
                            me.pieces[x][y] = currentPiece;
                            me.pieces[currentPiecePosition.x][currentPiecePosition.y] = undefined;
                        }   
                    }
                }
            }
        }
        //dessin des pièces sur l'échiquier
        TheBoard.draw();
    });
}

Board.prototype.draw = function () {//dessine l'échiquier avec les pièces
    
    //affichage centrage de l'échiquier par rapport au canvas
    //ctx.fillStyle = '#000000';
    //ctx.beginPath();
    //ctx.rect(0, 0, width, height);
    //ctx.fill();

    //Les cases et les cordonnées

    for (let x = 0; x < nbCase; x++) {
        if (x % 2 === 0) {//les colonnes paires
            for (let y = 0; y < nbCase; y++) {
                //choix de la couleur en fonction de y (ligne)
                if (y % 2 === 0) {//(division sans reste)
                    ctx.fillStyle = this.color2;//pour les lignes paires
                } else {
                    ctx.fillStyle = this.color1;//pour les lignes impaires
                }
                //dessin du rectangle
                ctx.beginPath();
                ctx.rect(this.x + y * this.dimension, this.y + x * this.dimension, this.dimension, this.dimension);
                ctx.fill();
            }
        } else {//les colonnes impaires
            for (let y = 0; y < nbCase; y++) {
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
                    for (let i = 0; i < nbCase; i++) {
                        ctx.fillStyle = 'rgb(255, 255, 255)';
                        ctx.fillText(letters[i], this.x + 32 + i * this.dimension, this.y + 25 + (x + 1) * this.dimension);
                        //le 32 vient de this.dimension(75)/2 = 32,5 ==> 32 / le 25 vient de tatonement pour ajuster un bon placement des lettres.
                    }
                }
            }
        }
        //les chiffres en colonnes
        ctx.fillStyle = 'rgb(255,255,255)';
        ctx.font = '20px sans-serif';
        ctx.fillText(8 - x, this.x - 25, this.y + 42 + x * this.dimension);
    }
    //ajout des pièces
    if (atStart === true) {//s'exécute seulement au départ
        for (let x = 0; x < nbCase; x++) {
            for (let y = 0; y < nbCase; y++) {
                if (y === 0) {//la dernière rangée (pour les blancs), 8
                    if (x === 0 || x === 7) {// en a8 et h8
                        this.pieces[x][y] = new Rook(Player.Black);
                    }
                    if (x === 1 || x === 6) {// en b8 et g8
                        this.pieces[x][y] = new Knight(Player.Black);
                    }
                    if (x === 2 || x === 5) {// en c8 et f8 
                        this.pieces[x][y] = new Bishop(Player.Black);
                    }
                    if (x === 3) {// en d8
                        this.pieces[x][y] = new Queen(Player.Black);
                    }
                    if (x === 4) {// en e8
                        this.pieces[x][y] = new King(Player.Black);
                    }
                }
                if (y === 1) {//l'avant dernière rangée, 7
                    this.pieces[x][y] = new Pawn(Player.Black);
                }

                if (y === 6) {//la deuxième rangée, 2
                    this.pieces[x][y] = new Pawn(Player.White);
                }
                if (y === 7) {//la première rangée, 1
                    if (x === 0 || x === 7) {// en a1 et h1, ...
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
        atStart = false;//s'execute une seule fois
    }

    //integration des pièces dans le tableau qui représente les cases
    for (let x = 0; x < this.pieces.length; x++) {//première dimension (lignes), axe x, a - h
        for (let y = 0; y < this.pieces[x].length; y++) {//deuxième dimension (colonnes), axe y, 8 - 1
            let piece = this.pieces[x][y];
            if (piece) {//si ce n'est pas undefine
                piece.draw(x * this.dimension + 50, y * this.dimension + 50);//dessin de la pièce en fonction de ses propriétés
            }
        }
    }
}

Board.prototype.canImoveHere = function (x, y) {//détermine à l'aide de cordonnée si une pièce peut se déplacer
    if (x >= 0 && x <= 7 && y >= 0 && y <= 7) {//les cordonnées appartiennent à une case sur l'échiquier.
        return this.pieces[x][y] === undefined;//l'endroit doit être libre.
    } else {
        return false;
    }
}

Board.prototype.canIeatHere = function(x, y){//détermine si la pièce en rencontre une autre
    if(x >= 0 && x <= 7 && y >= 0 && y <= 7){
        return this.pieces[x][y] !== undefined;//l'endroit doit être occupé.
    }else{
        return false;
    }
}

Board.prototype.colorRule = function(x, y, colorPiece){//détermine si la pièce rencontrée est mangeable en fonction de sa couleur.
    return this.pieces[x][y].player !== colorPiece;//la couleur doit être différente.
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
    if (image.complete) {//vérifie que l'image est complète.
        ctx.drawImage(image, x, y);//on la dessine.
    } else {
        image.onload = function () {//sinon on attend qu'elle le soit.
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
Rook.prototype.whereCanMove = function (x, y) {//créer un tableau qui dit les endroits où la pièce peut se déplacer.
    let array = createFalseArray();
    let state = 0;
    while (state <= 3) {
        let stop = false;
        for (let i = 1; i < array.length; i++) {
            //vers la droite
            if (state === 0 && stop === false) {//première direction
                if (TheBoard.canImoveHere(x + i * 1, y) === true) {//si les cordonnées correspondent à un endroit libre
                    array[x + i * 1][y] = true;//on l'ajoute au tableau
                } else {
                    stop = true;//permet d'arrêter le cycle
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
    return array;//on renvoie le tableau contenant l'état de la case de déplacement (true or false).(x puis y)
};
Rook.prototype.whereCanEat = function (x, y) {//créer un tableau qui dit les endroits où peut manger la pièce
    let array = createFalseArray();
    let state = 0;
    while (state <= 3) {
        let stop = false;
        for (let i = 1; i < array.length; i++) {
            //vers la droite
            if (state === 0 && stop === false) {
                if (TheBoard.canIeatHere(x + i * 1, y) === true) {
                    stop = true;
                    if(TheBoard.colorRule(x + i * 1, y, this.player) === true){//détermine si la pièce présente n'est pas de la même couleur que la pièce séléctionnée
                        array[x + i*1][y] = true;//on ajoute un "true" au tableau de "false"
                    }
                }
            }
            //vers la gauche
            if (state === 1 && stop === false) {
                if (TheBoard.canIeatHere(x - i * 1, y) === true) {
                    stop = true;
                    if(TheBoard.colorRule(x - i*1, y, this.player) === true){
                        array[x - i*1][y] = true;
                    }
                }
            }
            //vers le bas
            if (state === 2 && stop === false) {
                if (TheBoard.canIeatHere(x, y + i * 1) === true) {
                    stop = true;
                    if(TheBoard.colorRule(x, y + i*1, this.player) === true){
                        array[x][y + i*1] = true;
                    }
                }
            }
            //vers le haut
            if (state === 3 && stop === false) {
                if (TheBoard.canIeatHere(x, y - i * 1) === true) {
                    stop = true;
                    if(TheBoard.colorRule(x, y - i*1, this.player) === true){
                        array[x][y - i*1] = true;
                    }
                }
            }
        }
        state++;
    }
    return array;//tableau de "true" ou "false" qui est dimenioné comme l'échiquier.
};

//FOU
function Bishop(player) {
    PieceRef.call(this, player);
}

Bishop.prototype = Object.create(PieceRef.prototype);
Bishop.prototype.constructor = Bishop;
Bishop.prototype.whereCanMove = function (x, y) {
    let array = createFalseArray();
    let state = 0;
    while (state <= 3) {
        let stop = false;
        for (let i = 1; i < array.length; i++) {
            //le bas-droite
            if (state === 0 && stop === false) {
                if (TheBoard.canImoveHere(x + i * 1, y + i*1) === true) {
                    array[x + i * 1][y + i*1] = true;
                } else {
                    stop = true;
                }
            }
            //le bas-gauche
            if (state === 1 && stop === false) {
                if (TheBoard.canImoveHere(x - i * 1, y + i*1) === true) {
                    array[x - i * 1][y + i*1] = true;
                } else {
                    stop = true;
                }
            }
            //le haut-gauche
            if (state === 3 && stop === false) {
                if (TheBoard.canImoveHere(x - i*1, y - i * 1) === true) {
                    array[x - i*1][y - i * 1] = true;
                } else {
                    stop = true;
                }
            }
            //le haut-droite
            if (state === 2 && stop === false) {
                if (TheBoard.canImoveHere(x + i*1, y - i * 1) === true) {
                    array[x + i*1][y - i * 1] = true;
                } else {
                    stop = true;
                }
            }
        }
        state++;
    }
    return array;
}
Bishop.prototype.whereCanEat = function (x, y) {
    let array = createFalseArray();
    let state = 0;
    while (state <= 3) {
        let stop = false;
        for (let i = 1; i < array.length; i++) {
            //le bas-droite
            if (state === 0 && stop === false) {
                if (TheBoard.canIeatHere(x + i * 1, y + i*1) === true) {
                    stop = true;
                    if(TheBoard.colorRule(x + i*1, y + i*1, this.player) === true){
                        array[x + i*1][y + i*1] = true;
                    }
                }
            }
            //le bas-gauche
            if (state === 1 && stop === false) {
                if (TheBoard.canIeatHere(x - i * 1, y + i*1) === true) {
                    stop = true;
                    if(TheBoard.colorRule(x - i*1, y + i*1, this.player) === true){
                        array[x - i*1][y + i*1] = true;
                    }
                }
            }
            //le haut-gauche
            if (state === 3 && stop === false) {
                if (TheBoard.canIeatHere(x - i * 1, y - i*1) === true) {
                    stop = true;
                    if(TheBoard.colorRule(x - i*1, y - i*1, this.player) === true){
                        array[x - i*1][y - i*1] = true;
                    }
                }
            }
            //le haut-droite
            if (state === 2 && stop === false) {
                if (TheBoard.canIeatHere(x + i * 1, y - i*1) === true) {
                    stop = true;
                    if(TheBoard.colorRule(x + i*1, y - i*1, this.player) === true){
                        array[x + i*1][y - i*1] = true;
                    }
                }
            }
        }
        state++;
    }
    return array;
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
Queen.prototype.whereCanMove = function(x, y) {
    let array = createFalseArray();
    let state = 0;
    while (state <= 7) {
        let stop = false;
        for (let i = 1; i < array.length; i++) {
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
            //le bas-droite
            if (state === 4 && stop === false) {
                if (TheBoard.canImoveHere(x + i * 1, y + i*1) === true) {
                    array[x + i * 1][y + i*1] = true;
                } else {
                    stop = true;
                }
            }
            //le bas-gauche
            if (state === 5 && stop === false) {
                if (TheBoard.canImoveHere(x - i * 1, y + i*1) === true) {
                    array[x - i * 1][y + i*1] = true;
                } else {
                    stop = true;
                }
            }
            //le haut-gauche
            if (state === 6 && stop === false) {
                if (TheBoard.canImoveHere(x - i*1, y - i * 1) === true) {
                    array[x - i*1][y - i * 1] = true;
                } else {
                    stop = true;
                }
            }
            //le haut-droite
            if (state === 7 && stop === false) {
                if (TheBoard.canImoveHere(x + i*1, y - i * 1) === true) {
                    array[x + i*1][y - i * 1] = true;
                } else {
                    stop = true;
                }
            }
        }
        state++;
    }
    return array;
}
Queen.prototype.whereCanEat = function(x, y){
    let array = createFalseArray();
    let state = 0
    while(state <= 7){
        let stop = false;
        for (let i = 1; i < array.length; i++) {
            //vers la droite
            if (state === 0 && stop === false) {
                if (TheBoard.canIeatHere(x + i * 1, y) === true) {
                    stop = true;
                    if(TheBoard.colorRule(x + i * 1, y, this.player) === true){
                        array[x + i*1][y] = true;
                    }
                }
            }
            //vers la gauche
            if (state === 1 && stop === false) {
                if (TheBoard.canIeatHere(x - i * 1, y) === true) {
                    stop = true;
                    if(TheBoard.colorRule(x - i*1, y, this.player) === true){
                        array[x - i*1][y] = true;
                    }
                }
            }
            //vers le bas
            if (state === 2 && stop === false) {
                if (TheBoard.canIeatHere(x, y + i * 1) === true) {
                    stop = true;
                    if(TheBoard.colorRule(x, y + i*1, this.player) === true){
                        array[x][y + i*1] = true;
                    }
                }
            }
            //vers le haut
            if (state === 3 && stop === false) {
                if (TheBoard.canIeatHere(x, y - i * 1) === true) {
                    stop = true;
                    if(TheBoard.colorRule(x, y - i*1, this.player) === true){
                        array[x][y - i*1] = true;
                    }
                }
            }
            //le bas-droite
            if (state === 4 && stop === false) {
                if (TheBoard.canIeatHere(x + i * 1, y + i*1) === true) {
                    stop = true;
                    if(TheBoard.colorRule(x + i*1, y + i*1, this.player) === true){
                        array[x + i*1][y + i*1] = true;
                    }
                }
            }
            //le bas-gauche
            if (state === 5 && stop === false) {
                if (TheBoard.canIeatHere(x - i * 1, y + i*1) === true) {
                    stop = true;
                    if(TheBoard.colorRule(x - i*1, y + i*1, this.player) === true){
                        array[x - i*1][y + i*1] = true;
                    }
                }
            }
            //le haut-gauche
            if (state === 6 && stop === false) {
                if (TheBoard.canIeatHere(x - i * 1, y - i*1) === true) {
                    stop = true;
                    if(TheBoard.colorRule(x - i*1, y - i*1, this.player) === true){
                        array[x - i*1][y - i*1] = true;
                    }
                }
            }
            //le haut-droite
            if (state === 7 && stop === false) {
                if (TheBoard.canIeatHere(x + i * 1, y - i*1) === true) {
                    stop = true;
                    if(TheBoard.colorRule(x + i*1, y - i*1, this.player) === true){
                        array[x + i*1][y - i*1] = true;
                    }
                }
            }
        }
        state++;
    }
    return array;
}

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