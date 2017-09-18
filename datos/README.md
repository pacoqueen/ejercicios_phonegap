# Módulo 5: Datos

Aplicación para guardar notas, con posibilidad de almacenamiento en la nube.

## Paso 1

> [Commit `ccc88ea`](https://github.com/pacoqueen/ejercicios_phonegap/tree/ccc88ea1252d7eb13351abbe034cd85d1784e82b)

Esqueleto de la aplicación. Sin comportamiento. Solo un sencillo CSS.


## Paso 2

> [Commit `d0c065d`](https://github.com/pacoqueen/ejercicios_phonegap/tree/d0c065d0804ec903e9d4f18177415726e85b3822)

Se añade la funcionalidad de crear nuevas notas.

## Paso 3

> [Commit ``](https://github.com/pacoqueen/ejercicios_phonegap/tree/)

Se agrega persistencia para que las nuevas notas no se pierdan al reiniciar la aplicación.

La primera vez que se ejecuta, falla porque no existe el fichero `Andoid\data\com.adobe.phonegap.files\model.json` y el `leerDatos`, al no poder abrir el fichero, no llega a ejecutar el `app.inicio`.

Se puede, bien crear el fichero vacío a mano, o bien cambiar descomentar la línea 150 y comentar la 151 para que la aplicación cargue y se pueda guardar una primera nota.

```javascript
if('addEventListener' in document){
  document.addEventListener('deviceready', function() {
    console.log("Aplicación iniciada. Leyendo datos...");
    app.inicio();
    //app.leerDatos();
  }, false);
```

## Paso 4

> [Commit ``](https://github.com/pacoqueen/ejercicios_phonegap/tree/)



---

![Captura de pantalla](www/img/.png)

Servir la aplicación desde el ordenador con
```
phonegap serve
```
Y lanzarla en el móvil con [PhoneGap Developer App](http://docs.phonegap.com/getting-started/2-install-mobile-app/).
