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
    var MILLIS_PER_DAY = 1000 * 60 * 60 * 24;
    
    // Initialize sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var tempResponse = e.values;
    var expirationRange = sheet.getRange(e.range.rowEnd, 22);
    
    // Prep participant object
    var participant = {
      email: sheet.getRange(e.range.rowEnd, 2).getValue(),
      name: sheet.getRange(e.range.rowEnd, 3).getValue(),
      dob: sheet.getRange(e.range.rowEnd, 6).getValue(),
      date: sheet.getRange(e.range.rowEnd, 19).getValue(),
      time: sheet.getRange(e.range.rowEnd, 20).getValue()
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
    var prevBase64Code = sheet.getRange(e.range.rowEnd, 23).getValue();
    
    var base64Code = Utilities.base64Encode([
      sheet.getRange(e.range.rowEnd, 2).getValue(),
      sheet.getRange(e.range.rowEnd, 3).getValue(),
      sheet.getRange(e.range.rowEnd, 6).getValue()
    ].join());
    var qrCodeLink = "https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=" + base64Code;
    var qrCodeRange = sheet.getRange(e.range.rowEnd, 24);
    qrCodeRange.setValue(qrCodeLink);
    var base64Range = sheet.getRange(e.range.rowEnd, 23);
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
        "major": sheet.getRange(e.range.rowEnd, 5).getValue(),
        "dob": sheet.getRange(e.range.rowEnd, 6).getValue(),
        "identityCard": sheet.getRange(e.range.rowEnd, 7).getValue(),
        "transcript": sheet.getRange(e.range.rowEnd, 8).getValue(),
        "phoneNumber": sheet.getRange(e.range.rowEnd, 9).getValue(),
        "guardianNumber": sheet.getRange(e.range.rowEnd, 10).getValue(),
        "schoolLocation": sheet.getRange(e.range.rowEnd, 11).getValue(),
        "educationStatus": sheet.getRange(e.range.rowEnd, 12).getValue(),
        "currentGrade": sheet.getRange(e.range.rowEnd, 13).getValue(),
        "currentMajor": sheet.getRange(e.range.rowEnd, 14).getValue(),
        "university": sheet.getRange(e.range.rowEnd, 15).getValue(),
        "school": sheet.getRange(e.range.rowEnd, 16).getValue(),
        "baciiGrade": sheet.getRange(e.range.rowEnd, 17).getValue(),
        "mathGrade": sheet.getRange(e.range.rowEnd, 18).getValue(),
        "examDate": sheet.getRange(e.range.rowEnd, 19).getValue(),
        "examTime": sheet.getRange(e.range.rowEnd, 20).getValue(),
        "expiration": sheet.getRange(e.range.rowEnd, 22).getValue(),
        "base64Code": base64Code,
        "attended": false
      })
    };
    
    if (participant.isSuccess) {
      if (participant.isEdit) {
        sendEmail(participant);
        // Sends put request to edit info
        options['method'] = 'put';
        var httpResponse = UrlFetchApp.fetch("https://bruh-test-123.herokuapp.com/students/" + prevBase64Code, options);
        Logger.log(prevBase64Code);
      } else {
        sendEmail(participant);
        // Sends post request to post new participant
        var httpResponse = UrlFetchApp.fetch("https://bruh-test-123.herokuapp.com/students/", options);
  //      Logger.log(httpResponse);
      }
    }
  }
  
  // Function to send email
  function sendEmail(participant){
    var recipient = participant.email;
    var subject = "Thank you for your registeration in the KIT Entrance Exam";
    if (participant.isSuccess) {
      if (participant.isEdit) {
        var editTemplate = HtmlService.createTemplateFromFile('success_edit_email_template');
        editTemplate.participant = participant;
        var body = editTemplate.evaluate().getContent();
      } else {
        var successTemplate = HtmlService.createTemplateFromFile('success_email_template');
        successTemplate.participant = participant;
        var body = successTemplate.evaluate().getContent();
      }
    } else {
      if (participant.isEdit) {
        var failTemplate = HtmlService.createTemplateFromFile('fail_edit_email_template');
        failTemplate.participant = participant;
        var body = failTemplate.evaluate().getContent();
      } else {
        var failTemplate = HtmlService.createTemplateFromFile('fail_email_template');
        failTemplate.participant = participant;
        var body = failTemplate.evaluate().getContent();
      } 
    }
    MailApp.sendEmail({
      to: participant.email,
      subject: subject,
      htmlBody: body
    });
  }
  
  // Function to check if duplicate
  function checkDuplicate(name, dob, email){
    // Initialize sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getDataRange().getValues();
    // Checks for every row and column to see duplicate
    for (let i = 1; i < sheet.length - 1; i++){
      if([sheet[i][2], sheet[i][5]].join() == [name, dob].join()) {  
        return true;
      } 
    }
    for (let i = 1; i < sheet.length - 1; i++) {
      if (sheet[i][1] == email) {
        return true;
      }
    }
    return false;
  }
  