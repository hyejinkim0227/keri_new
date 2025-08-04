/**
 * 공통 공유 함수 모음
 * common.js와 publish.js에서 공통으로 사용되는 함수들
 */


// 전역 변수
var elFocus; // 포커스 요소 저장하는 전역변수

/**
 * 창 크기 체크 함수
 * @param {number} width - 기준 너비
 * @returns {boolean} 창 크기가 기준보다 크면 true
 */
function pcChk(width) {
  if ($(window).width() > width) {
    return true;
  } else {
    return false;
  }
}

/**
 * 포커스 루프 함수
 * 이벤트가 발생한 요소의 상위 tabindex="0"을 찾아 포커스 이동
 */
function focusLoop() {
  $(event.target).closest('[tabindex="0"]').focus();
}

/**
 * 포커스 저장 함수
 * 이벤트 발생한 요소를 elFocus 변수에 저장
 */
function saveFocus() {
  return (elFocus = $(event.target));
}

/**
 * 포커스 복원 함수
 * 저장된 요소로 포커스 이동
 */
function returnFocus() {
  if (elFocus === undefined) {
    return false;
  }
  elFocus.focus();
}

/**
 * 바디 스크롤 제어 함수
 * @param {string} arg - 'on' 또는 'off'
 */
function bodyScroll(arg) {
  if (arg == 'off') {
    $('body').css('overflow', 'hidden');
  } else if (arg == 'on') {
    $('body').removeAttr('style');
  }
}

/**
 * 모바일 검색 토글 함수
 */
function mSchOnOff(target) {
  $(event.target).toggleClass('active').parent().parent().prev().find('.search').fadeToggle(300);
}

/**
 * 모바일 네비게이션 초기화 함수
 */
function mGnbInit() {
  $('.dep2_wrap ul > li').each(function () {
    if ($(this).children('ol').length) {
      $(this).children('a').addClass('menu_btn');
    }
  });
}

/**
 * 모바일 메뉴 1뎁스 제어 함수
 */
function mMenuActive1() {
  $('.sitemap .dep1 > li > a').click(function () {
    if (!pcChk(1080)) {
      $('.sitemap .dep1 > li').removeClass('active');
      $(this).closest('li').addClass('active');
      return false;
    }
  });
  
  // 모바일에서 메뉴 열릴 때 첫 번째 메뉴에 기본 active 적용
  if (!pcChk(1080)) {
    $('.sitemap .dep1 > li').removeClass('active');
    $('.sitemap .dep1 > li:first-child').addClass('active');
  }
}

/**
 * 모바일 메뉴 3뎁스 제어 함수
 */
function mMenuActive3() {
  $('.sitemap .dep2_wrap ol > li > a').click(function () {
    if (!pcChk(1080)) {
      $('.sitemap .dep2_wrap ol > li').removeClass('active');
      $(this).closest('li').addClass('active');
    }
  });
}

/**
 * 통합 사이트맵 함수 (한국어/영문 공통)
 * @param {boolean} isEnglish - 영문 사이트 여부
 */
function openSitemap(isEnglish = false) {
  const sourceSelector = isEnglish ? '.gnb > .dep1' : '#gnb .dep1';
  const targetSelector = isEnglish ? '.sitemap > .container' : '.sitemap .container';
  
  // 기존에 복제된 메뉴가 있으면 먼저 제거
  $(targetSelector).find('.dep1').remove();
  
  $(sourceSelector).clone().appendTo(targetSelector);
  
  if (isEnglish) {
    $('.sitemap .dep2').removeAttr('style');
  } else {
    $('.sitemap .dep2_wrap').removeAttr('style');
  }
  
  $('.sitemap').stop().fadeIn().attr('tabindex', '0').focus();
  $('body').addClass('sitemap-open');
}

/**
 * 사이트맵 닫기 함수
 */
function closeSitemap() {
  $('.sitemap')
    .stop()
    .fadeOut(function () {
      $(this).find('.dep1').remove();
    })
    .removeAttr('tabindex');
  $('body').removeClass('sitemap-open');
}

/**
 * 영문 사이트맵 열기 (하위 호환성)
 */
function openSitemapEn() {
  openSitemap(true);
}

/**
 * 영문 사이트맵 닫기 (하위 호환성)
 */
function closeSitemapEn() {
  closeSitemap();
} 