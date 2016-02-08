$(function(){
    var calculatorCheckpoints = {
        0: {
            time: 1,
            percent: 15,
            step: 100
        },
        1001: {
            time: 7,
            percent: 35
        },
        10001: {
            time: 14,
            percent: 140,
            step: 500
        },
        30001: {
            time: 30,
            percent: 420
        }
    };


    (function(){
        $(".calculator-slider").slider({
            min: 100,
            max: 90000,
            slide: resetAll,
            change: resetAll,
            create: resetAll
        });
        function resetAll() {
            var $slider = $(this);
            setActiveFieldSize($slider);
            setSliderParams($slider);
            displayValues($slider);
        }

        function setActiveFieldSize($slider) {
            var left = $slider.find(".ui-slider-handle").position().left;
            $slider.find(".calculator-slider--active-field").css("width", left);
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
            $(".calculator-column--real .calculator-column--value").html(formatNumber(value));
            $(".calculator-column--imaginary .calculator-column--value").html(formatNumber(imaginaryValue));
            $(".calculator-column--real .calculator-column--real-area").css("height", realColumnHeight + "%");
            $(".calculator-column--imaginary .calculator-column--real-area").css("height", realColumnHeight + "%");
            $(".calculator-column--imaginary .calculator-column--imaginary-area").css("height", imaginaryColumnHeight + "%");
        }
        function formatNumber (num) {
            num = num.toString();
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
    })();
});