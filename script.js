window.onload = function() {

    var canvasWidth = 900; // largeur canvas
    var canvasHeigth = 600; // hauteur canvas
    var blockSize = 30; // taille d'un block
    var ctx; // le contexte
    var delay = 150; // exprimer en milliseconde donc la 1 seconde (delai de rafraichissement)   
    var snakee; // le serpent
    var applee; // la pomme
    var widthInBlocks = canvasWidth / blockSize; // calculer le nombre de block sur la largeur donc 29
    var heightInBlocks = canvasHeigth / blockSize; //calculer le nombre de block sur la hauteur donc 19
    var score; // on créé la variable score
    var timeout; // 

    init();
// FONCTION INIT ---------------------------------------------------------
    function init() { // initialisation du jeu

        var canvas = document.createElement('canvas'); // on créé un canvas
        canvas.width = canvasWidth; // on donne une largeur au canvas
        canvas.height = canvasHeigth; // on donne une hauteur au canvas
        canvas.style.border = "30px solid gray"; // on met une bordure au canvas
        canvas.style.margin = "5px auto"; // on ajoute des marges
        canvas.style.display = "block"; // pour que ça fonctionne il faut display:block 
        canvas.style.backgroundImage = "url('images/meadow.jpg')"; // mettre une couleur de fond au canvas     
        document.body.appendChild(canvas); // on affecte le canvas au body      
        ctx = canvas.getContext('2d'); // on va utiliser la 2d
        snakee = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4]], "right"); // le body est représenté par 3 blocks : point de depart du snake avec une direction right
        applee = new Apple([10,10]); // la pomme avec sa position
        score = 0; // on initialise le score
        refreshCanvas();
    }
// REFRESH CANVAS ----------------------------------------------------------
    function refreshCanvas() { // quand on rafraîchit
       
        snakee.advance(); // le serpent avance

        if(snakee.checkCollision()) {
        
            // GAME OVER
            gameOver();
        }
        else {
       
            if(snakee.isEatingApple(applee)) {
            
                score++; // on augmente le score des qu'on mange une pomme SCORE
                snakee.ateApple = true;
                do {
                
                    applee.setNewPosition(); // on donne une nouvelle position
                }
                while(applee.isOnSnake(snakee)) // on verifie si la nouvelle pomme n'est pas sur le snake
               
            }
            ctx.clearRect(0,0,canvasWidth, canvasHeigth); // on créé notre canvas
            drawScore(); // on affiche le score SCORE on le met en premier pour qu'il s'affiche derrière le serpent et la pomme       
            snakee.draw(); // on dessine le serpent
            applee.draw(); // on dessine la pomme            
            timeout = setTimeout(refreshCanvas,delay); // refait la fonction refreshCanvas
        }
        
    }
// DRAWBLOCK -----------------------------------------------
    function drawBlock(ctx, position) {
    
        var x = position[0]*blockSize;
        var y = position[1]*blockSize;
        ctx.fillRect(x,y,blockSize,blockSize);
    }
// FUNCTION GAME OVER -----------------------------------------
    function gameOver() {
    
        ctx.save();
        ctx.font = "bold 70px sans-serif"; // style d'écriture du game over
        ctx.fillStyle = "#000"; // couleurs d'écriture
        ctx.textAlign = "center"; // on centre le texte
        ctx.textBaseline = "middle"; // on affiche le texte par rapport a son centre et non a sa base
        ctx.strokeStyle = "white"; // mettre une bordure au texte
        ctx.lineWidth = 5; //mettre une épaisseur au stroke
        var centreX = canvasWidth / 2; // on calcule le centre sur l'axe X
        var centreY = canvasHeigth / 2; // on calcule le centre des Y
        ctx.strokeText("Game Over", centreX, centreY - 180); // on remplit le stroke
        ctx.fillText("Game Over", centreX, centreY - 180); // on écrit game over en le positionne
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appuyer sur la touche Espace pour rejouer", centreX, centreY - 120); // on remplit le stroke
        ctx.fillText("Appuyer sur la touche Espace pour rejouer", centreX, centreY - 120); // on ecrit un message pour aider
        ctx.restore();
    }
// FONCTION RESTART (pour relancer une partie)
    function restart() {
    
        snakee = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4]], "right"); // le body est représenté par 3 blocks : point de depart du snake avec une direction right
        applee = new Apple([10,10]); // la pomme avec sa position
        score = 0; // on initialise le score
        clearTimeout(timeout); // on remet a zéro la var timeout (delay) ça évite que si on appuie sur Espace plusieur la vitesse augment
        refreshCanvas();
    }
// FONCTION POUR LE SCORE -----------------------------------------
    function drawScore() {
    
        ctx.save();
        ctx.font = "bold 200px sans-serif"; // style d'écriture du score
        ctx.fillStyle = "gray"; // couleurs d'écriture
        ctx.textAlign = "center"; // on centre le texte
        ctx.textBaseline = "middle"; // on affiche le texte par rapport a son centre et non a sa base
        var centreX = canvasWidth / 2; // on calcule le centre sur l'axe X
        var centreY = canvasHeigth / 2; // on calcule le centre des Y
        ctx.fillText(score.toString(), centreX, centreY); // on écrit le score et on le centre
        ctx.restore();
    }
