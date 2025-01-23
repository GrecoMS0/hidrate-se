chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "setAlarm") {
        const interval = parseInt(request.interval);
        if (!isNaN(interval)) {
            chrome.alarms.create("drinkWaterReminder", { periodInMinutes: interval });
            console.log(`Alarme Definido para cada ${interval} minutos.`);
        } else {
            console.error("Intervalo Inválido!");
        }
    }
});

chrome.alarms.onAlarm.addListener((alarm) => {
    chrome.storage.sync.get(["reminderActive", "reminderPosition", "playSound", "volume"], (data) => {
        if (data.reminderActive) {
            const position = data.reminderPosition || "top-right";
            const messages = [
                "💧 Hora de se hidratar!",
                "Já bebeu sua água hoje? 💧",
                "Bora ingerir um pouco de 💧H2O!!!",
                "Não se esqueça de beber água! 💧",
                "Seu corpo agradece um gole de água! 💧",
                "Pausa para a hidratação! 💧",
                "Água é vida! Beba um pouco agora! 💧",
                "Mantenha-se hidratado(a)! 💧",
                "Vamos beber água para manter a saúde! 💧",
                "Hidratação já! 💧",
                "Olha a pedra no rim em... pega sua água lá! 💧",
                "Você é feito de 70% de água, então hidrate essa porcentagem! 💧",
                "Sabe o que falta na sua vida? Água! Bebe aí! 💧",
                "Mantenha-se hidratado, assim você evita de virar uma uva passa! 🍇💧",
                "Beber água evita paulada... VAI SE HIDRATAR! 💧",
                "Beber água deixa a pele bonita e os rins felizes! 💧😄",
                "Quer evitar a ressaca? Bebe água agora! 💧",
                "Não deixe sua garganta virar um deserto do Saara! 💧"
            ];
            const message = messages[Math.floor(Math.random() * messages.length)];

            const audioFiles = [
                "drop-01.mp3",
                "drop-02.mp3",
                "drop-03.mp3",
                "drop-04.mp3"
            ];

            const audioFile = audioFiles[Math.floor(Math.random() * audioFiles.length)];

            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: (pos, msg, audio, playSound, volume) => {
                        const reminderDiv = document.createElement('div');
                        reminderDiv.textContent = msg;
                        reminderDiv.style.position = "fixed";
                        reminderDiv.style.backgroundColor = "rgba(0, 123, 255, 0.9)";
                        reminderDiv.style.color = "white";
                        reminderDiv.style.padding = "15px 25px";
                        reminderDiv.style.borderRadius = "10px";
                        reminderDiv.style.fontSize = "20px";
                        reminderDiv.style.fontWeight = "bold";
                        reminderDiv.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
                        reminderDiv.style.zIndex = "9999";
                        reminderDiv.style.display = "flex";
                        reminderDiv.style.justifyContent = "center";
                        reminderDiv.style.alignItems = "center";
                        reminderDiv.style.transition = "opacity 0.5s";

                        const closeButton = document.createElement('button');
                        closeButton.textContent = "X";
                        closeButton.style.marginLeft = "10px";
                        closeButton.style.backgroundColor = "red";
                        closeButton.style.color = "white";
                        closeButton.style.border = "none";
                        closeButton.style.borderRadius = "50%";
                        closeButton.style.width = "25px";
                        closeButton.style.height = "25px";
                        closeButton.style.cursor = "pointer";
                        closeButton.style.fontSize = "16px";
                        closeButton.addEventListener('click', () => reminderDiv.remove());
                        reminderDiv.appendChild(closeButton);

                        switch (pos) {
                            case "top-left":
                                reminderDiv.style.top = "20px";
                                reminderDiv.style.left = "20px";
                                break;
                            case "top-right":
                                reminderDiv.style.top = "20px";
                                reminderDiv.style.right = "20px";
                                break;
                            case "bottom-left":
                                reminderDiv.style.bottom = "20px";
                                reminderDiv.style.left = "20px";
                                break;
                            case "bottom-right":
                                reminderDiv.style.bottom = "20px";
                                reminderDiv.style.right = "20px";
                                break;
                            case "center":
                                reminderDiv.style.top = "50%";
                                reminderDiv.style.left = "50%";
                                reminderDiv.style.transform = "translate(-50%, -50%)";
                                break;
                        }

                        if (playSound) {
                            const audioElement = new Audio(audio);
                            audioElement.volume = volume / 100;
                            audioElement.play();
                        }

                        document.body.appendChild(reminderDiv);
                        reminderDiv.style.opacity = "1";
                        setTimeout(() => {
                            reminderDiv.style.opacity = "0";
                            setTimeout(() => { reminderDiv.remove(); }, 500);
                        }, 40000);
                    },
                    args: [position, message, chrome.runtime.getURL(audioFile), data.playSound, data.volume]
                });
            });
        }
    })
});