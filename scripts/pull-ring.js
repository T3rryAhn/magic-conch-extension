document.addEventListener('DOMContentLoaded', function() {
  const pullRing = document.getElementById('pull-ring');
  const pullString = document.getElementById('pull-string');
  const imageWrapper = document.getElementById('conch-image-wrapper');

  let isDragging = false;
  let startX = 0,
    startY = 0;
  let currentX = 0,
    currentY = 0;
  let ringInitialX = 0,
    ringInitialY = 0;
  let ringImageRadius = 0;
  let animationFrameId;

  // 페이지 로드 시 고리의 초기 위치 저장
  window.addEventListener('load', function() {
    const ringRect = pullRing.getBoundingClientRect();
    const wrapperRect = imageWrapper.getBoundingClientRect();
    ringImageRadius = ringRect.height / 2;

    // 고리의 중심 위치
    const ringCenterX = ringRect.left + ringRect.width / 2 - wrapperRect.left;
    const ringCenterY = ringRect.top + ringRect.height / 2 - wrapperRect.top;

    // 고리의 상단 중앙 위치 계산
    ringInitialX = ringCenterX;
    ringInitialY = ringCenterY - ringImageRadius;

    // 끈의 시작점 설정
    pullString.style.top = `${ringInitialY}px`;
    pullString.style.left = `${ringInitialX}px`;
  });

  pullRing.addEventListener('mousedown', function(event) {
    isDragging = true;
    startX = event.clientX;
    startY = event.clientY;
    pullRing.style.transition = 'none';
    pullString.style.transition = 'none';
    pullRing.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', function(event) {
    if (isDragging) {
      currentX = event.clientX - startX;
      currentY = event.clientY - startY;

      // 고리 위치 및 회전 업데이트
      updateRingPositionAndRotation(currentX, currentY);

      // 끈 업데이트
      updateString();
    }
  });

  document.addEventListener('mouseup', function() {
    if (isDragging) {
      isDragging = false;
      pullRing.style.cursor = 'grab';

      // 랜덤 응답 생성
      window.playMagicConchResponse();

      // 고리를 원위치로 애니메이션
      const startTime = performance.now();
      const duration = 500; // 애니메이션 지속 시간 (밀리초)

      const ringStartX = currentX;
      const ringStartY = currentY;

      function animateReturnToOrigin(timestamp) {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1); // 진행률 (0 ~ 1)

        // 이징 함수 (ease-in-out)
        const easeInOut =
          progress < 0.5
            ? 2 * progress * progress
            : -1 + (4 - 2 * progress) * progress;

        // 고리 위치 업데이트
        const newX = ringStartX * (1 - easeInOut);
        const newY = ringStartY * (1 - easeInOut);
        updateRingPositionAndRotation(newX, newY);

        updateString();

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animateReturnToOrigin);
        } else {
          // 애니메이션 완료 후 초기 상태로 설정
          pullRing.style.transform = 'translateX(-50%)';
          pullString.style.height = '0';
          pullString.style.transform = 'translateX(-50%) rotate(0deg)';
        }
      }

      animationFrameId = requestAnimationFrame(animateReturnToOrigin);
    }
  });

  function updateRingPositionAndRotation(x, y) {
    // 전체 변환 적용
    const totalTransform = `translateX(-50%) translate(${x}px, ${y}px)`;

    // 고리의 현재 위치 계산 (중앙 기준)
    const ringRect = pullRing.getBoundingClientRect();
    const wrapperRect = imageWrapper.getBoundingClientRect();
    const ringCenterX =
      ringRect.left + ringRect.width / 2 - wrapperRect.left;
    const ringCenterY =
      ringRect.top + ringRect.height / 2 - wrapperRect.top;

    // 고리의 현재 위치에서 초기 위치까지의 벡터 계산
    const deltaX = ringInitialX - ringCenterX;
    const deltaY = ringInitialY - (ringCenterY - ringImageRadius);

    // 회전 각도 계산
    let ringAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    // 이미지의 기본 방향에 따라 각도 보정 (이미지가 위쪽을 향할 경우)
    ringAngle += 90;

    // 전체 변환 적용
    pullRing.style.transform = `${totalTransform} rotate(${ringAngle}deg)`;
  }

  function updateString() {
    // 고리의 현재 위치 및 회전 각도 계산
    const ringRect = pullRing.getBoundingClientRect();
    const wrapperRect = imageWrapper.getBoundingClientRect();
    const ringCenterX =
      ringRect.left + ringRect.width / 2 - wrapperRect.left;
    const ringCenterY =
      ringRect.top + ringRect.height / 2 - wrapperRect.top;

    // 고리의 회전 각도 가져오기
    const transform = pullRing.style.transform;
    const rotateMatch = transform.match(/rotate\((-?\d+\.?\d*)deg\)/);
    let ringAngle = 0;
    if (rotateMatch) {
      ringAngle = parseFloat(rotateMatch[1]);
    }

    // 고리의 상단 중심 좌표 계산 (회전 후)
    const angleRad = (ringAngle - 90) * (Math.PI / 180); // 각도 조정
    const ringTopX = ringCenterX + ringImageRadius * Math.cos(angleRad);
    const ringTopY = ringCenterY + ringImageRadius * Math.sin(angleRad);

    // 끈의 길이 및 각도 계산
    const deltaX = ringTopX - ringInitialX;
    const deltaY = ringTopY - ringInitialY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle =
      Math.atan2(deltaY, deltaX) * (180 / Math.PI) - 90;

    // 끈 업데이트
    pullString.style.height = `${distance}px`;
    pullString.style.transform = `translateX(-50%) rotate(${angle}deg)`;

    // 끈의 시작점은 ringInitialX, ringInitialY에 고정
    pullString.style.top = `${ringInitialY}px`;
    pullString.style.left = `${ringInitialX}px`;
  }
});
