const triagemNames = {
  autismo: 'Autismo',
  tdah: 'TDAH',
  ansiedade: 'Ansiedade',
  depressao: 'Depressão',
  burnout: 'Burnout e esgotamento'
};

const selectedTriagem = new URLSearchParams(window.location.search).get('triagem');
const triagemName = Object.prototype.hasOwnProperty.call(triagemNames, selectedTriagem)
  ? triagemNames[selectedTriagem]
  : null;
const paymentContent = document.getElementById('paymentContent');
const invalidTriagem = document.getElementById('invalidTriagem');

if (triagemName) {
  document.getElementById('triagemName').textContent = `Triagem de ${triagemName}`;
  document.getElementById('proofButton').href =
    `https://wa.me/5543991814458?text=${encodeURIComponent(`Olá! Realizei o pagamento da triagem de ${triagemName} (R$ 29,90) e vou enviar o comprovante.`)}`;
  document.title = `Pix — Triagem de ${triagemName} | Thais Rodrigues`;

  const countdownElement = document.getElementById('countdown');
  const countdownMessage = document.getElementById('countdownMessage');
  let secondsRemaining = 15 * 60;
  let countdownInterval;

  const updateCountdown = () => {
    const minutes = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining % 60;
    countdownElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    if (secondsRemaining === 0) {
      countdownMessage.textContent = 'O prazo sugerido terminou. A chave Pix continua válida; após o pagamento, envie o comprovante.';
      window.clearInterval(countdownInterval);
      return;
    }

    secondsRemaining -= 1;
  };

  updateCountdown();
  countdownInterval = window.setInterval(updateCountdown, 1000);
} else {
  paymentContent.hidden = true;
  invalidTriagem.hidden = false;
}

document.getElementById('copyPixButton').addEventListener('click', async () => {
  const pixKey = document.getElementById('pixKey');
  const copyStatus = document.getElementById('copyStatus');

  try {
    await navigator.clipboard.writeText(pixKey.value);
    copyStatus.textContent = 'Chave Pix copiada.';
  } catch {
    pixKey.select();
    copyStatus.textContent = 'Não foi possível copiar automaticamente. Selecione e copie a chave Pix.';
  }
});
