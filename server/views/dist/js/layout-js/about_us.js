//layyui配置
layui.use('layer', function(){ //独立版的layer无需执行这一句
    var $ = layui.jquery, layer = layui.layer; //独立版的layer无需执行这一句
    //触发事件
    function changeImage(name){

    }
    var active = {
        setTop: function(){
            var that = this;
            //多窗口模式，层叠置顶
            layer.open({
                type: 2 //此处以iframe举例
                ,title: '当你选择该窗体时，即会在最顶端'
                ,area: ['390px', '260px']
                ,shade: 0
                ,maxmin: true
                ,offset: [ //为了演示，随机坐标
                    Math.random()*($(window).height()-300)
                    ,Math.random()*($(window).width()-390)
                ]
                ,content: 'http://layer.layui.com/test/settop.html'
                ,btn: ['继续弹出', '全部关闭'] //只是为了演示
                ,yes: function(){
                    $(that).click();
                }
                ,btn2: function(){
                    layer.closeAll();
                }

                ,zIndex: layer.zIndex //重点1
                ,success: function(layero){
                    layer.setTop(layero); //重点2
                }
            });
        }
        ,confirmTrans: function(){
            //配置一个透明的询问框
            layer.msg('大部分参数都是可以公用的<br>合理搭配，展示不一样的风格', {
                time: 20000, //20s后自动关闭
                btn: ['明白了', '知道了', '哦']
            });
        }
        ,notice: function(e){
            //示范一个公告层
            console.log(window.screen.availWidth<700,window.screen.availWidth*0.9)
            layer.open({
                type: 1
                ,title: false //不显示标题栏
                ,shade: 0.3
                ,id: 'LAY_layuipro' //设定一个id，防止重复弹出
                // ,btn: ['火速围观', '残忍拒绝']/**/
                ,btnAlign: 'c'
                ,offset: window.screen.availWidth<700? '20px':"auto",
                area: window.screen.availWidth<700?[window.screen.availWidth*0.9+'px', window.screen.availHeight-150+'px']:['600px', 'auto'],
                shadeClose:true,
                closeBtn:2
                ,moveType: 1 //拖拽模式，0或者1
                ,content: '<div style="padding: 30px;word-break:break-al; line-height: 22px; background-color: #fff; font-weight: 300;border-radius: 5px">'+'<h2 style="margin-bottom:20px">'+$(e).next().text()+'<i style="font-size:16px;color:#ccc;    font-style: normal;margin-left:20px">('+$(e).parent().find('.pay').html()+')</i>'+'</h2>'+$(e).parent().find('.short').html()+'</div>'
                ,success: function(layero){
                    // var btn = layero.find('.layui-layer-btn');
                    // btn.find('.layui-layer-btn0').attr({
                    //     href: 'http://www.layui.com/'
                    //     ,target: '_blank'
                    // });
                }
            });
        }
        ,offset: function(othis){
            var type = othis.data('type')
                ,text = othis.text();

            layer.open({
                type: 1
                ,offset: type //具体配置参考：http://www.layui.com/doc/modules/layer.html#offset
                ,id: 'layerDemo'+type //防止重复弹出
                ,content: '<div style="padding: 20px 100px;">'+ text +'</div>'
                ,btn: '关闭全部'
                ,btnAlign: 'c' //按钮居中
                ,shade: 0 //不显示遮罩
                ,yes: function(){
                    layer.closeAll();
                }
            });
        }
    };

    $('#layerDemo .layui-test').on('click', function(){
        var othis = $(this), method = othis.data('method');
        active[method] ? active[method].call(this, othis) : '';
        console.log(            $(this).parent().find('.short').html()
            ,111)
        var name=$(this).attr('id')
        var a="images/"+name+"on.png";
        var b="images/"+name+"off.png";
        if (this.src.match("off"))
        {
            this.src=a;
        }
        else
        {
            this.src=b;
        }
        $(this).parent().siblings().find('img').each(function(e,val){
            $(val).attr('src',"images/"+$(val).attr('id')+"off.png")
        })
    });
})

//百度地图配置
var map = new BMap.Map("map");            // 创建Map实例
var point = new BMap.Point(118.078483,24.613542);    // 创建点坐标

map.centerAndZoom(point,20);                     // 初始化地图,设置中心点坐标和地图级别。
map.enableScrollWheelZoom();                            //启用滚轮放大缩小

var marker1 = new BMap.Marker(new BMap.Point(118.078483,24.613542));  // 创建标注
map.addOverlay(marker1);              // 将标注添加到地图中
marker1.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
var infoWindow1 = new BMap.InfoWindow("<p style='font-size:15px;color: #CC5522;font-weight: bold;white-space: nowrap;line-height: 20px;'>虎影科技有限公司<br/></p>" +
    "<p style='font-size:12px;line-height: 20px;'>地址：厦门市集美大道1302号创业大厦<br/>801-805单元</p>" + "<p style='font-size:12px;'>电话：0592-5366007</p>");              //给标注添加信息框
//给mark添加鼠标单击事件
marker1.addEventListener("click", function () { this.openInfoWindow(infoWindow1); });
setTimeout(function () {
    // IE
    if(document.all) {
        marker1.click();
    }
    // 其它浏览器
    else {
        var e = document.createEvent("MouseEvents");
        e.initEvent("click", true, true);
        marker1.dispatchEvent(e);
    }
}, 2000);
//编写自定义函数添加工作者标注
function addMarker(point, i) {
    //百度默认的标注是个红色气球，可以给它换图标：
    var myIcon = new BMap.Icon("./red_dot.png", new BMap.Size(20, 20), { anchor: new BMap.Size(10, 10) });//自己要添加的路径
    var marker2 = new BMap.Marker(point, { icon: myIcon });  // 创建标注
    map.addOverlay(marker2);              // 将标注添加到地图中
}
