var app = {
    inicio: function(){
        DIAMETRO_BOLA = 20;     // En píxeles
        ANCHO_LADRILLO = 100
        ALTO_LADRILLO = 50;
        velocidadX = 0;
        velocidadY = 0;
        puntuacion = 0;
        alto = document.documentElement.clientHeight;
        ancho = document.documentElement.clientWidth;
        numladrillos = 0;
        bolas = [];
        game_over = false;

        console.log("Iniciando...");
        app.vigilaSensores();
        console.log("Callback sensores instalado.");
        app.iniciaJuego();
    },

    create_bola: function(game){
        /**
         * Crea y devuelve una bola en juego.
         */
        // Creo bola en algún lugar al azar
        console.log("Inicializando bola...");
        bola = game.add.sprite(app.inicioX(), app.inicioY(), 'bola');
        console.log("Activando bola...");
        game.physics.arcade.enable(bola);
        // Área de colisión circular según radio de la bola y activo rebote.
        console.log("Cambiando área colisión bola a círculo de radio " + DIAMETRO_BOLA/2);
        bola.body.setCircle(DIAMETRO_BOLA/2);
        console.log("Activando rebote bola...");
        bola.body.bounce.set(1);
        // Detección de colisiones de la bola con los bordes.
        bola.body.collideWorldBounds = true;
        bola.body.onWorldBounds = new Phaser.Signal();
        bola.body.onWorldBounds.add(app.detectar_game_over, this);
        return bola;
    },

    iniciaJuego: function(){
        function preload(){
            /* Estado inicial: Prepara el juego */
            game.physics.startSystem(Phaser.Physics.ARCADE);    // Motor de física: Arcade.
            game.stage.backgroundColor = '#034f84';
            game.load.image('bola', 'assets/ball.png');
            game.load.image('ladrillo', 'assets/brick.png');
            console.log("Precarga finalizada.");
        }
        function create(){
            console.log(" --> create()");
            /* Crea el juego */
            scoreText = game.add.text(16, 16 + ALTO_LADRILLO, puntuacion, {fontSize: '100px', fill: '#f7786b'});
            numladrillos = Math.floor(ancho / ANCHO_LADRILLO) * 2;  // Dos filas de ladrillos.
            ladrillos_restantes = numladrillos;
            console.log("Ladrillos: " + numladrillos);  // XXX
            // Creo ladrillos en la parte superior (y-ALTO_LADRILLO) e inferior (0);
            ladrillos = [];
            for (i=0; i<numladrillos; i++){
                console.log("Inicializando ladrillo " + i);
                if (i%2){   // Ladrillo "impar", arriba
                    x = ((i-1)/2) * ANCHO_LADRILLO;
                    y = alto - ALTO_LADRILLO;
                } else {    // Ladrillo "par", abajo
                    x = (i/2) * ANCHO_LADRILLO;
                    // No me desplazo en x todavía para que los ladrillos sean
                    // paralelos arriba y abajo.
                    y = 0;
                }
                console.log("... a (" + x + ", " + y + ")");
                ladrillos[i] = game.add.sprite(x, y, 'ladrillo');
            }
            bola = app.create_bola(game);
            bolas.push(bola);
            // Los activo e incluyo en el juego
            console.log("Activando ladrillos...");
            for (i=0; i<numladrillos; i++){
                console.log("Activando ladrillo " + i);
                game.physics.arcade.enable(ladrillos[i]);
                console.log("Fijando ladrillo " + i);
                ladrillos[i].body.immovable = true;
                console.log("Estableciendo rebote ladrillo " + i);
                ladrillos[i].body.bounce.set(1);
            }
            console.log("Juego creado.");
        }
        function update(){
            // Cuantos menos ladrillos queden, más rápida irá la bola.
            for (numbola=0; numbola<bolas.length; numbola++){
                var bola = bolas[numbola];
                // La velocidad depende de la inclinación. Es la misma para todas las bolas.
                var newVelocityX = velocidadX * -1 * (50 + (numbola * 100));
                var newVelocityY = velocidadY * (50 + (numbola * 100));
                bola.body.velocity.setTo(newVelocityX, newVelocityY);
                // Detección de colisiones entre la bola y los ladrillos, función 
                // a llamar cuando suceda, condiciones adicionales (`null`) y 
                // contexto (`this`).
                for (i=0; i<numladrillos; i++){
                    var ladrillo = ladrillos[i];
                    this.game.physics.arcade.collide(bola, ladrillo, app.incrementaPuntuacion, null, {this: this, game: game});
                }
            }
        }
        function render(){
            /**
             * Para poder depurar.
             */
            game.debug.text("Ladrillos restantes " + ladrillos_restantes, 32, 32);
            // game.debug.spriteInfo(bola, 16, 64);
        }
        console.log("Función Inicia juego.");
        var estados = {preload: preload, create: create, update: update, render: render};
        console.log("Estados creados.");
        var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser', estados);
    },

    detectar_game_over: function(){
        /**
         * La bola ha chocado con los bordes del mundo. ¿Con los laterales o 
         * con el inferior/superior? Si lo primero, se teletransporta. Si lo 
         * segundo, entonces sí que es game over.
         */
        var bola_game_over = -1; // Número de la bola que ha chocado con el borde.
        for (numbola=0; numbola<bolas.length; numbola++){
            var bola = bolas[numbola];
            if (bola.body.y >= alto - DIAMETRO_BOLA || bola.body.y <= 0){
                // Chocó con pared superior o inferior
                scoreText.text = puntuacion + "\nGAME\nOVER\n(agitar)";
                bola_game_over = numbola;
                game_over = true;
            }
            if (bola.body.x <= 0){
                bola.body.x = ancho - DIAMETRO_BOLA;
            } else if (bola.body.x >= ancho - DIAMETRO_BOLA){
                bola.body.x = 0;
            }
        }
        if (bola_game_over >= 0){
            for (i=0; i<bolas.length; i++){
                bola = bolas[i];
                bola.body.velocity.setTo(0, 0);
                if (i != bola_game_over){
                    // Limpio todas las bolas menos la que la ha cagado.
                    bola.kill();
                }
            }
        }
    },

    incrementaPuntuacion: function(_bola, _ladrillo){
        puntuacion = puntuacion + 1;
        scoreText.text = puntuacion;
        _ladrillo.kill();   // Hace desaparecer el ladrillo
        ladrillos_restantes--;
        console.log("Creando bola...");
        var nueva_bola = app.create_bola(this.game);
        console.log("Bola creada.");
        bolas.push(nueva_bola);
        if (ladrillos_restantes === 0){
            for (i=0; i<bolas.length;i++){
                bolas[i].body.velocity.setTo(0, 0);
                bolas[i].kill();
            }
            scoreText.text += "\n☺";
        }
    },

    inicioX: function(){
        /**
         * Devuelve un valor aleatorio para la x de la bola.
         */
        return app.numeroAleatorioHasta(ancho - DIAMETRO_BOLA);
    },

    inicioY: function(){
        /**
         * Devuelve un valor inicial aleatorio para la coordenada y de la bola.
         * No puede pisar inicialmente los ladrillos ni el borde.
         */
        return ALTO_LADRILLO + app.numeroAleatorioHasta(alto - DIAMETRO_BOLA - ALTO_LADRILLO);
    },

    numeroAleatorioHasta: function(limite){
        /**
         * Devuelve un número aleatorio entre 0 y el límite recibido.
         */
        return Math.floor(Math.random() * limite);
    },

    vigilaSensores: function(){
        function onError(){
            console.log("Error leyendo acelerómetro.");
        }
        function onSuccess(datosAceleracion){
            app.detectaAgitacion(datosAceleracion);
            app.registraDireccion(datosAceleracion);
        }
        navigator.accelerometer.watchAcceleration(onSuccess, onError, {frequency: 10});
    },

    registraDireccion: function(datosAceleracion){
        if (!game_over){
            velocidadX = datosAceleracion.x;
            velocidadY = datosAceleracion.y;
        } else {
            velocidadX = 0;
            velocidadY = 0;
        }
    },

    detectaAgitacion: function(datosAceleracion){
        agitacionX = datosAceleracion.x > 10;
        agitacionY = datosAceleracion.y > 10;
        if (agitacionX || agitacionY){
            setTimeout(app.reset, 1000);
        }
    },
    
    reset: function(){
        /**
         * Reinicia el juego.
         */
        document.location.reload(true);
    },
};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
}
