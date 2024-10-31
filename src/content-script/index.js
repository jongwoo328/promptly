window.onload = function () {
  // 감시할 요소의 선택자
  const targetSelector = 'form > div';

  // MutationObserver 콜백 함수
  function onElementReady(selector, callback) {
    console.log(`🔍 감시를 시작합니다. 요소 선택자: ${selector}`);

    const targetNode = document.querySelector(selector);

    if (targetNode) {
      console.log(`✅ 요소가 이미 존재합니다:`, targetNode);
      callback(targetNode);
    }
  }

  // 요소가 준비되면 실행할 코드
  onElementReady(targetSelector, (inputWrapper) => {
    console.log(`⚙️ 요소에 새로운 div를 추가합니다.`);

    const icon = document.createElement('div');
    icon.classList.add('promptly-button')
    icon.id = 'promptly-app-injection'
    icon.textContent = '🔥';
    inputWrapper.appendChild(icon);


    console.log(`✨ 새로운 div 추가 완료:`, icon);
  });
};
