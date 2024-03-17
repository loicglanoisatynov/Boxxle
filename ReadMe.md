1. [Description](#description)

Boxxle est un jeu de puzzle où le joueur doit déplacer des caisses sur un plateau en 2D pour placer celles-ci sur des cibles, tout en prenant garde à ne pas coincer lesdites caisses dans un endroit d'où il ne peut plus les bouger. Il se joue depuis un navigateur web en localhost. Le jeu est un devoir de première année à Ynov Campus Lyon.

2. [Installation](#installation)

(Il est nécessaire d'avoir wsl, git, npm, node et python3 installés sur votre machine pour pouvoir installer le jeu)

Pour installer le jeu, les étapes à suivre sont les suivantes :

(Consignes à réaliser dans un terminal)
- Créez un dossier pour le jeu :
$ cd ~ && mkdir Boxxle && cd ./Boxxle
- Clonez le dépôt :
$ sudo git clone https://ytrack.learn.ynov.com/git/glloic/Boxxle.git
- Installez les dépendances :
$ sudo apt-get install npm && sudo apt-get install node && sudo apt-get install python3

3. [Usage](#usage)

Pour lancer le jeu, les étapes à suivre sont les suivantes :

- Depuis le dossier du jeu, lancez le serveur :
$ &>/dev/null python3 -m http.server 8080
- Ouvrez un navigateur web et entrez l'adresse suivante dans la barre de recherche :
http://localhost:8080/Boxxle/
(Si le jeu ne se lance pas, lancez VSCode, installez l'extension Live Server, ouvrez le dossier du jeu, puis cliquez sur `Go Live` en bas à droite de l'écran, puis allez sur votre navigateur et entrez localhost:5500 dans la barre de recherche)

Bon jeu !

4. [Credits](#credits)

Travail réalisé par Loïc GLANOIS, B1A-INFO (Campus Ynov Lyon). Adresse mail : loic.glanois@ynov.com

Sujet choisi par l'école. Les maps sont fournies par l'équipe pédagogique.

win.mp3 : https://www.youtube.com/watch?v=VJ8FQSh-H4U
huh.mp3 : https://www.youtube.com/watch?v=j5BXUF_4PP0
finalWin.mp3 : https://www.youtube.com/watch?v=teUWsONJkk8
sprites du personnage : https://i.pinimg.com/564x/7d/59/5a/7d595a64c99a634d94759de8096cca14.jpg
target : https://www.pixilart.com/art/star-sprite-8bfe7c1ce79530e
textures : Minecraft (mojang/microsoft)
background : https://img.craftpix.net/2023/07/Ocean-and-Clouds-Free-Pixel-Art-Backgrounds9.png