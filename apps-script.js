function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp',
      'Full Name',
      'Email',
      'Age',
      'Gender',
      'Height',
      'Weight',
      'Experience',
      'Goals',
      'Biggest Struggle',
      'Training Days',
      'Interest',
      'Instagram',
      'Additional Info'
    ]);
  }

  var data = e.parameter;

  sheet.appendRow([
    new Date().toLocaleString('en-GB'),
    data['Full Name'] || '',
    data['Email'] || '',
    data['Age'] || '',
    data['Gender'] || '',
    data['Height'] || '',
    data['Weight'] || '',
    data['Experience'] || '',
    data['Goals'] || '',
    data['Biggest Struggle'] || '',
    data['Training Days'] || '',
    data['Interest'] || '',
    data['Instagram'] || '',
    data['Additional Info'] || ''
  ]);

  var subject = 'New Coaching Application: ' + (data['Full Name'] || 'Unknown');
  var body = 'New application received!\n\n' +
    'Name: ' + (data['Full Name'] || '') + '\n' +
    'Email: ' + (data['Email'] || '') + '\n' +
    'Age: ' + (data['Age'] || '') + '\n' +
    'Gender: ' + (data['Gender'] || '') + '\n' +
    'Height: ' + (data['Height'] || '') + '\n' +
    'Weight: ' + (data['Weight'] || '') + '\n' +
    'Experience: ' + (data['Experience'] || '') + '\n' +
    'Goals: ' + (data['Goals'] || '') + '\n' +
    'Biggest Struggle: ' + (data['Biggest Struggle'] || '') + '\n' +
    'Training Days: ' + (data['Training Days'] || '') + '\n' +
    'Interest: ' + (data['Interest'] || '') + '\n' +
    'Instagram: ' + (data['Instagram'] || '') + '\n' +
    'Additional Info: ' + (data['Additional Info'] || '');

  MailApp.sendEmail('digitalviewsmedia@gmail.com', subject, body);
  MailApp.sendEmail('nguyensyphudvl123@gmail.com', subject, body);

  var firstName = (data['Full Name'] || 'there').split(' ')[0];
  var applicantEmail = data['Email'] || '';

  if (applicantEmail) {
    var confirmSubject = 'Application received - here is what is next';
    var confirmHtml = '<div style="font-family: Arial, sans-serif; max-width: 500px; color: #333;">'
      + '<p>Hey ' + firstName + ',</p>'
      + '<p>Thanks for applying - I have got your details and I will be personally reviewing your application.</p>'
      + '<p>If you are a good fit, I will reach out within the next 24-48 hours to set up a quick strategy call where we will map out your game plan together.</p>'
      + '<p>In the meantime, follow me on Instagram if you have not already - I post daily tips that you can start using right away: '
      + '<a href="https://www.instagram.com/zayd__neyugn08" style="color: #c9a84c; font-weight: bold;">@zayd__neyugn08</a></p>'
      + '<p>Speak soon,<br><strong>Zayd</strong></p>'
      + '</div>';

    MailApp.sendEmail({
      to: applicantEmail,
      subject: confirmSubject,
      htmlBody: confirmHtml,
      name: 'ZAYD Fitness Coaching'
    });
  }

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
