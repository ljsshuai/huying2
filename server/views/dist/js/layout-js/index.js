window.onscroll = function() {
    /*console.log(document.documentElement.scrollTop,document.querySelector('.server_region2').offsetTop)*/
    /*console.log(window.pageYOffset)*/
    if($(window).width()>1024) {
        if (document.documentElement.scrollTop > 600 || window.pageYOffset > 600) {
            $(".we_server_title").addClass("animated slideInUp");
            $(".we_server_main1").addClass("animated slideInLeft");
            $(".box_office_main_image").addClass("animated slideInRight");
        }
        if (document.documentElement.scrollTop > 1200 || window.pageYOffset > 1200) {
            $(".film_movice_image").addClass("animated slideInLeft");
            $(".film_movice_main").addClass("animated slideInRight");
        }
        if (document.documentElement.scrollTop > 1700 || window.pageYOffset > 1700) {
            $(".marketing_monitoring_main").addClass("animated slideInLeft");
            $(".marketing_monitoring_image").addClass("animated slideInRight");
        }
        if (document.documentElement.scrollTop > 2200 || window.pageYOffset > 2200) {
            $(".data_report_image").addClass("animated slideInLeft");
            $(".data_report_main").addClass("animated slideInRight");
        }
        if (document.documentElement.scrollTop > 2500 || window.pageYOffset > 2500) {
            $(".data_report_server_title").addClass("animated0 fadeInUp");
            $(".layer1").addClass("animated0 fadeInUp");
            $(".layer2").addClass("animated1 fadeInUp");
            $(".layer3").addClass("animated2 fadeInUp");
            $(".layer4").addClass("animated3 fadeInUp");
        }
        if (document.documentElement.scrollTop > 3500 || window.pageYOffset > 3500) {
            $(".td1").addClass("animated11 fadeInUp");
            $(".td2").addClass("animated0 fadeInUp");
            $(".td3").addClass("animated1 fadeInUp");
            $(".td4").addClass("animated2 fadeInUp");
            $(".td5").addClass("animated3 fadeInUp");
            $(".td6").addClass("animated4 fadeInUp");
            $(".td7").addClass("animated5 fadeInUp");
            $(".td8").addClass("animated6 fadeInUp");
            $(".td9").addClass("animated7 fadeInUp");
            $(".td10").addClass("animated8 fadeInUp");
            $(".td11").addClass("animated9 fadeInUp");
            $(".td12").addClass("animated10 fadeInUp");
        }
    }

    if($(window).width()<1450)
    {
        if (document.documentElement.scrollTop > 3000 || window.pageYOffset > 3000) {
            $(".data_report_server_title").removeClass("animated0 fadeInUp");
            $(".layer1").removeClass("animated1 fadeInUp");
            $(".layer2").removeClass("animated2 fadeInUp");
            $(".layer3").removeClass("animated3 fadeInUp");
            $(".layer4").addClass("animated4 fadeInUp");
        }
    }

    if($(window).width()<1024)
    {
        if (document.documentElement.scrollTop > 600 || window.pageYOffset > 600) {
            $(".we_server").addClass("animated slideInLeft");
        }
        if (document.documentElement.scrollTop > 1200 || window.pageYOffset > 1200) {
            $(".film_movice").addClass("animated slideInRight");
        }
        if (document.documentElement.scrollTop > 1700 || window.pageYOffset > 1700) {
            $(".marketing_monitoring").addClass("animated slideInLeft");
        }
        if (document.documentElement.scrollTop > 1900 || window.pageYOffset >1900) {
            $(".data_report").addClass("animated slideInRight");
        }
    }
}


