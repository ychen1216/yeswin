/**
 * 亞信．鄭詩瀚會計事務所 - 聯絡表單 Google Apps Script 後端腳本
 * 
 * 此腳本負責接收網頁表單傳來的資料，寫入 Google 試算表，
 * 並自動發送 Email 通知信至指定的電子郵件。
 */

// 設定收件信箱
const NOTIFICATION_EMAIL = 'ychen1216@gmail.com';

function doPost(e) {
  try {
    // 解析傳入的參數
    let params;
    if (e.postData && e.postData.contents) {
      params = JSON.parse(e.postData.contents);
    } else {
      params = e.parameter;
    }

    // 取得資料
    const timestamp = new Date();
    const name = params.name || '';
    const company = params.company || '';
    const phone = params.phone || '';
    const email = params.email || '';
    const service = params.service || '';
    const message = params.message || '';

    // 取得當前試算表與工作表
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 寫入資料列
    sheet.appendRow([
      timestamp,
      name,
      company,
      phone,
      email,
      service,
      message
    ]);

    // 格式化日期時間
    const formattedDate = Utilities.formatDate(timestamp, "GMT+8", "yyyy-MM-dd HH:mm:ss");

    // 發送通知郵件
    sendEmailNotification(formattedDate, name, company, phone, email, service, message);

    // 回傳成功 JSON
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: '資料已成功寫入試算表，並已發送通知郵件。'
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });

  } catch (error) {
    // 回傳錯誤 JSON
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
  }
}

// 支援 OPTIONS 請求（解決跨域 Preflight 請求）
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}

// 支援 GET 請求作為簡單測試
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: '亞信會計事務所 API 運行中。請使用 POST 方法提交表單。'
  }))
  .setMimeType(ContentService.MimeType.JSON)
  .setHeaders({
    'Access-Control-Allow-Origin': '*'
  });
}

/**
 * 發送電子郵件通知
 */
function sendEmailNotification(date, name, company, phone, email, service, message) {
  const subject = `【新諮詢通知】亞信會計官網 - 來自 ${name} 的諮詢`;
  
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
      <div style="background-color: #F26522; padding: 20px; text-align: center;">
        <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: bold; letter-spacing: 1px;">亞信．鄭詩瀚會計事務所</h2>
        <p style="color: rgba(255,255,255,0.85); margin: 5px 0 0 0; font-size: 14px;">官網線上客戶諮詢通知</p>
      </div>
      <div style="padding: 30px; background-color: #ffffff; color: #333333; line-height: 1.6;">
        <p style="margin-top: 0; font-size: 16px;">您好，官網剛剛收到了一筆新的客戶諮詢表單。以下是詳細資料：</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; font-weight: bold; width: 30%; color: #666666;">填寫時間</td>
            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0;">${date}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #666666;">聯絡人姓名</td>
            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; font-weight: 200;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #666666;">公司 / 職稱</td>
            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0;">${company || '未提供'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #666666;">聯絡電話</td>
            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0;"><a href="tel:${phone}" style="color: #F26522; text-decoration: none;">${phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #666666;">電子郵件</td>
            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0;"><a href="mailto:${email}" style="color: #F26522; text-decoration: none;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #666666;">諮詢項目</td>
            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #F26522;">${service}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; color: #666666; vertical-align: top;">諮詢內容</td>
            <td style="padding: 10px; white-space: pre-wrap;">${message}</td>
          </tr>
        </table>
        
        <div style="margin-top: 30px; text-align: center;">
          <a href="${SpreadsheetApp.getActiveSpreadsheet().getUrl()}" style="background-color: #1E232B; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 14px; font-weight: bold; display: inline-block;">開啟 Google 試算表查看</a>
        </div>
      </div>
      <div style="background-color: #f7f7f7; padding: 15px; text-align: center; border-top: 1px solid #e0e0e0; font-size: 12px; color: #999999;">
        本信件由 亞信．鄭詩瀚會計事務所 官方網站系統自動發送。
      </div>
    </div>
  `;

  MailApp.sendEmail({
    to: NOTIFICATION_EMAIL,
    subject: subject,
    htmlBody: htmlBody
  });
}
