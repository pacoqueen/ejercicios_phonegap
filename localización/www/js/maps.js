var app = {
    inicio: function() {
        this.iniciaFastClick();
    },

    iniciaFastClick:function () {
        FastClick.attach(document.body);
    },

    dispositivoListo: function(){
        console.log("¡Listo!");
        navigator.geolocation.getCurrentPosition(app.dibujaCoordenadas, app.errorAlSolicitarLocalizacion);
    },

    dibujaCoordenadas: function(position){
        var coordsDiv = document.querySelector('#coords');
        coordsDiv.innerHTML = 'Latitud: ' + position.coords.latitude + ' Longitud:' + position.coords.longitude;
        console.log("Posición localizada");
        var mi_mapa = L.map('map').setView([position.coords.latitude, position.coords.longitude], 13);
        console.log("Accediendo a mapbox...");
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
        //L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token={accessToken}',
            {attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
             maxZoom: 18,
             id: 'mapbox.streets',
             //id: 'mapbox.satellite',
             accessToken: config.MAPBOX_APIKEY}
        ).addTo(mi_mapa);
        console.log("Mapa renderizado.");

        app.pintar_marcador([position.coords.latitude, position.coords.longitude], 'Usted está aquí', mi_mapa);

        mi_mapa.on('click', function(evento){
            var texto='Marcador en lat. (' + evento.latlng.lat.toFixed(2) + ') y lon. (' + evento.latlng.lng.toFixed(2)  + ')';
            app.pintar_marcador(evento.latlng, texto, mi_mapa);
        });
    },

    pintar_marcador: function(latlng, texto, mapa){
        var marcador = L.marker(latlng).addTo(mapa);
        marcador.bindPopup(texto).openPopup();
    },

    errorAlSolicitarLocalizacion: function(error){
        console.log(error.code + ': ' + error.message);
    },

};

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        app.inicio();
    }, false);
    document.addEventListener('deviceready', function() {
        app.dispositivoListo();
    }, false);
}
