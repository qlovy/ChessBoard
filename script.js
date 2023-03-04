
/*CANVAS*/

const canvas = document.querySelector('#Canvas');//cela nous permet de prendre toutes les informations nécessaires.
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

