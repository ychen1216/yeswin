/**
 * 亞信．鄭詩瀚會計事務所 官方網站 - 前端邏輯
 */

// 若您完成 Google Apps Script 部署，請將下方 URL 替換為您的網頁應用程式部署網址 (Web App URL)
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwdk900jeRp7gbFBnNmMwccUGSxm3HV4YNn6Y_n1vXwvo5_YcDL0pOy8QPB6D41Pjqc/exec';

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileNav();
  initScrollSpy();
  initFAQ();
  initContactForm();
  initLineModal();
});

/**
 * 1. 導覽列滾動狀態與返回頂部按鈕
 */
function initNavbar() {
  const header = document.getElementById('header');
  const totopBtn = document.getElementById('totop-btn');
  
  const handleScroll = () => {
    const scrollPos = window.scrollY;
    
    // 導覽列變色
    if (scrollPos > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // 返回頂部按鈕顯示/隱藏
    if (scrollPos > 400) {
      totopBtn.classList.remove('hidden');
    } else {
      totopBtn.classList.add('hidden');
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // 初始化執行一次
}

/**
 * 2. 手機版導覽選單控制
 */
function initMobileNav() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-btn-outline');
  
  const toggleMenu = () => {
    const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
    mobileToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('open');
  };
  
  const closeMenu = () => {
    mobileToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('open');
  };
  
  mobileToggle.addEventListener('click', toggleMenu);
  
  // 點擊連結後自動收合選單
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  
  // 平滑滾動（扣除導覽列高度）
  const allScrollLinks = document.querySelectorAll('a[href^="#"]');
  allScrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      e.preventDefault();
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerOffset = 80; // header 的高度
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * 3. 滾動監聽導覽列作用中連結 (Scrollspy)
 */
function initScrollSpy() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  
  const options = {
    root: null,
    rootMargin: '-90px 0px -60% 0px', // 精準觸發範圍
    threshold: 0
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, options);
  
  sections.forEach(section => observer.observe(section));
}

/**
 * 4. FAQ 手風琴摺疊面板
 */
function initFAQ() {
  const accordionTriggers = document.querySelectorAll('.accordion-trigger');
  
  accordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', function() {
      const accordionItem = this.parentElement;
      const content = this.nextElementSibling;
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      
      // 關閉其他所有問答項（手風琴模式）
      document.querySelectorAll('.accordion-trigger').forEach(otherTrigger => {
        if (otherTrigger !== trigger) {
          otherTrigger.setAttribute('aria-expanded', 'false');
          otherTrigger.nextElementSibling.style.maxHeight = null;
          otherTrigger.nextElementSibling.setAttribute('aria-hidden', 'true');
        }
      });
      
      // 切換自身狀態
      if (isExpanded) {
        this.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = null;
        content.setAttribute('aria-hidden', 'true');
      } else {
        this.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px'; // 動態計算實際高度以支援 CSS 動畫
        content.setAttribute('aria-hidden', 'false');
      }
    });
  });
}

