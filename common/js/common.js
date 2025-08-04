// 공통 함수들은 common-shared.js에서 로드됨
var headH; // 헤더 높이 저장하는 전역변수  
var page = 0;
var scrolledProtectionTimer; // scrolled 클래스 보호 타이머

// 리사이즈 관련 타이머들을 통합 관리
var resizeTimers = {
  main: null,
  header: null,
  domain: null,
  interview: null,
  news: null,
  layout: null
};

// 리사이즈 디바운싱 헬퍼 함수
function debounceResize(key, callback, delay = 300) {
  clearTimeout(resizeTimers[key]);
  resizeTimers[key] = setTimeout(callback, delay);
}

// scrolled 클래스 보호 함수
function protectScrolledClass() {
  var shouldHaveScrolled = $(window).scrollTop() > 150 || 
                          $('.header #gnb > ul > li.active').length > 0 ||
                          $('.header').hasClass('active');
  
  if (shouldHaveScrolled && !$('.header').hasClass('scrolled')) {
    $('.header').addClass('scrolled');
  }
}

// scrolled 클래스 보호 시작
function startScrolledProtection() {
  clearInterval(scrolledProtectionTimer);
  scrolledProtectionTimer = setInterval(protectScrolledClass, 50);
}

// scrolled 클래스 보호 중지
function stopScrolledProtection() {
  clearInterval(scrolledProtectionTimer);
}

function resizeContentHeight() {
  var conH = $('#contents').outerHeight();
  var lnbH = $('.lnb').outerHeight();
  if (conH < lnbH) {
    $('#contents').outerHeight(lnbH);
  } else {
    $('#contents').removeAttr('style');
  }
}

function lnbInit() {
  //로컬내비게이션 초기화
  $('.lnb > li').each(function () {
    if ($(this).children('ol').length) {
      $(this).children('a').attr('title', '하위메뉴 닫힘').addClass('menu_btn');
      if ($(this).hasClass('active')) {
        $(this).children('a').attr('title', '하위메뉴 열림');
      }
    }
    if ($(this).find('.selected').length) {
      $(this).children('a').attr('title', '하위메뉴 열림');
      $(this).children('ol').show();
      $(this).find('.selected').children('a').attr('title', '현재 페이지');
    } else if ($(this).hasClass('selected')) {
      $(this).children('a').attr('title', '현재 페이지');
    }
  });
}

function closeLnb() {
  //lnb dep3 닫힘
  $('.lnb > li.active ol').stop().slideUp().prev().attr('title', '하위메뉴 닫힘');
  $('.lnb > li.active').removeClass('active');
}

function resetLnb() {
  //선택페이지 제거
  $('.lnb > li.selected ol').stop().slideUp();
  $('.lnb li.selected').removeClass('selected').children('a').removeAttr('title');
}

function imgResize() {
  //이미지 사이즈 조절
  if (pcChk(720) && $('.img').length > 0) {
    function imgResizeH() {
      $('.img').each(function () {
        var imgBoxH, imgH, img;
        imgBoxH = $(this).height();
        img = $(this).find('img');
        imgH = img.height();
        if (imgBoxH > imgH) {
          img.width('auto').height('100%');
        }
      });
    }
    $('.img').each(function () {
      var imgBoxW, imgW, img;
      imgBoxW = $(this).width();
      img = $(this).find('img');
      imgW = img.width();
      if (imgBoxW > imgW) {
        //이미지box가 클경우
        img.width('100%').height('auto');
        imgResizeH();
      } else {
        imgResizeH();
      }
    });
  } else {
    $('.img img').removeAttr('style');
  }
}

function mMenuActive2() {
  // 모바일에서 link클래스가 없는 a태그 클릭시 하위메뉴 열고 닫힘 (한국어 사이트 전용)
  if (!pcChk(1080)) {
    $('.sitemap .dep2_wrap ul > li > a').click(function () {
      if ($(this).parent().hasClass('active')) {
        $('.sitemap .dep2_wrap ul > li').removeClass('active');
      } else {
        $(this).parent().addClass('active').siblings('li').removeClass('active');
      }
      if ($(this).hasClass('menu_btn')) {
        return false;
      }
    });
  }
}

function snsPositon() {
  if (!pcChk(1080)) {
    $('.sitemap .sns').insertAfter($('.sitemap .dep1'));
  }
}

function resizeHeadHeight(target) {
  //pc화면에서 gnb모션
  if (pcChk(1080)) {
    // dep2_wrap이 열릴 때 현재 scrolled 상태 확인
    var wasScrolled = $('.header').hasClass('scrolled');
    // 스크롤 위치도 확인하여 더 정확한 판단
    var shouldKeepScrolled = wasScrolled || $(window).scrollTop() > 150;
    
    var dep2H = $(target).next('.dep2_wrap').outerHeight();
    $('.header')
      .stop()
      .animate({ height: headH + dep2H + 'px' }, 200, function () {
        // dep2_wrap이 열린 후 scrolled 클래스 복원
        if (shouldKeepScrolled) {
          $('.header').addClass('scrolled');
        }
      });
    $('.header').addClass('active');
    
    // dep2_wrap이 열리는 즉시 scrolled 클래스 유지 (강제 적용)
    if (shouldKeepScrolled) {
      setTimeout(function() {
        $('.header').addClass('scrolled');
      }, 10);
    }
    
    $(target).closest('li').addClass('active').closest('li').siblings('li').removeClass('active');
    
    // 다시 한번 확실하게 적용
    if (shouldKeepScrolled) {
      setTimeout(function() {
        $('.header').addClass('scrolled');
      }, 50);
    }
  }
}

function gnbReset() {
  //gnb 초기화
  if (pcChk(1080)) {
    // dep1>li에 active가 있는지 확인 (제거하기 전에)
    var hasActiveGnbItem = $('.header #gnb > ul > li.active').length > 0;
    // 현재 scrolled 상태도 확인
    var wasScrolled = $('.header').hasClass('scrolled');
    // 스크롤 위치도 확인하여 더 정확한 판단
    var shouldKeepScrolled = hasActiveGnbItem || wasScrolled || $(window).scrollTop() > 150;
    
    $('.header')
      .stop()
      .animate({ height: headH + 'px' }, 200, function () {
        // scrolled 클래스 유지 조건 확인
        if (shouldKeepScrolled) {
          $('.header').addClass('scrolled');
        }
      });
    $('.header').removeClass('active');
    
    // 애니메이션 후에도 다시 한번 확실하게 적용
    if (shouldKeepScrolled) {
      setTimeout(function() {
        $('.header').addClass('scrolled');
      }, 250);
    }
  }
  // GNB 메뉴 모든 active 상태 제거
  $('.header #gnb > ul > li').removeClass('active');
}

