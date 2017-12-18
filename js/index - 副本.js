$(document).ready(function() {
    var ques, hiero, news, index, classBook = new Array(1, 1, 1);
    $("#quiz-part .container .question").hide();
    $("#quiz-part .container .hierophant").hide();
    $("#quiz-part .container #introduction #enter-quiz").click(function() {
        $("#quiz-part .container #introduction").hide();
        $("#quiz-part .container .question").show();
    });
    $.ajax({
        url: "data/question.dat",
        async: false,
        success: function(data, status) {
            ques = eval("(" + data + ")");
        }
    });
    $.ajax({
        url: "data/hierophant.dat",
        async: false,
        success: function(data, status) {
            hiero = eval("(" + data + ")");
        }
    });
    $.ajax({
        url: "data/news.dat",
        async: false,
        success: function(data, status) {
            news = eval("(" + data + ")");
        }
    });
    var bookOfQues = new Array(news.numOfNews);
    var bookOfHier = new Array(hiero.numOfHier);
    var ans = new Array(ques.numOfQues + 1),
        count = 1;
    for (var i = 0; i < ques.numOfQues; i++) {
        ans[i] = -1;
    }
    index = 0;
    setQues(index, count);

    $("#quiz-part .container .hierophant .h-btns #h-btn-0").click(function() {
        // window.location.reload(true);
        $("#quiz-part .container .hierophant").hide();
        $("#quiz-part .container .question").show();
        indnex = 5, count = 6;
        setQues(5, 6);
    });

    $("#quiz-part .container .hierophant .h-btns #h-btn-1").click(function() {
        $("#quiz-part .container .hierophant .h-btns .cpr").hide();
        $("#quiz-part .container .hierophant .h-btns").addClass("h-fixed");
        $("#quiz-part .container .hierophant p").hide();
        $("#quiz-part .container .hierophant .h-btns #h-btn-1").hide();
        $("#quiz-part .container .hierophant .media-container").empty();
        for (var i = 0; i < hiero.numOfHier; i++)
            setHiero(i);
    });

    function setHiero(hierIndex) {
        $("#quiz-part .container .hierophant .d-avatar-list").append("<div class='d-avatar-wrap'><div class='d-avatar active' style='background-image: url(img/" +hierIndex.toString() +".jpg)'><div class='d-avatar-name'>"+hiero.hier[hierIndex].name+"</div></div></div>");
        $("#quiz-part .container .hierophant .media-container").trigger("create");
        if (hiero.hier[hierIndex].gender == "男") {
            $("#quiz-part .container .hierophant .media-container #daoshi-" + hierIndex.toString() + " ul .ds-basic .gender .fa-venus").hide();
        } else {
            $("#quiz-part .container .hierophant .media-container #daoshi-" + hierIndex.toString() + " ul .ds-basic .gender .fa-mars").hide();
        }
    }

    function setQues(index, count) {
        $("#quiz-part .container #progress #progress-inner").animate({ width: (Math.round((count) / (ques.numOfQues + 2) * 100)).toString() + "%" });
        $("#quiz-part .container .question .q-title").empty();
        $("#quiz-part .container .question .q-title").append(ques.ques[index].quesTitle);
        $("#quiz-part .container .question .q-description").empty();
        if (index == 5) {
            $("#quiz-part .container .question .q-description").append("本题为多选题，蓝色代表已经选中，不可以都不选哦(*^▽^*)");
        }
        $("#quiz-part .container .question .q-answers").empty();
        for (var i = 0; i < ques.ques[index].ansNum; i++) {
            $("#quiz-part .container .question .q-answers").append("<div class=q-answer id=q-answer-" + i.toString() + ">" + ques.ques[index].quesAns[i] + "</div>");
        }
        if (index == 5) {
            for (var j = 0; j < 3; j++) {
                $("#quiz-part .container .question .q-answers #q-answer-" + j.toString()).toggleClass("active");
            }
        }
        $("#quiz-part .container .question .q-answers").trigger("create");
        if (index != 5) {
            $("#quiz-part .container .question .q-answers *").on("click", judgeAns);
        } else {
            for (var i = 0; i < 3; i++) {
                $("#quiz-part .container .question .q-answers #q-answer-" + i.toString()).on("click", function() {
                    $(this).toggleClass("active");
                    classBook[parseInt(this.id[9])] ^= 1;
                    if (classBook[0] + classBook[1] + classBook[2] == 0) {
                        for (var j = 0; j < 3; j++) {
                            $("#quiz-part .container .question .q-answers #q-answer-" + j.toString()).toggleClass("active");
                            classBook[j] = 1;
                        }
                    }
                });
            }
            $("#quiz-part .container .question .q-answers #q-answer-3").on("click", judgeAns);
        }
    }

    function judgeAns() {
        
        if (count <= ques.numOfQues) {
            ans[index] = parseInt(this.id[9]);
        } else {
            ans[count - 1] = this.id[9];
        }
        if (count == ques.numOfQues) {
            getNews();
            count++;

        } else if (count == ques.numOfQues + 1) {
            $("#quiz-part .container #progress #progress-inner").animate({ width: "100%" });
            $("#quiz-part .container .question").hide();
            $("#quiz-part .container .hierophant").show();
            ansJson = { "gender": ans[0], "ident": ans[1], "hope": ans[2], "wishHier": ans[3], "wishOccup": ans[4], "isClass0": classBook[0], "isClass1": classBook[1], "isClass2": classBook[2], "news": ans[6] };
            $.ajax({
                url: "https://ds9btgbx.api.lncld.net/1.1/classes/data",
                type: "POST",
                data: JSON.stringify(ansJson),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("X-LC-Id", "dS9btgBxJ6LKXxtrhWsg7UxS-gzGzoHsz");
                    xhr.setRequestHeader("X-LC-Key", "NakdwbJmQT5fgq3HXxmgqOFs");
                    xhr.setRequestHeader("Content-Type", "application/json");
                }
            });
            var hierCnt = 0;
            for (var i = 0; i < hiero.numOfHier; i++) {
                bookOfHier[i] = 0;
            }
            $("#quiz-part .container .hierophant .media-container").empty();
            for (var i = getRand(hiero.numOfHier), j = i - 1; i < hiero.numOfHier && i != j; i++, i %= hiero.numOfHier) {
                if (bookOfHier[i] == 0 && ((ans[3] == 0 && hiero.hier[i].gender == "男") || (ans[3] == 1 && hiero.hier[i].gender == "女") || ans[3] == 2) && (((ans[4] == 0 && (hiero.hier[i].occup == "教授" || hiero.hier[i].occup == "副教授" || hiero.hier[i].occup == "助理教授")) || (ans[4] == 1 && (hiero.hier[i].occup == "讲师" || hiero.hier[i].occup == "工程师" || hiero.hier[i].occup == "高级工程师" || hiero.hier[i].occup == "高级实验师"))) || ans[4] == 2) && (ans[5] == '*' || ans[7] == hiero.hier[i].code)) {
                    if (hierCnt < 12) {
                        bookOfHier[i] = 1;
                        setHiero(i);
                        hierCnt++;
                    }
                }
            }
            if (hierCnt == 0) {
                $("#quiz-part .container .hierophant p small").empty();
                $("#quiz-part .container .hierophant p small").append("没有符合要求的导师，但是你有可能喜欢他们...");
                for (var i = 0; i < 12; i++) {
                    var j = getRand(hiero.numOfHier);
                    if (bookOfHier[j] == 0) {
                        setHiero(j);
                        bookOfHier[j] = 1;
                    }
                }
            }
        } else {
            index++;
            count++;
            if (index == 2 && ans[1] != 0) {
                index++;
                count++;
            }
            setQues(index, count);
        }
    }

    function getNews() {
        $("#quiz-part .container #progress #progress-inner").animate({ width: (Math.round((ques.numOfQues + 1) / (ques.numOfQues + 2) * 100)).toString() + "%" });
        $("#quiz-part .container .question .q-description").empty();
        $("#quiz-part .container .question .q-description").append("还差最后一步...");
        $("#quiz-part .container .question .q-title").empty();
        $("#quiz-part .container .question .q-title").append("以下哪条大新闻使你最感兴趣？");
        $("#quiz-part .container .question .q-answers").empty();
        
        for (var i = 0; i < news.numOfNews; i++) {
            bookOfQues[i] = 0;
        }
        for (var i = 0; i < 3;) {
            var j = getRand(news.numOfNews);
            if (bookOfQues[j] == 0 && classBook[news.news[j].class] == 1) {
                bookOfQues[j] = 1;
                $("#quiz-part .container .question .q-answers").append("<div class=q-answer id=q-answer-" + news.news[j].index + ">" + news.news[j].title + "</div>");
                i++;
            }
        }
        $("#quiz-part .container .question .q-answers").append("<div class=q-answer id=q-answer-*>都感兴趣</div>");
        $("#quiz-part .container .question .q-answers").append("<div class=q-answer id=q-answer-~>都不感兴趣（换一批）</div>");
        $("#quiz-part .container .question .q-answers").trigger("create");
        $("#quiz-part .container .question .q-answers div:eq(0)").on("click", judgeAns);
        $("#quiz-part .container .question .q-answers div:eq(1)").on("click", judgeAns);
        $("#quiz-part .container .question .q-answers div:eq(2)").on("click", judgeAns);
        $("#quiz-part .container .question .q-answers div:eq(3)").on("click", judgeAns);
        $("#quiz-part .container .question .q-answers div:eq(4)").on("click", getNews);
    }

    function getRand(maxv) {
        return (Math.floor(Math.random() * maxv));
    }
    $("#quiz-part .container .hierophant .btn-group .btn btn-secondary .option1").click(function(){
    $("#quiz-part .container .hierophant .d-avatar-list").empty();
        for (var i = 0; i < hiero.numOfHier; i++)
            setHiero(i);
                
    });


});