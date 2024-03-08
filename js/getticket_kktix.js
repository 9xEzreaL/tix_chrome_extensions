

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

    function compareTime(){
        chrome.storage.local.get([
            "tixcraft_date",
            "tixcraft_time",
            ],(result) => {
            var date1 = result.tixcraft_date + "T" + result.tixcraft_time;
            const endDate = new Date(date1);
            const startDate = new Date()
            let difference = endDate.getTime() - startDate.getTime();
            async function exampleFunction() {
                console.log('Code before sleep');
                await sleep(difference);
                console.log('Code after sleep');
            }

            exampleFunction();
            console.log(`The timeout is set for ${difference} milliseconds.`);
        })}

    compareTime()

    if(document.querySelectorAll("input[type='text']").length == 1){
        // if haven't selling -> reload
        console.log("reload.");
        sleep(500);
        window.location.reload(true);
    }
    else if(document.getElementById("person_agree_terms")!=null){
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
        var elements = Array.from(document.querySelectorAll( "input[type='text']"));
        var assignTicket = false;
        try {
            elements[result.tixcraft_area].value = result.tixcraft_ticketcount;
            elements[result.tixcraft_area].dispatchEvent(new Event('change'));
            assignTicket = true;
        } catch (e) {
            try {elements[result.tixcraft_area2].value = result.tixcraft_ticketcount;
                elements[result.tixcraft_area2].dispatchEvent(new Event('change'));
                assignTicket = true;
            } catch (e) {
                try {elements[result.tixcraft_area3].value = result.tixcraft_ticketcount;
                    elements[result.tixcraft_area3].dispatchEvent(new Event('change'));
                    assignTicket = true;
                } catch (e) {
                    console.log("no tickets");
                    }
            }
        }
        if (assignTicket){
            // btn btn-primary btn-lg ng-isolate-scope btn-disabled-alt 不能點的
            // btn btn-primary btn-lg ng-isolate-scope 可以點的
            // console.log(document.getElementsByClassName("btn btn-primary btn-lg ng-isolate-scope"))
            var checkBtn = document.getElementsByClassName("btn btn-primary btn-lg ng-isolate-scope")[0];
            var intervalId = setInterval(function() {
            // Check if the button is not disabled
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
        else{
            // area ticket can not assign
            window.location.reload(true);}
            }
        )
    }
    else{window.location.reload(true);}

//         //kktix
//  chrome.storage.local.get([
//     "tms_using",
//     "tms_EventType",
//     "tms_GovernmentType",
//     "tms_SellTickets",
//     "tms_date",
//     "tms_start",
//     "tms_SubVenuesTagDiv",
//     "tms_end",
//     "tms_Broadcast",
//     "tms_Billboards",
//     "tms_Stalls",
//     "tms_EventName",
//     "tms_EventDescription",
//     "tms_EventSportType",
//     "tms_EventParticipantsNumber"
//   ],(result)=> {
//
//
//
// let getticket=$(".ticket-unit.ng-scope").filter(key => $($(".ticket-unit.ng-scope")[key]).find(".ticket-price").text().includes("3,800"));
// getticket.find("input").val("1")
// window.alert = function(str){
// return ;
// }
// alert("不能彈出警示框");//-->
// $(".btn.btn-lg.ng-isolate-scope.btn-primary")
//         document.getElementById("EventType").value=result.tms_EventType;
//         document.getElementById("GovernmentType").value=result.tms_GovernmentType;
//         document.getElementById("SellTickets").value=result.tms_SellTickets
//
//
//   });
//
//     }
//     window.alert = function(str){
//     return ;
//     }
//     alert("不能彈出警示框")

})
   

       
      