function tabBoxSizing() {
  if ($('.tab_box').length) {
    //active li의 높이를 구하고 tab_box 높이 설정
    var tabConH = $('.tab_box').find('.active > div').outerHeight();
    var tabH = $('.tab_box').find('li').outerHeight();
    $('.tab_box').height(tabConH + tabH);
  }
}

function gnbFloatClear() {
  // dep2Wrap의 너비보다 li의 너비가 클경우 해당 번째요소에 clearfix
  var dep2W = $('.header .dep2_wrap > ul').width(),
    dep2Li = $('.header .dep2_wrap > ul > li');
  dep2Li.removeClass('clear');
  dep2Li.each(function () {
    var i = 0;
    var li = $(this).closest('ul').children('li');
    var dep2LiWidth = 0;
    while (i < li.length) {
      dep2LiWidth += li.eq(i).outerWidth(true);
      if (dep2W < dep2LiWidth) {
        li.eq(i).addClass('clear');
        dep2LiWidth = 0;
        continue;
      }
      i++;
    }
  });
}

// function openSearch() {
//   $('.header .util > .search_box,.search_open').addClass('active');
//   $('.search_open').attr('title', '검색창 닫기');
//   var schBoxH = $('.search_box').outerHeight();
//   $('.header').addClass('active').stop().animate({ height: headH + schBoxH + 'px' }, 200);
//   return false;
// }

// function resetSearch() {
//   $('.header').stop().animate({ height: headH + 'px' }, 200, function () {
//     $('.header').removeClass('active');
//     $('.util > .search_box,.search_open').removeClass('active');
//     $('.search_open').attr('title', '검색창 열기');
    
//   });
// }

function openPopup() {
  saveFocus(); //이벤트 발생한 요소 기억
  $('.modal_wrap').css('display', 'flex').hide().fadeIn().find('.modal_pop').attr('tabindex', '0').focus().find('.pop_bg').attr('tabindex', 0);;
}

function closePopup() {
  $('.modal_wrap').fadeOut().find('.modal_pop').removeAttr('tabindex', '0');
  returnFocus();
}

function openPopup2(arg) { //복수 팝업
  saveFocus(); //이벤트 발생한 요소 기억
  $('.modal_wrap .modal_pop').hide();
  $('.modal_wrap').css('display', 'flex').hide().fadeIn().find('.modal_pop[data-pop="' + arg + '"]').show().attr('tabindex', '0').focus().find('.pop_bg').attr('tabindex', 0);
}

/**
 * `.tab_list` 내 탭 버튼의 높이를 가장 높은 버튼의 높이에 맞춰 통일합니다.
 */
function tabResizing1() {
  var tabH = 0;
  // 모든 탭 버튼의 style 속성을 제거하여 초기화합니다.
  $('.tab_list > li > a').removeAttr('style');
  // 각 탭 버튼의 높이를 비교하여 최대 높이를 찾습니다.
  $('.tab_list > li').each(function () {
    if (tabH < $(this).children('a').height()) {
      tabH = $(this).children('a').height();
    }
  });
  // 모든 탭 버튼의 높이를 찾은 최대 높이로 설정합니다.
  $('.tab_list > li > a').height(tabH);
}

/**
 * 인트로 섹션(#intro)의 스크롤 동작을 제어합니다. (PC 환경 720px 이상)
 * 마우스 휠 또는 특정 버튼 클릭 시 다음 섹션(.sec2)으로 부드럽게 스크롤하며 바디 스크롤을 제어합니다.
 */
function introScroll() {
  // #intro 요소가 존재하고 PC 환경(720px 이상)일 경우에만 실행합니다.
  if ($('#intro').length && pcChk(720)) {
    // .sec2 요소의 문서 상단으로부터의 오프셋 위치를 가져옵니다.
    var sec2T = $('.sec2').offset().top;
    // body 스크롤을 비활성화합니다.
    bodyScroll('off');
    
    // 윈도우에 마우스 휠 이벤트 리스너를 추가합니다.
    $(window).on("wheel", function (e) {
      // HTML 요소가 애니메이션 중이면 중복 실행을 방지합니다.
      if ($('html').is(":animated")) {
        return false;
      };
      // 마우스 휠을 아래로 스크롤하고 현재 페이지가 0일 경우 (첫 섹션)
      if (e.originalEvent.deltaY > 0 && page == 0) {
        // HTML, body를 .sec2의 위치로 부드럽게 스크롤합니다.
        $('html,body').animate({ scrollTop: sec2T }, 1000, 'swing', function () {
          bodyScroll('on'); // 스크롤 완료 후 body 스크롤을 다시 활성화합니다.
        });
        page = 1; // 페이지 번호를 1로 업데이트합니다.
      }
    });
    
    // 페이지 로드 시 스크롤 위치가 0보다 크면 (첫 섹션이 아니면)
    if ($(window).scrollTop() > 0) {
      bodyScroll('on'); // body 스크롤을 활성화합니다.
      page = 1; // 페이지 번호를 1로 업데이트합니다.
    }
    
    // 윈도우에 스크롤 이벤트 리스너를 추가합니다.
    $(window).on('scroll', function () {
      // 스크롤 위치가 0일 경우 (첫 섹션으로 돌아왔을 때)
      if ($(window).scrollTop() == 0) {
        bodyScroll('off'); // body 스크롤을 비활성화합니다.
        page = 0; // 페이지 번호를 0으로 초기화합니다.
      }
    });
  } else {
    // #intro 요소가 없거나 모바일 환경인 경우 body 스크롤을 항상 활성화합니다.
    bodyScroll('on');
  }
}

/**
 * 특정 타겟 요소 내의 iframe을 정지합니다.
 * iframe의 `src` 속성을 다시 설정하여 비디오 재생 등을 중지시키는 효과를 냅니다.
 * @param {string} target - iframe을 포함하는 요소를 선택하는 jQuery 셀렉터.
 */
