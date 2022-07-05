jQuery(document).ready(function ($) {
  // ntc example
  // var n_match = ntc.name('#6195ED');
  // This is the RGB value of the closest matching color
  // n_rgb = n_match[0];
  // This is the text string for the name of the match
  // n_name = n_match[1];
  // True if exact color match, False if close-match
  // n_exactmatch = n_match[2];
  // alert(n_match);

  // $('#hexValue').on('input change paste keyup mouseup', function () {
  //   var hexVal = $(this).val();
  //   var hexValLength = $(this).val().length;
  //   if (hexValLength === 6) {
  //     var hexCode = '#' + hexVal;
  //     var n_match = ntc.name(hexCode);
  //     var n_rgb = n_match[0];
  //     var n_name = n_match[1];
  //     var n_exactmatch = n_match[2];
  //     console.log(n_match);
  //   }
  // });

  // camel case conversion
  function camelize(str) {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, '');
  }

  // select all in hex input
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
      $('#hexColor').val(hexCode);

      // populate variable field
      var n_match = ntc.name(hexCode);
      var n_rgb = n_match[0];
      var n_name = n_match[1];
      var n_exactmatch = n_match[2];
      var variableName = camelize(n_name);

      // focus and select variable
      $('#sassVariable').val('$' + variableName + ': ' + hexCode + ';');
      // $('#sassVariable').focus().select();
    }
  });
  // on change color picker
  $('#hexColor').on('change', function () {
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
});
