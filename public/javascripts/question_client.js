$(function() {
  $('.question-like-btn').click(function(e) { //질문에 좋아요 버튼 누르면 이 함수 사용
    var $el = $(e.currentTarget);
    if ($el.hasClass('loading')) return;
    $el.addClass('loading');
    $.ajax({
      url: '/api/questions/' + $el.data('id') + '/like',
      method: 'POST',
      dataType: 'json',
      success: function(data) {
        $('.question .num-likes').text(data.numLikes);
        $('.question-like-btn').hide();
      },
      error: function(data, status) {
        if (data.status == 401) {
          alert('Login required!');
          location = '/signin';
        }
        console.log(data, status);
      },
      complete: function(data) {
        $el.removeClass('loading');
      }
    });
  });

  $('.answer-like-btn').click(function(e) { //답변에 좋아요 버튼 누르면 이 함수 사용
    var $el = $(e.currentTarget); //현재 클릭한 것 선택
    if ($el.hasClass('disabled')) return; //현재 선택한 것이 disabled 클래스가 있으면 종료
    $.ajax({ //아닐 경우 서버에서 이것 실행
      url: '/api/answers/' + $el.data('id') + '/like',
      method: 'POST', //POST 메소드로 실행 -> routes/api/index.js의 37줄에서 처리
      dataType: 'json',
      success: function(data) { //성공해서 넘어 왔으면
        $el.parents('.answer').find('.num-likes').text(data.numLikes); //text를 바꿔 줌
        $el.addClass('disabled'); //2번 좋아요 못 누르게 disabled 걸어 줌
      },
      error: function(data, status) {
        if (data.status == 401) {
          alert('Login required!');
          location = '/signin';
        }
        console.log(data, status);
      }
    });
  });
}); 