// 폼 데이터를 JSON 형식으로 제출하는 함수 (jQuery)
function submitForm() {
  const formData = {
    userAnswers: [
      $("#answer1").val(),
      $("#answer2").val(),
      $("#answer3").val(),
      $("#answer4").val(),
      $("#answer5").val(),
      $("#answer6").val(),
    ],
  };

  // 로딩 메시지 표시
  $(".loading-message").show();
  $(".result-container").hide();

  $.ajax({
    url: "/ai/chat/nomad",
    method: "POST",
    contentType: "application/json", // JSON 형식으로 전송
    data: JSON.stringify(formData), // 데이터를 JSON으로 변환
    success: function (data) {
      // 로딩 메시지 숨기기
      $(".loading-message").hide();

      // AI 응답 표시
      localStorage.setItem("aiResponse", data.response); // 결과를 로컬 저장소에 저장
      displayResult(data.response); // 결과 표시
    },
    error: function () {
      console.error("Error occurred.");
      $(".loading-message").text("오류가 발생했습니다. 다시 시도해주세요.");
    },
  });
}

// 페이지 로드 시 로컬 저장소에 저장된 결과 표시
$(document).ready(function () {
  const savedResponse = localStorage.getItem("aiResponse");
  if (savedResponse) {
    displayResult(savedResponse);
  }
});

// 결과 표시 함수
function displayResult(response) {
  $(".result-container").show();
  $(".result-text").text(response);
}
