layui.use(['laypage', 'layer'], function () {
    var laypage = layui.laypage
    $ = layui.jquery
        , layer = layui.layer;
    var isOne=false;
    //完整功能
    $.ajax({
        url: 'http://127.0.0.1:3333/api/articleIn',
        type: 'get',
        dataType: 'json',
        success: function (data, status) {
            console.log(data)
            if(data.status==='ok'){
                laypage.render({
                    elem: 'demo7'
                    , count: data.data.total
                    , layout: [ 'prev', 'page', 'next', 'limit']
                    , jump: function (obj) {
                        getdata(obj)
                    }
                });
            }
        },
        fail: function (err, status) {
            console.log(err)
        }
    })
    function getdata(obj){
        $.ajax({
            url: 'http://127.0.0.1:3333/api/articleIn?limit='+obj.limit+'&current='+obj.curr,
            type: 'get',
            dataType: 'json',
            success: function (data, status) {
                if(data.status==='ok'){
                    var html='';
                    data.data.listdata.forEach(function(item){
                        if(item.createdAt!=undefined){
                            item.createdAt=item.createdAt.substring(0,10)
                        }
                        if(item.publish===1){
                            html+= '<div class="movice_introduce"><div class="movice_introduce_left"><img src="//127.0.0.1:3333/serverPublic/images/'+item.image +'"></div><div class="movice_introduce_right"><div class="movice_introduce_title"><a href='+item.url +'>'+item.title+'</a></div><div class="movice_introduce_author">原创：'+ item.author +' | 来源：虎影数据 | 时间：'+ item.createdAt +'</div><div class="movice_introduce_main">'+ item.shortDescription +'</div><div class="movice_introduce_label"><img src="images/label.png">'+ item.keyword+' </div></div></div>'
                        }
                    })
                    $('#content').html(html)
                }
            },
            fail: function (err, status) {
                console.log(err)
            }
        })
    }
    /*手机端的加载*/
    $(function(){
        /*初始化*/
        var counter = 0; /*计数器*/
        var pageStart = 10; /*offset*/
        var pageSize = 1; /*size*/

        /*首次加载*/
        phonegetData(10, pageSize);

        /*监听加载更多*/
        $(document).on('click', '#more', function(){
            isOne=true
            pageSize ++;
            // pageStart = counter * pageSize;
            phonegetData(pageStart,pageSize);
        });
    });
    function phonegetData(offset,size){
        $.ajax({
            type: 'GET',
            url: 'http://192.168.2.188:3333/api/articleIn?limit='+offset+'&current='+size,
            dataType: 'json',
            success: function(reponse){
                var data = reponse.data.listdata;
                var sum = reponse.data.listdata.length;
                var result = '';
                //console.log(offset , size, sum);

                /*      * 例如分页数是5，只剩2条，则只取2条
                      *
                      * 实际MySQL查询时不写这个不会有问题
                      *!/*/
                //              if(sum - offset < size ){
                //                  size = sum - offset;
                //              }
                //              /!*使用for循环模拟SQL里的limit(offset,size)*!/
                for(var i=0; i<sum; i++){
                    result+=  '<div class="movice_introduce"><div class="movice_introduce_left"><img src="//127.0.0.1:3333/serverPublic/images/'+ data[i].image +'"></div><div class="movice_introduce_right"><div class="movice_introduce_title"><a href='+ data[i].url +'>'+ data[i].title+'</a></div><div class="movice_introduce_author">原创：'+ data[i].author +' | 来源：虎影数据 | 时间：'+  data[i].createdAt +'</div><div class="movice_introduce_main">'+  data[i].shortDescription +'</div><div class="movice_introduce_label"><img src="images/label.png">'+data[i].keyword+' </div></div></div>'
                }
                //
                if(isOne){
                    $('#content').append(result);
                }


                //
                //             /!*******************************************!/
                //             /!*隐藏more按钮*!/

                console.log($('.movice_introduce'))

                if ($('.movice_introduce').length===reponse.data.total){

                    $("#more").hide();
                }else{
                    $("#more").show();
                }
            },
            error: function(xhr, type){
             /* alert('Ajax error!');*/
            }
        });
    }
})