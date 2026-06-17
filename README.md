# 亞信．鄭詩瀚會計事務所 官方網站

本專案為「亞信．鄭詩瀚會計事務所」的官方網站，採用單頁式響應式設計（Single-Page Responsive Web Design），以橘色、白色與深曜石灰為主調，呈現出活力、專業與高信任感的商務形象。

## 專案結構

- `index.html` - 網頁主體架構，已針對台灣在地 SEO 與效能進行最佳化。
- `style.css` - 現代化 Vanilla CSS 樣式表，包含流暢的動畫與完整的響應式佈局。
- `app.js` - 原生 JavaScript 控制的動態效果、FAQ 收折與聯絡表單串接。
- `assets/` - 網站使用的商務插圖、Logo 與背景圖片。
- `google-apps-script.js` - 用於 Google 試算表 (Google Sheets) 後端的 Google Apps Script 範例程式碼。

## 本地預覽

您可以使用任何靜態伺服器（如 Live Server、npm serve 或直接在瀏覽器中開啟 `index.html`）進行預覽。

## Google 試算表聯絡表單串接教學

本網站的聯絡表單已預留 API 串接介面，能將客戶提交的諮詢資訊自動寫入您的 Google 試算表，並發送通知至您的信箱 (`ychen1216@gmail.com`)。

### 設定步驟

1. **建立 Google 試算表**
   - 登入您的 Google 帳號，新建一個 Google 試算表。
   - 將試算表命名為「亞信會計事務所-線上諮詢表單」。
   - 在第一列建立以下欄位名稱：
     - A1: `時間`
     - B1: `聯絡人姓名`
     - C1: `公司名稱 / 職稱`
     - D1: `聯絡電話`
     - E1: `電子郵件`
     - F1: `諮詢項目`
     - G1: `諮詢內容`

2. **建立 Apps Script 腳本**
   - 點擊試算表選單的 **「延伸功能」** > **「Apps Script」**。
   - 清除原有程式碼，複製本專案中 `google-apps-script.js` 的內容貼上。
   - 將程式碼中的 `ychen1216@gmail.com` 確認設定為您的通知收件信箱。
   - 點擊上方 **「儲存」**（磁碟片圖示）。

3. **部署為網頁應用程式**
   - 點擊右上角 **「部署」** > **「新增部署」**。
   - 類型選擇 **「網頁應用程式」**。
   - 設定如下：
     - 說明：`亞信表單 API`
     - 專案執行身分：**「我」** (您的 Google 帳號)
     - 誰有權限存取：**「所有人」** (Anyone, even anonymous - 這樣網頁表單才能發送資料)
   - 點擊 **「部署」**。系統會要求授權，請按提示完成驗證（點擊「進階」並允許存取）。
   - 複製部署成功後產生的 **「網頁應用程式 URL」** (Web App URL)。

4. **更新網站設定**
   - 開啟本專案的 [app.js](file:///C:/Users/acc4/.gemini/antigravity/scratch/yaxin-accounting-web/app.js)。
   - 找到第一行的 `const GOOGLE_SHEET_URL = '...';`。
   - 將其替換為您剛剛複製的網頁應用程式 URL 即可！
