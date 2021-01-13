// Set up the trigger
function setUpTrigger(){
    var sheet = SpreadsheetApp.getActive();
    ScriptApp.newTrigger('onFormSubmit')
    .forSpreadsheet(sheet) 
    .onFormSubmit()
    .create();
  }
  
   function onFormSubmit(e) {
      // Variable for storing milliseconds per day
      var MILLIS_PER_DAY = 1000 * 60 * 60 *  24;
      
      // Initialize sheet
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      var tempResponse = e.values;
      var expirationRange = sheet.getRange(e.range.rowEnd, 8);
      
      // Prep participant object
      var participant = {
        email: sheet.getRange(e.range.rowEnd, 2).getValue(),
        name: sheet.getRange(e.range.rowEnd, 3).getValue(),
        dob: sheet.getRange(e.range.rowEnd, 6).getValue(),
  
      };
      
      // Check if new or edited
      if (expirationRange.getValue() == '') {
        participant.isEdit = false;
        expirationRange.setValue(Utilities.formatDate(new Date(new Date().getTime() + 7 * MILLIS_PER_DAY), "GMT+7", "MM/dd/yyyy HH:mm:ss"));
      } else {
        participant.isEdit = true;
        if (new Date(expirationRange.getValue()) < new Date()) {
          participant.isSuccess = false;
          sendEmail(participant);
          return; 
        }
      }
     
      Logger.log("Here");
      // Check if duplicate
      var checkDupe = checkDuplicate(participant.name, participant.dob, participant.email);
      if (participant.isEdit == false) {
        if (checkDupe) {
          participant.isSuccess = false;
          sendEmail(participant);
          return;
        }
      }
    
      Logger.log("There");
      // Generate base64 code
      var prevBase64Code = sheet.getRange(e.range.rowEnd, 9).getValue();
      
      var base64Code = Utilities.base64Encode([
        sheet.getRange(e.range.rowEnd, 2).getValue(),
        sheet.getRange(e.range.rowEnd, 3).getValue(),
        sheet.getRange(e.range.rowEnd, 6).getValue()
      ].join());
      var qrCodeLink = "https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=" + base64Code;
      var qrCodeRange = sheet.getRange(e.range.rowEnd, 10);
      qrCodeRange.setValue(qrCodeLink);
      var base64Range = sheet.getRange(e.range.rowEnd, 9);
      base64Range.setValue(base64Code)
      
      participant.isSuccess = true;
      participant.qrCodeLink = qrCodeLink;
      
      Logger.log("Everywhere");
    // Send http requests and send email
      var options = {
        'method' : 'post',
        'contentType': 'application/json',
        'payload' : JSON.stringify({
          "email": sheet.getRange(e.range.rowEnd, 2).getValue(),
          "name": sheet.getRange(e.range.rowEnd, 3).getValue(),
          "gender": sheet.getRange(e.range.rowEnd, 4).getValue(),
          "phoneNumber": sheet.getRange(e.range.rowEnd,5).getValue(),
          "dob": sheet.getRange(e.range.rowEnd, 7).getValue(),
          "base64Code": base64Code,
          "attended": false
        })
      };
      
      if (participant.isSuccess) {
        if (participant.isEdit) {
          sendEmail(participant);
          // Sends put request to edit info
          options['method'] = 'put';
          var httpResponse = UrlFetchApp.fetch("http://localhost:3000/users/" + prevBase64Code, options);
          Logger.log(prevBase64Code);
        } else {
          sendEmail(participant);
          // Sends post request to post new participant
          var httpResponse = UrlFetchApp.fetch("http://localhost:3000/users/", options);
    //      Logger.log(httpResponse);
        }
      }
    }