function stopIframe(target) {
  // 타겟 요소가 존재할 경우에만 실행합니다.
  if ($(target).length) {
    // 타겟 요소 내의 iframe의 현재 `src` 속성 값을 가져옵니다.
    var src = $(target).find('iframe').attr('src');
    // iframe의 `src` 속성을 다시 원래 값으로 설정하여 재생을 멈춥니다.
    $(target).find('iframe').attr('src', src);
  }
}

/**
 * 헤더 스크롤 이벤트를 초기화합니다.
 * 스크롤 시 header에 scrolled 클래스를 추가/제거합니다.
 */
function initHeaderScroll() {
  $(window).off('scroll.headerScroll');
  
  var scrollThreshold = 150; 
  
  $(window).on('scroll.headerScroll', function() {
    var scrollTop = $(window).scrollTop();
    var $header = $('.header');
    var isMenuOpen = $header.hasClass('active') || $('.header #gnb > ul > li.active').length > 0;
    
    if (scrollTop > scrollThreshold) {
      $header.addClass('scrolled');
    } else {
      if (!isMenuOpen) {
        $header.removeClass('scrolled');
      }
    }
  });
  
  $(window).trigger('scroll.headerScroll');
}
//혜진 04804수정
$(function () {
  $(window).on('resize', function () {
    AOS.init({
      once: false,
      duration: 600,
      disable: function () {
        return window.innerWidth <= 1080;
      }
    });
  });
  
  // AOS.init({
  //   once: false, // 애니메이션 반복 안함
  //   duration: 600, // 애니메이션 지속 시간
  //   disable: function() {
  //     return window.innerWidth <= 1080; // 1080px 이하에서 AOS 비활성화
  //   }
  // });

  // GNB(Global Navigation Bar) 초기화: 페이지 로드 시 모든 메뉴를 닫힌 상태로 설정
  $('.header #gnb > ul > li').removeClass('active');
  $('.header').removeClass('active');
  
  // 초기 scrolled 상태 설정
  if ($(window).scrollTop() > 150) {
    $('.header').addClass('scrolled');
  }

  lnbInit(); // LNB 초기화 함수 호출

  // 데이트피커(날짜 선택기) 플러그인 실행
  if ($('.date_inp input').length > 0) {
    $('.date_inp input').datepicker();
  }

  // 스크롤 테이블 레이어(`.scroll_layer`) 감추기: 터치 또는 클릭 시 페이드아웃됩니다.
  $('.scroll_layer').on('touchstart click', function () {
    $(this).fadeOut(200);
  });

  // 모달/팝업 열기 버튼(`.modal_open`, `.pop_open`) 클릭 이벤트
  $('.modal_open,.pop_open').on('click', function () {
    bodyScroll('off'); // 본문 스크롤 비활성화
    openPopup(); // 단일 팝업 열기 함수 호출
    popSlide.slick('setPosition'); // 슬라이드 위치 리셋 (slick slider)
  });

  // 다중 팝업 열기 버튼(`.pop_open2`) 클릭 이벤트
  $('.pop_open2').on('click', function () {
    var popName = $(this).data('pop'); // 클릭된 버튼의 `data-pop` 속성 값 가져오기
    bodyScroll('off'); // 본문 스크롤 비활성화
    openPopup2(popName); // 다중 팝업 열기 함수 호출 (지정된 팝업 열기)
    popSlide.slick('setPosition'); // 슬라이드 위치 리셋 (slick slider)
    return false; // 기본 이벤트 동작 방지
  });

  // 모달/팝업 닫기 버튼(`.modal_close button`, `.loop`) 클릭 이벤트
  $('.modal_close button, .loop').on('click', function () {
    closePopup(); // 팝업 닫기 함수 호출
    bodyScroll('on'); // 본문 스크롤 활성화
  });

  // 검색 열기 버튼(`.search_open`) 클릭 이벤트: 검색창을 열거나 닫습니다.
  $('.search_open').on('click', function () {
    if (!$(this).hasClass('active')) {
      openSearch(); // 검색창 열기
    } else {
      resetSearch(); // 검색창 닫기
    }
    return false; // 기본 이벤트 동작 방지
  });

  // 검색창 내부 버튼(`.search_box button`)의 focusout 이벤트: 검색창을 닫습니다.
  $('.search_box button').on({
    focusout: function () {
      resetSearch();
    }
  });

  // 문서 전체 클릭 이벤트: 검색창 외부 클릭 시 검색창을 닫습니다.
  $(document).on('click', function (e) {
    if (!$(e.target).closest('.search_box').length) {
      resetSearch();
    }
  });

  // GNB 1단계 메뉴 링크(`.header #gnb > ul > li > a`)의 mouseenter 및 focusin 이벤트
  $('.header #gnb > ul > li > a').on({
    // 마우스 진입 시 헤더 높이 조절 및 검색창 비활성화
    mouseenter: function () {
      $('.util > .search_box').removeClass('active');
      // scrolled 클래스 보호 시작
      startScrolledProtection();
      resizeHeadHeight(this);
    },
    // 포커스 진입 시 헤더 높이 조절
    focusin: function () {
      // scrolled 클래스 보호 시작
      startScrolledProtection();
      resizeHeadHeight(this);
    },
  });

  // GNB(`.header #gnb`)의 mouseleave 이벤트: 마우스가 GNB 영역을 벗어났을 때 헤더 초기화
  $('.header #gnb').on({
    mouseleave: function () {
      // 검색창이 활성화된 상태라면 검색창을 다시 열고 유지
      if ($('.search_open').hasClass('active')) {
        $('.util > .search_box').addClass('active');
        openSearch();
      } else {
        // 그렇지 않다면 GNB 메뉴에서 active 클래스 제거 및 헤더 높이 초기화
        $('.header #gnb > ul > li').removeClass('active');
        gnbReset(); // 헤더 높이 초기화
      }
      
      // 잠시 후 보호 중지 및 scrolled 클래스 확인 (애니메이션 완료 후)
      setTimeout(function() {
        if (!$('.header').hasClass('active') && $('.header #gnb > ul > li.active').length === 0) {
          stopScrolledProtection();
          // section1일 때 (스크롤 위치가 150 이하일 때) scrolled 클래스 제거
          if ($(window).scrollTop() <= 150) {
            $('.header').removeClass('scrolled');
          }
        }
      }, 500);
    },
  });

  // GNB 2단계 메뉴의 마지막 링크(`.header #gnb .dep2_wrap a:last`)의 focusout 이벤트: 포커스가 벗어나면 헤더 초기화
  $('.header #gnb .dep2_wrap a')
    .last()
    .on({
      focusout: function () {
        gnbReset(); // 헤더 높이 초기화
        $('.header #gnb > ul > li').removeClass('active');
      },
    });

  // 모바일 GNB 메뉴 클릭 이벤트
  $('.header #gnb a').on('click', function () {
    var innerMenu = $(this).next('ul'); // 다음 형제 `ul` (3단계 메뉴)
    var innerMenu2 = $(this).next('.dep2_wrap'); // 다음 형제 `.dep2_wrap` (2단계 메뉴)
    // 3단계 메뉴가 있고 모바일 환경(1080px 이하)일 경우
    if (innerMenu.length > 0 && !pcChk(1080)) {
      // 다른 형제 항목의 하위 메뉴를 닫고 현재 항목의 하위 메뉴를 토글합니다.
      $(this).closest('li').siblings('li').find('ul').stop().slideUp(200);
      innerMenu.stop().slideToggle(200);
      return false; // 기본 이벤트 동작 방지
    // 2단계 메뉴가 있고 모바일 환경(1080px 이하)일 경우
    } else if (innerMenu2.length > 0 && !pcChk(1080)) {
      // 다른 형제 항목의 2단계 메뉴를 닫고 현재 항목의 2단계 메뉴를 토글합니다.
      $(this).closest('li').siblings('li').find('.dep2_wrap').stop().slideUp(200);
      innerMenu2.stop().slideToggle(200);
    }
  });

  // 사이트맵 열기 버튼(`.header .sitemap_open`) 클릭 이벤트
  $('.header .sitemap_open').on('click', function () {
    openSitemap(); // 사이트맵 열기 함수 호출
    saveFocus(); // 현재 포커스 요소 저장
    snsPositon(); // SNS 위치 조정
    mGnbInit(); // 모바일 GNB 초기화 (common-shared.js에 정의됨)
    // 모바일 환경(1080px 이하)일 경우 `.header .util`과 `.sitemap`에 'active' 클래스 추가
    if (!pcChk(1080)) {
      $('.header .util,.sitemap').addClass('active');
    }
    mMenuActive1(); // 모바일 메뉴 활성화 함수 호출 (common-shared.js에 정의됨)
    mMenuActive2(); // 모바일 메뉴 활성화 함수 호출 (현재 파일 상단에 정의됨)
    mMenuActive3(); // 모바일 메뉴 활성화 함수 호출 (common-shared.js에 정의됨)
  });

  // 사이트맵 닫기 버튼(`.header .btn_sitemap_close`) 클릭 이벤트
  $('.header .btn_sitemap_close').on({
    click: function () {
      // 모바일 환경(1080px 이하)일 경우 사이트맵 닫기 애니메이션 처리
      if (!pcChk(1080)) {
        $('.sitemap').removeClass('active');
        // 일정 시간 후 `.util` 클래스 제거 (애니메이션 완료 후 처리)
        var delUtil = setTimeout(function () {
          $('.util').removeClass('active');
          clearTimeout(delUtil);
        }, 300);
      }
      closeSitemap(); // 사이트맵 닫기 함수 호출
      returnFocus(); // 이전 포커스 요소로 되돌리기
    },
  });

  // 사이트맵 닫기 버튼(`.btn_sitemap_close`)에서 키보드 이벤트(탭 키) 처리: 포커스 루프
  $(document).on('keydown', '.btn_sitemap_close', function (e) {
    var isShift = window.event.shiftKey ? true : false;
    if (isShift && e.keyCode == 9) { // Shift + Tab
      return; // 역방향 탭 이동 허용
    } else if (event.keyCode == 9) { // Tab
      focusLoop(); // 포커스 루프 함수 호출
      return false; // 기본 탭 이동 방지
    }
  });

});

