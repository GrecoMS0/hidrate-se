chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "setAlarm") {
        const interval = parseInt(request.interval);
        const disableDuration = parseInt(request.disableDuration);

        if (!isNaN(interval)) {
            chrome.alarms.create("drinkWaterReminder", { periodInMinutes: interval });
            console.log(`Alarme Definido para cada ${interval} minutos.`);
        } else {
            console.error("Intervalo Inválido!");
        }

        if (!isNaN(disableDuration)) {
            chrome.storage.sync.set({ reminderActive: false }, () => {
                console.log(`Lembretes serão reativados após ${disableDuration} minutos.`);
                chrome.alarms.create("reactivateReminder", { delayInMinutes: disableDuration });
            });
        }
    }
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "reactivateReminder") {
        chrome.storage.sync.set({ reminderActive: true }, () => {
            console.log("Lembretes reativados automaticamente");
        });
    } else if (alarm.name === "drinkWaterReminder") {
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
                    "Quer evitar a ressaca? Beba água agora! 💧",
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
                            reminderDiv.style.backgroundColor = "rgba(0, 123, 255, 0.6)";
                            reminderDiv.style.color = "#f0f0f0";
                            reminderDiv.style.padding = "15px 25px";
                            reminderDiv.style.borderRadius = "20px";
                            reminderDiv.style.fontFamily = "'Nunito', sans-serif";
                            reminderDiv.style.fontSize = "18px";
                            reminderDiv.style.fontWeight = "600";
                            reminderDiv.style.boxShadow = "0 15px 30px rgba(0, 0, 0, 0.3)";
                            reminderDiv.style.zIndex = "9999";
                            reminderDiv.style.display = "flex";
                            reminderDiv.style.justifyContent = "space-between";
                            reminderDiv.style.alignItems = "center";
                            reminderDiv.style.transition = "opacity 0.5s, transform 0.5s";
                            reminderDiv.style.opacity = "0";
                            reminderDiv.style.transform = "translateY(20px)";
                            reminderDiv.style.backdropFilter = "blur(5px)";

                            const closeButton = document.createElement('button');
                            closeButton.textContent = "X";
                            closeButton.style.marginLeft = "15px";
                            closeButton.style.backgroundColor = "transparent";
                            closeButton.style.color = "#f0f0f0";
                            closeButton.style.border = "2px solid #f0f0f0";
                            closeButton.style.borderRadius = "50%";
                            closeButton.style.width = "35px";
                            closeButton.style.height = "35px";
                            closeButton.style.cursor = "pointer";
                            closeButton.style.fontSize = "16px";
                            closeButton.style.display = "flex";
                            closeButton.style.alignItems = "center";
                            closeButton.style.justifyContent = "center";
                            closeButton.style.transition = "background-color 0.3s, color 0.3s, transform 0.3s";
                            closeButton.addEventListener('mouseenter', () => {
                                closeButton.style.backgroundColor = "#f0f0f0";
                                closeButton.style.color = "#007BFF";
                                closeButton.style.transform = "scale(1.2)";
                            });
                            closeButton.addEventListener('mouseleave', () => {
                                closeButton.style.backgroundColor = "transparent";
                                closeButton.style.color = "#f0f0f0";
                                closeButton.style.transform = "scale(1)";
                            });
                            closeButton.addEventListener('click', () => {
                                reminderDiv.style.opacity = "0";
                                reminderDiv.style.transform = "translateY(20px)";
                                setTimeout(() => reminderDiv.remove(), 500);
                            });
                            reminderDiv.appendChild(closeButton);

                            setTimeout(() => {
                                reminderDiv.style.opacity = "1";
                                reminderDiv.style.transform = "translateY(0)";
                            }, 50);

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
                                    reminderDiv.style.top = "40%";
                                    reminderDiv.style.left = "30%";
                                    reminderDiv.style.transform = "translate(-40%, -30%)";
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
        });
    }
});