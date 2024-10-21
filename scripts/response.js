document.addEventListener('DOMContentLoaded', function() {
  let lastResponse = '';

  function playMagicConchResponse() {
    const positiveResponses = ['그럼', '돼'];
    const negativeResponses = ['안돼', '그것도 안돼', '가만히 있어'];
    const otherResponses = ['다시한번 물어봐'];

    let possibleResponses = [];

    if (lastResponse === '안돼') {
      possibleResponses = [...positiveResponses, ...negativeResponses.filter(r => r !== '안돼'), ...otherResponses];
    } else {
      possibleResponses = [...positiveResponses, ...negativeResponses.filter(r => r !== '그것도 안돼'), ...otherResponses];
    }

    const randomResponse = possibleResponses[Math.floor(Math.random() * possibleResponses.length)];
    document.getElementById('response').textContent = randomResponse;
    lastResponse = randomResponse;

    // Play corresponding audio
    let audioPath = '';

    if (randomResponse === '그럼') {
      audioPath = 'assets/audio/positive/그럼.mp3';
    } else if (randomResponse === '돼') {
      const positiveAudios = [
        'assets/audio/positive/돼_0.mp3',
        'assets/audio/positive/돼_1.mp3',
        'assets/audio/positive/돼_2.mp3',
        'assets/audio/positive/돼_3.mp3',
        'assets/audio/positive/돼_4.mp3'
      ];
      audioPath = positiveAudios[Math.floor(Math.random() * positiveAudios.length)];
    } else if (randomResponse === '안돼') {
      const negativeAudios = [
        'assets/audio/negative/안돼_0.mp3',
        'assets/audio/negative/안돼_1.mp3',
        'assets/audio/negative/안돼_3.mp3',
        'assets/audio/negative/안돼_2.mp3',
        'assets/audio/negative/안돼_4.mp3'
      ];
      audioPath = negativeAudios[Math.floor(Math.random() * negativeAudios.length)];
    } else if (randomResponse === '그것도 안돼') {
      audioPath = 'assets/audio/negative/그것도_안돼.mp3';
    } else if (randomResponse === '가만히 있어') {
      audioPath = 'assets/audio/negative/가만히_있어.mp3';
    } else {
      audioPath = 'assets/audio/other/다시한번_물어봐.mp3';
    }

    console.log('Playing audio path:', audioPath);
    const audio = new Audio(audioPath);
    audio.play().catch(error => console.error('Failed to play audio:', error));
  };

  window.playMagicConchResponse = playMagicConchResponse;
});