var app={
    inicio: function(){
        this.iniciaFastClick();
        this.iniciaBotones();
    },
    
    iniciaFastClick: function (){
        FastClick.attach(document.body);
    },

    iniciaBotones: function(){
        var buttonAction = document.querySelector('#button-action');
        buttonAction.addEventListener('click', this.tomarFoto);

        var filterButtons = document.querySelectorAll('.button-filter');
        filterButtons[0].addEventListener('click', function(){
            app.aplicar_filtro('gray');
        });
        filterButtons[1].addEventListener('click', function(){
            app.aplicar_filtro('negative');
        });
        filterButtons[2].addEventListener('click', function(){
            app.aplicar_filtro('sepia');
        });

        var buttonGallery = document.querySelector('#button-gallery');
        buttonGallery.addEventListener('click', function(){
            app.cargar_foto(Camera.PictureSourceType.PHOTOLIBRARY);
        });
    },

    cargar_foto: function(pictureSourceType){
        var opciones = {
            quality: 50,
            sourceType: pictureSourceType, 
            destinationType: Camera.DestinationType.FILE_URI,
            targetWidth: 300,
            targetHeight: 300,
            correctOrientation: true
        };
        navigator.camera.getPicture(app.fotoCargada, app.errorAlCargarFoto, opciones);
    },

    fotoCargada: function(imageURI){
        var img = document.createElement('img');
        img.onload = function(){
            app.pintar_foto(img);
        }
        img.src = imageURI;
    },

    tomarFoto: function(){
        var opciones = {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            targetWidth: 300,
            targetHeight: 300,
            correctOrientation: true
        };
        navigator.camera.getPicture(app.fotoTomada, app.errorAlTomarFoto, opciones);
    },

    fotoTomada: function(imageURI){
        var img = document.createElement('img');
        img.onload = function(){
            app.pintar_foto(img);
        }
        img.src = imageURI;
    },

    pintar_foto: function(img){
        var canvas = document.querySelector('#foto');
        var context = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);
    },

    errorAlTomarFoto: function(message){
        console.log('Fallo al tomar foto o toma cancelada: ' + message);
    },

    aplicar_filtro: function(filterName){
        var canvas = document.querySelector('#foto');
        var context = canvas.getContext('2d');
        imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        effects[filterName](imageData.data);
        context.putImageData(imageData, 0, 0);
    }
};

if ('addEventListener' in document){
    document.addEventListener('DOMContentLoaded', function() {
        app.inicio();
    }, false);
}
