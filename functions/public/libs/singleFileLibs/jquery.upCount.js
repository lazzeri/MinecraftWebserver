let upCountInterval;

$(function () {
  $.fn.upCount = function (requirements) {
    let startDate = new Date(Date.now());

    startDate = startDate.removeSeconds(requirements.collectedTimeInSeconds);

    // Save container
    var container = this;

    /**
     * Main upCount function that calculates everything
     */
    function countdown() {
      var current_date = new Date(Date.now()); // get fixed current date

      // difference of dates
      var difference = current_date - startDate;
      requirements.collectedTimeInSeconds = Math.floor(difference / 1000);

      // basic math variables
      var _second = 1000,
        _minute = _second * 60,
        _hour = _minute * 60,
        _day = _hour * 24;

      // calculate dates
      var days = Math.floor(difference / _day),
        hours = Math.floor((difference % _day) / _hour),
        minutes = Math.floor((difference % _hour) / _minute),
        seconds = Math.floor((difference % _minute) / _second);

      // fix dates so that it will show two digets
      days = String(days).length >= 2 ? days : '0' + days;
      hours = String(hours).length >= 2 ? hours : '0' + hours;
      minutes = String(minutes).length >= 2 ? minutes : '0' + minutes;
      seconds = String(seconds).length >= 2 ? seconds : '0' + seconds;
      // based on the date change the refrence wording
      var ref_days = days === 1 ? 'day' : 'days',
        ref_hours = hours === 1 ? 'hour' : 'hours',
        ref_minutes = minutes === 1 ? 'minute' : 'minutes',
        ref_seconds = seconds === 1 ? 'second' : 'seconds';

      // set to DOM
      container.find('.days').text(days);
      container.find('.hours').text(hours);
      container.find('.minutes').text(minutes);
      container.find('.seconds').text(seconds);

      container.find('.days_ref').text(ref_days);
      container.find('.hours_ref').text(ref_hours);
      container.find('.minutes_ref').text(ref_minutes);
      container.find('.seconds_ref').text(ref_seconds);
    }

    // start
    upCountInterval = noDelaySetInterval(countdown, 200);
  };

  $.fn.setTime = function (difference) {
    difference = difference * 1000;
    let container = this;

    // basic math variables
    var _second = 1000,
      _minute = _second * 60,
      _hour = _minute * 60,
      _day = _hour * 24;

    // calculate dates
    var days = Math.floor(difference / _day),
      hours = Math.floor((difference % _day) / _hour),
      minutes = Math.floor((difference % _hour) / _minute),
      seconds = Math.floor((difference % _minute) / _second);

    // fix dates so that it will show two digets
    days = String(days).length >= 2 ? days : '0' + days;
    hours = String(hours).length >= 2 ? hours : '0' + hours;
    minutes = String(minutes).length >= 2 ? minutes : '0' + minutes;
    seconds = String(seconds).length >= 2 ? seconds : '0' + seconds;

    // based on the date change the refrence wording
    var ref_days = days === 1 ? 'day' : 'days',
      ref_hours = hours === 1 ? 'hour' : 'hours',
      ref_minutes = minutes === 1 ? 'minute' : 'minutes',
      ref_seconds = seconds === 1 ? 'second' : 'seconds';

    // set to DOM
    container.find('.days').text(days);
    container.find('.hours').text(hours);
    container.find('.minutes').text(minutes);
    container.find('.seconds').text(seconds);

    container.find('.days_ref').text(ref_days);
    container.find('.hours_ref').text(ref_hours);
    container.find('.minutes_ref').text(ref_minutes);
    container.find('.seconds_ref').text(ref_seconds);
  };
});
