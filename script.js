function start(){
	$("#home").hide();
	$("#container").append("<div id='player' class='anima1'></div>");
	$("#container").append("<div id='enemy1' class='anima2'></div>");
	$("#container").append("<div id='enemy2'></div>");
	$("#container").append("<div id='ally' class='anima3'></div>");
    $("#container").append("<div id='scoreboard'></div>");
    $("#container").append("<div id='energy'></div>");

    var lost = 0;
    var saved = 0;
    var score = 0;
    var totalEnergy = 3;
    var shoot = true;
    var gameOver = false;
	var game = {};
    var velocity = 5; //movimentação do enemy
    var posY = parseInt(Math.random() * 334);
    var keycode = {
        W: 87,
        S: 83,
        D: 68
    }

	game.pressed = [];

    var soundShot = document.getElementById("soundShot");
    var soundExplosion = document.getElementById("soundExplosion");
    var music = document.getElementById("music");
    var soundGameOver = document.getElementById("soundGameOver");
    var soundLost = document.getElementById("soundLost");   
    var soundRescue = document.getElementById("soundRescue");

    music.addEventListener("ended", function(){ music.currentTime = 0; music.play(); }, false);
    music.play();
	
    $(document).keydown(function(key){ //verifica tecla pressionada
        game.pressed[key.which] = true;
    });
    
    $(document).keyup(function(key){
        game.pressed[key.which] = false;
    });

	game.timer = setInterval(loop, 30);

	function loop(){
	    moveBackground();
    	movePlayer();
        moveEnemy1();
        moveEnemy2();
        moveAlly();
        crash();
        scoreboard();
        energy();
	}
	
	function moveBackground(){ //movimentação de fundo
	    left = parseInt($("#container").css("background-position"));
	    $("#container").css("background-position", left-2);
	} 

    function movePlayer(){
        if(game.pressed[keycode.W]){
            var topo = parseInt($("#player").css("top"));
            $("#player").css("top", topo-10);
            if(topo <= 0){//limitação da movimentação p cima
                $("#player").css("top", topo+10);
            }
        }
        
        if(game.pressed[keycode.S]){        
            var topo = parseInt($("#player").css("top"));
            $("#player").css("top", topo+10);
            if(topo >= 434){//limitação da movimentação p baixo	
                $("#player").css("top", topo-10);       
            }	
        }
    
        if(game.pressed[keycode.D]){//função disparo
            firing();
        }
    } 

    function moveEnemy1(){
	    posX = parseInt($("#enemy1").css("left")); 
	    $("#enemy1").css("left", posX-velocity);
	    $("#enemy1").css("top", posY);
        if(posX <= 0){
            posY = parseInt(Math.random() * 334);
		    $("#enemy1").css("left", 694);
		    $("#enemy1").css("top", posY);		
	    }
    } 

    function moveEnemy2(){
        posX = parseInt($("#enemy2").css("left"));
	    $("#enemy2").css("left", posX-3);		
		if(posX <= 0){
            $("#enemy2").css("left", 775);		
		}
    }

    function moveAlly(){
        posX = parseInt($("#ally").css("left"));
        $("#ally").css("left", posX+1);
        if(posX > 906){
            $("#ally").css("left", 0);
        }
    }

    function firing(){
        if(shoot == true){
            soundShot.play();
            shoot = false;
            topo = parseInt($("#player").css("top"));
            posX = parseInt($("#player").css("left"));
            shotX = posX + 190;
            topShot = topo + 37;
            $("#container").append("<div id='shot'></div>");
            $("#shot").css("top", topShot);
            $("#shot").css("left", shotX);
            var timeFiring = window.setInterval(fire, 30);
        }
        
        function fire(){
            posX = parseInt($("#shot").css("left"));
            $("#shot").css("left", posX+15);
            if(posX > 900){
                window.clearInterval(timeFiring);
                timeFiring = null;
                $("#shot").remove();
                shoot = true;
            }
        } 
    } 

    function crash(){
        var crash1 = ($("#player").collision($("#enemy1"))); //colisão do jogador com o inimigo 1
        var crash2 = ($("#player").collision($("#enemy2")));
        var crash3 = ($("#shot").collision($("#enemy1")));
        var crash4 = ($("#shot").collision($("#enemy2")));
        var crash5 = ($("#player").collision($("#ally")));
        var crash6 = ($("#enemy2").collision($("#ally")));

        if(crash1.length > 0){
            totalEnergy--;
            enemy1X = parseInt($("#enemy1").css("left"));
            enemy1Y = parseInt($("#enemy1").css("top"));
            explosion1(enemy1X, enemy1Y);
        
            posY = parseInt(Math.random() * 334);
            $("#enemy1").css("left", 694);
            $("#enemy1").css("top", posY);
        }

        if(crash2.length > 0){//jogador e inimigo2
            totalEnergy--;
            enemy2X = parseInt($("#enemy2").css("left"));
            enemy2Y = parseInt($("#enemy2").css("top"));
            explosion2(enemy2X, enemy2Y);
            $("#enemy2").remove();
            repositionEnemy2();		
        }	
        
        if(crash3.length > 0){
            score += 100;
            velocity += 0.3;
            enemy1X = parseInt($("#enemy1").css("left"));
            enemy1Y = parseInt($("#enemy1").css("top"));
            explosion1(enemy1X, enemy1Y);
            $("#shot").css("left", 950);
                
            posY = parseInt(Math.random() * 334);
            $("#enemy1").css("left", 694);
            $("#enemy1").css("top", posY);
        }
                
        if(crash4.length > 0){
            score += 50;
            enemy2X = parseInt($("#enemy2").css("left"));
            enemy2Y = parseInt($("#enemy2").css("top"));
            $("#enemy2").remove();
        
            explosion2(enemy2X, enemy2Y);
            $("#shot").css("left", 950);
            repositionEnemy2();
        }
                
        if(crash5.length > 0){
            saved++;
            soundRescue.play();
            repositionAlly();
            $("#ally").remove();
        }

        if(crash6.length > 0){
            lost++;
            allyX = parseInt($("#ally").css("left"));
            allyY = parseInt($("#ally").css("top"));
            explosion3(allyX, allyY);
            $("#ally").remove();
            repositionAlly();
        }
    }

    function explosion1(enemy1X, enemy1Y){
        soundExplosion.play();
        $("#container").append("<div id='explosion1'></div");
        $("#explosion1").css("background-image", "url(./images/explosao.png)");
        var div = $("#explosion1");
        div.css("top", enemy1Y);
        div.css("left", enemy1X);
        div.animate({ width:200, opacity:0 }, "slow");
        
        var timeExplosion = window.setInterval(removeExplosion, 1000);
        function removeExplosion(){
            div.remove();
            window.clearInterval(timeExplosion);
            timeExplosion = null;
        }
    } 

    function repositionEnemy2(){
        var timeCrash4 = window.setInterval(rep4, 2000);
        function rep4(){ 
            window.clearInterval(timeCrash4);
            timeCrash4 = null;
            if(gameOver == false){
                $("#container").append("<div id=enemy2></div");
            }
        }	
    } 

    function explosion2(enemy2X, enemy2Y){
        soundExplosion.play();
        $("#container").append("<div id='explosion2'></div");
        $("#explosion2").css("background-image", "url(./images/explosao.png)");
        var div2 = $("#explosion2");
        div2.css("top", enemy2Y);
        div2.css("left", enemy2X);
        div2.animate({ width:200, opacity:0 }, "slow");
    
        var timeExplosion2 = window.setInterval(removeExplosion2, 1000);
        function removeExplosion2(){
            div2.remove();
            window.clearInterval(timeExplosion2);
            timeExplosion2 = null;		
        }		
    } 

    function repositionAlly(){	//reposiciona aliado
        var timeAlly = window.setInterval(rep6, 6000);
            function rep6(){
            window.clearInterval(timeAlly);
            timeAlly = null;
            if(gameOver == false){
                $("#container").append("<div id='ally' class='anima3'></div>");
            }	
        }	
    }
    function explosion3(allyX, allyY){
        soundLost.play();
        $("#container").append("<div id='explosion3' class='anima4'></div");
        $("#explosion3").css("top", allyY);
        $("#explosion3").css("left", allyX);
        var timeExplosion3 = window.setInterval(resetExplosion3, 1000);
        function resetExplosion3(){
            $("#explosion3").remove();
            window.clearInterval(timeExplosion3);
            timeExplosion3 = null; 
        }
    } 

    function scoreboard(){
        $("#scoreboard").html("<h2> SCORE: " + score + " Saved: " + saved + " Lost: " + lost + "</h2>");	
    }

    function energy(){
        if(totalEnergy == 3){
            $("#energy").css("background-image", "url(./images/energia3.png)");
        }
        if(totalEnergy == 2){
            $("#energy").css("background-image", "url(./images/energia2.png)");
        }
        if(totalEnergy == 1){
            $("#energy").css("background-image", "url(./images/energia1.png)");
        }
        if(totalEnergy == 0){
            $("#energy").css("background-image", "url(./images/energia0.png)");
            endgame();
        }	
    }

    function endgame(){
	    gameOver = true;
	    music.pause();
	    soundGameover.play();

	    window.clearInterval(game.timer);
	    game.timer = null;
	
	    $("#player").remove();
	    $("#enemy1").remove();
	    $("#enemy2").remove();
	    $("#ally").remove();	

	    $("#container").append("<div id='end'></div>");
	    $("#end").html("<h1> GAME OVER </h1><p>SCORE: " + score + "</p>" + "<section><button onclick=restart()><img src='./images/restart.png'>RESTART</button><section/>");
    }   
}

function restart(){
    soundGameover.pause();
    $("#end").remove();
    start();
}















	



























































	








	




