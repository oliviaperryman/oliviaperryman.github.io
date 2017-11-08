


$(document).ready(function(){
  $.get("titles.html", function(data){
      $("#quotes-list").append(data);
      var quotes = $(".quotes");
      var quoteIndex = -1;

          function showNextQuote() {
              ++quoteIndex;
              quotes.eq(quoteIndex % quotes.length)
                  .fadeIn(2000)
                  .delay(2000)
                  .fadeOut(2000, showNextQuote);
          }

          showNextQuote();
    });

});
