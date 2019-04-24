var app = new Vue({
    el: "#app",
    data: {
        expression: "",
        answer: "",
        correctNum: 0,
        currentScore: 0,
        highScore: 0,
        gameStarted: false,
        gameOver: false,
        colors: ["yellow", "orange", "red", "purple", "green", "lightBlue"],
        bgColor: "grey",
        intervalId: ""
    },
    methods: {
        generateEquation: function() {
            if (this.intervalId != "") {
                clearInterval(app.intervalId);
            }
            this.setTimer();

            this.bgColor = this.colors[Math.floor(Math.random()*this.colors.length)];

            var firstNum = Math.floor(Math.random()*15) + 1;
            var secondNum = Math.floor(Math.random()*15) + 1;

            this.expression = firstNum.toString() + " + " + secondNum.toString();
            this.correctNum = firstNum + secondNum;

            var chance = Math.floor(Math.random() * 2);

            if (chance == 0) {
                var posNeg = Math.floor(Math.random()*2) == 1 ? 1 : -1;
                app.answer = app.correctNum + posNeg*(Math.floor(Math.random() * 5) + 1);
            }
            else {
                app.answer = app.correctNum;
            }
        },
        verifyAnswer: function(response) {
            if (response == "yes" && app.answer == app.correctNum || response == "no" && app.answer != app.correctNum) {
                app.currentScore++;

                if (app.currentScore > app.highScore) {
                    app.highScore = app.currentScore;
                    
                    var highScoreCookie = JSON.stringify(app.highScore);
                    app.createCookie('highScore', highScoreCookie);
                }

                app.generateEquation();
            }
            else {
                app.gameStarted = false;
                app.gameOver = true;

                $("#app").effect("shake", {times: 3, distance: 10});
            }
        },
        startGame: function() {
            this.gameStarted = true;
            this.generateEquation();
        },
        resetGame: function() {
            this.gameOver = false;
            
            this.currentScore = 0;
            this.gameStarted = true;
            this.generateEquation();
        },
        setTimer: function() {
            var i = 21;

            var counterBack = setInterval(function () {
                i--;
                if (i > 0) {
                    $('#timerBar').find("div").animate({ width: i == 20? "100%" : i*5 + '%' }, i == 20? 0 : 200, 'linear');
                } else {
                    $('#timerBar').find("div").animate({ width: "0%" }, 200, 'linear');
                    clearInterval(counterBack);

                    setTimeout(function() {
                        if (!app.gameOver) {
                            app.gameOver = true;
                            app.gameStarted = false;
                            $("#app").effect("shake", {times: 3, distance:10});
                        }
                    }, 200);
                }
            }, 200);

            this.intervalId = counterBack;
        },
        getCookie: function (c_name) {
            if (document.cookie.length > 0) {
                c_start = document.cookie.indexOf(c_name + "=");
                if (c_start != -1) {
                    c_start = c_start + c_name.length + 1;
                    c_end = document.cookie.indexOf(";", c_start);
                    if (c_end == -1) {
                        c_end = document.cookie.length;
                    }
                    return unescape(document.cookie.substring(c_start, c_end));
                }
            }
            return "";
        },
        createCookie: function (name, value, days) {
            var expires;
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toGMTString();
            }
            else {
                expires = "";
            }
            document.cookie = name + "=" + value + expires + "; path=/";
        }
    },
    mounted: function() {
        var highScoreCookie = this.getCookie('highScore');

        if (highScoreCookie != "") {
            this.highScore = JSON.parse(highScoreCookie);
        }
    }
});