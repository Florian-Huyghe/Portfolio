const txtAnim = document.getElementById('typewriter-effect');

new Typewriter(txtAnim, {
    deleteSpeed: 15
})
.changeDelay(40)
.typeString('I\'m Florian Huyghe,<br>')
.pauseFor(300)
.typeString('a Computer Science student ! ')
.pauseFor(1000)
.deleteChars(27)
.typeString('<span style="color:#243fb5"> Web Development </span> student ! ')
.pauseFor(1000)
.deleteChars(27)
.typeString('<span style="color:#087004"> Cybersecurity </span> student ! ')
.start();
