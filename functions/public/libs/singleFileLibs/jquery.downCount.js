let downCountInterval;

$(function () {
  $.fn.downCount = function (requirements, callback) {
    // Save container
    let container = this;

    /**
     * Change client's local date to match offset timezone
     * @return {Object} Fixed Date object.
     */
    let currentDate = function () {
      // get client's current date
      let date = new Date();
      return date;
    };

    /**
     * Main downCount function that calculates everything
     */
    function countdown() {
      let target_date = new Date(requirements.startTimeDate), // set target date
        current_date = currentDate(); // get fixed current date

      // difference of dates
      let difference = target_date - current_date;

      requirements.timeLeftInSeconds = Math.floor(difference / 1000);
      console.log('updating');
      // if difference is negative than it's pass the target date
      if (difference < 0) {
        // stop timer
        clearInterval(downCountInterval);
        if (callback && typeof callback === 'function') callback();

        return;
      }

      let days = Math.floor(difference / (1000 * 60 * 60 * 24));
      let hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((difference % (1000 * 60)) / 1000);

      // fix dates so that it will show two digets
      days = String(days).length >= 2 ? days : '0' + days;
      hours = String(hours).length >= 2 ? hours : '0' + hours;
      minutes = String(minutes).length >= 2 ? minutes : '0' + minutes;
      seconds = String(seconds).length >= 2 ? seconds : '0' + seconds;

      // based on the date change the refrence wording
      let ref_days = days === 1 ? 'day' : 'days',
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
    downCountInterval = noDelaySetInterval(countdown, 200);
  };
});