// SERPENT ---------------------------------------------------
    function Snake(body,direction) { // fonction pour dessiner le snake avec la direction
    
        this.body = body; // est représenté par 3 blocks
        this.direction = direction;
        this.ateApple = false; 
        this.draw = function() { // dessiner le serpent
        
            ctx.save(); // on sauvegarde le contexte du canvas (son contenu comme il etait avant)
            ctx.fillStyle = "#786D4B"; // couleur rouge du serpent
            for(var i = 0; i < this.body.length; i++) {
            
               drawBlock(ctx, this.body[i]); 
            }
            ctx.restore(); // permet de garder le context comme il etait avant
        };
        this.advance = function() { // fonction pour faire avancer le snake
        
            var nextPosition = this.body[0].slice();
            switch(this.direction){
                case "left":
                    nextPosition[0] -= 1; // [0]->pour les x 
                    break;
                case "right":
                    nextPosition[0] += 1;
                    break;
                case "down":
                    nextPosition[1] += 1; // et [1]->pour les y
                    break;
                case "up":
                    nextPosition[1] -= 1;
                    break;
                default:
                    throw("invalid direction");
            }

            //nextPosition[0] += 1;
            this.body.unshift(nextPosition);
            if(!this.ateApple) {
            
                this.body.pop();
            }
            else {
            
                this.ateApple = false;
            }
                
        };
        this.setDirection = function(newDirection) {// condition pour diriger le snake
        
            var allowedDirection;
            switch(this.direction) {
            
                case "left": // si il va vers la droite ou la gauche il ne peux que monter ou descendre
                case "right":
                    allowedDirection = ["up", "down"];
                    break;
                case "down": // si il monte ou descend, il ne peut que aller a droite ou a gauche
                case "up":
                    allowedDirection = ["left", "right"];
                    break;
                default:
                    throw("Invalid Direction");
            }
            if(allowedDirection.indexOf(newDirection) > -1) {
            
                this.direction = newDirection;
            }
        };
        this.checkCollision = function() {
        
            var wallCollision = false; // collision sur un mur
            var snakeCollision = false; // collision sur lui-même
            var head = this.body[0]; // déterminer la tete du serpent
            var rest = this.body.slice(1); // on détermine le reste de serpent (sans sa tête)
            var snakeX = head[0]; // on determine le x de la tete du serpent
            var snakeY = head[1]; // on determine le y de la tete du serpent
            // le snakeX doit être compris entre 0 et 29 (compris)
            var minX = 0;
            var maxX = widthInBlocks - 1; // 29
            // le snakeY doit être compris entre 0 et 19 (compris)
            var minY = 0;
            var maxY = heightInBlocks - 1; // 19
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX; // collision sur les murs gauche et droite
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY; // collision sur les murs haut et bas

            if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls) {
            
                wallCollision = true; // si collision horizontal ou vertical alors on passe a true
            }
            // on va vérifier si les coordonnées de la tête ne sont pas les mêmes que le reste du corps
            for(var i = 0; i < rest.length; i++) {
            
                if(snakeX === rest[i][0] && snakeY === rest[i][1]) {
                
                    snakeCollision = true; // si oui on passe a true
                }
            }

            return wallCollision || snakeCollision; // on retourne l'un ou l'autre
        };
        this.isEatingApple = function(appleToEat) { // on vérifie si on mange une pomme
        
            var head = this.body[0]; // on détermine la tete
            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]) { // on verifie si la tete touche une pomme 
            
                return true; // si oui true
            }
            else {
            
                return false; // sinon false
            }
        };
    }
// LA POMME -----------------------------------------------------------------
    function Apple(position) {
    
        this.position = position;
        this.draw = function() {
        
            ctx.save(); // pour se souvenir des anciens param canvas
            ctx.fillStyle = "#ff0000"; // couleurs de la pomme
            ctx.beginPath();
            var radius = blockSize / 2;
            var x = this.position[0] * blockSize + radius; // position x
            var y = this.position[1] * blockSize + radius; // position y
            ctx.arc(x, y, radius, 0, Math.PI*2, true); // on arrondie la pomme
            ctx.fill(); // on la remplie
            ctx.restore(); // pour se souvenir des anciens param canvas
        };
        this.setNewPosition = function() { // une fois mangé on lui donne une nouvelle position aléatoire
        
            var newX = Math.round(Math.random() * (widthInBlocks - 1)); // chiffre entier aléatoire compris entre 0 et 29
            var newY = Math.round(Math.random() * (heightInBlocks - 1)); // chiffre entier aléatoire compris entre 0 et 19
            this.position = [newX, newY]; // donner une nouvelle position
        };
        // on vérifier la position du serpent pour ne pas mettre la nouvelle pomme sur le serpent 
        this.isOnSnake = function(snakeToCheck) {
        
            var isOnSnake = false;

            for(var i = 0; i < snakeToCheck.body.length; i++) {
            
                if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]) {
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        };
    }
    // LES TOUCHES POUR JOUER -----------------------------------------------------
    document.onkeydown = function handleKeyDown(e) { // définir les touches pour controler le serpent
    
        var key = e.keyCode;
        var newDirection;
        switch(key) {
       
            case 37: // touche <-
                newDirection = "left";
                break;
            case 38: // touche flêche haut
                    newDirection = "up"; 
                break;
            case 39: // touche ->
                    newDirection = "right"; 
                break;
            case 40: // touche flêche bas
                    newDirection = "down"; 
                break;
            case 32: // touche Espace
                    restart(); // pour relancer une nouvelle partie
                    return;
            default:
                return;
        }
        snakee.setDirection(newDirection);
    }
}