var testdata;
var prediction;

function predict(data,weight){
    var f = 0;
    weight = [3.33346292e-01,-1.11200396e-01,-7.77821806e-01,1.11058590e-01,3.89430647e-01,1.99992062e+00,4.44366975e-01,-2.77951957e-01,-6.00531647e-05,3.33200243e-01,2.66644002e+00,6.66735991e-01,5.55496098e-01,5.57022408e-02,2.22225591e-01,-1.66678858e-01];
    for(var j=0;j<data.length;j++) {
      f += data[j] * weight[j];
    }
    return f > 0 ? 1 : -1;
}

function isIPInURL(){
    var reg =/\d{1,3}[\.]{1}\d{1,3}[\.]{1}\d{1,3}[\.]{1}\d{1,3}/;
    var url = window.location.href
    if(reg.exec(url)==null){
        console.log("NP");
        return -1;
    }
    else{
        console.log("P");
        return 1;
    }
}

function isLongURL(){
    var url = window.location.href;    
    if(url.length<54){
        console.log("NP");
        return -1;
    } 
    else if(url.length>=54 && url.length<=75){
        console.log("Maybe");
        return 0;
    }
    else{
        console.log("P");
        return 1;
    }
}
function isTinyURL(){
    var url = window.location.href;    
    if(url.length>20){
        console.log("NP");
        return -1;
    } 
    else{
        console.log("P");
        return 1;
    }
}
function isAlphaNumericURL(){
    var search ="@";
    var url = window.location.href; 
    if(url.match(search)==null){
        console.log("NP");
        return -1;
    }
    else{
        console.log("P");
        return 1;
    }
}
function isRedirectingURL(){
    var reg1 = /^http:/
    var reg2 = /^https:/
    var srch ="//";
    var url = window.location.href; 
    if(url.search(srch)==5 && reg1.exec(url)!=null && (url.substring(7)).match(srch)==null){
        console.log("NP");
        return -1;
    }
    else if(url.search(srch)==6 && reg2.exec(url)!=null && (url.substring(8)).match(srch)==null){
        console.log("NP");
        return -1;
    }
    else{
        console.log("P");
        return 1;
    }
}
function isHypenURL(){
    var reg = /[a-zA-Z]\//;
    var srch ="-";
    var url = window.location.href; 
    if(((url.substring(0,url.search(reg)+1)).match(srch))==null){
        console.log("NP");
        return -1;
    }    
    else{
        console.log("P");
        return 1;
    }
}
function isMultiDomainURL(){
    var reg = /[a-zA-Z]\//;
    var srch ="-";
    var url = window.location.href; 
    if((url.substring(0,url.search(reg)+1)).split('.').length < 5){
        console.log("NP");
        return -1;
    }    
    else{
        console.log("P");
        return 1;
    }
}
function isFaviconDomainUnidentical(){
    var reg = /[a-zA-Z]\//;
    var url = window.location.href; 
    if(document.querySelectorAll("link[rel*='shortcut icon']").length>0){            
        var faviconurl = document.querySelectorAll("link[rel*='shortcut icon']")[0].href;
        if((url.substring(0,url.search(reg)+1))==(faviconurl.substring(0,faviconurl.search(reg)+1))){
            console.log("NP");
            return -1;
        }    
        else{
            console.log("P");
            return 1;
        }
    }
    else{
        console.log("NP");
        return -1;
    }
}

