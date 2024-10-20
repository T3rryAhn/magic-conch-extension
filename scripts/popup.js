document.getElementById('pull-string').addEventListener('click', function() {
  const responses = ['안돼', '돼'];
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  document.getElementById('response').textContent = randomResponse;

  // Optionally play audio
  const audio = new Audio(randomResponse === '돼' ? 'yes_sound.mp3' : 'no_sound.mp3');
  audio.play();
});
