
const giftBox = document.getElementById('giftBox');
const result = document.getElementById('result');
const downloadBtn = document.getElementById('downloadBtn');
const adminStatus = document.getElementById('adminStatus');
let userIP = '';
const adminIPs = ['192.168.1.45', 'localhost', '127.0.0.1'];
let isAdmin = false;

async function getIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error al obtener la IP:', error);
    return null;
  }
}

async function checkAdminStatus() {
  userIP = await getIP();
  isAdmin = adminIPs.includes(userIP) || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  if (isAdmin) {
    adminStatus.style.display = 'block';
  }
}

checkAdminStatus();

giftBox.addEventListener('click', async () => {
  if (userIP === null && !isAdmin) {
    showResult("Error al obtener la IP. Por favor, intenta nuevamente más tarde.");
    return;
  }

  if (isAdmin) {
    openGiftBox();
  } else {
    const lastOpenTime = localStorage.getItem(`lastOpenTime_${userIP}`);
    const currentTime = new Date().getTime();
    
    if (!lastOpenTime || (currentTime - lastOpenTime) >= 7 * 24 * 60 * 60 * 1000) {
      openGiftBox();
      localStorage.setItem(`lastOpenTime_${userIP}`, currentTime);
    } else {
      showResult("Solo puedes abrir la caja una vez por semana. ¡Vuelve pronto!");
    }
  }
});

function openGiftBox() {
  const prizes = [
    '100 seguidores',
    '10,000 vistas de TikTok',
    '50 me gustas para Instagram',
    '1,000 vistas para reels de Instagram'
  ];
  const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
  showResult(`¡Felicidades! Has ganado: ${randomPrize}`);
  downloadBtn.style.display = 'block';
}

function showResult(message) {
  result.textContent = message;
  result.classList.add('show');
}

downloadBtn.addEventListener('click', () => {
  html2canvas(document.body).then(canvas => {
    const link = document.createElement('a');
    link.download = 'premio_caja_sorpresa_3d.png';
    link.href = canvas.toDataURL();
    link.click();
  });
});