$(window).on('resize', function () {
  
  // 통합된 리사이즈 핸들러
  debounceResize('main', function() {
    // 기본 리사이즈 처리
    var isDepMenuOpen = $('.header #gnb .dep2_wrap').is(':visible');
    var isHeaderActive = $('.header').hasClass('active');
    var shouldKeepScrolled = isDepMenuOpen || isHeaderActive;
    
    if (!shouldKeepScrolled) {
      $('.header,.search_open').removeAttr('style').removeClass('active scrolled');
    } else {
      $('.header,.search_open').removeAttr('style').removeClass('active');
    }
    
    $('.header #gnb > ul > li').removeClass('active');
    headH = $('.header').outerHeight();
    if (pcChk(1080)) {
      gnbFloatClear();
    }
    $('.util,.sitemap').removeClass('active');
    closeSitemap();
    if (!pcChk(1080)) {
      tableChange();
    }
    
    if (!shouldKeepScrolled) {
      $('.header').removeClass('active scrolled').removeAttr('style');
    } else {
      $('.header').removeClass('active').removeAttr('style');
    }
    imgResize();
  }, 200);
  
  // 헤더 스크롤 이벤트 재초기화
  debounceResize('header', function() {
    $(window).off('scroll.headerScroll');
    initHeaderScroll();
  }, 300);
  
  // 도메인 슬라이더 재초기화
  if ($('.domain').length) {
    debounceResize('domain', function() {
      initDomainSlider();
    }, 300);
  }
  
  // 인터뷰 슬라이더 재초기화
  debounceResize('interview', function() {
    if (window.interviewSwiper) {
      window.interviewSwiper.update();
    }
  }, 250);
  
  // 뉴스 슬라이더 재초기화
  debounceResize('news', function() {
    initNewsSlider();
  }, 300);

});

