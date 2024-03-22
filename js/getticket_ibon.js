

$(()=>{
    window.alert = function() { console.log('Alert blocked.'); };

    function sleep(milliseconds) {
          var start = new Date().getTime();
          while (true) {
            if ((new Date().getTime() - start) > milliseconds){
              break;
            }
          }
        };

    function compareTime() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(["tixcraft_date", "tixcraft_time"], (result) => {
                var date1 = result.tixcraft_date + "T" + result.tixcraft_time;
                const endDate = new Date(date1);
                const startDate = new Date();
                let difference = endDate.getTime() - startDate.getTime();

                if (difference > 0) {
                    setTimeout(() => {
                        console.log('Time has arrived.');
                        resolve(true);  // 時間到達
                    }, difference);
                    console.log(`The timeout is set for ${difference} milliseconds.`);
                } else {
                    console.log('The specified time has already passed.');
                    resolve(false); // 時間已過
                }
            });
        });
    }

    function waitForElementToBeClickable(selector, timeout = 30000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            // 檢查元素是否可點擊
            function checkIfClickable(el) {
                // console.log("disable")
                // console.log(el.disabled)
                // console.log("display")
                // console.log(getComputedStyle(el).display)
                // console.log("style")
                // console.log(getComputedStyle(el).visibility)
                if (el && !el.disabled && getComputedStyle(el).display !== 'none' && getComputedStyle(el).visibility !== 'hidden') {
                    resolve(el);
                    console.log('clickable')
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error('Element not clickable within timeout'));
                } else {
                    console.log('not clickable')
                    setTimeout(checkIfClickable, 1000);  // 每100毫秒檢查一次

                }
            }

            checkIfClickable(selector);
        });
    }

    function waitForElement(selector, timeout = 30000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            function checkForElement() {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error('Element not found within the specified timeout'));
                } else {
                    setTimeout(checkForElement, 100); // Check again after a short delay
                }
            }

            checkForElement();
        });
    }

    // Chrome扩展中的JavaScript示例
    function sendImageToOCR(imageBase64) {
        console.log(imageBase64)
        fetch('http://localhost:5000/ocr', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image: imageBase64 })
        })
        .then(response => response.json())
        .then(data => {
            const inputElement = document.getElementById('ctl00_ContentPlaceHolder1_CHK');
            if (inputElement) {
                inputElement.value = data.text;  // 将OCR结果设置为input元素的值
                let elBtn = document.querySelector('#ticket-wrap > a.btn');
                if (elBtn && !elBtn.disabled) {
                    elBtn.click();
                }
            }
        })
        .catch(error => console.error('Error:', error));
    }

    function getImage(imageId) {
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        let img = document.getElementById(imageId); // Use the actual image ID
        canvas.height = img.naturalHeight;
        canvas.width = img.naturalWidth;
        context.drawImage(img, 0, 0);
        return canvas.toDataURL(); // Return the base64 string
    }


    // 1 step -> 定時功能
    compareTime().then(timeArrived => {
        if (window.location.href.indexOf("/ActivityInfo/Details/")>0){
        // 2 step -> 進入立即購票選日期
            chrome.storage.local.get([
            "tixcraft_date_index", // index
            ],(result) => {
                let myCssSelector = "div.single-content > div > div.row > div > div.tr";

                // Wait for the page to load
                function findAndClick(selector, maxAttempts = 30, interval = 300) {
                    let attempts = 0;

                    console.log(`Searching for element with selector: ${selector}`);

                    const intervalId = setInterval(() => {
                        const element = document.querySelectorAll(selector);
                        console.log(element)
                        if (element.length != 0) {
                            clearInterval(intervalId);
                            try {
                                element[result.tixcraft_date_index - 1].getElementsByTagName('button')[0].click()
                            }
                            catch (e) {
                                element[0].getElementsByTagName('button')[0].click()
                            }

                            console.log('Element clicked:', element);
                        } else {
                            attempts++;
                            console.log(`Attempt ${attempts}: Element not found`);

                            if (attempts >= maxAttempts) {
                                clearInterval(intervalId);
                                console.log('Max attempts reached, reloading page...');
                                window.location.reload();
                            }
                        }
                    }, interval);
                }
                findAndClick(myCssSelector)
            })
        }

        if (window.location.href.indexOf("PRODUCT_ID")>0){
            // 3 step -> 選區域
            let myCssSelector = 'div.col-md-5 > table > tbody > tr';

            chrome.storage.local.get([
            "tixcraft_area",
            "tixcraft_area2",
            "tixcraft_area3" // keyword
            ],(result) => {
                function findAreaClick(selector, maxAttempts = 30, interval = 300) {
                    let attempts = 0;
                    const intervalId = setInterval(() => {
                        const elements = document.querySelectorAll(selector);
                        console.log('elements', elements)
                        if (elements.length != 0) {
                            clearInterval(intervalId);
                            try {
                                elements[result.tixcraft_area - 1].click()
                            }
                            catch (e) {
                                try {
                                    elements[result.tixcraft_area2 - 1].click()
                                }
                                catch (e) {
                                    try {
                                        elements[result.tixcraft_area3 - 1].click()
                                    }
                                    catch (e) {
                                        console.log("can not click elements in area.")
                                    }
                                }
                            }
                            // window.location.href = nextUrl;
                        } else {
                            attempts++;
                            console.log(`Attempt ${attempts}: Element not found`);

                            if (attempts >= maxAttempts) {
                                clearInterval(intervalId);
                                console.log('Max attempts reached, reloading page...');
                                window.location.reload();
                            }
                        }
                    }, interval)
                }
            findAreaClick(myCssSelector)
            })
        }

        if (window.location.href.indexOf("PERFORMANCE_PRICE_AREA_ID")>0){
            // 4 step -> 選張數 + 驗證碼
            let myCssSelector = "ctl00_ContentPlaceHolder1_DataGrid_ctl02_AMOUNT_DDL";

            chrome.storage.local.get([
            "tixcraft_ticketcount" // Number
            ],(result) => {
                const ticketNumber = parseInt(result.tixcraft_ticketcount, 10);

                // Now, use this ticketNumber in your script
                function findTicketNumberClick(selector, maxAttempts = 30, interval = 300){
                    let attempts = 0;
                    const intervalId = setInterval(() => {
                        const ticket = document.getElementById(selector);
                        if (ticket.length != 0){
                            clearInterval(intervalId);
                            if (ticket && ticket.options && ticket.options[ticketNumber]) {
                            ticket.value = ticket.options[ticketNumber].value;
                            let imageBase64 = getImage('chk_pic');
                            sendImageToOCR(imageBase64);
                            }
                        } else {
                            attempts++;
                            console.log(`Attempt ${attempts}: Element not found`);

                            if (attempts >= maxAttempts) {
                                clearInterval(intervalId);
                                console.log('Max attempts reached, reloading page...');
                                window.location.reload();
                            }
                        }
                    })

                // 預測ocr/ click final Btn
                }
                findTicketNumberClick(myCssSelector)

            })



        }

    })

    // 3 step -> 選區域
    // https://orders.ibon.com.tw/application/UTK02/UTK0201_000.aspx?PERFORMANCE_ID=B06OLIRU&PRODUCT_ID=B06OEKX0&strItem=WEB%E7%B6%B2%E7%AB%99%E5%85%A5%E5%8F%A31
    // https://orders.ibon.com.tw/application/UTK02/UTK0201_000.aspx?PERFORMANCE_ID=B06KDFWO&PRODUCT_ID=B06K8ZDQ&strItem=WEB%E7%B6%B2%E7%AB%99%E5%85%A5%E5%8F%A31


    // 4 step -> 選張數
    // https://orders.ibon.com.tw/application/UTK02/UTK0202_.aspx?PERFORMANCE_ID=B06KDFWO&GROUP_ID=&PERFORMANCE_PRICE_AREA_ID=B06KDGMC

})
