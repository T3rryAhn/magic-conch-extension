document.addEventListener('DOMContentLoaded', function() {
  const pullRing = document.getElementById('pull-ring');
  const pullString = document.getElementById('pull-string');
  const imageWrapper = document.getElementById('conch-image-wrapper');

  let isDragging = false;
  let startX = 0, startY = 0;
  let currentX = 0, currentY = 0;

  pullRing.addEventListener('mousedown', function() {
    isDragging = true;
    startX = event.clientX;
    startY = event.clientY;
    pullRing.style.transition = 'none';
    pullString.style.transition = 'none';
    pullRing.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', function(event) {
    if (isDragging) {
      // 고리의 새로운 위치 계산
      currentX = event.clientX - startX;
      currentY = event.clientY - startY;
     
      // 고리 위치 업데이트
      pullRing.style.transform = `translateX(-50%) translate(${currentX}px, ${currentY}px)`;

      // 끈의 길이 및 각도 업데이트
      const wrapperRect = imageWrapper.getBoundingClientRect();
      const ringRect = pullRing.getBoundingClientRect();

      const deltaX = ringRect.left + ringRect.width / 2 - (wrapperRect.left + wrapperRect.width / 2);
      const deltaY = ringRect.top + ringRect.height / 2 - (wrapperRect.top + wrapperRect.height / 2);
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

      // 끈 업데이트
      pullString.style.height = `${distance}px`;
      pullString.style.transform = `translateX(-50%) rotate(${angle}deg)`;
    }
  });

  document.addEventListener('mouseup', function() {
    if (isDragging) {
      isDragging = false;
      pullRing.style.cursor = 'grab';

      // 랜덤 응답 생성
      window.playMagicConchResponse();

      // 고리 위치 및 끈 길이 초기화 (부드러운 애니메이션 포함)
      pullRing.style.transition = 'transform 2s ease-in-out';
      pullString.style.transition = 'height 2s ease-in-out, transform 2s ease-in-out';

      // 고리 위치 초기화
      pullRing.style.transform = 'translateX(-50%)';

      // 끈 초기화
      pullString.style.height = '0';
      pullString.style.transform = 'translateX(-50%) rotate(0deg)';
    }
  });
});