// 모바일 메인 배너 토글 기능
function initMobileMainBannerToggle() {
  var isAnimating = false; // 애니메이션 진행 중 플래그
  
  $('.m_main_banner_right_btn').off('click').on('click', function() {
    var $btn = $(this);
    var container = $btn.closest('.main_banner_right');
    
    // 1080px 이하에서만 동작하고, 애니메이션 중이 아닐 때만
    if ($(window).width() <= 1080 && !isAnimating) {
      isAnimating = true;
      
      container.toggleClass('toggle-open');
      
      // 버튼 텍스트 변경
      if (container.hasClass('toggle-open')) {
        $btn.text('한국전기연구원 최신성과 및 영상 닫기');
      } else {
        $btn.text('한국전기연구원 최신성과 및 영상 열기');
      }
      
      // 애니메이션 완료 후 플래그 리셋 (CSS transition 시간과 맞춤)
      setTimeout(function() {
        isAnimating = false;
      }, 450); // 0.4s transition + 여유시간
    }
  });
  
  // 리사이즈 시 데스크톱에서는 토글 상태 리셋
  $(window).off('resize.mobileToggle').on('resize.mobileToggle', function() {
    if ($(window).width() > 1080) {
      $('.main_banner_right').removeClass('toggle-open');
      $('.m_main_banner_right_btn').text('한국전기연구원 최신성과 및 영상 열기');
      isAnimating = false; // 플래그도 리셋
    }
  });
}

$(window).on('load', function () {
  //lnb 컨텐츠 높이 통일
  resizeContentHeight();
  imgResize();
  
  // GNB 최종 초기화 - 모든 리소스 로드 완료 후 확실히 닫힌 상태로 설정
  $('.header #gnb > ul > li').removeClass('active');
  $('.header').removeClass('active');
  gnbReset(); // GNB 리셋 함수도 실행
  
  // 헤더 스크롤 이벤트 초기화
  initHeaderScroll();
  
  // 모바일 메인 배너 토글 초기화
  initMobileMainBannerToggle();
});


// 도메인 슬라이더 초기화 (Swiper.js 사용) - 안정화된 버전
function initDomainSlider() {
  if (!$('.domain').length || typeof Swiper === 'undefined') return;
  // 기존 이벤트 핸들러 제거
  $('.domain-controls .prev, .domain-controls .next, .domain-controls .pause, .domain-nav .nav-item').off('click');

  // 기존 슬라이더가 있다면 제거
  if (window.domainSwiper) {
    window.domainSwiper.destroy();
  }
  if (window.domainNavSwiper) {
    window.domainNavSwiper.destroy();
  }
  
  // 함수들을 먼저 정의
  function initMobileSlider() {
    // 모바일 세로 카드 슬라이더
    window.domainSwiper = new Swiper('.domain-content.slider-for', {
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
      // @@@ 신종미 부장님.
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      on: {
        slideChange: function(swiper) {
          $('.domain-controls .pagination .current').text(swiper.realIndex + 1);
        }
      }
    });
    
    // 모바일 컨트롤 버튼 연결
    $('.domain-controls .prev').on('click', function() {
      window.domainSwiper.slidePrev();
    });

    $('.domain-controls .next').on('click', function() {
      window.domainSwiper.slideNext();
    });

    $('.domain-controls .pause').on('click', function() {
      if ($(this).hasClass('play')) {
        window.domainSwiper.autoplay.start();
        $(this).removeClass('play');
      } else {
        window.domainSwiper.autoplay.stop();
        $(this).addClass('play');
      }
    });

    $('.domain-controls').show();
  }
  
  function initDesktopSlider() {
    // 아이템 복제 nav 쪽 개수가 적어서 스크롤시 비어있는것이 보여서 2배로 셋팅함
    if ($('.domain-nav .nav-item').length === 10) {
        var navItems = $('.domain-nav .nav-item').clone();
        $('.domain-nav .swiper-wrapper').append(navItems);
    }
    // if ($('.domain-content .content-slide').length === 10) {
    //     var contentSlides = $('.domain-content .content-slide').clone();
    //     $('.domain-content').append(contentSlides);
    // }

    // PC에서만 기존 슬라이더 초기화
    window.domainSwiper = new Swiper('.domain-content.slider-for', {
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      speed: 500,
      allowTouchMove: false,
    });
    
    window.domainNavSwiper = new Swiper('.domain-nav.slider-nav', {
      direction: 'vertical',
      slidesPerView: 9,
      spaceBetween: 0,
      loop: true,
      centeredSlides: true,
      speed: 500,
      allowTouchMove: true,
      // on: {
      //   slideChange: function() {
      //   }
      // }
    });
    
    // 메인 슬라이더와 네비게이션 슬라이더 연결
    window.domainSwiper.on('slideChange', function(swiper) {
      // 페이징 숫자 업데이트
      $('.domain-controls .pagination .current').text(swiper.realIndex + 1);
      // 네비게이션 슬라이더 이동
      window.domainNavSwiper.slideToLoop(swiper.realIndex);

      if (swiper.realIndex % 2 !== 0) {
        $('.domain').addClass('even-slide');
      } else {
        $('.domain').removeClass('even-slide');
      }
    });
    
    // PC 컨트롤 버튼 연결
    $('.domain-controls .prev').on('click', function() {
      window.domainNavSwiper.slidePrev();
      window.domainSwiper.slidePrev();
    });
    
    $('.domain-controls .next').on('click', function() {
      window.domainNavSwiper.slideNext();
      window.domainSwiper.slideNext();
    });
    
    // 네비게이션 아이템 클릭 이벤트
    $('.domain-nav .nav-item').on('click', function() {
      var index = $(this).data('index');
      window.domainSwiper.slideToLoop(index);
    });
    
    $('.domain-controls .pause').on('click', function() {
      if ($(this).hasClass('play')) {
        window.domainSwiper.autoplay.start();
        $(this).removeClass('play');
      } else {
        window.domainSwiper.autoplay.stop();
        $(this).addClass('play');
      }
    });
    
    $('.domain-controls').show();
    $('.domain').removeClass('even-slide');
  }
  
  // 실제 초기화 실행
  var windowWidth = $(window).outerWidth();

  if (windowWidth <= 1080) {
    initMobileSlider();
  } else {
    initDesktopSlider();
  }
  // 로딩 및 셋팅 완료후 보이게 처리
  $('.domain .container').removeClass('ready');
}

// DOM 로드 완료 후 도메인 슬라이더 초기화 
$(document).ready(function() {
  // 모든 라이브러리와 이미지 로딩 후 도메인 슬라이더 초기화
  $(window).on('load', function() {
    // 0.3초 후에 슬라이더를 초기화하고 리사이즈 이벤트를 발생시켜 레이아웃을 강제로 재계산합니다.
    setTimeout(function() {
      if ($('.domain').length && typeof Swiper !== 'undefined') {
        initDomainSlider();
        $(window).trigger('resize');
      }
    }, 300);
  });
});

