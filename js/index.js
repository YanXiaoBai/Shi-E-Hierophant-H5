$(document).ready(function() {
    var ques, hiero, index, words, news, classBook = new Array(1, 1, 1),
        goal = 0;
    var lastTime = 0;
    var x = y = z = lastX = lastY = lastZ = 0;
    var shakeSpeed = 800;
    $("#quiz-part .container .question").hide();
    $("#quiz-part .container .hierophant").hide();
    $("#quiz-part .container .hierophant #titleOfClass").hide();
    $("#quiz-part .container .hierophant #chooseOfClass").hide();
    $("#quiz-part .container #introduction #enter-quiz").click(function() {
        $("#quiz-part .container #introduction").hide();
        $("#quiz-part .container .question").show();
    });
    var imgData = new Array(66);
    for (var i = 0; i < 63; i++) {
        imgData[i] = new Image();
        imgData[i].src = "img/" + i.toString() + ".jpg";
    }
    imgData[63] = new Image();
    imgData[63].src = "static/text_a.svg";
    imgData[64] = new Image();
    imgData[64].src = "static/text_s.svg";
    imgData[65] = new Image();
    imgData[65].src = "static/text_b.svg";
    $.ajax({
        url: "data/question.dat",
        async: false,
        success: function(data, status) {
            ques = eval("(" + data + ")");
        }
    });
    $.ajax({
        url: "data/news.dat",
        async: false,
        success: function(data, status) {
            news = eval("(" + data + ")");
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
        url: "data/words.dat",
        async: false,
        success: function(data, status) {
            words = eval("(" + data + ")");
        }
    });
    var bookOfHier = new Array(hiero.numOfHier);
    var ans = new Array(ques.numOfQues + 1),
        count = 1;
    for (var i = 0; i < ques.numOfQues; i++) {
        ans[i] = -1;
    }
    index = 0;
    setQues(index, count);

    $("#quiz-part .container .hierophant .btn-group #option1").click(function() {
        if (!$(this).hasClass("active")) {
            $("#quiz-part .container .hierophant .btn-group #option1").toggleClass("active");
            $("#quiz-part .container .hierophant .btn-group #option2").toggleClass("active");
        }
        $("#quiz-part .container .hierophant #chosen-hier").hide();
        $("#quiz-part .container .hierophant #full-hier").show();
        $("#quiz-part .container .hierophant #titleOfClass").show();
        $("#quiz-part .container .hierophant #chooseOfClass").show();
    });

    $("#quiz-part .container .hierophant .btn-group #option2").click(function() {
        if (!$(this).hasClass("active")) {
            $("#quiz-part .container .hierophant .btn-group #option1").toggleClass("active");
            $("#quiz-part .container .hierophant .btn-group #option2").toggleClass("active");
        }
        $("#quiz-part .container .hierophant #chosen-hier").show();
        $("#quiz-part .container .hierophant #full-hier").hide();
        $("#quiz-part .container .hierophant #titleOfClass").hide();
        $("#quiz-part .container .hierophant #chooseOfClass").hide();
    });

    $("#quiz-part .container .hierophant #chooseOfClass .btn").click(function() {
        $(this).toggleClass("active");
        showAllHier();
        $(this).toggleClass("active");
        $("#quiz-part .container .hierophant #d-single .d-single-before").on("click", function() {
            $("#quiz-part .container .hierophant #d-single").removeClass("active");
        });
        $("#quiz-part .container .hierophant .d-avatar-list .d-avatar-wrap .d-avatar").on("click", function() {
            $("#quiz-part .container .hierophant #d-single .container .d-single-name").empty();
            $("#quiz-part .container .hierophant #d-single .container .d-single-position").empty();
            $("#quiz-part .container .hierophant #d-single .container .d-single-email a").empty();
            $("#quiz-part .container .hierophant #d-single .container .d-single-description").empty();

            var hierClass;
            if (parseInt(this.id.split("-")[3]) == 62) {
                hierClass = "无人机系统研究院 ";
            } else if (news.news[parseInt(hiero.hier[parseInt(this.id.split("-")[3])].code)].class == 0) {
                hierClass = "电子信息工程学院 ";
            } else if (news.news[parseInt(hiero.hier[parseInt(this.id.split("-")[3])].code)].class == 1) {
                hierClass = "计算机学院 ";
            } else {
                hierClass = "软件学院 ";
            }
            $("#quiz-part .container .hierophant #d-single .d-single-fix .d-avatar").css("background-image", "url(img/" + parseInt(this.id.split("-")[3]) + ".jpg)");
            $("#quiz-part .container .hierophant #d-single .container .d-single-name").append(hiero.hier[parseInt(this.id.split("-")[3])].name);
            $("#quiz-part .container .hierophant #d-single .container .d-single-position").append(hierClass + hiero.hier[parseInt(this.id.split("-")[3])].occup);
            $("#quiz-part .container .hierophant #d-single .container .d-single-email a").attr("href", "mailto:" + hiero.hier[parseInt(this.id.split("-")[3])].mail);
            $("#quiz-part .container .hierophant #d-single .container .d-single-email a").append(hiero.hier[parseInt(this.id.split("-")[3])].mail);
            $("#quiz-part .container .hierophant #d-single .container .d-single-description").append(hiero.hier[parseInt(this.id.split("-")[3])].searchDir);
            $("#quiz-part .container .hierophant #d-single").addClass("active");
        });
    });

    function setHiero(hierIndex, isActive, container_id) {
        $("#quiz-part .container .hierophant #" + container_id).append("<div class='d-avatar-wrap'><div class='d-avatar' id='d-avatar-id-" + hierIndex.toString() + "' style='background-image: url(img/" + hierIndex.toString() + ".jpg)'><div class='d-avatar-name'>" + hiero.hier[hierIndex].name + "</div></div></div>");
        if (isActive == true) {
            $("#quiz-part .container .hierophant #" + container_id + " .d-avatar-wrap #d-avatar-id-" + hierIndex.toString()).toggleClass("active");
        }
        $("#quiz-part .container .hierophant .d-avatar-list").trigger("create");
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
        if (count < ques.numOfQues) {
            ans[index] = parseInt(this.id[9]);
        }
        if (count == ques.numOfQues) {
            getWords();
            count++;
        } else if (count == ques.numOfQues + 1) {
            $("#quiz-part .container #progress #progress-inner").animate({ width: "100%" });
            $("#quiz-part .container .question").hide();
            $("#quiz-part .container .hierophant").show();
            ansJson = { "gender": ans[0], "ident": ans[1], "hope": ans[2], "wishHier": ans[3], "wishOccup": ans[4], "isClass0": classBook[0], "isClass1": classBook[1], "isClass2": classBook[2], "score": goal, };
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
            $("#quiz-part .container .hierophant .d-avatar-list").empty();
            for (var i = getRand(hiero.numOfHier), j = i - 1; i < hiero.numOfHier && i != j; i++, i %= hiero.numOfHier) {
                if (bookOfHier[i] == 0 && ((ans[3] == 0 && hiero.hier[i].gender == "男") || (ans[3] == 1 && hiero.hier[i].gender == "女") || ans[3] == 2) && (((ans[4] == 0 && (hiero.hier[i].occup == "教授" || hiero.hier[i].occup == "副教授" || hiero.hier[i].occup == "助理教授")) || (ans[4] == 1 && (hiero.hier[i].occup == "讲师" || hiero.hier[i].occup == "工程师" || hiero.hier[i].occup == "高级工程师" || hiero.hier[i].occup == "高级实验师"))) || ans[4] == 2) && hierCnt < 12) {
                    bookOfHier[i] = 1;
                    setHiero(i, true, "chosen-hier");
                    hierCnt++;
                }
            }
            for (var i = 0; i < hiero.numOfHier; i++) {
                if (bookOfHier[i] == 0) {
                    setHiero(i, false, "chosen-hier");
                }
            }
            showAllHier();
            $("#quiz-part .container .hierophant #full-hier").hide();
            $("#quiz-part .container .hierophant #d-single #d-single-close").on("click", function() {
                $("#quiz-part .container .hierophant #d-single").removeClass("active");
            });
            $("#quiz-part .container .hierophant .d-avatar-list .d-avatar-wrap .d-avatar").on("click", function() {
                $("#quiz-part .container .hierophant #d-single .container .d-single-name").empty();
                $("#quiz-part .container .hierophant #d-single .container .d-single-position").empty();
                $("#quiz-part .container .hierophant #d-single .container .d-single-email a").empty();
                $("#quiz-part .container .hierophant #d-single .container .d-single-description").empty();

                var hierClass;
                if (parseInt(this.id.split("-")[3]) == 62) {
                    hierClass = "无人机系统研究院 ";
                } else if (news.news[parseInt(hiero.hier[parseInt(this.id.split("-")[3])].code)].class == 0) {
                    hierClass = "电子信息工程学院 ";
                } else if (news.news[parseInt(hiero.hier[parseInt(this.id.split("-")[3])].code)].class == 1) {
                    hierClass = "计算机学院 ";
                } else {
                    hierClass = "软件学院 ";
                }
                $("#quiz-part .container .hierophant #d-single .d-single-fix .d-avatar").css("background-image", "url(img/" + parseInt(this.id.split("-")[3]) + ".jpg)");
                $("#quiz-part .container .hierophant #d-single .container .d-single-name").append(hiero.hier[parseInt(this.id.split("-")[3])].name);
                $("#quiz-part .container .hierophant #d-single .container .d-single-position").append(hierClass + hiero.hier[parseInt(this.id.split("-")[3])].occup);
                $("#quiz-part .container .hierophant #d-single .container .d-single-email a").attr("href", "mailto:" + hiero.hier[parseInt(this.id.split("-")[3])].mail);
                $("#quiz-part .container .hierophant #d-single .container .d-single-email a").append(hiero.hier[parseInt(this.id.split("-")[3])].mail);
                $("#quiz-part .container .hierophant #d-single .container .d-single-description").append(hiero.hier[parseInt(this.id.split("-")[3])].searchDir);
                $("#quiz-part .container .hierophant #d-single").addClass("active");
            });
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

    function getWords() {
        $("#quiz-part .container #progress #progress-inner").animate({ width: (Math.round((ques.numOfQues + 1) / (ques.numOfQues + 2) * 100)).toString() + "%" });
        $("#quiz-part .container .question .q-description").empty();
        $("#quiz-part .container .question .q-description").append("接下来将会出现12个你不太熟悉的短语（都是导师们的研究方向哦），你要在12秒内尽可能记住它们，随后其中部分短语会被替换，且未被替换的短语的顺序也会被打乱。最终你能选出多少个之前出现过的短语呢？");
        $("#quiz-part .container .question .q-title").empty();
        $("#quiz-part .container .question .q-title").append("你的记忆力有多强？");
        $("#quiz-part .container .question .q-answers").empty();
        $("#quiz-part .container .question .q-answers").append("<div class=q-answer id=q-start>开始吧</div>");
        $("#quiz-part .container .question .q-answers #q-start").on("click", function() {
            var count = 12;
            $("#quiz-part .container .question .q-description").empty();
            $("#quiz-part .container .question .q-description").append("<div>请尽快记忆以下词汇哦：</div>");
            $("#quiz-part .container .question .q-answers").empty();
            $("#quiz-part .container .question .q-answers").append("<ol class=addOL>");
            var bookOfWords = new Array(words.numOfWords);
            for (var i = 0; i < words.numOfWords; i++) {
                bookOfWords[i] = 0;
            }
            for (var i = 0; i < 12;) {
                var j = getRand(words.numOfWords);
                if (bookOfWords[j] == 0) {
                    $("#quiz-part .container .question .q-answers .addOL").append("<li>" + words.words[j] + "</li>");
                    i++;
                    bookOfWords[j] = 1;
                }
            }
            asd = setInterval(function() {
                count--;
                if (count < 0) {
                    clearInterval(asd);
                    count_2 = 4;
                    $("#quiz-part .container .question .q-title").empty();
                    $("#quiz-part .container .question .q-title").append("正在替换中...");
                    $("#quiz-part .container .question .q-description").empty();
                    $("#quiz-part .container .question .q-description").append("让导师帽想想要换那些短语吧");
                    dsa = setInterval(function() {
                        count_2--;
                        if (count_2 == 3) {
                            $("#quiz-part .container .question .q-answers").animate({ opacity: "0" }, 500);
                        }
                        if (count_2 == 2) {
                            $("#quiz-part .container .question .q-answers").animate({ opacity: "1" }, 0);
                            $("#quiz-part .container .question .q-answers").empty();
                            $("#quiz-part .container .question .q-answers").append("<p style='text-align:center;font-size:100px'>🤔</p>");
                        }
                        if (count_2 < 0) {
                            clearInterval(dsa);
                            $("#quiz-part .container .question .q-title").empty();
                            $("#quiz-part .container .question .q-title").append("噔噔噔");
                            $("#quiz-part .container .question .q-description").empty();
                            $("#quiz-part .container .question .q-description").append("以下是部分短语被替换的列表，选出哪些短语是原来有的吧？");
                            $("#quiz-part .container .question .q-answers").empty();
                            for (var i = 0, k = 0, p = 0; i < 6 || k < 6;) {
                                var j = getRand(words.numOfWords);
                                if (bookOfWords[j] == 0 && i < 6) {
                                    var q = getRand(5);
                                    if (q != 0)
                                        continue;
                                    $("#quiz-part .container .question .q-answers").append("<div class='q-answer q-false' id=q-answer-" + j.toString() + ">" + words.words[j] + "</div>");
                                    i++;
                                    p++;
                                    bookOfWords[j] = 2;
                                }
                                if (bookOfWords[j] == 1 && k < 6) {
                                    $("#quiz-part .container .question .q-answers").append("<div class='q-answer q-true' id=q-answer-" + j.toString() + ">" + words.words[j] + "</div>");
                                    k++;
                                    p++;
                                    bookOfWords[j] = 3;
                                }
                            }
                            var choiceOfWords = new Array(words.numOfWords);
                            for (var i = 0; i < words.numOfWords; i++) {
                                choiceOfWords[i] = 0;
                            }
                            $("#quiz-part .container .question .q-answers").append("<hr><div class=q-answer id=q-submit>提交</div>");
                            $("#quiz-part .container .question .q-answers").trigger("create");
                            $("#quiz-part .container .question .q-answers").animate({ opacity: "0" }, 0);
                            $("#quiz-part .container .question .q-answers").animate({ opacity: "1" }, 500);
                            $("#quiz-part .container .question .q-answers [id^=q-answer-]").on("click", function() {
                                choiceOfWords[parseInt(this.id.split("-")[2])] ^= 1;
                                $(this).toggleClass("active");
                            });
                            $("#quiz-part .container .question .q-answers #q-submit").on("click", function() {
                                var callOfName = [
                                    ["小伙", "您", "您", "您"],
                                    ["姑娘", "您", "您", "您"],
                                ];
                                for (var i = 0; i < words.numOfWords; i++) {
                                    if (choiceOfWords[i] == 1) {
                                        if (bookOfWords[i] == 2) {
                                            goal -= 1.5;
                                        } else {
                                            goal += 1;
                                        }
                                    }
                                }
                                $("#quiz-part .container .question .q-title").empty();
                                $("#quiz-part .container .question .q-description").empty();
                                $("#quiz-part .container .question .q-answers").empty();

                                $("#quiz-part .container .question .q-answers").append("搞定啦！导师帽已经足够了解你了，拿起手机<strong>摇一摇</strong>，为导师帽充电，查看最终结果吧");
                                if (goal == 6) {
                                    $("#quiz-part .container .question .q-title").append("<div style='text-align:center'><img width=100px src='static/text_s.svg'></div><div style='text-align:center'>测试评价</div>");
                                    $("#quiz-part .container .question .q-description").append("WOW！" + callOfName[ans[0]][ans[1]] + "的记忆力超棒哎！全部正确！<hr>");
                                } else if (goal >= 5) {
                                    $("#quiz-part .container .question .q-title").append("<div style='text-align:center'><img width=100px src='static/text_s.svg'></div><div style='text-align:center'>测试评价</div>");
                                    $("#quiz-part .container .question .q-description").append("WOW！" + callOfName[ans[0]][ans[1]] + "的记忆力很棒，离全对只有一步之遥噢。<hr>");
                                } else if (goal >= 3) {
                                    $("#quiz-part .container .question .q-title").append("<div style='text-align:center'><img width=100px src='static/text_a.svg'></div><div style='text-align:center'>测试评价</div>");
                                    $("#quiz-part .container .question .q-description").append(callOfName[ans[0]][ans[1]] + "的记忆力还不错哎，赞一个。<hr>");
                                } else {
                                    $("#quiz-part .container .question .q-title").append("<div style='text-align:center'><img width=100px src='static/text_b.svg'></div><div style='text-align:center'>测试评价</div>");
                                    $("#quiz-part .container .question .q-description").append(callOfName[ans[0]][ans[1]] + "最近休息得不太好？小测试的成绩还可以，不过稍微有点不理想哦<hr>");
                                }
                                if (window.DeviceMotionEvent) {
                                    window.addEventListener('devicemotion', shake, false);
                                }
                                // else {
                                $("#quiz-part .container .question .q-answers").append("<div class='q-answer' id=q-enter>也可以点击这里直接查看结果</div>");
                                $("#quiz-part .container .question .q-answers #q-enter").trigger("create");
                                $("#quiz-part .container .question .q-answers #q-enter").on("click", judgeAns);
                                // }
                            });
                            return;
                        }
                    }, 500);
                    return;
                }
                $("#quiz-part .container .question .q-title").empty();
                $("#quiz-part .container .question .q-title").append("还有 " + count.toString() + " 秒");
            }, 1000);
        });
    }

    function shake(eventDate) {
        //获取设备加速度信息 
        var acceleration = eventDate.accelerationIncludingGravity;
        var nowTime = new Date().getTime();
        //如果这次摇的时间距离上次摇的时间有一定间隔 才执行
        if (nowTime - lastTime > 100) {
            var diffTime = nowTime - lastTime;
            lastTime = nowTime;
            x = acceleration.x;
            y = acceleration.y;
            z = acceleration.z;
            var speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 10000;
            if (speed > shakeSpeed) {
                judgeAns();
            }
            lastX = x;
            lastY = y;
            lastZ = z;
        }
    }

    function getRand(maxv) {
        return (Math.floor(Math.random() * maxv));
    }

    function showAllHier() {
        $("#quiz-part .container .hierophant #full-hier").empty();
        for (var i = 0; i < hiero.numOfHier; i++) {
            if ($("#quiz-part .container .hierophant #chooseOfClass #college0" + news.news[parseInt(hiero.hier[i].code)].class.toString()).hasClass("active")) {
                setHiero(i, true, "full-hier");
            }
        }
        for (var i = 0; i < hiero.numOfHier; i++) {
            if (!$("#quiz-part .container .hierophant #chooseOfClass #college0" + news.news[parseInt(hiero.hier[i].code)].class.toString()).hasClass("active")) {
                setHiero(i, false, "full-hier");
            }
        }
    }
});