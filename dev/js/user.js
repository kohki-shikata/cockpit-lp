$(function() {
    $('.mh').matchHeight();
});

$('.nav-tabs a').click(function (e) {
  e.preventDefault()
  $(this).tab('show')
})