// indicator 제어
$(document).ready(function() {
  const $indicator = $('#indicator');
  const $contents = $('#contents');
  const $sections = $('[data-mainnavi]');
  const $footer = $('[data-mainnavi="footer"]'); 

  function checkIndicatorVisibility() {
    if ($(window).width() <= 1080) {
      $indicator.hide();
    } else {
      $indicator.show();
    }
  }
  
  checkIndicatorVisibility();

  $(window).on('resize', function() {
    checkIndicatorVisibility();
  });

  $(window).on('scroll', function() {
      if ($contents.length === 0 || $footer.length === 0) {
        return;
      }
      
      const scrollTop = $(window).scrollTop();
      const contentsTop = $contents.offset().top;
      const footerTop = $footer.offset().top;
      const windowHeight = $(window).height();

      if (scrollTop + windowHeight > footerTop + 200) {
          $indicator.fadeOut();
      } else {
          if ($(window).width() > 1080) {
            $indicator.fadeIn();
          }
      }

      let currentActiveSection = null;
      
      $sections.each(function() {
        const $section = $(this);
        if ($section.length === 0) return;
        
        const sectionTop = $section.offset().top;
        const sectionHeight = $section.outerHeight();
        const sectionBottom = sectionTop + sectionHeight;
        
        let offset = $(window).height() / 2;
        
        if (scrollTop >= sectionTop - offset && scrollTop < sectionBottom - offset) {
          currentActiveSection = $section.data('mainnavi');
        }
      });

      if (currentActiveSection) {
          $indicator.find('li').removeClass('active');
          $indicator.find(`li[data-mainnavi="${currentActiveSection}"]`).addClass('active');
      }
  });

  $indicator.find('a').on('click', function(e) {
    e.preventDefault();
    const anchor = $(this).attr('href');
    const $targetSection = $(anchor);
    
    if ($targetSection.length) {
      let offset = 100;
      if ($targetSection.is('#search')) {
        offset = 0;
      }
      $('html, body').animate({
        scrollTop: $targetSection.offset().top - offset
      }, 500);
    }
  });

  $(window).trigger('scroll');
});


// TOP 버튼 기능
$(document).ready(function() {
  const $topBtn = $('#topBtn');
  
  // 스크롤 이벤트 - top 버튼 show/hide
  $(window).on('scroll', function() {
      if ($(window).scrollTop() > 300) {
        $topBtn.addClass('show');
      } else {
        $topBtn.removeClass('show');
      }
  });
  
  // top 버튼 클릭 이벤트 - 페이지 상단으로 부드럽게 이동
  $topBtn.on('click', function() {
      $('html, body').animate({
        scrollTop: 0
      }, 600, 'swing');
  });
});

// 모달 공통 - 배경 스크롤 방지 함수
function preventBodyScroll() {
  const scrollY = window.scrollY;
  $('body').addClass('modal-open').css('top', `-${scrollY}px`);
}

function allowBodyScroll() {
  const scrollY = $('body').css('top');
  $('body').removeClass('modal-open').css('top', '');
  if (scrollY) {
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
  }
}

// 관련사이트/관련기관 모달 기능
$(document).ready(function() {
  // 모달 열기
  $('.btn_modal_open').on('click', function() {
    const modalType = $(this).data('modal');
    const $modal = $(`#modal-${modalType}`);
    
    if ($modal.length) {
      preventBodyScroll();
      $modal.addClass('show');
    }
  });
  
  // 모달 닫기 (X 버튼)
  $('.btn_modal_close').on('click', function() {
    $(this).closest('.modal_overlay').removeClass('show');
    allowBodyScroll();
  });
  
  // 모달 닫기 (배경 클릭)
  $('.modal_overlay').on('click', function(e) {
    if (e.target === this) {
      $(this).removeClass('show');
      allowBodyScroll();
    }
  });
  
  // 모달 닫기 (ESC 키)
  $(document).on('keydown', function(e) {
    if (e.keyCode === 27) { // ESC 키
      $('.modal_overlay.show').removeClass('show');
      allowBodyScroll();
    }
  });
});

// 기술지원 슬라이더 초기화 함수
function initSupportSlider() {
  if (!window.supportSwiper) {
    window.supportSwiper = new Swiper('.support_list', {
      slidesPerView: 'auto',
      speed: 600,
      loop: true,
      loopFillGroupWithBlank: true,
      // autoplay: {
      //   delay: 3000,
      //   disableOnInteraction: false,
      //   pauseOnMouseEnter: false
      // },
      navigation: {
        nextEl: '.support_banner .support_btn_next',
        prevEl: '.support_banner .support_btn_prev',
      },
      breakpoints: {
        // 1400 이상 2개씩 보여주기
        1401: {
          slidesPerView: 2,
        }
      }
    });
  }
}

// DOM 로드 완료 후 슬라이더 초기화
$(document).ready(function() {
  // 0.5초 후 슬라이더 초기화 (DOM이 완전히 로드된 후)
  setTimeout(function() {
    initSupportSlider();
  }, 500);
});

// 탭 박스 기능
$(".tab_box > li").on("click", function () {
  let idx = $(this).index();
  $(this).addClass("active").siblings().removeClass("active");
  $(this).parent().siblings().children().eq(idx).show().siblings().hide();
});

// 팝업 슬라이드
window.popupSwiper = new Swiper('.slide_pop', {
  slidesPerView: 1,
  spaceBetween: 0,
  loop: true,
  speed: 600,
  autoplay: {
    delay: 4000,
    disableOnInteraction: false
  },
  pagination: {
    el: '.modal_pop[data-pop="pop1"] .pagination_num',
    clickable: true,
    renderBullet: function (index, className) {
      return '<button>' + (index + 1) + '/' + this.slides.length + '</button>';
    }
  },
  navigation: {
    nextEl: '.modal_pop[data-pop="pop1"] .next',
    prevEl: '.modal_pop[data-pop="pop1"] .prev'
  }
});