layui.use('jquery', function () {
    var $ = layui.jquery;


    window.onload = function () {
        var swiper = new Swiper('.swiper-container', {
            autoplay: 3000,
            speed: 1000,
            autoplayDisableOnInteraction: false,
            loop: true,
            centeredSlides: true,
            slidesPerView: 2,
            pagination: '.swiper-pagination',
            paginationClickable: true,
            prevButton: '.swiper-button-prev',
            nextButton: '.swiper-button-next',
            onInit: function (swiper) {
                swiper.slides[2].className = "swiper-slide swiper-slide-active";//第一次打开不要动画
            },
            breakpoints: {
                668: {
                    slidesPerView: 1,
                }
            }
        });


        //
        var scrllArr =window.screen.availWidth>1024?[{
            top: '9%',
            sort:1,
            left: '28%',
            width: '200px',
            height: '80px',
            background: 'url("../images/noSelectc.png") no-repeat 100% 100%'
        }, {
            top: '31%',
            sort:2,
            left: '50%',
            width: '238px',
            height: '89px',
            background: 'url("../images/select.png") no-repeat 100% 100%',
            isSelect: true
        }, {
            top: '54%',
            sort:3,
            left: '15%',
            width: '200px',
            height: '80px',
            background: 'url("../images/noSelectc.png") no-repeat 100% 100%'
        }]:[{
            top: '17%',
            sort:1,
            left: '68%',
            width: '160px',
            height: '74px',
            background: 'url("../images/noSelectc.png") no-repeat 100% 100%'
        }, {
            top: '12%',
            sort:2,
            left: '28%',
            width: '180px',
            height: '74px',
            background: 'url("../images/select.png") no-repeat 100% 100%',
            isSelect: true
        }, {
            top: '33%',
            sort:3,
            left: '-5%',
            width: '160px',
            height: '73px',
            background: 'url("../images/noSelectc.png") no-repeat 100% 100%'
        }];
        var setInter = function () {
            var newArr = [];
            newArr.push(scrllArr.pop())
            scrllArr = newArr.concat(scrllArr)
            $('.carousel-ul-div>div').each(function (index, val) {
                if (scrllArr[index].left == '50%') {
                    $('#server_region3').find('.server_region3:nth-child(' + (index + 1) + ')').css('display', 'block').siblings().css('display', 'none');
                    $('#server_region3').find('.server_region3:nth-child(' + (index + 1) + ')').addClass("animated fadeIn").siblings().removeClass('animated slideInLeft');
                    $(this).attr('isSelect', 'true');
                    $(this).addClass('activeCarouseDiv');
                    $('.carousel-ul').find('li:nth-child(' + (index + 1) + ')').addClass("carousel-ul-active").siblings().removeClass('carousel-ul-active')
                    ;
                } else {
                    // $(this).find('a').css('font-size', '28px');
                    $(this).removeAttr('isSelect').removeClass('activeCarouseDiv');;
                    $(this).css('z-index', 10);
                }
                $(this).animate({
                    top: scrllArr[index].top,
                    left: scrllArr[index].left,
                    width: scrllArr[index].width,
                    height: scrllArr[index].height
                });
                $(this).css('background', scrllArr[index].background);
            })
        }


        //
        var t=setInterval(setInter,2000)
        $('.carousel-ul-div>div,.carousel-ul li').mousemove(function(){
            clearInterval(t)
        })
        $('.carousel-ul-div>div,.carousel-ul li').mouseleave(function(){
            clearInterval(t)
            t=setInterval(setInter,2000)
        });


        $('.carousel-ul-div>div').each(function (e, val) {
            $(val).click(function () {
                // clearInterval(t)
                $('#server_region3').find('.server_region3:nth-child(' + (e + 1) + ')').css('display', 'block').siblings().css('display', 'none');
                $('#server_region3').find('.server_region3:nth-child(' + (e + 1) + ')').addClass("animated fadeIn").siblings().removeClass('animated slideInLeft');
                $('.carousel-ul').find('li:nth-child(' + (e + 1) + ')').addClass("carousel-ul-active").siblings().removeClass('carousel-ul-active')

                // $(this).find('a').css('font-size', '35px')
                if (!$(this).attr('isSelect')) {
                    var newArrSelect=[];
                    for (var i = 0; i < scrllArr.length; i++) {
                        if (scrllArr[i].isSelect) {
                            $(this).animate({
                                top: scrllArr[i].top,
                                left: scrllArr[i].left,
                                width: scrllArr[i].width,
                                height: scrllArr[i].height
                            });
                            $(this).css('background', scrllArr[i].background);
                            $(this).attr('isSelect', 'true').addClass('activeCarouseDiv')
                        }else{
                            newArrSelect.push(scrllArr[i])
                        }
                    }
                    console.log(newArrSelect)
                    console.log(e)
                    if(e!==1){
                        newArrSelect.sort(function(x,y){
                            if(x.sort>y.sort){
                                return -1
                            }else{
                                return 1
                            }
                        })
                    }
                    $(this).siblings().each(function(index,siblingsVal){
                        console.log(newArrSelect[index].top, $(siblingsVal))
                        $(siblingsVal).animate({
                            top: newArrSelect[index].top,
                            left: newArrSelect[index].left,
                            width: newArrSelect[index].width,
                            height: newArrSelect[index].height
                        });
                        $(siblingsVal).css('background', newArrSelect[index].background);
                        $(siblingsVal).removeAttr('isSelect').removeClass('activeCarouseDiv');
                    })
                }
            })
        })
    }
})