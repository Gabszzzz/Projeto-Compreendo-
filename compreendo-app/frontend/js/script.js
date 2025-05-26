// Configurações
const API_URL = "http://127.0.0.1:8000"; // Use 127.0.0.1 para evitar problemas com CORS
let audioUrl = "";
let videoUrl = "";

// Elementos DOM
const inputText = document.getElementById("inputText");
const simplifyBtn = document.getElementById("simplifyBtn");
const ttsBtn = document.getElementById("ttsBtn");
const librasBtn = document.getElementById("librasBtn");
const resultsSection = document.getElementById("results");
const simplifiedText = document.getElementById("simplifiedText");
const audioPlayer = document.getElementById("audioPlayer");
const librasVideo = document.getElementById("librasVideo");

// Função para mostrar erros
function showError(message) {
    simplifiedText.innerHTML = `
        <div class="error">
            <p>⚠️ ${message}</p>
            <small>Tente recarregar a página ou verificar sua conexão</small>
        </div>
    `;
}

// Simplificar texto
async function simplifyText() {
    const text = inputText.value.trim();
    if (!text) {
        showError("Por favor, digite um texto para simplificar.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/simplify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ text })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Erro desconhecido");
        }

        const data = await response.json();
        
        // Atualiza a interface
        simplifiedText.textContent = data.simplified_text;
        audioUrl = `${API_URL}${data.tts_url}`;
        videoUrl = `${API_URL}${data.libras_video_url}`;
        resultsSection.style.display = "block";

    } catch (error) {
        showError(`Falha na comunicação: ${error.message}`);
    }
}

// Reproduzir áudio
function playTTS() {
    if (!audioUrl) {
        showError("Simplifique um texto primeiro.");
        return;
    }
    audioPlayer.src = audioUrl;
    audioPlayer.play().catch(e => showError("Erro ao reproduzir áudio: " + e.message));
}

// Mostrar vídeo em Libras
function playLibras() {
    if (!videoUrl) {
        showError("Simplifique um texto primeiro.");
        return;
    }
    librasVideo.src = videoUrl;
    librasVideo.play().catch(e => showError("Erro ao reproduzir vídeo: " + e.message));
}

// Event Listeners
simplifyBtn.addEventListener("click", simplifyText);
ttsBtn.addEventListener("click", playTTS);
librasBtn.addEventListener("click", playLibras);

// Opcional: Enviar ao pressionar Enter
inputText.addEventListener("keypress", (e) => {
    if (e.key === "Enter") simplifyText();
});

// Durante a requisição:
simplifyBtn.disabled = true;
simplifyBtn.textContent = "Processando...";

// Ao finalizar:
simplifyBtn.disabled = false;
simplifyBtn.textContent = "Simplificar Texto";