$('.modal_pop[data-pop="pop1"] .pause').on('click', function () {
  if ($(this).hasClass('play')) {
    window.popupSwiper.autoplay.start();
    $(this).removeClass('play');
    $(this).text('자동재생 정지');
  } else {
    window.popupSwiper.autoplay.stop();
    $(this).addClass('play');
    $(this).text('자동재생 시작');
  }
});

// 연구인터뷰 슬라이더 초기화 함수
function initInterviewSlider() {
  if ($('.interview_slider').length && !window.interviewSwiper) {
    window.interviewSwiper = new Swiper('.interview_slider', {
      slidesPerView: 'auto',
      spaceBetween: 20,
      speed: 600,
      loop: true,
      autoplay: false,
      navigation: false,
      breakpoints: {
        // 1080 이상 2개씩 보여주기
        1080: {
          slidesPerView: 3,
          spaceBetween: 0
        },
      }
    });
  }
}

// 페이지 로드 시 인터뷰 슬라이더 초기화
$(document).ready(function() {
  initInterviewSlider();
});

// 인터뷰 슬라이더 리사이즈는 통합된 리사이즈 핸들러에서 처리됨


// 탭 셀렉트(`.tab_select ul > li > a`) 클릭 이벤트
$('.tab_select ul > li > a').on('click', function () {
  $(this)
    .addClass('active') // 클릭된 항목 활성화
    .attr('title', '선택됨') // 타이틀 '선택됨'으로 설정
    .parent('li') // 부모 `li` 선택
    .siblings('li') // 모든 형제 `li` 선택
    .children('a') // 형제 `li`의 자식 `a` 태그 선택
    .removeClass('active') // 형제 `a` 태그 비활성화
    .removeAttr('title'); // 형제 `a` 태그 타이틀 제거
  $(this).closest('ul').stop().slideUp().parents('li').removeClass('active'); // 부모 `ul` 닫고 부모 `li` 비활성화
});

// 아코디언 - 콤보박스(`.combo_box button`) 클릭 이벤트
$('.combo_box button').on('click', function () {
  if ($(this).parent().hasClass('active')) {
    // 활성화된 상태일 경우 하위 메뉴 닫기
    $(this).attr('title', '하위메뉴 닫힘').next().stop().slideUp(200).parent().removeClass('active');
  } else {
    // 비활성화된 상태일 경우 하위 메뉴 열기
    $(this).attr('title', '하위메뉴 열림').next().stop().slideDown(200).parent().addClass('active');
  }
});

// 자주묻는질문 드롭다운 메뉴(`.list_dropdown dt a`) 클릭 이벤트
var faqBtn = $('.list_dropdown dt a');
faqBtn.on('click', function () {
  if ($(this).closest('dt').hasClass('active')) {
    // 활성화된 질문을 클릭하면 닫기
    $(this).closest('dt').removeClass('active');
    $('.list_dropdown dd').slideUp();
  } else {
    // 다른 질문을 클릭하면 기존 질문 닫고 현재 질문 열기
    $('.list_dropdown dt').removeClass('active');
    $('.list_dropdown dd').slideUp();
    $(this).closest('dt').addClass('active').next().slideDown();
  }
  return false; // 기본 이벤트 동작 방지
});

// 컨텐츠 드롭다운 메뉴(`.list_dropdown2 dt a`) 클릭 이벤트
var dropBtn = $('.list_dropdown2 dt a');
dropBtn.on('click', function () {
  if ($(this).closest('dt').hasClass('active')) {
    // 활성화된 콘텐츠를 클릭하면 닫기
    $(this).closest('dt').removeClass('active').children('a').attr('title', '내용 닫힌');
    $('.list_dropdown2 dd').slideUp();
  } else {
    // 다른 콘텐츠를 클릭하면 기존 콘텐츠 닫고 현재 콘텐츠 열기
    $('.list_dropdown2 dt').removeClass('active').children('a').attr('title', '내용 닫힌');
    $('.list_dropdown2 dd').slideUp();
    $(this).closest('dt').addClass('active').next().slideDown();
    $(this).closest('dt').children('a').attr('title', '내용 열림');
  }
  return false; // 기본 이벤트 동작 방지
});

// 탭 리스트2(`.tab_list2 > button`) 버튼 클릭 이벤트 (모바일용)
$('.tab_list2 > button').on('click', function () {
  // PC 환경(720px 이상)이 아닐 경우 (모바일 환경)
  if (!pcChk(720)) {
    if ($(this).parent().hasClass('active')) {
      // 활성화된 상태일 경우 하위 메뉴 닫기
      $(this)
        .attr('title', '하위메뉴 닫힘')
        .next()
        .stop()
        .slideUp(200, function () {
          $('.tab_list2 > ul').removeAttr('style'); // 슬라이드 업 완료 후 style 속성 제거
        })
        .parent()
        .removeClass('active');
    } else {
      // 비활성화된 상태일 경우 하위 메뉴 열기
      $(this).attr('title', '하위메뉴 열림').next().stop().slideDown(200).parent().addClass('active');
    }
  }
});

// 탭 리스트3(`.tab_list3 > ul > li > a`) 링크 클릭 이벤트
if ($('.tab_list3 > ol').length) { // `.tab_list3`에 콘텐츠 영역이 있을 경우에만 실행
  $('.tab_list3 > ul > li > a').on('click', function (e) {
    var i = $(this).parent('li').index(); // 클릭된 탭의 인덱스 가져오기
    // 모든 탭 콘텐츠에서 'active' 클래스 제거
    $(this).closest('ul').siblings('ol').children('li').removeClass('active');
    // 클릭된 탭의 인덱스에 해당하는 콘텐츠에 'active' 클래스 추가
    $(this).closest('ul').siblings('ol').children('li').eq(i).addClass('active');
    resizeContentHeight(); // 콘텐츠 높이 조절 함수 호출
    e.preventDefault(); // 기본 이벤트 동작 방지
  });
}