function isIllegalHttpsURL(){
    var srch1 ="//";   
    var srch2 = "https";   
    var url = window.location.href; 
    if(((url.substring(url.search(srch1))).match(srch2))==null){
        console.log("NP");
        return -1;
    }    
    else{
        console.log("P");
        return 1;
    }
}
function isImgFromDifferentDomain(){
	var totalCount = document.querySelectorAll("img").length
	var identicalCount = getIdenticalDomainCount("img");
	if(((totalCount-identicalCount)/totalCount)<0.22){
        console.log("NP");
        return -1;
    } 
	else if((((totalCount-identicalCount)/totalCount)>=0.22) && (((totalCount-identicalCount)/totalCount)<=0.61)){
        console.log("Maybe");
        return 0;
    } 	
    else{
        console.log("P");
        return 1;
    }
}
function isAnchorFromDifferentDomain(){
	var totalCount = document.querySelectorAll("a").length
	var identicalCount = getIdenticalDomainCount("a");
	if(((totalCount-identicalCount)/totalCount)<0.31){
        console.log("NP");
        return -1;
    } 
	else if((((totalCount-identicalCount)/totalCount)>=0.31) && (((totalCount-identicalCount)/totalCount)<=0.67)){
        console.log("Maybe");
        return 0;
    } 	
    else{
        console.log("P");
        return 1;
    }
}
function isScLnkFromDifferentDomain(){
	var totalCount = document.querySelectorAll("script").length + document.querySelectorAll("link").length
	var identicalCount = getIdenticalDomainCount("script") + getIdenticalDomainCount("link");
	if(((totalCount-identicalCount)/totalCount)<0.17){
        console.log("NP");
        return -1;
    } 
	else if((((totalCount-identicalCount)/totalCount)>=0.17) && (((totalCount-identicalCount)/totalCount)<=0.81)){
        console.log("Maybe");
        return 0;
    } 	
    else{
        console.log("P");
        return 1;
    }
}

function isFormActionInvalid(){
    var totalCount = document.querySelectorAll("form").length
	var identicalCount = getIdenticalDomainCount("form");
	if(document.querySelectorAll('form[action]').length<=0){
	    console.log("NP");
        return -1;
	}	
	else if(identicalCount!=totalCount){
        console.log("Maybe");
        return 0;
    } 	
    else if(document.querySelectorAll('form[action*=""]').length>0){
        console.log("P");
        return 1;
    } 
    else{
        console.log("NP");
        return -1;
    } 
}

function isMailToAvailable(){
    if(document.querySelectorAll('a[href^=mailto]').length<=0){
        console.log("NP");
        return -1;
    } 	
    else{
        console.log("P");
        return 1;
    }
}

function isStatusBarTampered(){
    if((document.querySelectorAll("a[onmouseover*='window.status']").length<=0) || (document.querySelectorAll("a[onclick*='location.href']").length<=0)){
        console.log("NP");
        return -1;
    }
    else{
        console.log("P");
        return 1;
    } 
}

function isIframePresent(){
    if(document.querySelectorAll('iframe').length<=0){
        console.log("NP");
        return -1;
    }
    else{
        console.log("P");
        return 1;
    }
}

function getIdenticalDomainCount(tag){    
    var i;
	var identicalCount=0;
	var reg = /[a-zA-Z]\//;    
    var url = window.location.href;
    var mainDomain = url.substring(0,url.search(reg)+1);    
    var nodeList = document.querySelectorAll(tag);
    if(tag=="img" || tag=="script"){
        nodeList.forEach(function(element,index) {        
        i = nodeList[index].src
        if(mainDomain==(i.substring(0,i.search(reg)+1))){
           identicalCount++;
        }   
      });
    }  
    else if(tag=="form"){
        nodeList.forEach(function(element,index) {        
        i = nodeList[index].action
        if(mainDomain==(i.substring(0,i.search(reg)+1))){
           identicalCount++;
        }   
      });
    }  
    else if(tag=="a"){
        nodeList.forEach(function(element,index) {        
        i = nodeList[index].href
        if((mainDomain==(i.substring(0,i.search(reg)+1))) && ((i.substring(0,i.search(reg)+1))!=null) && ((i.substring(0,i.search(reg)+1))!="")){
           identicalCount++;
        }    
      });
    } 
    else{
        nodeList.forEach(function(element,index) {        
        i = nodeList[index].href
        if(mainDomain==(i.substring(0,i.search(reg)+1))){
           identicalCount++;
        }    
      });
    }  
    return identicalCount;
} 

