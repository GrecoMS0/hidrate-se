document.addEventListener("DOMContentLoaded", () => {
    const intervalSelect = document.getElementById("interval");
    const saveBtn = document.getElementById("save-btn");
    const statusText = document.getElementById("status");
    const toggleReminder = document.getElementById("toggle-reminder");
    const reminderStatus = document.getElementById("reminder-status");
    const positionSelect = document.getElementById("position");
    const toggleSound = document.getElementById("toggle-sound");
    const volumeSlider = document.getElementById("volume");
    const volumeValue = document.getElementById('volume-value');

    // Ver se API do Chrome está disponível
    if (chrome.storage) {
        // Carregar o que foi salvo
        chrome.storage.sync.get(["reminderInterval", "reminderActive", "reminderPosition", "playSound", "volume"], (result) => {
            if (result.reminderInterval) {
                intervalSelect.value = result.reminderInterval;
            }
            toggleReminder.checked = !!result.reminderActive;
            reminderStatus.textContent = result.reminderActive ? "Lembretes ativados" : "Lembretes desativados";
            positionSelect.disabled = !result.reminderActive;
            if (result.reminderPosition) {
                positionSelect.value = result.reminderPosition;
            }
            toggleSound.checked = !!result.playSound;
            volumeSlider.value = result.volume || 100;
            volumeValue.textContent = `${volumeSlider.value}%`;
            volumeSlider.disabled = !result.playSound;
        });

        // Salvar configs
        saveBtn.addEventListener("click", () => {
            const selectedInterval = intervalSelect.value;
            const selectedReminder = toggleReminder.checked;
            const selectedPosition = positionSelect.value;
            const selectedSound = toggleSound.checked;
            const selectedVolume = volumeSlider.value;
            chrome.storage.sync.set({
                reminderInterval: selectedInterval,
                reminderActive: selectedReminder,
                reminderPosition: selectedPosition,
                playSound: selectedSound,
                volume: selectedVolume
            }, () => {
                statusText.textContent = "Configuração salva!";
                chrome.runtime.sendMessage({ action: "setAlarm", interval: selectedInterval, reminder: selectedReminder, position: selectedPosition });
            });
        });
    } else {
        console.error("A API chrome.storage não está disponível. Execute como extensão.");
    }

    // Altera Status dos lembretes (Ativado/Desativado)
    toggleReminder.addEventListener("change", () => {
        const isChecked = toggleReminder.checked;
        positionSelect.disabled = !isChecked;
        reminderStatus.textContent = isChecked ? "Lembretes ativados" : "Lembretes desativados";
        chrome.storage.sync.set({ reminderActive: isChecked });
    })

    // Altera Status do som (Ativado/Desativado)
    toggleSound.addEventListener("change", () => {
        const isSoundChecked = toggleSound.checked;
        volumeSlider.disabled = !isSoundChecked;
        chrome.storage.sync.set({ playSound: isSoundChecked });
    })

    // Atualiza o valor do volume
    volumeSlider.addEventListener("input", () => {
        volumeValue.textContent = `${volumeSlider.value}%`;
    })
});
