const txtAnim = document.getElementById('typewriter-effect');

new Typewriter(txtAnim, {
    deleteSpeed: 20
})
.changeDelay(35)
.typeString('I\'m Florian Huyghe,<br>')
.pauseFor(300)
.typeString('a Computer Science student ! ')
.pauseFor(1000)
.deleteChars(27)
.typeString('<span style="color:#041e91"> Web Development </span> student ! ')
.pauseFor(1000)
.deleteChars(27)
.typeString('<span style="color:#087004"> Cybersecurity </span> student ! ')
.start();