testdata = [isIPInURL(),isLongURL(),isTinyURL(),isAlphaNumericURL(),isRedirectingURL(),isHypenURL(),isMultiDomainURL(),isFaviconDomainUnidentical(),isIllegalHttpsURL(),isImgFromDifferentDomain(),isAnchorFromDifferentDomain(),isScLnkFromDifferentDomain(),isFormActionInvalid(),isMailToAvailable(),isStatusBarTampered(),isIframePresent()];

prediction = predict(testdata);
console.log(prediction)
if (prediction == -1){
    // Create a div element for information message
    var infoDiv = document.createElement('div');
    infoDiv.innerHTML = "safe site!!!!!";
    infoDiv.style.backgroundColor = "green";
    infoDiv.style.borderRadius = "8px";
    infoDiv.style.color = "white";
    infoDiv.style.padding = "10px";
    infoDiv.style.position = "fixed";
    infoDiv.style.top = "0%";
    infoDiv.style.left = "0%";
    infoDiv.style.zIndex = "9999";
    
    // Append the div to the body
    document.body.appendChild(infoDiv);
    
    // Remove the div after a certain time (e.g., 5 seconds)
    setTimeout(function() {
        infoDiv.remove();
    }, 5000); // 5000 milliseconds = 5 seconds
}
else if (prediction == 1) {
    // Create HTML structure as a string
    var infoHTML = `
    <div class="infoDiv" style="background-color: rgba(0,0,0,0.75); color: white; padding: 10px;position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);  z-index: 9999; height: 100vh; width: 100%;">
    <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 1rem; background-color: white; border-radius: 1rem; height: 26rem; width: 34rem; box-shadow: 0px 0px 6px 0px rgba(0,0,0,0.5);">
        <img  src="https://cdn.dribbble.com/users/1952691/screenshots/11527466/media/9b7cd53cafd5a6f9d48da5cc9ad02454.jpg" alt="Phishing Image" width="200" style="margin-bottom: 10px; border-radius: 1rem; width: 32rem; height: 20rem;">
        <div class="bottom-container" style="display: flex; align-items: center; justify-content: space-between;">
                <div>
                    <span style="color: black; font-size: 1.5rem; font-family: Sans-serif;">Phishing Detected!</span>
                </div>
                <div>
                    <button class="button-19"  onclick="this.parentElement.parentElement.parentElement.parentElement.remove()">Proceed Unsafe</button>
                </div>
        </div>
    </div>
</div>
<style>

    .button-19 {
        appearance: button;
        background-color: #cf0000;
        border: solid transparent;
        border-radius: 16px;
        border-width: 0 0 4px;
        box-sizing: border-box;
        color: #FFFFFF;
        cursor: pointer;
        display: inline-block;
        font-family: din-round,sans-serif;
        font-size: 15px;
        font-weight: 700;
        letter-spacing: .8px;
        line-height: 20px;
        margin: 0;
        outline: none;
        overflow: visible;
        padding: 13px 16px;
        text-align: center;
        text-transform: uppercase;
        touch-action: manipulation;
        transform: translateZ(0);
        transition: filter .2s;
        user-select: none;
        -webkit-user-select: none;
        vertical-align: middle;
        white-space: nowrap;
        width: 100%;
    }
    
    .button-19:after {
        background-clip: padding-box;
        background-color: #f64141;
        border: solid transparent;
        border-radius: 16px;
        border-width: 0 0 4px;
        bottom: -4px;
        content: "";
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        z-index: -1;
    }
    
    .button-19:main,
    .button-19:focus {
        user-select: auto;
    }
    
    .button-19:hover:not(:disabled) {
        filter: brightness(1.1);
        -webkit-filter: brightness(1.1);
    }
    
    .button-19:disabled {
        cursor: auto;
    }
    
    .button-19:active {
        border-width: 4px 0 0;
        background: none;
    }
</style>
    `;

    // Append the HTML string to the body
    document.body.insertAdjacentHTML('beforeend', infoHTML);

}


chrome.extension.sendRequest(prediction);



