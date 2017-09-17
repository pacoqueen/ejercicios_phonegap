var app = {
    inicio: function(){
        DIAMETRO_BOLA = 50;     // En píxeles
        dificultad = 0;         // Nivel de dificultad. Aumenta la velocidad.
        velocidadX = 0;
        velocidadY = 0;
        puntuacion = 0;
        alto = document.documentElement.clientHeight;
        ancho = document.documentElement.clientWidth;

        app.vigilaSensores();
        app.iniciaJuego();
    },

    iniciaJuego: function(){
        function preload(){
            /* Estado inicial: Prepara el juego */
            game.physics.startSystem(Phaser.Physics.ARCADE);    // Motor de física: Arcade.
            game.stage.backgroundColor = '#f27d0c';
            game.load.image('bola', 'assets/bola.png');
            game.load.image('objetivo', 'assets/objetivo.png');
        }
        function create(){
            /* Crea el juego */
            scoreText = game.add.text(16, 16, puntuacion, { fontSize: '100px', fill: '#757676' });
            objetivo = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo')
            // Se pintan en el orden en que se declaran. La bola lo último para
            // que siempre esté por encima de los demás objetos.
            bola = game.add.sprite(app.inicioX(), app.inicioY(), 'bola');
            game.physics.arcade.enable(bola);
            game.physics.arcade.enable(objetivo);
            // Detección de colisiones de la bola con los bordes.
            bola.body.collideWorldBounds = true;
            bola.body.onWorldBounds = new Phaser.Signal();
            bola.body.onWorldBounds.add(app.decrementaPuntuacion, this);
        }
        function update(){
            var factor_dificultad = (300 + (dificultad * 100));
            bola.body.velocity.x = (velocidadX * -1 * factor_dificultad);
            bola.body.velocity.y = (velocidadY * factor_dificultad);
            // Detección de colisiones entre la bola y el objetivo, función 
            // a llamar cuando suceda, condiciones adicionales (`null`) y 
            // contexto (`this`).
            game.physics.arcade.overlap(bola, objetivo, app.incrementaPuntuacion, null, this);
        }
        var estados = {preload: preload, create: create, update: update};
        var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser', estados);
    },

    decrementaPuntuacion: function(){
        puntuacion = puntuacion - 1;
        scoreText.text = puntuacion;
    },

    incrementaPuntuacion: function(){
        puntuacion = puntuacion + 1;
        scoreText.text = puntuacion;
        objetivo.body.x = app.inicioX();
        objetivo.body.y = app.inicioY();
        if (puntuacion > 0){
            dificultad = dificultad + 1;
        }
    },

    inicioX: function(){
        return app.numeroAleatorioHasta(ancho - DIAMETRO_BOLA);
    },

    inicioY: function(){
        return app.numeroAleatorioHasta(alto - DIAMETRO_BOLA);
    },

    numeroAleatorioHasta: function(limite){
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

    detectaAgitacion: function(datosAceleracion){
        agitacionX = datosAceleracion.x > 10;
        agitacionY = datosAceleracion.y > 10;
        if (agitacionX || agitacionY){
            setTimeout(app.recomienza, 1000);
        }
    },

    recomienza: function(){
        document.location.reload(true);
    },

    registraDireccion: function(datosAceleracion){
        velocidadX = datosAceleracion.x;
        velocidadY = datosAceleracion.y;
    },
};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
}
