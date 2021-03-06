var app = {

  model: {
    "notas": [{"titulo": "Comprar pan", "contenido": "Oferta en la panaderia de la esquina"}]
  },

  inicio: function(){
    /**
     * Inicializa la aplicación y bibliotecas de terceros.
     */
    this.iniciaFastClick();
    this.iniciaFirebase();
    this.iniciaBotones();
    this.refrescarLista();
  },

  iniciaFastClick: function() {
    FastClick.attach(document.body);
  },

  iniciaFirebase: function() {
    firebase.initializeApp(configFirebase);
  },

  iniciaBotones: function() {
    /**
     * Asocia los manejadores de mostrar y guardar nueva nota.
     */
    console.log("Iniciando botones...");
    var salvar = document.querySelector('#salvar');
    var anadir = document.querySelector('#anadir');

    anadir.addEventListener('click', this.mostrarEditor, false);
    salvar.addEventListener('click', this.salvarNota, false);
    console.log("Botones inicializados.");
  },

  mostrarEditor: function() {
    /**
     * Pone los valores de los controles a vacío, muestra el formulario
     * cambiando el display `none` (del CSS) por `block` y obtiene el foco.
     */
    console.log("Mostrando editor...");
    document.getElementById('titulo').value = "";
    document.getElementById('comentario').value = "";
    document.getElementById("note-editor").style.display = "block";
    document.getElementById('titulo').focus();
  },

  salvarNota: function() {
    app.construirNota();
    app.ocultarEditor();
    app.refrescarLista();
    app.grabarDatos();
  },

  grabarDatos: function(){
    window.resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory,
                                     this.gotFS, this.fail);
  },

  gotFS: function(fileSystem){
    fileSystem.getFile("files/"+"model.json", {create: true, exclusive: false}, app.gotFileEntry, app.fail);
  },

  gotFileEntry: function(fileEntry){
    fileEntry.createWriter(app.gotFileWriter, app.fail);
  },

  gotFileWriter: function(writer){
    writer.onwriteend = function(evt){
      console.log("Datos grabados en externalApplicationStorageDirectory.");
      if (app.hayWifi()){
        app.salvarFirebase();
      }
    };
    writer.write(JSON.stringify(app.model));
  },

  salvarFirebase: function(){
    console.log("Salvando en Firebase...");
    console.log(configFirebase.projectId);
    var ref = firebase.storage().ref('model.json');
    ref.putString(JSON.stringify(app.model));
    console.log("Guardado.");
  },

  hayWifi: function(){
    console.log("¿Hay wifi?");
    return navigator.connection.type==='wifi';
  },

  leerDatos: function(){
    /**
     * Resuelve la ruta donde cordova guarda ficheros y en caso de éxito abre
     * en `obtenerFS` el fichero que guarda las notas (el modelo) en _json_.
     * Si no hay errores, abre una tercera función (`leerFile`) el fichero y
     * carga los datos en el modelo real `app.model`.
     */
    console.log("Abriendo almacenamiento externo...");
    window.resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory,
                                     this.obtenerFS, this.fail);
  },

  obtenerFS: function(fileSystem){
    console.log("Abriendo fichero model.json...");
    fileSystem.getFile("files/"+"model.json", null, app.obtenerFileEntry, app.fail);
  },

  obtenerFileEntry: function(fileEntry){
    console.log("Leyendo contenido...");
    fileEntry.file(app.leerFile, app.fail);
  },

  leerFile: function(file){
    console.log("Parseando json...");
    var reader = new FileReader();
    reader.onloadend = function(evt){
      var data = evt.target.result;
      app.model = JSON.parse(data);
      app.inicio();
    };
    reader.readAsText(file);
  },

  fail: function(error){
    console.error("Error: " + error.code);
  },

  refrescarLista: function() {
    var div=document.getElementById('notes-list');
    div.innerHTML = this.anadirNotasALista();
  },

  anadirNotasALista: function() {
    var notas = this.model.notas;
    var notasDivs = '';
    for (var i in notas) {
      var titulo = notas[i].titulo;
      notasDivs = notasDivs + this.anadirNota(i, titulo);
    }
    return notasDivs;
  },

  anadirNota: function(id, titulo) {
    console.log("Añadir nota");
    return "<div class='note-item' id='notas[" + id + "]'>" + titulo + "</div>";
  },

  construirNota: function() {
    var notas = app.model.notas;
    notas.push({"titulo": app.extraerTitulo() , "contenido": app.extraerComentario() });
  },

  extraerTitulo: function() {
    return document.getElementById('titulo').value;
  },

  extraerComentario: function() {
    return document.getElementById('comentario').value;
  },

  ocultarEditor: function() {
    document.getElementById("note-editor").style.display = "none";
  }
};

if('addEventListener' in document){
  document.addEventListener('deviceready', function() {
    console.log("Aplicación iniciada. Leyendo datos...");
    //app.inicio();
    app.leerDatos();
  }, false);
}
