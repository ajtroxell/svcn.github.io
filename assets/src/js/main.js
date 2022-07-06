jQuery(document).ready(function ($) {
  // camel case conversion
  function camelize(str) {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, '');
  }

  // single value
  // select in hex input
  $('#hexValue').on('click', function () {
    $(this).select();
  });

  // check hex input against colors
  $('#hexValue').on('input', function () {
    var hexVal = $(this).val();
    var hexValLength = $(this).val().length;

    if (hexValLength === 6) {
      var hexCode = '#' + hexVal;

      // change color input value
      $('#hexColor span').css('background', hexCode);

      // populate variable field
      var n_match = ntc.name(hexCode);
      var n_rgb = n_match[0];
      var n_name = n_match[1];
      var n_exactmatch = n_match[2];
      var variableName = camelize(n_name);
      $('#sassVariable').val('$' + variableName + ': ' + hexCode + ';');
    }
  });
  // on change color picker
  $('#hexColor').on('focusout, blue', function () {
    var hexHashVal = $(this).val();
    var hexVal = hexHashVal.replace(/^#/, '');

    // change hex input value
    $('#hexValue').val(hexVal);

    // populate variable field
    var n_match = ntc.name(hexHashVal);
    var n_rgb = n_match[0];
    var n_name = n_match[1];
    var n_exactmatch = n_match[2];
    var variableName = camelize(n_name);
    $('#sassVariable')
      .val('$' + variableName + ': ' + hexHashVal + ';')
      .select();
  });

  // select variable on click
  $('#sassVariable').on('click', function () {
    $(this).select();
  });

  // multiple values
  // select all in hex input
  $('#hexValues').on('click', function () {
    $(this).select();
  });

  // split hex value lines
  $('#hexValues').on('focusout, blur', function () {
    $('#sassVariables').html('');
    $('#hexColors').html('');
    var value = $('#hexValues').val().split('\n');
    for (var i = 0; i < value.length; i++) {
      var hexVal = value[i];
      var hexValLength = value[i].length;

      if (hexValLength === 6) {
        var hexCode = '#' + hexVal;

        // populate variable field
        var n_match = ntc.name(hexCode);
        var n_rgb = n_match[0];
        var n_name = n_match[1];
        var n_exactmatch = n_match[2];
        var variableName = camelize(n_name);
        var hexValueEach = '$' + variableName + ': ' + hexCode + ';';
        $('#sassVariables').append(
          '$' + variableName + ': ' + hexCode + ';' + '\n'
        );
        $('#hexColors').append(
          '<span style="background:' + hexCode + '"></span>'
        );
      }
    }
  });

  // select variable on click
  $('#sassVariables').on('click', function () {
    $(this).select();
  });

  // colors height
  function hexColorsHeight() {
    var hexValHeight = $('#hexValues').outerHeight();
    $('#hexColors').css('height', hexValHeight);
  }

  // swap batch and single
  $('.btn-batch').on('click', function () {
    $('.batch-namer').removeClass('inactive');
    $('.single-namer').addClass('inactive');
    $('.btn-single').removeClass('inactive');
    $('.btn-batch').addClass('inactive');
    hexColorsHeight();
  });
  $('.btn-single').on('click', function () {
    $('.batch-namer').addClass('inactive');
    $('.single-namer').removeClass('inactive');
    $('.btn-single').addClass('inactive');
    $('.btn-batch').removeClass('inactive');
  });
});
