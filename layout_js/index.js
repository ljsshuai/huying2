window.onscroll=function(){1024<$(window).width()&&((600<document.documentElement.scrollTop||600<window.pageYOffset)&&($(".we_server_title").addClass("animated slideInUp"),$(".we_server_main1").addClass("animated slideInLeft"),$(".box_office_main_image").addClass("animated slideInRight")),(1200<document.documentElement.scrollTop||1200<window.pageYOffset)&&($(".film_movice_image").addClass("animated slideInLeft"),$(".film_movice_main").addClass("animated slideInRight")),(1700<document.documentElement.scrollTop||1700<window.pageYOffset)&&($(".marketing_monitoring_main").addClass("animated slideInLeft"),$(".marketing_monitoring_image").addClass("animated slideInRight")),(2200<document.documentElement.scrollTop||2200<window.pageYOffset)&&($(".data_report_image").addClass("animated slideInLeft"),$(".data_report_main").addClass("animated slideInRight")),(2500<document.documentElement.scrollTop||2500<window.pageYOffset)&&($(".data_report_server_title").addClass("animated0 fadeInUp"),$(".layer1").addClass("animated0 fadeInUp"),$(".layer2").addClass("animated1 fadeInUp"),$(".layer3").addClass("animated2 fadeInUp"),$(".layer4").addClass("animated3 fadeInUp")),(3500<document.documentElement.scrollTop||3500<window.pageYOffset)&&($(".td1").addClass("animated0 fadeInUp"),$(".td2").addClass("animated0 fadeInUp"),$(".td3").addClass("animated1 fadeInUp"),$(".td4").addClass("animated2 fadeInUp"),$(".td5").addClass("animated3 fadeInUp"),$(".td6").addClass("animated4 fadeInUp"),$(".td7").addClass("animated5 fadeInUp"),$(".td8").addClass("animated6 fadeInUp"),$(".td9").addClass("animated7 fadeInUp"),$(".td10").addClass("animated8 fadeInUp"),$(".td11").addClass("animated9 fadeInUp"),$(".td12").addClass("animated10 fadeInUp"))),$(window).width()<=1024&&((600<document.documentElement.scrollTop||600<window.pageYOffset)&&$(".we_server").addClass("animated slideInLeft"),(1200<document.documentElement.scrollTop||1200<window.pageYOffset)&&$(".film_movice").addClass("animated slideInRight"),(1700<document.documentElement.scrollTop||1700<window.pageYOffset)&&$(".marketing_monitoring").addClass("animated slideInLeft"),(1900<document.documentElement.scrollTop||1900<window.pageYOffset)&&$(".data_report").addClass("animated slideInRight"))},layui.use("jquery",function(){var s=layui.jquery;window.onload=function(){new Swiper(".swiper-container",{autoplay:3e3,speed:1e3,autoplayDisableOnInteraction:!1,loop:!0,centeredSlides:!0,slidesPerView:2,pagination:".swiper-pagination",paginationClickable:!0,prevButton:".swiper-button-prev",nextButton:".swiper-button-next",onInit:function(e){e.slides[2].className="swiper-slide swiper-slide-active"},breakpoints:{668:{slidesPerView:1}}});var d=1024<window.screen.availWidth?[{top:"9%",sort:1,left:"28%",width:"200px",height:"80px",background:'url("../images/noSelectc.png") no-repeat 100% 100%'},{top:"31%",sort:2,left:"50%",width:"238px",height:"89px",background:'url("../images/select.png") no-repeat 100% 100%',isSelect:!0},{top:"54%",sort:3,left:"15%",width:"200px",height:"80px",background:'url("../images/noSelectc.png") no-repeat 100% 100%'}]:[{top:"17%",sort:1,left:"68%",width:"160px",height:"74px",background:'url("../images/noSelectc.png") no-repeat 100% 100%'},{top:"12%",sort:2,left:"28%",width:"180px",height:"74px",background:'url("../images/select.png") no-repeat 100% 100%',isSelect:!0},{top:"33%",sort:3,left:"-5%",width:"160px",height:"73px",background:'url("../images/noSelectc.png") no-repeat 100% 100%'}],e=function(){var e=[];e.push(d.pop()),d=e.concat(d),s(".carousel-ul-div>div").each(function(e,a){"28%"==d[e].left?(s("#server_region3").find(".server_region3:nth-child("+(e+1)+")").css("display","block").siblings().css("display","none"),s("#server_region3").find(".server_region3:nth-child("+(e+1)+")").addClass("animated fadeIn").siblings().removeClass("animated slideInLeft"),s(this).attr("isSelect","true"),s(this).addClass("activeCarouseDiv"),s(".carousel-ul").find("li:nth-child("+(e+1)+")").addClass("carousel-ul-active").siblings().removeClass("carousel-ul-active")):(s(this).removeAttr("isSelect").removeClass("activeCarouseDiv"),s(this).css("z-index",10)),s(this).animate({top:d[e].top,left:d[e].left,width:d[e].width,height:d[e].height}),s(this).css("background",d[e].background)})},a=setInterval(e,2e3);s(".carousel-ul-div>div,.carousel-ul li").mousemove(function(){clearInterval(a)}),s(".carousel-ul-div>div,.carousel-ul li").mouseleave(function(){clearInterval(a),a=setInterval(e,2e3)}),s(".carousel-ul-div>div").each(function(a,e){s(e).click(function(){if(s("#server_region3").find(".server_region3:nth-child("+(a+1)+")").css("display","block").siblings().css("display","none"),s("#server_region3").find(".server_region3:nth-child("+(a+1)+")").addClass("animated fadeIn").siblings().removeClass("animated slideInLeft"),s(".carousel-ul").find("li:nth-child("+(a+1)+")").addClass("carousel-ul-active").siblings().removeClass("carousel-ul-active"),!s(this).attr("isSelect")){for(var t=[],e=0;e<d.length;e++)d[e].isSelect?(s(this).animate({top:d[e].top,left:d[e].left,width:d[e].width,height:d[e].height}),s(this).css("background",d[e].background),s(this).attr("isSelect","true").addClass("activeCarouseDiv")):t.push(d[e]);console.log(t),console.log(a),1!==a&&t.sort(function(e,a){return e.sort>a.sort?-1:1}),s(this).siblings().each(function(e,a){console.log(t[e].top,s(a)),s(a).animate({top:t[e].top,left:t[e].left,width:t[e].width,height:t[e].height}),s(a).css("background",t[e].background),s(a).removeAttr("isSelect").removeClass("activeCarouseDiv")})}})})}}),$(function(){1024<$(window).width()&&$(".banner_image table").html('  <tr>\n                <td class="td1"><img src="images/ad1.png"></td>\n                <td class="td2"><img src="images/ad2.png"></td>\n                <td class="td3"><img src="images/ad3.png"></td>\n                <td class="td4"><img src="images/ad4.png"></td>\n            </tr>\n            <tr>\n                <td class="td5"><img src="images/ad5.png"></td>\n                <td class="td6"><img src="images/ad6.png"></td>\n                <td class="td7"><img src="images/ad7.png"></td>\n                <td class="td8"><img src="images/ad8.png"></td>\n            </tr>\n            <tr>\n                <td class="td9"><img src="images/ad9.png"></td>\n                <td class="td10"><img src="images/ad10.png"></td>\n                <td class="td11"><img src="images/ad11.png"></td>\n                <td class="td12"><img src="images/ad12.png"></td>\n            </tr>')});