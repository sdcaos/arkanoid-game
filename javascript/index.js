window.onload = () => {
  app.init();
  app.setEventListeners();

  const audio = `<audio autoplay>
            <source src="./sounds/backgroundSound.mp3" type="audio/mp3" />
          </audio>`;
  const music = document.querySelector('.buttonMusic');
  music.addEventListener('click', () => {
    setTimeout(() => {
      document.querySelector('#canvas').insertAdjacentHTML('beforeend', audio);
      document.querySelector('audio').loop = true;
    }, 3000);
    music.classList.add('hidden');
  });
};
