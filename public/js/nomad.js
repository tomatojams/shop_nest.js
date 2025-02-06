// 폼 데이터를 JSON 형식으로 제출하는 함수
function submitForm() {
  const formData = {
    userAnswers: [
      document.getElementById("answer1").value,
      document.getElementById("answer2").value,
      document.getElementById("answer3").value,
      document.getElementById("answer4").value,
      document.getElementById("answer5").value,
      document.getElementById("answer6").value,
    ],
  };

  // 로딩 메시지 표시
  document.querySelector(".loading-message").style.display = "block";
  document.querySelector(".result-container").style.display = "none";
  const csrfToken = document.querySelector("#csrf-token").value;
  fetch("/ai/chat/nomad", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // JSON 형식으로 전송
      "X-XSRF-TOKEN": csrfToken,
    },
    body: JSON.stringify(formData), // 데이터를 JSON으로 변환
  })
    .then((response) => response.json()) // JSON 응답 처리
    .then((data) => {
      // 로딩 메시지 숨기기
      document.querySelector(".loading-message").style.display = "none";

      // AI 응답 표시
      localStorage.setItem("aiResponse", data.response); // 결과를 로컬 저장소에 저장
      displayResult(data.response); // 결과 표시
    })
    .catch((error) => {
      console.error("Error:", error);
      document.querySelector(".loading-message").textContent =
        "오류가 발생했습니다. 다시 시도해주세요.";
    });
}

// 페이지 로드 시 로컬 저장소에 저장된 결과 표시
window.onload = function () {
  const savedResponse = localStorage.getItem("aiResponse");
  if (savedResponse) {
    displayResult(savedResponse);
  }
};

// 결과 표시 함수
function displayResult(response) {
  document.querySelector(".result-container").style.display = "block";
  document.querySelector(".result-text").textContent = response;
}