/**
 * 5. 聯絡表單驗證與串接
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = submitBtn.querySelector('.btn-text');
  const spinner = submitBtn.querySelector('.spinner');
  const successOverlay = document.getElementById('success-overlay');
  const successCloseBtn = document.getElementById('success-close-btn');
  
  // 欄位 DOM
  const fields = {
    name: {
      input: document.getElementById('client-name'),
      error: document.getElementById('name-error'),
      validate: (val) => val.trim().length > 0
    },
    phone: {
      input: document.getElementById('client-phone'),
      error: document.getElementById('phone-error'),
      validate: (val) => {
        const phoneRegex = /^09[0-9]{8}$|^0[2-8]{1,2}-?[0-9]{7,8}$/; // 台灣手機及市話驗證
        return phoneRegex.test(val.replace(/\s+/g, ''));
      }
    },
    email: {
      input: document.getElementById('client-email'),
      error: document.getElementById('email-error'),
      validate: (val) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(val.trim());
      }
    },
    service: {
      input: document.getElementById('service-select'),
      error: document.getElementById('service-error'),
      validate: (val) => val !== null && val !== ""
    },
    message: {
      input: document.getElementById('client-message'),
      error: document.getElementById('message-error'),
      validate: (val) => val.trim().length > 0
    }
  };

  // 清除單一欄位錯誤狀態
  const clearError = (fieldKey) => {
    const field = fields[fieldKey];
    field.input.parentElement.classList.remove('error');
  };

  // 設定單一欄位錯誤狀態
  const setError = (fieldKey) => {
    const field = fields[fieldKey];
    field.input.parentElement.classList.add('error');
  };

  // 監聽輸入事件以即時清除錯誤提示
  Object.keys(fields).forEach(key => {
    const field = fields[key];
    ['input', 'change', 'blur'].forEach(eventName => {
      field.input.addEventListener(eventName, () => {
        if (field.validate(field.input.value)) {
          clearError(key);
        }
      });
    });
  });

  // 表單提交事件
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    let isValid = true;
    
    // 驗證所有欄位
    Object.keys(fields).forEach(key => {
      const field = fields[key];
      if (!field.validate(field.input.value)) {
        setError(key);
        isValid = false;
      } else {
        clearError(key);
      }
    });

    if (!isValid) {
      // 滾動至第一個錯誤欄位
      const firstError = document.querySelector('.form-group.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // 開始送出狀態
    submitBtn.disabled = true;
    btnText.textContent = '傳送中...';
    spinner.classList.remove('hidden');

    // 彙整表單資料
    const formData = {
      name: fields.name.input.value.trim(),
      company: document.getElementById('client-company').value.trim(),
      phone: fields.phone.input.value.trim(),
      email: fields.email.input.value.trim(),
      service: fields.service.input.value,
      message: fields.message.input.value.trim()
    };

    if (GOOGLE_SHEET_URL) {
      // 1. 實際串接 Google Sheets
      try {
        const response = await fetch(GOOGLE_SHEET_URL, {
          method: 'POST',
          mode: 'no-cors', // 配合 Google Web App 特性
          cache: 'no-cache',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        
        // 由於 no-cors 模式下無法讀取 response body，我們假設連線成功即為成功
        handleFormSuccess();
      } catch (error) {
        console.error('表單提交失敗:', error);
        alert('提交表單時發生錯誤，請稍後再試，或直接撥打電話 02-2711-5752 與我們聯繫，謝謝！');
        resetSubmitBtn();
      }
    } else {
      // 2. 模擬串接測試 (當尚未填寫 GOOGLE_SHEET_URL 時)
      console.log('尚未設定 GOOGLE_SHEET_URL，觸發模擬提交：', formData);
      setTimeout(() => {
        handleFormSuccess();
      }, 1500);
    }
  });

  // 成功提交後的處理
  const handleFormSuccess = () => {
    form.reset();
    resetSubmitBtn();
    successOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // 鎖定背景捲動
  };

  // 重設按鈕狀態
  const resetSubmitBtn = () => {
    submitBtn.disabled = false;
    btnText.textContent = '送出諮詢申請';
    spinner.classList.add('hidden');
  };

  // 關閉成功訊息彈窗
  const closeSuccessOverlay = () => {
    successOverlay.classList.remove('active');
    document.body.style.overflow = ''; // 恢復背景捲動
  };

  successCloseBtn.addEventListener('click', closeSuccessOverlay);
  successOverlay.addEventListener('click', (e) => {
    if (e.target === successOverlay) {
      closeSuccessOverlay();
    }
  });
}

/**
 * 6. LINE 諮詢彈窗控制
 */
function initLineModal() {
  const lineBtn = document.getElementById('floating-line-btn');
  const lineModal = document.getElementById('line-modal');
  const lineModalClose = document.getElementById('line-modal-close');

  if (!lineBtn || !lineModal || !lineModalClose) return;

  const openModal = () => {
    lineModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // 鎖定背景捲動
  };

  const closeModal = () => {
    lineModal.classList.remove('active');
    document.body.style.overflow = ''; // 恢復背景捲動
  };

  lineBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });

  lineModalClose.addEventListener('click', closeModal);

  // 點擊彈窗外部背景時關閉
  lineModal.addEventListener('click', (e) => {
    if (e.target === lineModal) {
      closeModal();
    }
  });
}
