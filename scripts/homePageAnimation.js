
const txtAnim = document.getElementById('typewriter-effect');

new Typewriter(txtAnim, {
    deleteSpeed: 20
})
.changeDelay(35)
.typeString('Moi c\'est Florian Huyghe,<br>')
.pauseFor(300)
.typeString('Étudiant en Informatique ! ')
.pauseFor(1000)
.deleteChars(15)
.typeString('<span style="color:#041e91"> Développement Web </span>! ')
.pauseFor(1000)
.deleteChars(20)
.typeString('<span style="color:#087004"> Cybersécurité </span>! ')
.start();
