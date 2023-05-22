console.clear();
$('#text-input').val('');
$('#demo').html('<span>Name or Lore</span>');

function hexToRGB (hex) {
  hex = hex.replace('#','');
  var triPartHex = [hex.slice(0,2),hex.slice(2,4),hex.slice(4,6)];
  return (triPartHex.map(x => parseInt(x, 16)));
}

function compareRGB (heavyColor, oppColor, mod) {
  return [Math.round(heavyColor[0] - ((heavyColor[0]-oppColor[0]) * mod)),(heavyColor[1] - Math.round((heavyColor[1]-oppColor[1]) * mod)),(heavyColor[2] - Math.round((heavyColor[2]-oppColor[2]) * mod))];
}

function hexFromRGB (rgb) {
  var newRGB = [rgb[0].toString(16), rgb[1].toString(16), rgb[2].toString(16)];
  newRGB = newRGB.map(x => {
    if (x=="0") {return "00"} else {return x}
  }); 
  return `#${(newRGB[0]+newRGB[1]+newRGB[2])}`;
}

function lengthColor(id, count) {
  let counter = $(id).children("span")[0];
  $(counter).removeClass();
  if (count < 244) {
    $(counter).addClass('q-green');
  } else if (count < 245) {
    $(counter).addClass('q-yellow');
  } else if (count < 247) {
    $(counter).addClass('q-amber');
  } else {
    $(counter).addClass('q-red');
  }
}

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

  // Name/Lore Text Format //
  var textExt = `${itemBold ? '&l' : ''}${itemItalic ? '&o' : ''}${itemUnderline ? '&n' : ''}`;

  var finalOutput;
  finalOutput = '';
  if (((colourInstances - 2) > 0) && (inputColors.length == 2)) {
    // Redesigned <> format
    finalOutput = `{${gColour1}>}${textExt}${inputText}{${gColour2}<}`;

    // OLD CODE //
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
    var numColors = inputColors.length - 1;       // I think this matches up as number of Insertions.
    var positionMod = numColors / inputTextLen;
    //console.log('---------------------');
    //console.log('posMod: ' + positionMod);
    //console.log(`positionMod = ${numColors} / ${inputTextLen}`)
    
    // REMAPPING - Formerly: each colourInstance, new: each gradientInsertion
    var tempStr = inputText;
    finalOutput = `{${inputColors[0]}>}${textExt}`
    var lengthInsertion = (((inputText.replace(' ','')).length) / numColors);
    for (let iInsertion = 1; iInsertion < numColors; iInsertion++) {
      console.log("Processing Insertion");
      var charPosition = lengthInsertion * iInsertion;
      
      //if (!(Number.isInteger(charPosition))) {
      if (true) {
        var firstPos = (Math.floor(charPosition) - 0.5) - (lengthInsertion * (iInsertion - 1));
        var nextPos = Math.ceil(charPosition) - 0.5;
        
        // Initial. First colour.
        // Chars in Section: Char Index Pos of End of String - Char Index Pos of Start.
        let validChar;
        validChar = 0;
        //console.log("Start: " + (Math.floor(iInsertion * lengthInsertion) - 1) + "     End: " + ((Math.floor((iInsertion - 1) * lengthInsertion)) - 1))
        var charsInSection = ((Math.floor(iInsertion * lengthInsertion) - 1) - ((Math.floor((iInsertion - 1) * lengthInsertion)) - 1));
        //console.log(`charsInsection: ${charsInSection}`);
        while (validChar < charsInSection) {
          finalOutput += tempStr[0];
          //console.log(`validChar: ${validChar}, charsInsection: ${charsInSection}, tempStr char: ${tempStr[0]}`);
          if (tempStr[0] != ' ') {
            validChar += 1;
          }
          tempStr = tempStr.slice(1,tempStr.length);
        }

        var prevColor = hexToRGB(inputColors[iInsertion - 1]);
        var focalColor = hexToRGB(inputColors[iInsertion]);
        var nextColor = hexToRGB(inputColors[iInsertion + 1]);
        // < Gradient. Color-1 ---> Color... Position: firstPos-0.5
        var modifier = ((firstPos / lengthInsertion) - 1) * -1;
        //console.log(`firstPos: ${firstPos}, lengthInsertion: ${lengthInsertion}`);

        var firstColor = compareRGB(focalColor, prevColor, modifier);
        //console.log('firstColor: ' + firstColor);
        var firstColorHex = hexFromRGB(firstColor);

        var secondColor = compareRGB(focalColor, nextColor, modifier);
        //console.log('secondColor: ' + secondColor);
        //console.log(`focalColor: ${focalColor} ---- nextColor: ${nextColor} ---- modifier: ${modifier}`)
        var secondColorHex = hexFromRGB(secondColor);

        finalOutput += `{${firstColorHex}<}{${secondColorHex}>}${textExt}`;
        // > Gradient. Color ---> Color+1... Position: nextPos-0.5
      }
      console.log('finalOutput: ' + finalOutput);
    }
    finalOutput += `${tempStr}{${inputColors[inputColors.length - 1]}<}`
    console.log('Completed: ' + finalOutput);
    // For each colourInstance, generate a colour (per char)
    for (let colourX = 0; colourX < colourInstances; colourX++) {
      let colSegs = [];
      let colPos = colourX;

      //console.log(`colourX (loop pos): ${colourX}, colPos: ${colPos}`);

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
      //console.log(`posData: ${posData}, posMultiplier: ${posMultiplier}`)

      //console.log(`Position 1 (Colour): ${inputColors[(posData[0])]}, Position 2 (Colour): ${inputColors[(posData[0] + 1)]}`);
      
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

      //console.log('New Colour: ' + (colRed + colGreen + colBlue));
      
      colourArray = colourArray.concat([(colRed + colGreen + colBlue)]);
      //}


    }

  }

  //console.log('Two Colour Gradient: ' + twoColourGrad);
  //console.log('Colour Array: ' + colourArray);

  // Construct DEMO + Output Texts.
  //   - Classes + Minecraft styles, for formatting.
  var demoClasses = `${itemBold ? 'i-b ' : ''}${itemItalic ? 'i-i ' : ''}${itemUnderline ? 'i-u' : ''}`;

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
  $('#para2').text(finalOutput);

  // Length count, and validity.
  $('#long-format-length').html(`Long Format: <span>${outputText.length}</span> Characters`);
  lengthColor('#long-format-length', outputText.length);
  $('#croc-format-length').html(`Croc Format: <span>${finalOutput.length}</span> Characters`);
  lengthColor('#croc-format-length', finalOutput.length);

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
      <input class="color-entry trigger-update" data-jscolor="{preset: 'dark',closeButton: true,closeText: 'OK',width: 300,height: 300}" value="#ffffff" id="color${newCols + 1}"/>
    </div>`);
  jscolor.install();
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

$('#copy-new-format').click(function() {
  navigator.clipboard.writeText($('#para2').text());
})
