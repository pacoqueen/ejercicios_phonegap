var app={
    inicio: function(){
        this.iniciar_botones();
        this.iniciar_fastclick();
        this.iniciar_hammer();
    },

    iniciar_botones: function(){
        var botonClaro = document.querySelector('#claro');
        var botonOscuro = document.querySelector('#oscuro');

        botonClaro.addEventListener('click', this.ponloClaro, false);
        botonOscuro.addEventListener('click', this.ponloOscuro, false);
    },

    iniciar_fastclick: function(){
        FastClick.attach(document.body);
    },

    ponloClaro: function(){
        document.body.className = 'claro';
    },

    ponloOscuro: function(){
        document.body.className = 'oscuro';
    },

    iniciar_hammer: function(){
        var zona = document.getElementById('zona-gestos');
        var hammertime = new Hammer(zona);

        hammertime.get('pinch').set({enable: true});
        hammertime.get('rotate').set({enable: true});

        zona.addEventListener('webkitAnimationEnd', function(e){
            zona.className='';
        });

        hammertime.on('doubletap',
            function(ev){
                zona.className='doubletap';
            }
        );
        
        hammertime.on('swipe', function(ev){
            var clase=undefined;
            direccion=ev.direction;

            if (direccion==4){
                clase='swipe-derecha';
                console.log("SWIPE DERECHA");
            }
            if (direccion==2){
                clase='swipe-izquierda';
                console.log("SWIPE IZQUIERDA");
            }
            zona.className=clase;
        });

        hammertime.on('rotate', function(ev){
            var umbral=25;
            if (ev.distance >= umbral){
                console.log("Rotate! " + ev.distance);
                zona.className='rotate';
            }
        });
    },
};

// app.inicio();

console.log("Iniciando app...");

if ('addEventListener' in document){
    document.addEventListener('DOMContentLoaded', function() {
        app.inicio();
    }, false);
}
