var isClick=false;
$(function () {
    $(".menu p").click(function() {
        //点击当前P标记，使P标记的下一个兄弟ul，隐藏或者显示；除了当前P标记的下一个兄弟ul之外，其他的ul都隐藏。
        $(this).next("ul").toggle(100).siblings('ul').hide(100);
    });
});

function show(){
    $('html').css({'position':'fixed',"width":"100%"});
    $(".lbOverlay").css({"height":window.screen.availHeight});
    $(".lbOverlay").show();
    if(!isClick){
        isClick=true;
        console.log(isClick)
        var st=$(document).scrollTop(); //页面滑动高度
        var objH=$(".hidden_pro_au").height();//浮动对象的高度
        var ch=$(window).height();//屏幕的高度
        var objT=Number(st)+(Number(ch)-Number(objH))/5;   //思路  浮动高度+（（屏幕高度-对象高度））/2
        $(".hidden_pro_au").css("top",objT);
        $(".hidden_pro_au").css("height",ch-objT);
    }
    var sl=$(document).scrollLeft(); //页面滑动左移宽度
    var objW=$(".hidden_pro_au").width();//浮动对象的宽度
    var cw=$(window).width();//屏幕的宽度
    var objL=Number(sl)+(Number(cw)-Number(objW))/2; //思路  左移浮动宽度+（（屏幕宽度-对象宽度））/2
    $(".hidden_pro_au").css("left",objL);
    $(".hidden_pro_au").slideDown("20000");//这里显示方式多种效果
}
function closeDiv(){
    $(".lbOverlay").hide();
    $(".hidden_pro_au").hide();
    $("html").css({"position":"initial","height":"auto"})
}

function switchp() {
    var chanpin = document.getElementById('chanpin');
    if(chanpin.innerHTML=='<p>产品 v</p>')
    {
        chanpin.innerHTML="<p>产品 ></p>";
    }else
    {
        chanpin.innerHTML="<p>产品 v</p>";
    }
}


document.getElementsByClassName('drop-down')[0].addEventListener( 'mouseenter',function(e){
    $('.drop-down-content').slideDown(700);
});
document.getElementsByClassName('drop-down')[0].addEventListener( 'mouseleave', function(){
    $('.drop-down-content').slideUp(700);
});