// 문서 전체 클릭 이벤트: `.combo_box`와 `.tab_list2`의 하위 메뉴를 닫습니다.
$(document).on('click', function (event) {
  // 클릭된 요소가 `.combo_box`의 자손이 아닐 경우 콤보 박스 하위 메뉴를 닫습니다.
  if (!$(event.target).closest('.combo_box').length) {
    $('.combo_box button').attr('title', '하위메뉴 닫힘').next().stop().slideUp(200).parent().removeClass('active');
  }
  // 클릭된 요소가 `.tab_list2 > button`의 자손이 아니고 PC 환경이 아닐 경우 탭 리스트2 하위 메뉴를 닫습니다.
  if (!$(event.target).closest('.tab_list2 > button').length && !pcChk(720)) {
    $('.tab_list2 > button')
      .attr('title', '하위메뉴 닫힘')
      .next()
      .stop()
      .slideUp(200, function () {
        $('.tab_list2 > ul').removeAttr('style');
      })
      .parent()
      .removeClass('active');
  }
});

// 공통 - 탭컨텐츠(`.tab_box > li > button`) 클릭 이벤트
$('.tab_box > li > button').on('click', function () {
  // 클릭된 탭 항목에 'active' 클래스를 추가하고 형제 항목에서는 제거합니다.
  $(this).closest('li').addClass('active').closest('li').siblings('li').removeClass('active');
  tabBoxSizing(); // 탭 박스 높이 조절 함수 호출
  // 클릭된 버튼의 타이틀을 '탭 선택됨'으로 변경하고 다른 탭 버튼의 타이틀은 '탭'으로 변경합니다.
  $(this).attr('title', '탭 선택됨').closest('li').siblings().find('button').attr('title', '탭');
});



/**
 * 뉴스 슬라이더를 초기화하고 반응형에 따라 아이템 수를 조절합니다.
 * slick 슬라이더 대신 간단한 페이징 방식을 사용합니다.
 */
/**
 * 뉴스 슬라이더를 초기화하고 반응형에 따라 아이템 수를 조절합니다.
 * slick 슬라이더 대신 간단한 페이징 방식을 사용합니다.
 */
function initNewsSlider() {
  // 활성화된 탭 패널 내의 뉴스 슬라이더에 대해 반복합니다.
  $('.tab_panel.active .news_slider').each(function() {
    var $slider   = $(this);
    var $items    = $slider.find('li');       // 슬라이드 아이템들
    var numItems  = $items.length;            // 총 아이템 개수
    var $controls = $('.news_controls');      // 슬라이더 컨트롤 요소

    // 반응형에 따른 itemsPerPage 설정
    var itemsPerPage;
    if (window.innerWidth >= 1285) {
      // 1920px~1281px: 3개씩 2줄 = 6개
      itemsPerPage = 6;
    } else if (window.innerWidth >= 901) {
      // 1280px~900px: 2개씩 2줄 = 4개
      itemsPerPage = 4;
    } else {
      // 900px~320px: 1줄에 3개 = 3개
      itemsPerPage = 3;
    }

    // 기존 slick 슬라이더 해제 (만약 초기화되어 있다면)
    if ($slider.hasClass('slick-initialized')) {
      $slider.slick('unslick');
    }

    // 컨트롤 버튼 항상 보이기
    $controls.find('.news_prev, .news_next').removeClass('disabled').show();

    // 아이템 수가 페이지당 수 이하이면 슬라이더 비활성화
    if (numItems <= itemsPerPage) {
      $controls.find('.news_prev, .news_next').addClass('disabled');
      $slider.removeClass('news-slider-active');
      return;
    }

    // 페이징 슬라이더 활성화
    $slider.addClass('news-slider-active');
    var currentPage = 0;                      
    var totalPages  = Math.ceil(numItems / itemsPerPage);

    // 특정 페이지를 보여주고 버튼 상태 업데이트
    function showPage(pageIndex) {
      $items.hide();
      var start = pageIndex * itemsPerPage;
      var end   = start + itemsPerPage;
      $items.slice(start, end).show();

      $controls
        .find('.news_prev').toggleClass('disabled', pageIndex === 0);
      $controls
        .find('.news_next').toggleClass('disabled', pageIndex >= totalPages - 1);
    }

    // 초기 표시
    showPage(0);

    // 이전/다음 클릭 핸들러
    $controls.find('.news_prev')
      .off('click.newsSlider')
      .on('click.newsSlider', function(e) {
        e.preventDefault();
        if (currentPage > 0) {
          currentPage--;
          showPage(currentPage);
        }
      });

    $controls.find('.news_next')
      .off('click.newsSlider')
      .on('click.newsSlider', function(e) {
        e.preventDefault();
        if (currentPage < totalPages - 1) {
          currentPage++;
          showPage(currentPage);
        }
      });
  });
}

// 윈도우 리사이즈와 문서 로드 시 재초기화 - 통합된 핸들러에서 처리됨
$(document).ready(initNewsSlider);


// 모바일에서 테이블 스타일 변환 함수
function tableChange() {
  // 테이블 반응형 처리가 필요한 경우 여기에 구현
}

// YouTube Player 변수
let player;

/**
 * YouTube API 준비 콜백 함수
 */
function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
      events: {
        onReady: function(event) {
            event.target.mute();        // autoplay 제한 회피
            event.target.playVideo();   // 재생
            console.log('YouTube Player Ready');
          }
      }
    });
}

// YouTube API가 함수를 찾을 수 있도록 전역으로 노출
window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;





/**
 * 뉴스 탭 메뉴 기능 
 * news_tab_menu의 버튼 클릭 시 해당하는 tab_panel을 활성화하고 뉴스 슬라이더를 재초기화합니다.
 */
$(document).ready(function() {
  // 뉴스 탭 메뉴 버튼 클릭 이벤트
  $('.news_tab_menu li button').on('click', function() {
    // 클릭된 버튼의 인덱스를 구합니다 (입찰공고 a태그 제외하고 button만 카운트)
    var clickedIndex = $(this).closest('li').index();
    
    // 모든 탭 메뉴에서 active 클래스 제거
    $('.news_tab_menu li').removeClass('active');
    
    // 클릭된 탭 메뉴에 active 클래스 추가
    $(this).closest('li').addClass('active');
    
    // 모든 탭 패널에서 active 클래스 제거
    $('.news_tab_content .tab_panel').removeClass('active');
    
    // 해당 인덱스의 탭 패널에 active 클래스 추가
    $('.news_tab_content .tab_panel').eq(clickedIndex).addClass('active');
    
    // 뉴스 슬라이더 재초기화 (새로 활성화된 탭 패널의 슬라이더를 위해)
    setTimeout(function() {
      initNewsSlider();
    }, 100);
    
  });
});
