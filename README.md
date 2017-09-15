![MiríadaX logo](https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/LogoMiriadax.jpg/220px-LogoMiriadax.jpg)
![PhoneGap logo](https://phonegap.com/blog/uploads/2013-02/cordova-phonegap-build.jpg)

Ejercicios PhoneGap
===================

Ejercicios del MOOC de [MiríadaX: Creando Apps. Aprende a programar aplicaciones móviles (3.ª edición)](https://miriadax.net/web/creando-apps-aprende-a-programar-aplicaciones-moviles-3-edicion-/)

* Módulo 1: Gestos

* Módulo 2: Cámara

* Módulo 3: Localización

* Módulo 4: Sensores

* Módulo 5: Datos

* Módulo 6: Aspectos avanzados

En este repositorio solo se almacenan los ficheros relevantes de cada módulo (`www/*`, principalmente). Para usar cada aplicación se debe instalar primero PhoneGap:
```
npm install phonegap
echo << EOF
cat > ~/bin/phonegap << EOF
#!/bin/bash
~/node_modules/phonegap/bin/phonegap.js "$@"
EOF
```
Y crear cada proyecto, copiando después los fuentes del repositorio. Por ejemplo:
```
phonegap create modulo1 --name "Gestos"
cp -a gestos/* modulo1
```
