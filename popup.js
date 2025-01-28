document.addEventListener("DOMContentLoaded", () => {
    const intervalSelect = document.getElementById("interval");
    const saveBtn = document.getElementById("save-btn");
    const toggleReminder = document.getElementById("toggle-reminder");
    const reminderStatus = document.getElementById("reminder-status");
    const positionSelect = document.getElementById("position");
    const toggleSound = document.getElementById("toggle-sound");
    const volumeSlider = document.getElementById("volume");
    const volumeValue = document.getElementById("volume-value");
    const toggleReminderTimer = document.getElementById("toggle-reminder-timer");
    const selects = document.querySelectorAll("select");
    const nightModeToggle = document.getElementById("toggle-night-mode");

    // Ver se API do Chrome está disponível
    if (chrome.storage) {
        // Carregar o que foi salvo
        chrome.storage.sync.get(["reminderInterval", "reminderActive", "reminderPosition", "playSound", "volume", "disableDuration", "nightMode"], (result) => {
            if (result.reminderInterval) {
                intervalSelect.value = result.reminderInterval;
            }
            toggleReminder.checked = result.reminderActive;
            positionSelect.disabled = !result.reminderActive;
            toggleReminderTimer.disabled = !!result.reminderActive;
            reminderStatus.textContent = result.reminderActive ? "Lembretes ativados" : "Lembretes desativados";

            if (result.reminderPosition) {
                positionSelect.value = result.reminderPosition;
            }

            toggleSound.checked = !!result.playSound;
            volumeSlider.value = result.volume || 100;
            volumeValue.textContent = `${volumeSlider.value}%`;
            volumeSlider.disabled = !result.playSound;

            if (result.disableDuration) {
                toggleReminderTimer.value = result.disableDuration;
            } else {
                toggleReminderTimer.value = "";
            }

            nightModeToggle.checked = !!result.nightMode;
            document.body.classList.toggle("night-mode", nightModeToggle.checked);

            updateReminderStatus();
        });

        // Salvar configs
        saveBtn.addEventListener("click", () => {
            const selectedInterval = intervalSelect.value;
            const selectedReminder = toggleReminder.checked;
            const selectedPosition = positionSelect.value;
            const selectedSound = toggleSound.checked;
            const selectedVolume = volumeSlider.value;
            const disableDuration = toggleReminderTimer.disabled ? null : toggleReminderTimer.value;

            saveBtn.disabled = true;
            saveBtn.style.pointerEvents = "none";

            chrome.storage.sync.set({
                reminderInterval: selectedInterval,
                reminderActive: selectedReminder,
                reminderPosition: selectedPosition,
                playSound: selectedSound,
                volume: selectedVolume,
                disableDuration: disableDuration
            }, () => {
                saveBtn.textContent = "Configuração salva!";
                saveBtn.style.backgroundColor = "#4CAF50";
                saveBtn.classList.add('active');

                chrome.runtime.sendMessage({
                    action: "setAlarm",
                    interval: selectedInterval,
                    reminder: selectedReminder,
                    position: selectedPosition,
                    disableDuration: disableDuration
                });

                setTimeout(() => {
                    saveBtn.textContent = "Salvar";
                    saveBtn.style.backgroundColor = "";
                    saveBtn.disabled = false;
                    saveBtn.style.pointerEvents = "auto";
                }, 3000);
            });
        });

        nightModeToggle.addEventListener("change", () => {
            const isNightMode = nightModeToggle.checked;
            document.body.classList.toggle("night-mode", isNightMode);
            chrome.storage.sync.set({ nightMode: isNightMode });
        })
    } else {
        console.error("A API chrome.storage não está disponível. Execute como extensão.");
    }

    // Carregar selects ao iniciar
    selects.forEach(select => {
        // Verificar se o valor está salvo no chrome.storage
        chrome.storage.sync.get(select.id, (result) => {
            const savedValue = result[select.id];
            if (savedValue) {
                select.value = savedValue;
            }
        });
    
        // Salvar última seleção
        select.addEventListener("change", () => {
            const valueToSave = select.value;
            chrome.storage.sync.set({ [select.id]: valueToSave });
        });
    });

    // Atualizar cor do status do lembrete
    const updateReminderStatus = () => {
        if (toggleReminder.checked) {
            reminderStatus.textContent = "Lembretes ativados";
            reminderStatus.style.color = "#4CAF50";
            reminderStatus.style.transition = "color 0.3s ease-in-out";
            reminderStatus.style.fontWeight = "bolder";
        } else {
            reminderStatus.textContent = "Lembretes desativados";
            reminderStatus.style.color = "#F44336";
            reminderStatus.style.transition = "color 0.3s ease-in-out";
            reminderStatus.style.fontWeight = "bolder";
        }
    };

    // Listener que atualiza status ao mudar checkbox '<input type="checkbox" id="toggle-reminder">'
    toggleReminder.addEventListener("change", updateReminderStatus);

    // Altera Status dos lembretes (Ativado/Desativado)
    toggleReminder.addEventListener("change", () => {
        const isChecked = toggleReminder.checked;
        positionSelect.disabled = !isChecked;
        reminderStatus.textContent = isChecked ? "Lembretes ativados" : "Lembretes desativados";
        toggleReminderTimer.disabled = isChecked;
        chrome.storage.sync.set({ reminderActive: isChecked });
    });

    // Altera Status do som (Ativado/Desativado)
    toggleSound.addEventListener("change", () => {
        const isSoundChecked = toggleSound.checked;
        volumeSlider.disabled = !isSoundChecked;
        chrome.storage.sync.set({ playSound: isSoundChecked });
    });

    // Atualiza o valor do volume
    volumeSlider.addEventListener("input", () => {
        volumeValue.textContent = `${volumeSlider.value}%`;
    });
});
