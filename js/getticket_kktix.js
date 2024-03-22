

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
                    resolve(true); // 時間已過
                }
            });
        });
    }

    // compareTime().then(timeArrived => {
    //     if (timeArrived) {
    //         console.log('Time has arrived, proceed with the operation.');
    //         if(document.querySelectorAll("input[type='text']").length == 1){
    //             // if haven't selling -> reload
    //             console.log("reload.");
    //             sleep(500);
    //             window.location.reload(true);
    //         }
    //         else if(document.getElementById("person_agree_terms")!=null){
    //             // sell -> click agree btn
    //             document.getElementById("person_agree_terms").click();
    //             // select area
    //             chrome.storage.local.get([
    //                 "tixcraft_area",
    //                 "tixcraft_area2",
    //                 "tixcraft_area3",
    //                 "tixcraft_ticketcount",
    //                 ],(result)=> {
    //                 // ng-untouched ng-valid ng-not-empty ng-dirty ng-valid-parse
    //             var elements = Array.from(document.querySelectorAll( "input[type='text']"));
    //             var assignTicket = false;
    //             try {
    //                 elements[result.tixcraft_area].value = result.tixcraft_ticketcount;
    //                 elements[result.tixcraft_area].dispatchEvent(new Event('change'));
    //                 assignTicket = true;
    //             } catch (e) {
    //                 try {elements[result.tixcraft_area2].value = result.tixcraft_ticketcount;
    //                     elements[result.tixcraft_area2].dispatchEvent(new Event('change'));
    //                     assignTicket = true;
    //                 } catch (e) {
    //                     try {elements[result.tixcraft_area3].value = result.tixcraft_ticketcount;
    //                         elements[result.tixcraft_area3].dispatchEvent(new Event('change'));
    //                         assignTicket = true;
    //                     } catch (e) {
    //                         console.log("no tickets");
    //                         }
    //                 }
    //             }
    //             if (assignTicket){
    //                 // btn btn-primary btn-lg ng-isolate-scope btn-disabled-alt 不能點的
    //                 // btn btn-primary btn-lg ng-isolate-scope 可以點的
    //                 // console.log(document.getElementsByClassName("btn btn-primary btn-lg ng-isolate-scope"))
    //                 var checkBtn = document.getElementsByClassName("btn btn-primary btn-lg ng-isolate-scope")[0];
    //                 var intervalId = setInterval(function() {
    //                 // Check if the button is not disabled
    //                 if (!checkBtn.disabled) {
    //                     // Click the button
    //                     checkBtn.click();
    //                     console.log('Button clicked');
    //
    //                     // Stop checking
    //                     clearInterval(intervalId);
    //                 } else {
    //                     console.log('Button not clickable yet');
    //                 }
    //             }, 500); // Check every 1000 milliseconds (1 second)
    //                 // checkBtn.click();
    //                 // checkBtn.dispatchEvent(new Event('change'));
    //                 console.log("assign ticket already");
    //             }
    //             else{
    //                 // area ticket can not assign
    //                 window.location.reload(true);}
    //                 }
    //             )
    //         }
    //         else{window.location.reload(true);}
    //     } else {
    //         console.log('Time has already passed, handle accordingly.');
    //     }
    // });

function clickBtn(){
    // btn btn-primary btn-lg ng-isolate-scope btn-disabled-alt 不能點的
    // btn btn-primary btn-lg ng-isolate-scope 可以點的
    // console.log(document.getElementsByClassName("btn btn-primary btn-lg ng-isolate-scope"))
    var checkBtn = document.getElementsByClassName("btn btn-primary btn-lg ng-isolate-scope")[0];
    console.log("get check btn")
    var intervalId = setInterval(function() {
    // Check if the button is not disabled
        console.log(checkBtn.disabled)
        if (!checkBtn.disabled) {
        // Click the button
        checkBtn.click();
        console.log('Button clicked');

        // Stop checking
        clearInterval(intervalId);
    } else {
        console.log('Button not clickable yet');
    }
}, 500); // Check every 1000 milliseconds (1 second)
    // checkBtn.click();
    // checkBtn.dispatchEvent(new Event('change'));
    console.log("assign ticket already");

}

function findArea(maxAttempts = 5, interval = 500, callback) {
    let attempts = 0;

    console.log('Searching for elements with input type text');

    const intervalId = setInterval(() => {
        const elements = Array.from(document.querySelectorAll("input[type='text']"));

        if (elements.length > 0) {
            console.log('Element found:', elements);
            clearInterval(intervalId);
            if (callback) {
                callback(elements);  // Pass the elements to the callback function
            }
        } else {
            attempts++;
            console.log(`Attempt ${attempts}: Element not found`);

            if (attempts >= maxAttempts) {
                clearInterval(intervalId);
                console.log('Max attempts reached, reloading page...');
                // window.location.reload();
            }
        }
    }, interval);
}

var assignTicket = false;
function handleTimeCheck() {
    compareTime().then(timeArrived => {
        if (timeArrived) {
            console.log('Time has arrived, proceed with the operation.');

            if(document.getElementById("person_agree_terms")!=null){
                // sell -> click agree btn

                document.getElementById("person_agree_terms").click();
                // select area
                chrome.storage.local.get([
                    "tixcraft_area",
                    "tixcraft_area2",
                    "tixcraft_area3",
                    "tixcraft_ticketcount",
                    ],(result)=> {
                    // ng-untouched ng-valid ng-not-empty ng-dirty ng-valid-parse
                // var elements = Array.from(document.querySelectorAll( "input[type='text']"));

                window.addEventListener('load', () => {
                    findArea(5, 500, (elements) => {
                        try {
                            elements[result.tixcraft_area].value = result.tixcraft_ticketcount;
                            elements[result.tixcraft_area].dispatchEvent(new Event('change'));
                            clickBtn()
                            assignTicket = true;
                        } catch (e) {
                            try {
                                elements[result.tixcraft_area2].value = result.tixcraft_ticketcount;
                                elements[result.tixcraft_area2].dispatchEvent(new Event('change'));
                                clickBtn()
                                assignTicket = true;
                            } catch (e) {
                                try {
                                    elements[result.tixcraft_area3].value = result.tixcraft_ticketcount;
                                    elements[result.tixcraft_area3].dispatchEvent(new Event('change'));
                                    clickBtn()
                                    assignTicket = true;
                                } catch (e) {
                                    console.log("no tickets");
                                }
                            }
                        }
                    })
                })

                    }
                )
            }
            else{window.location.reload(true);}
            //
        } else {
            console.log('Time has not arrived yet, checking again...');
            setTimeout(handleTimeCheck, 1000); // 等待1秒後重新檢查
        }
    });
}


handleTimeCheck();  // 開始時間檢查流程
})
       
      