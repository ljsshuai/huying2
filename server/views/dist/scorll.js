if ($('body').width() < 650) {
    $('.carousel>img').show();
    $('.popup-container').hide();
    $('.c-nav-r-btn').click(function(e) {
        e.stopPropagation()
        if ($('.c-nav-r-btn span:nth-child(2)').css('opacity') == 0) {
            $('.c-nav-r-btn span:first-child').css('transform', 'rotate(0deg)')
            $('.c-nav-r-btn span:nth-child(2)').css('opacity', '1')
            $('.c-nav-r-btn span:last-child').css('transform', 'rotate(0deg)')

            $('.headerMenu').slideUp("1500");
        } else {
            $('.c-nav-r-btn span:first-child').css('transform', 'rotate(-45deg)')
            $('.c-nav-r-btn span:nth-child(2)').css('opacity', '0')
            $('.c-nav-r-btn span:last-child').css('transform', 'rotate(45deg)')
            $('.headerMenu').slideDown("1500");
        }
    })
    $('body').click(function() {
        $('.c-nav-r-btn span:first-child').css('transform', 'rotate(0deg)')
        $('.c-nav-r-btn span:nth-child(2)').css('opacity', '1')
        $('.c-nav-r-btn span:last-child').css('transform', 'rotate(0deg)')
        $('.headerMenu').slideUp("1500");
    })
} else {
    var a = document.documentElement.scrollTop || document.body.scrollTop;
    if (a != 0) {
        rightScrollTop()
    }

    window.onscroll = function() {
        console.log(document.documentElement.scrollTop)
        rightScrollTop()
    }

    function rightScrollTop() {
        var a = document.documentElement.scrollTop || document.body.scrollTop; //滚动条
        var b = document.documentElement.clientHeight || document.body.clientHeight; //
        var c = document.documentElement.scrollHeight || document.body.scrollHeight; //
        console.dir(document.querySelector('.absoluteRight').clientHeight * 0.5)
        document.querySelector('.absoluteRight').style.top = a + window.innerHeight * 0.5 - document.querySelector('.absoluteRight').clientHeight * 0.5 + 'px';
    }
    $('.absoluteRight ul li:nth-child(4)').click(function() {
        $('body,html').animate({
            scrollTop: 0
        }, 500)
    })
}