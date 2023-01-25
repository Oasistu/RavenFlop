console.clear();

function processText () {
  var inputText = $('#text-input').val();

  var itemBold = ($('#text-bold').is(':checked'));
  var itemItalic = ($('#text-italic').is(':checked'));
  var itemUnderline = ($('#text-underline').is(':checked'));

  /* COLOUR */
  let gColour1 = $('#color1').val();
  let gColour2 = $('#color2').val();

  let colourInstances = inputText.length;
  console.log('Colour Instances: ' + colourInstances);
  var colourArray = [];
  

  // Count Colours.
  var colorElems = $('.color-entry').toArray();
  var inputColors = [];
  colorElems.forEach((elem) => {
    inputColors = inputColors.concat([$(elem).val()]);
  })
  console.log('Input Colors :' + inputColors);

  if (((colourInstances - 2) > 0) && (inputColors.length == 2)) {
    let colSegs = [];
    
    colourInstances -= 2;
    // COLOURS : 2
    for (let itX = 0; itX < 3; itX++) {
      // Init. Get Colour Inputs. //
      let col1 = parseInt((inputColors[0].slice((1 + itX * 2), (3 + itX * 2))), 16);
      let col2 = parseInt((inputColors[1].slice((1 + itX * 2), (3 + itX * 2))), 16);
      colSegs = colSegs.concat([[col1, col2]]);
    }
    for (let colourX = 0; colourX < colourInstances; colourX++) {
      // R
      let divDiffRed = ((colSegs[0][0] - colSegs[0][1]) / (colourInstances + 1)) * (colourX + 1);
      let colRed = 0;
      if (divDiffRed < 0) {
        divDiffRed = divDiffRed * -1;
      }
      if (colSegs[0][0] < colSegs[0][1]) {
        colRed = colSegs[0][0] + divDiffRed;
      } else {
        colRed = colSegs[0][0] - divDiffRed;
      }
      colRed = (Math.ceil(colRed)).toString(16);

      // G
      let divDiffGreen = ((colSegs[1][0] - colSegs[1][1]) / (colourInstances + 1)) * (colourX + 1);
      let colGreen = 0;
      if (divDiffGreen < 0) {
        divDiffGreen = divDiffGreen * -1;
      }
      if (colSegs[1][0] < colSegs[1][1]) {
        colGreen = colSegs[1][0] + divDiffGreen;
      } else {
        colGreen = colSegs[1][0] - divDiffGreen;
      }
      colGreen = (Math.ceil(colGreen)).toString(16);

      // B
      let divDiffBlue = ((colSegs[2][0] - colSegs[2][1]) / (colourInstances + 1)) * (colourX + 1);
      let colBlue = 0;
      if (divDiffBlue < 0) {
        divDiffBlue = divDiffBlue * -1;
      }
      if (colSegs[2][0] < colSegs[2][1]) {
        colBlue = colSegs[2][0] + divDiffBlue;
      } else {
        colBlue = colSegs[2][0] - divDiffBlue;
      }
      colBlue = (Math.ceil(colBlue)).toString(16);

      // Validating Colour Value. //
      if (colRed.length == 1) {
        colRed = '0' + colRed;
      }
      if (colGreen.length == 1) {
        colGreen = '0' + colGreen;
      }
      if (colBlue.length == 1) {
        colBlue = '0' + colBlue;
      }

      colourArray = colourArray.concat([(colRed + colGreen + colBlue)]);
    }
    colourArray = [(inputColors[0].replace('#', ''))].concat(colourArray).concat([(inputColors[1].replace('#', ''))]);
  } else if ((colourInstances > 0) && (inputColors.length > 2)) {
    console.log("Executing 3+ Colour Code.");
    // Sequence of colouring on a character based on location on a "colour number line".
    // * Determine position.
    // * Modify color relative to position.
    var inputTextLen = inputText.length;
    var numColors = inputColors.length - 1;
    var positionMod = numColors / inputTextLen;
    console.log('---------------------');
    console.log('posMod: ' + positionMod);
    console.log(`positionMod = ${numColors} / ${inputTextLen}`)
    
    // For each colourInstance, generate a colour (per char)
    for (let colourX = 0; colourX < colourInstances; colourX++) {
      let colSegs = [];
      let colPos = colourX;

      console.log(`colourX (loop pos): ${colourX}, colPos: ${colPos}`);

      // 0.21389 = ['0', '21389'] - We can use [0] of arr for the lower range colour and ([0] + 1) for upper colour.
      //   - then [1] of the arr can be used as (0.[1]) a modifier of the colour. i.e 0.25 is 25% of the way between
      //   - colour 0 and colour 1.
      // If Int: Fix Float.
      let colorLinePos = parseFloat(colPos * positionMod);
      if (Number.isInteger(colorLinePos)) {
        colorLinePos = colorLinePos.toString() + '.0';
      } else {colorLinePos = colorLinePos.toString()}
      
      let posData = colorLinePos.split('.');
      posData = [(parseInt(posData[0])), posData[1]];
      let posMultiplier = parseFloat(('0.' + (posData[1]).toString()));
      console.log(`posData: ${posData}, posMultiplier: ${posMultiplier}`)

      console.log(`Position 1 (Colour): ${inputColors[(posData[0])]}, Position 2 (Colour): ${inputColors[(posData[0] + 1)]}`);
      
      for (let itX = 0; itX < 3; itX++) {
        // Init. Gets Colour Inputs. -- Relative to position on colour line. //
        let col1 = parseInt((inputColors[posData[0]].slice((1 + itX * 2), (3 + itX * 2))), 16);
        console.log("Input Colors: " + inputColors[(posData[0] + 1)]);
        let col2 = parseInt((inputColors[(posData[0] + 1)].slice((1 + itX * 2), (3 + itX * 2))), 16);
        colSegs = colSegs.concat([[col1, col2]]);
      }
      //for (let colourY = 0; colourY < colourInstances; colourY++) {
      // R
      let divDiffRed = ((colSegs[0][0] - colSegs[0][1]) * posMultiplier);
      let colRed = colSegs[0][0] - divDiffRed;
      colRed = (Math.ceil(colRed)).toString(16);

      // G
      let divDiffGreen = ((colSegs[1][0] - colSegs[1][1]) * posMultiplier);
      let colGreen = colSegs[1][0] - divDiffGreen;
      colGreen = (Math.ceil(colGreen)).toString(16);

      // B
      let divDiffBlue = ((colSegs[2][0] - colSegs[2][1]) * posMultiplier);
      let colBlue = colSegs[2][0] - divDiffBlue;
      colBlue = (Math.ceil(colBlue)).toString(16);

      // Validating Colour Value. //
      if (colRed.length == 1) {
        colRed = '0' + colRed;
      }
      if (colGreen.length == 1) {
        colGreen = '0' + colGreen;
      }
      if (colBlue.length == 1) {
        colBlue = '0' + colBlue;
      }

      console.log('New Colour: ' + (colRed + colGreen + colBlue));
      
      colourArray = colourArray.concat([(colRed + colGreen + colBlue)]);
      //}


    }

  }

  console.log('Colour Array: ' + colourArray);

  // Construct DEMO + Output Texts.
  //   - Classes + Minecraft styles, for formatting.
  var demoClasses = `${itemBold ? 'i-b ' : ''}${itemItalic ? 'i-i ' : ''}${itemUnderline ? 'i-u' : ''}`;
  var textExt = `${itemBold ? '&l' : ''}${itemItalic ? '&o' : ''}${itemUnderline ? '&n' : ''}`;

  //   - Init. Starts with first char, using first color.
  //let demoText = `<span class="${demoClasses}" style="color: ${inputColors[0]}">${inputText[0]}</span>`;
  //let outputText = `{${inputColors[0]}}${textExt}${inputText[0]}`;
  let demoText = outputText = '';

  //console.log(demoText);
  for (let charX = 0; charX < colourArray.length; charX++) {
    // Raw styling, for copying.
    outputText = outputText + `{#${colourArray[charX]}}${textExt}${inputText[(charX)]}`;
    // Demonstration. Styles rendered in spans.
    demoText = demoText + `<span class="${demoClasses}" style="color: #${colourArray[charX]}">${inputText[charX]}</span>`;
  }
  // Adding the 
  //demoText = demoText + `<span class="${demoClasses}" style="color: ${inputColors[1]}">${inputText[inputText.length - 1]}</span>`;
  //outputText = outputText + `{${inputColors[1]}}${textExt}${inputText[inputText.length - 1]}`;
  $('#para').text(outputText);

  $('#demo').html(demoText);
}

function colorInit() {
  $('.trigger-update').change(function() {
    processText();
  });
  
  $('.color-entry-text').change(function() {
    //console.log($(this).attr('data-input-ref'));
    //console.log('#' + $(this).val());
    let newColor = $(this).val();
    if (newColor.search("#") == -1) {
      newColor = '#' + newColor;
    }
    //console.log(newColor);
    $(('#' + $(this).attr('data-input-ref'))).val(newColor);

    processText();
  });
}

colorInit();

$('#add-color').click(function() {
  let newCols = ($('.color-entry-container').toArray()).length;
  $('.color-list').append(`<div class="color-entry-container">
      <label for="color${newCols + 1}">Color ${newCols + 1} </label>
      <input class="color-entry trigger-update" type="color" value="#ffffff" id="color${newCols + 1}"/>
      <input class="color-entry-text" data-input-ref="color${newCols + 1}" />
    </div>`);
  colorInit();
  processText();
})

$('#remove-color').click(function() {
  let allColorConts = $('.color-entry-container').toArray();
  $((allColorConts[(allColorConts.length - 1)])).remove();
  colorInit();
  processText();
})

$('#copy-text').click(function() {
  navigator.clipboard.writeText($('#para').text());
})
