# 💧 **Hidrate-se**

Hidrate-se é uma extensão para o Google Chrome que te lembra de beber água periodicamente. A extensão exibe lembretes visuais na tela e, opcionalmente, pode reproduzir sons de notificação para reforçar o aviso.

### ✨ **Funcionalidades**

- ⏲️ Defina intervalos personalizados para receber lembretes, como 30 minutos ou 1 hora.
- 📍 Escolha a posição da notificação na tela:
  - Superior Direito (padrão)
  - Superior Esquerdo
  - Inferior Direito
  - Inferior Esquerdo
  - Centro da Tela
- 🔔 Ative ou desative os lembretes facilmente.
- 🔊 Opção para reproduzir sons de notificação com controle de volume.
- 🖥️ Interface simples e intuitiva.
- 💪 Lembretes motivacionais para incentivar sua hidratação diária.

### 🚀 **Como instalar e usar (Modo Desenvolvedor)**

Como a extensão ainda não está disponível na Chrome Web Store, é necessário instalá-la manualmente no navegador.

#### 1️⃣ **Faça o download ou clone o repositório**
   - Se você possui Git instalado, execute o seguinte comando no terminal:
   
     ```bash
     git clone https://github.com/seuusuario/hidrate-se.git
     ```

   - Caso não utilize Git, siga os passos abaixo:
     1. Acesse o repositório no GitHub: [https://github.com/seuusuario/hidrate-se](https://github.com/seuusuario/hidrate-se)
     2. Clique no botão verde "Code".
     3. Selecione a opção "Download ZIP".
     4. Extraia o conteúdo do arquivo ZIP para uma pasta no seu computador.

#### 2️⃣ **Carregue a extensão no navegador**
   - Abra o navegador Google Chrome ou outro baseado em Chromium (Microsoft Edge, Opera, OperaGX, Brave e Vivaldi).
   - Acesse `chrome://extensions/` ou vá até o gerenciamento de extensões no menu do navegador.
   - Ative o Modo do Desenvolvedor (deve estar localizado no canto superior direito da página).
   - Clique em "Carregar sem compactação".
   - Selecione a pasta onde os arquivos da extensão foram extraídos.
   - A extensão será adicionada e o ícone aparecerá na barra de extensões do navegador.

### ⚠️ **Observação:** 
   - A extensão não funcionará em páginas internas do navegador, como `chrome://extensions/`, mas funcionará normalmente em sites comuns.

### 🛠️ **Como usar**

1. Clique no ícone da extensão na barra de ferramentas do navegador.
2. Escolha o intervalo desejado para os lembretes, como 30 minutos ou 1 hora.
3. Ative os lembretes usando o botão de alternância.
4. Se desejar, ative o som e ajuste o volume conforme preferir.
5. Escolha a posição do lembrete na tela.
6. Clique em "Salvar" para começar a receber os lembretes.

### 🏗️ **Tecnologias utilizadas**

- 🏷️ HTML5
- 🎨 CSS3
- ⚙️ JavaScript (ES6+)
- 🖥️ Chrome Extensions API

### 📂 **Estrutura de arquivos**

hidrate-se/
   - icon.png (ícone da extensão)
   - drop-01.mp3 (sons de notificação)
   - drop-02.mp3
   - drop-03.mp3
   - drop-04.mp3
   - popup.html (interface da extensão)
   - styles.css (estilização da interface)
   - popup.js (lógica da interface do popup)
   - background.js (controle de alarmes e notificações)
   - manifest.json (configuração da extensão)
   - README.md (documentação)


### ❗ **Possíveis problemas e soluções**

- **O lembrete não aparece na tela:**
  - ✅ Certifique-se de que a extensão está ativada corretamente nas configurações.
  - ✅ Verifique se os lembretes estão ativados no popup da extensão.
  - ✅ Teste em sites normais, pois a extensão não funciona em páginas internas do navegador.
  
- **O som do lembrete não está funcionando:**
  - 🔊 Certifique-se de ter ativado a opção "Ativar Som" no popup.
  - 🔊 Verifique o volume definido na extensão.
  - 🔊 Confirme que as permissões de áudio estão corretas.

- **A extensão não carrega:**
  - 🔄 Verifique se o Chrome está atualizado para a versão mais recente.
  - 🔄 Recarregue a extensão em `chrome://extensions/`.
