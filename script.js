document.addEventListener("DOMContentLoaded", () => {
  console.log("files loaded");
  const textToTypeElement = document.getElementById("text-to-type");
  const typingInputElement = document.getElementById("typing-input");
  const speedElement = document.getElementById("speed");
  const accuracyElement = document.getElementById("accuracy");

  async function fetchData() {
    try {
      const response = await fetch(
        "https://random-text-generator.p.rapidapi.com/api/v1/sentence?realWord=true",
        {
          headers: {
            "x-rapidapi-host": "random-text-generator.p.rapidapi.com",
            "x-rapidapi-key":
              "ac8138c1c0msh863bcb7a3f3b0d8p130460jsn7127734279d5",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error.message);
    }
  }

  fetchData();

  //! Text to be displayed
  const sampleText = ["hi", "there", "how", "are", "you"];
  //initial values
  let currIndex = 0;
  let startTime = new Date();
  let errors = 0;

  //! function to initialize and restart game
  function initializeGame() {
    const text = sampleText[Math.floor(Math.random() * sampleText.length)];
    textToTypeElement.textContent = text;
    typingInputElement.value = "";
    console.log(text);
    currIndex = 0;
    startTime = new Date();
    errors = 0;
    updateFeedback();
  }
  //! function to update accuracy feedback and speed
  function updateFeedback() {
    const currTime = new Date();
    const elapsedTime = (currTime - startTime) / 60000;
    if (elapsedTime <= 0) {
      speedElement.textContent = 0;
    } else {
      const wordsTyped = typingInputElement.value.trim().split(/\s+/).length;
      const speed = Math.round(wordsTyped / elapsedTime);
      speedElement.textContent = speed;

      console.log(wordsTyped);
    }
    const accuracy =
      currIndex > 0
        ? Math.round(((currIndex - errors) / currIndex) * 100)
        : 100;
    accuracyElement.textContent = accuracy;
  }
  function checkCharater(inputChar, targetChar) {
    if (inputChar !== targetChar) {
      errors++;
      new Audio("./error.mp3").play();
      return false;
    } else {
      return true;
    }
  }
  function displayMessage(message) {
    const messageArea = document.getElementById("message-area");
    messageArea.textContent = message;
    setTimeout(() => {
      messageArea.textContent = "";
    }, 3000);
  }
  typingInputElement.addEventListener("input", (e) => {
    const typedText = typingInputElement.value;
    const targetText = textToTypeElement.textContent;
    if (currIndex < targetText.length) {
      const isCorrect = checkCharater(
        typedText[currIndex],
        targetText[currIndex]
      );
      textToTypeElement.innerHTML =
        targetText.substring(0, currIndex) +
        `<span class='${isCorrect ? "correct" : "incorrect"} '>${
          targetText[currIndex]
        }</span>` +
        targetText.substring(currIndex + 1);
      currIndex++;
    }
    if (currIndex === targetText.length) {
      displayMessage("Text Completed Start with new");
      initializeGame();
    }
    updateFeedback();
  });
  initializeGame();
});
