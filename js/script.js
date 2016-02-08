$(function(){
    var calculatorCheckpoints = {
            0: {
                time: 1,
                percent: 15,
                min: 100, //для кратности значения сотне
                step: 100
            },
            1001: {
                time: 7,
                percent: 35
            },
            10000: {
                min: 0, //для кратности значения пяти сотням
                step: 500
            },
            10001: {
                time: 14,
                percent: 140
            },
            30001: {
                time: 30,
                percent: 420
            }
        },
        calculatorMin = 100,
        calculatorMax = 90000;


    (function(){
        var $slider = $(".calculator-slider");
        $(".calculator-value--investment").on("click", function(){
            $(this).find(".calculator-digit--value").trigger("focus");
        }).find(".calculator-digit--value").on("keydown", function(e){
            var $this = $(this);
            setTimeout(function(){
                var val = $this.html().split(/\D/).join("").slice(0, calculatorMax.toString().length);
                $slider.slider("value", val);
                $this.html(formatNumber(val));
                setCaretAtEnd($this[0]);
            }, 0);
        }).on("focus", function() {
            setCaretAtEnd(this);
        }).on("blur", function(){
            var value = $slider.slider("value");
            $(this).html(formatNumber(value));
        });
        $slider.slider({
            range: "min",
            min: calculatorMin,
            max: calculatorMax,
            slide: resetAll,
            change: resetAll,
            create: resetAll,
            start: function(){
                $(this).find(".ui-slider-handle, .ui-slider-range").addClass("calculator--no-transition");
            },
            stop: function(){
                $(this).find(".ui-slider-handle, .ui-slider-range").removeClass("calculator--no-transition");
            }
        });
        function resetAll() {
            var $slider = $(this);
            setSliderParams($slider);
            displayValues($slider);
        }

        function setSliderParams($slider) {
            var value = $slider.slider("value");
            for (var pointValue in calculatorCheckpoints) {
                if (!calculatorCheckpoints.hasOwnProperty(pointValue)) continue;
                if (parseInt(pointValue) > value) break;
                var checkPoint = calculatorCheckpoints[pointValue];
                for (var param in checkPoint) {
                    if (!checkPoint.hasOwnProperty(param)) continue;
                    $slider.slider("option", param, checkPoint[param]);
                }
            }
        }
        function displayValues($slider) {
            var value = $slider.slider("value"),
                time = $slider.slider("option", "time"),
                timeText = formatNumberText(time, ["день", "дня", "дней"]),
                percent = $slider.slider("option", "percent"),
                income = parseInt(value * (percent / 100)),
                imaginaryValue = value + income,
                imaginaryColumnHeight = (100 / (100 + percent)) * percent,
                realColumnHeight = 100 - imaginaryColumnHeight;
            $(".calculator-value--time .calculator-digit--value").html(formatNumber(time));
            $(".calculator-value--time .calculator-digit--value-text").html(timeText);
            $(".calculator-value--percent .calculator-digit--value").html(formatNumber(percent));
            $(".calculator-value--income .calculator-digit--value").html(formatNumber(income));
            $(".calculator-value--investment .calculator-digit--value").html(formatNumber(value));
            $(".calculator-column--real .calculator-column--value").html(formatNumber(value));
            $(".calculator-column--imaginary .calculator-column--value").html(formatNumber(imaginaryValue));
            $(".calculator-column--real .calculator-column--real-area").css("height", realColumnHeight + "%");
            $(".calculator-column--imaginary .calculator-column--real-area").css("height", realColumnHeight + "%");
            $(".calculator-column--imaginary .calculator-column--imaginary-area").css("height", imaginaryColumnHeight + "%");
        }
        function formatNumber (num) {
            num = num.toString().split(/\D+/).join("");
            var thousands = [],
                splitBy = 3,
                length = num.length;
            for (var i = 0; i < Math.ceil(length / splitBy); i++) {
                var start = length - i * splitBy - splitBy,
                    end = length - i * splitBy;
                thousands.unshift(num.slice(start > 0 ? start : 0, end));
            }
            return thousands.join(" ");
        }
        function formatNumberText (num, forms) {
            num = num % 100;
            if (num >= 11 && num <= 19) {
                return forms[2];
            }
            num = num % 10;
            if (num == 1) {
                return forms[0];
            }
            if (num >= 2 && num <= 4) {
                return forms[1];
            }
            return forms[2];
        }
        function setCaretAtEnd(el) {
            el.focus();
            if (typeof window.getSelection != "undefined"
                && typeof document.createRange != "undefined") {
                var range = document.createRange();
                range.selectNodeContents(el);
                range.collapse(false);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (typeof document.body.createTextRange != "undefined") {
                var textRange = document.body.createTextRange();
                textRange.moveToElementText(el);
                textRange.collapse(false);
                textRange.select();
            }
        }
    })();
});