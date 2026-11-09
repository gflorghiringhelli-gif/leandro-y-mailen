// ACTIVAR INVITACIÓN
function activarInvitacion() {
    const contenedorPrincipal = document.getElementById("contenedor-principal");
    const videoSobre = document.getElementById("videoSobre");
    const imgSobre = document.getElementById("imgSobreEstetica");
    const capaBoton = document.getElementById("capa-boton");
    const seccionFinal = document.getElementById("seccion-final");
    const musica = document.getElementById("musicaInvitacion");
    const musicBtn = document.getElementById("music-toggle");

    imgSobre.style.opacity = "0";
    capaBoton.style.display = "none";
    videoSobre.style.display = "block";
    videoSobre.play();

    musica.play().catch(error => console.log("Interacción requerida para audio."));
    musicBtn.style.display = "flex";

    setTimeout(() => {
        contenedorPrincipal.style.display = "none";
        seccionFinal.classList.remove("oculto");
        
        iniciarCuentaRegresiva();
        observarRevelados();
    }, 2800); 
}

// CONTROL DE MÚSICA
function toggleMusic() {
    const musica = document.getElementById("musicaInvitacion");
    const icon = document.querySelector("#music-toggle i");
    if (musica.paused) {
        musica.play();
        icon.classList.remove("fa-music-slash");
        icon.classList.add("fa-music");
    } else {
        musica.pause();
        icon.classList.remove("fa-music");
        icon.classList.add("fa-music-slash");
    }
}

// LÓGICA DE SAVE THE DATE (TOCAR / FLIP)
let circulosRevelados = 0;

function revelarFecha(elemento) {
    if (!elemento.classList.contains('revelado')) {
        elemento.classList.add('revelado');
        circulosRevelados++;
        
        if (circulosRevelados === 3) {
            setTimeout(() => {
                document.getElementById('fecha-revelada').classList.add('show-revealed');
            }, 600);
        }
    }
}

// COPIAR ALIAS
function copiarAlias(texto) {
    navigator.clipboard.writeText(texto).then(() => {
        const toast = document.getElementById("toast");
        toast.innerText = "¡ALIAS COPIADO! 📋✨";
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 2500);
    });
}

// MURO DE DESEOS (CONECTADO A APPS SCRIPT)
function enviarMensaje(btn) {
    const nombre = document.getElementById("guestName").value.trim();
    const mensaje = document.getElementById("guestMessage").value.trim();
    
    if(!nombre || !mensaje) {
        alert("Por favor, completa tu nombre y mensaje antes de enviar.");
        return;
    }

    const originalText = btn.innerHTML;
    btn.innerHTML = "ENVIANDO...";
    btn.style.opacity = "0.7";

    const scriptURL = 'https://script.google.com/macros/s/AKfycbwIkuSR4CTZnYW5rLAJDSu30pGbrCoHbVX2GtWFgpgrH86i_gn1e6JRQteDm-CLZgMGwg/exec';
    
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("mensaje", mensaje);

    fetch(scriptURL, { 
        method: 'POST', 
        mode: 'no-cors', 
        body: formData 
    })
    .then(() => {
        btn.innerHTML = "<i class='fa-solid fa-check'></i> ¡ENVIADO!";
        btn.style.opacity = "1";
        document.getElementById("guestbook-form").reset();
        
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 3500);
    })
    .catch(error => {
        console.error('Error!', error);
        btn.innerHTML = "<i class='fa-solid fa-check'></i> ¡ENVIADO!";
        document.getElementById("guestbook-form").reset();
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.opacity = "1";
        }, 3500);
    });
}

// ANIMACIONES SCROLL
function observarRevelados() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });

    reveals.forEach(reveal => observer.observe(reveal));
}

// CUENTA REGRESIVA: 02/01/2027 18:30 HS
function iniciarCuentaRegresiva() {
    const fechaBoda = new Date("January 02, 2027 18:30:00").getTime();

    const intervalo = setInterval(() => {
        const ahora = new Date().getTime();
        const distancia = fechaBoda - ahora;

        if (distancia < 0) {
            clearInterval(intervalo);
            document.getElementById("dias").innerText = "00";
            document.getElementById("horas").innerText = "00";
            document.getElementById("minutos").innerText = "00";
            document.getElementById("segundos").innerText = "00";
            return;
        }

        const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

        document.getElementById("dias").innerText = dias.toString().padStart(2, '0');
        document.getElementById("horas").innerText = horas.toString().padStart(2, '0');
        document.getElementById("minutos").innerText = minutos.toString().padStart(2, '0');
        document.getElementById("segundos").innerText = segundos.toString().padStart(2, '0');
    }, 1000);
}