//Global variables
var i=0,
    temp,
    recData,
    mainDiv=null,optionDiv=null,senDiv=null,recDiv=null,
    mousePtrDiv,  
    timerLoop,timerGet, //setTimeout Handles
    jsonData,
    x=0,y=0,recId,senderId,resolution,
    flag=3,//Indicates Logging Level 0:ERROR, 1:WARN, 2:INFO, 3:DEBUG
    endFlag=0,stop=1;
var isIE=document.all?true:false;
var jsonObj={
		    };
 

var  idGenUrl="http://10.71.71.86:8080/CoBrowsing/IDGenServlet",
     cobrowseUrl="http://10.71.71.86:8080/CoBrowsing/CobrowseServlet",
     resolutionUrl="http://10.71.71.86:8080/CoBrowsing/ResolutionServlet",
     mousePtrImg="http://10.71.71.86:8080/CoBrowsing/mouse_pointer.png",
     exitImg="http://10.71.71.86:8080/CoBrowsing/exit_delet.png";
     ribbonImg="http://10.71.71.86:8080/CoBrowsing/ribbon.png";
     backGrndImg="http://10.71.71.86:8080/CoBrowsing/blue.png";
     
//Creation of CSS Style
function createStyle(){
     var style = document.createElement('style');
     style.type = 'text/css';
     style.innerHTML ='.cssClass {color: white; width:250px; height:45px;top:100px; position:fixed; z-index: 2147483647;background-color:#1A1A1A;font-family:Arial,Helvetica,sans-serif; font-size:16px; border-style:solid; border-color:red; } .cssClass a{color:#BABABA; cursor:pointer;} .cssClass a:hover{color:white;}';
     document.getElementsByTagName('head')[0].appendChild(style);   
}


 //Main DIV 
 function createMainDiv(){  
	 createStyle(); 
 if(mainDiv==null){ 
	 mainDiv = document.createElement("div");
	 mainDiv.id="mainId";
	 mainDiv.style.position='fixed';
	 mainDiv.style.width=20+'px';
	 mainDiv.style.left= 250+'px';
	 mainDiv.style.top = 0+'px';
	 mainDiv.align='center';
 
	 var rbnImg=document.createElement("img");
	 rbnImg.src=ribbonImg;
	 rbnImg.style.width=23+'px'; 
	 mainDiv.appendChild(rbnImg);
	 document.body.appendChild(mainDiv);
 }
 mainDiv.style.visibility='visible';
 mainDiv.addEventListener('dblclick',function(){checkCookie();},false);
 mainDiv.addEventListener('click',function(){showId();},false);
 }
 

 function showId(){
	 if(senDiv){
		 senDiv.style.left=mainDiv.style.left;
		 senDiv.style.top=mainDiv.style.top;
		 senDiv.style.visibility='visible';
		 mainDiv.style.visibility='hidden';
	 }
	 if(recDiv){
		 recDiv.style.left=mainDiv.style.left;
		 recDiv.style.top=mainDiv.style.top;
		 recDiv.style.visibility='visible';
	     mainDiv.style.visibility='hidden';
	    
	 }
		 
 }
 function change(){
	   mainDiv.style.visibility='hidden'; 
	    if(optionDiv!=null){
	    	optionDiv.style.visibility='visible';
	    	optionDiv.style.top=mainDiv.style.top;
			optionDiv.style.left=mainDiv.style.left;
//			 draggable('optionId'); 
	    }	
	    else{
		optionDiv=document.createElement("div");
		optionDiv.id="optionId";
		optionDiv.className='cssClass';
		optionDiv.style.top=mainDiv.style.top;
		optionDiv.style.left=mainDiv.style.left;
	    optionDiv.align='center';   
		
	    var img=document.createElement("img");
		 img.src=exitImg;
		 img.style.width=20+'px';
		 img.align='right';
		 img.style. cursor='pointer';
		 optionDiv.appendChild(img);
		 img.addEventListener('click',function(){close('optionId');},false);
		 
		 var aSen=document.createElement("a");
		 aSen.innerHTML="Click here to start new session";
		 optionDiv.appendChild(aSen);
		 aSen.addEventListener('click',function(){getId();},false);
		 
		 var br=document.createElement("br");
		 optionDiv.appendChild(br);
		 
		 var aRec=document.createElement("a");
		 aRec.innerHTML="Click here to join a session";
		 optionDiv.appendChild(aRec);
		 aRec.addEventListener('click',function(){postId();},false);
		 
		document.body.appendChild(optionDiv);
//	    draggable('optionId'); 
		console.log(optionDiv);
	    }
	   
	};
 
function close(id){
		
		document.getElementById(id).style.visibility='hidden';
		mainDiv.style.left=document.getElementById(id).style.left;
		mainDiv.style.top=document.getElementById(id).style.top;
		mainDiv.style.visibility='visible';
};

  //COOKIE
function getCookie(cName){
	var cValue = document.cookie;
	var cStart = cValue.indexOf(" " + cName + "=");
	if (cStart == -1)
	  cStart = cValue.indexOf(cName + "=");

	if (cStart == -1)
	  cValue = null;
	else{
	  cStart = cValue.indexOf("=", cStart) + 1;
	  var cEnd = cValue.indexOf(";", cStart);
	  if (cEnd == -1)
	    cEnd = cValue.length;
	  cValue = unescape(cValue.substring(cStart,cEnd));
	}
	return cValue;
}

function setCookie(cName,cValue){
	 var now = new Date();
		var time = now.getTime();
		time += 3600 * 5000;
		now.setTime(time);	
	document.cookie=cName + "=" + cValue+"; expires="+now.toGMTString();
}

function checkCookie(){
	senderId=getCookie("senCookie");
	recId=getCookie("recCookie");
	if (senderId!=null && senderId!=""){
//	  alert("Welcome again " + senderId);	
	  uiSender();
	}
	else if(recId!=null && recId!=""){	
	  uiReceiver();	
	}
	else
	  change();
}	
	
function deletCookie(cName){
	  var cDate = new Date ( );  // current date & time
	  cDate.setTime (cDate.getTime() - 1);
	  document.cookie = cName+"=;expires=" + cDate.toGMTString();
	  console.log(document.cookie);
};

//Log ERROR
function loggerError(string){
	if(flag>=0)
		console.error(string);
}

//Log WARN
function loggerWarn(string){
	if(flag>=1)
		console.warn(string);
} 
 
//Log INFO
function loggerInfo(string){
	if(flag>=2)
		console.info(string);
}
 
//Log DEBUG
function loggerDebug(string){
	if(flag>=3)
		console.debug(string);
}

//window.onload = function(){
//        createMainDiv();
//	    draggable('mainId');
////	    checkCookie();
//};

//Draggable DIV
var dragObj = null;
function draggable(id){
	    var obj = document.getElementById(id);
	    obj.style.position = "fixed";
	    obj.onmousedown = function(){
	            dragObj = obj;
	    };
}
	 
document.onmouseup = function(e){
	    dragObj = null;
};

document.onmousemove = function(e){
	    var x = e.pageX;
	    var y = e.pageY;

	    if(dragObj == null)
	        return;

	    dragObj.style.left = x + "px";
	    dragObj.style.top= y + "px";
};

//CREATION OF MOUSE POINTER
function  makePointer(){
	try{
	 mousePtrDiv = document.createElement("div");
	 mousePtrDiv.setAttribute("id","movingDiv");
	 mousePtrDiv.style.position='absolute';
	 mousePtrDiv.style.width=20+'px';
	 mousePtrDiv.style.cssFloat="left";
	 var img = document.createElement("img");
	 img.src=mousePtrImg;
	 img.style.zIndex="2147483647";
	 img.style.width=23+'px';
	 mousePtrDiv.appendChild(img);
	 document.body.appendChild(mousePtrDiv);
	}
	catch(err){
		console.error(err.name+","+err.message);
	}
};

//FUNCTION FOR RECEIVER BUTTON
function postId()
{	
try{
    optionDiv.style.visibility='hidden';
    var String;
	var xmlhttp = new XMLHttpRequest();
	recDiv=document.createElement("div");
	recDiv.id="recId";
	recDiv.className='cssClass';
	recDiv.style.left=optionDiv.style.left;
	recDiv.style.top=optionDiv.style.top;
	recDiv.align="center";
	
	var img = document.createElement("img");
	img.src=exitImg;
	img.style.cssFloat="right";
	img.style.width=20+'px';
	img.style.cursor='pointer';
	recDiv.appendChild(img);
	
	
	var txt= document.createTextNode("Enter ID");
    recDiv.appendChild(txt);
    var br=document.createElement("br");
	recDiv.appendChild(br);
	
	var input=document.createElement("input");
	input.type='text';
	input.value=null;
	input.id='client_id';
	recDiv.appendChild(input);
	
	//DONE BUTTON
	var btn=document.createElement("button");
	var txtDone=document.createTextNode("DONE");
	btn.id='done_id';
	btn.style.cursor='pointer';
	btn.appendChild(txtDone);
	recDiv.appendChild(btn);
	document.body.appendChild(recDiv);
	document.getElementById('client_id').focus();
	img.addEventListener('click',function(){optionDiv.style.visibility='visible';document.body.removeChild(recDiv); },false);
	
	btn.onclick = function() {
		recId=document.getElementById("client_id").value;
		//AJAX Call to POST ID
		xmlhttp.onreadystatechange = function() {		
	       if (xmlhttp.readyState == 4){ 
	           if( xmlhttp.status==200) {
	           	 var response = xmlhttp.responseText;
	           	    if(response){
	           	    	String="Receiver's session started";
	           	    	loggerInfo(String);
	           	    	getResolution();

	           	    	document.body.removeChild(recDiv);
	           	        setCookie("recCookie",recId);   
	           	        uiReceiver();
	           	     }
	           	    else{
	           	    	  String="Invalid Id, enter Id generated on Sender's side";
	           	    	  loggerWarn(String);
	           	    	  alert("Invalid ID");
	           	    }
	           }
	       }
		};
	   xmlhttp.open("POST",idGenUrl,true);
	   xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	   xmlhttp.send("id="+recId);
};
	}
	 catch(err){
		console.error(err.name+","+err.message);
	}
};

function uiReceiver(){
	    endFlag=0;
	    user="receiver";
	    mainDiv.style.visibility='hidden';
		recDiv=document.createElement("div");
		recDiv.id="recId";
		recDiv.className='cssClass';
		if(optionDiv!=null){
			recDiv.style.left=optionDiv.style.left;
			recDiv.style.top=optionDiv.style.top;
		}
		else{
			recDiv.style.left=mainDiv.style.left;
			recDiv.style.top=mainDiv.style.top;
		}
		recDiv.align="center";
		
		var img = document.createElement("img");
		img.src=exitImg;
		img.style.cssFloat="right";
		img.style.width=20+'px';
		img.style.cursor='pointer';
		recDiv.appendChild(img);
	    recDiv.style.height=50+'px';
        txt= document.createTextNode("Your ID is "+ recId);
        txt.font= "Consolas";
        txt.font.color= "white";
        recDiv.appendChild(txt);
    	document.body.appendChild(recDiv);
//    	draggable('recId');
    	img.addEventListener('click',function(){close('recId');},false);
    	    
	    var p=document.createElement("p");
	    recDiv.appendChild(p);
	    p.style.fontSize=13+'px';
	    var txtEnd=document.createTextNode("Do you want to end Session?");
	     txtEnd.className='cssEnd';
	     p.appendChild(txtEnd);
	     
	     var aYes=document.createElement("a");
	     aYes.id="endSessionId";
	     aYes.innerHTML="Yes";
	     p.appendChild(aYes);
	     aYes.addEventListener('click', function(){endRecSession();},false);
	     console.log(recDiv); 
	     makePointer();	
	     document.onmousemove=init; 
	     timerGet=setTimeout(getJsonArray,0);
	     
}

function endRecSession(){
	endFlag=-1; 
	console.log("end...");
	document.body.removeChild(document.getElementById('movingDiv'));
	
	if(optionDiv!=null){
		  optionDiv.style.visibility='visible'; 
		  optionDiv.style.left=recDiv.style.left;
		  optionDiv.style.top=recDiv.style.top; 
	}
		else{
		  mainDiv.style.visibility='visible';	
		  mainDiv.style.left=recDiv.style.left;
		  mainDiv.style.top=recDiv.style.top; 
	}
	document.body.removeChild(recDiv); 
	recDiv=null;
	deletCookie("recCookie");
}

//AJAX call to get random generated ID from server
function getId(){	
	var String;
	var xmlhttp1 = new XMLHttpRequest();
	xmlhttp1.onreadystatechange = function() {		
        if (xmlhttp1.readyState == 4){ 
            if( xmlhttp1.status==200) {
            	 senderId = xmlhttp1.responseText;
            	 if(senderId){
            	    uiSender();
            	    String="Sender's session started ID="+senderId; 
            		loggerInfo(String); 
            	    sendResolution();
            	    endFlag=0;
            	    //setCookie
                    setCookie("senCookie",senderId);   
            	 }
            	 else{
            		 String="No Id found";
            		 loggerWarn(String);
            	 }     
            }
        }
	};

    xmlhttp1.open("GET", idGenUrl,true);
    xmlhttp1.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp1.send(null);
    
};

//UI FOR SENDER
function uiSender(){
	user="sender";
    if(optionDiv!=null)
	  optionDiv.style.visibility='hidden';
    mainDiv.style.visibility='hidden';
    senDiv=document.createElement("div");
	senDiv.id="senDivId";
	senDiv.className='cssClass';
	if(optionDiv!=null){
		senDiv.style.left=optionDiv.style.left;
		senDiv.style.top=optionDiv.style.top;
	}
	else{
		senDiv.style.left=mainDiv.style.left;
		senDiv.style.top=mainDiv.style.top;
    }
 	senDiv.style.height=50+'px';
	senDiv.align="center";
	 
	var img = document.createElement("img");
	img.src=exitImg;
	img.style.cssFloat="right";
	img.style.width=20+'px';
	img.style.cursor='pointer';
	senDiv.appendChild(img);
	img.addEventListener('click',function(){close('senDivId');},false);
    
    var txt= document.createTextNode("Your ID is "+ senderId);
	txt.font= "Consolas";
	txt.font.color= "white";
    senDiv.appendChild(txt);
     
    var p=document.createElement("p");
    senDiv.appendChild(p);
    p.style.fontSize=13+'px';
    var txtEnd=document.createTextNode("Do you want to end Session?");
    txtEnd.className='cssEnd';
    p.appendChild(txtEnd);
    console.log(txtEnd);
    
    var aYes=document.createElement("a");
    aYes.id="endSessionId";
    aYes.innerHTML="Yes";
    p.appendChild(aYes);
	document.body.appendChild(senDiv);
	
//	draggable('senDivId');
	 makePointer();	
   	 document.onmousemove=init; 
	
	timerGet=setTimeout(getJsonArray,0);
};

function endSession(){
	endFlag=-1;
	console.log("end...");
	document.body.removeChild(document.getElementById('movingDiv'));
	//Request to remove Id
	var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET",idGenUrl+"?id="+senderId,true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");    
 	xmlhttp.send();	
 	
 	if(optionDiv!=null){
 	 	  optionDiv.style.visibility='visible';
 	 	  optionDiv.style.left=senDiv.style.left;
 	 	  optionDiv.style.top=senDiv.style.top;
 	 }
 	else{
 		  mainDiv.style.visibility='visible';
	 	  mainDiv.style.left=senDiv.style.left;
	 	  mainDiv.style.top=senDiv.style.top;
 	}
 	document.body.removeChild(senDiv);
 	senDiv=null;
 	console.log("senDiv="+senDiv);
 	deletCookie("senCookie");
}

function sendResolution()
{
	var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST",resolutionUrl,true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");    
// 	xmlhttp.send("id="+senderId+"&width="+screen.width+"&height="+screen.height);
    xmlhttp.send("id="+senderId+"&width="+document.body.clientWidth+"&height="+document.body.clientHeight);
 	var string="Resolution= "+screen.width+"(width)X"+screen.height+"(height)";
 	loggerInfo(string);
};



function getMousePosition(e){ 
return e.pageX ? {'x':e.pageX, 'y':e.pageY} : {'x':e.clientX + document.documentElement.scrollLeft + document.body.scrollLeft, 'y':e.clientY + document.documentElement.scrollTop + document.body.scrollTop}; 
} ;

function createJson(e) 
{ 
	if (!e) e = event; 
	var mp = getMousePosition(e),xPath; 
	x=mp.x; 
	y=mp.y; 
	if(endFlag==0){
	if(isIE)  //for IE
	 {
		 xPath = getElementXPath(event.srcElement);
		 jsonCall(path,window.event.type,x,y,window.event.target.value);
	 } 
	else{ 
		 xPath = getElementXPath(e.target);
		 if(e.type=="click" || e.type=="keypress" || e.type=="dblclick"){
			 var string=e.type+" event occure";
			 loggerDebug(string);
		}
		 if(e.clientX || e.type=="keyup"){		  
		   jsonCall(xPath,e.type,x,y,e.target.value);
		 }
		 if( e.type=='mousemove'){
			 if(dragObj == null)
		        return;
			  dragObj.style.left = x + "px";
		      dragObj.style.top = y + "px";
		} 
	 }	
	}
	
	else if(endFlag==-1 &&  e.type=='mousemove'){
		if(dragObj == null)
	        return;
//	        console.log(x,y);  
		    dragObj.style.left = x + "px";
		    dragObj.style.top = y + "px";
	}
}; 

//Initialize Function for all Event types
function init(e) 
{ 
	if(isIE) // for IE
	{
		if(window.event.type=="click")
			document.onclick= createJson;
		if(window.event.type=="mousemove") 
			document.onmousemove=createJson;
		if(window.event.type=="mouseover")
			document.onmouseover=createJson;	
		if(window.event.type=="keyup")
			document.onmouseover=createJson;	
		if(window.event.type=="keydown")
			document.onmouseover=createJson;	
		if(window.event.type=="keypress")
			document.onmouseover=createJson;	
		if(window.event.type=="dblclick")
			document.onclick= createJson;
	}
	else   //for other browsers
	{		
		if(e.type=="mousemove")
			document.onmousemove=createJson; 
		if(e.type="mouseout")
			document.onmouseout=createJson; 
		if(e.type="click"){
			document.getElementById("endSessionId").onclick=endSession;
			document.onclick = createJson;
		}
		if(e.type="keyup")
			document.onkeyup=createJson;
		if(e.type="keydown")
			document.onkeydown=createJson;
		if(e.type="keypress")
			document.onkeypress=createJson;
		if(e.type="mouseover")
            document.onmouseover=createJson;	
		if(e.type="dblclick")
            document.ondblclick=createJson;			
	} 
}	

//Creating and POSTing JSON Object
function jsonCall(xPath,eventType,x,y,textValue)
{
	   var xmlhttp = new XMLHttpRequest();
	   var timeStamp=getTimeStamp();
//	   console.log(x,y,document.body.clientWidth,document.body.clientHeight);
	   jsonObj={   
			   "event":eventType,
			   "x":x,
			   "y":y,
			   "timeStamp":timeStamp,
			   "xPath":xPath,
		       "pageX":pageXOffset,
		       "pageY":pageYOffset,
		       "textValue":textValue};
	   jsonData=JSON.stringify(jsonObj);
	   xmlhttp.open("POST",cobrowseUrl,true);
	   xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	   if(senderId)
	     xmlhttp.send("jsonData="+jsonData+"&id="+senderId+"&user="+user); 
	   else
		 xmlhttp.send("jsonData="+jsonData+"&id="+recId+"&user="+user);   
};

//Get TimeStamp 
function getTimeStamp() {
    var str = "";
    var currentTime = new Date();
    var hours = currentTime.getUTCHours();
    var minutes = currentTime.getUTCMinutes();
    var seconds = currentTime.getUTCSeconds();
    var milliseconds=currentTime.getUTCMilliseconds();
    if (minutes < 10) { minutes = "0" + minutes;}
    if (seconds < 10) { seconds = "0" + seconds; }
    if(milliseconds<10){ milliseconds="0" + milliseconds; } 
    str += hours + ":" + minutes + ":" + seconds + ":"+milliseconds + " ";
    return str;
};

//Calculating X-Path
function getElementXPath(elt)
{
     var path = "";
     for (; elt && elt.nodeType == 1; elt = elt.parentNode)
     {
	   	idx = getElementIdx(elt);
		xname = elt.tagName;
		if (idx > 1) 
			xname += "[" + idx + "]";
		path = "/" + xname + path;
     }
     return path;	
}

function getElementIdx(elt)
{
    var count = 1;
    for (var sib = elt.previousSibling; sib ; sib = sib.previousSibling)
    {
        if(sib.nodeType == 1 && sib.tagName == elt.tagName)	count++;
    }
       return count;
}

//Get Resolution Factor
function getResolutionFact(){
	var url;
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {		
	       if (xmlhttp.readyState == 4){ 
	           if( xmlhttp.status==200) {
	           	 var response = xmlhttp.responseText;
	           	if(response!=null) {
	           		resolution=response.split(",");
	           		if(senderId!=null){
	           			resolution[0]=resolution[0]*-1;
	           			resolution[1]=resolution[1]*-1;
	           		}
	           		string="Resolution Factor= "+resolution[0]+","+resolution[1];
//	           		alert(string);
	           		loggerDebug(string);
	           	 }
	           }
	       }
		};
//    var url=resolutionUrl+"?id="+recId+"&width="+screen.width+"&height="+screen.height;
	if(senderId!=null)	
	  url=resolutionUrl+"?id="+senderId;	
	else
		url=resolutionUrl+"?id="+recId;		
    xmlhttp.open("GET",url,true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send(null);	
}
	
//GET Resolution on Receiver's side
function getResolution()
{
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {		
	       if (xmlhttp.readyState == 4){ 
	           if( xmlhttp.status==200) {
	           	var response = xmlhttp.responseText;
	           	resolution=response.split(",");
	           	string="Resolution Factor= "+resolution[0]+","+resolution[1];
//	           	alert(string);
	         	loggerDebug(string);
	           }
	       }
		};
//    var url=resolutionUrl+"?id="+recId+"&width="+screen.width+"&height="+screen.height;
	var url=resolutionUrl+"?id="+recId+"&width="+document.body.clientWidth+"&height="+document.body.clientHeight;	
    xmlhttp.open("GET",url,true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send(null);
    var string="Resolution= "+screen.width+"(width)X"+screen.height+"(height)";
 	loggerInfo(string);
 	
};

function getJsonArray(){
try{
	if(endFlag==0){	
//		alert("in get");
	var xmlhttp = new XMLHttpRequest(),diff;
	xmlhttp.onreadystatechange = function(){
		console.log("Readystate"+xmlhttp.readyState);
    
		if (xmlhttp.readyState == 4){ 
		console.log("status="+xmlhttp.status);
        
		if( xmlhttp.status==200){
          var response= xmlhttp.responseText;
          recData = JSON.parse(response);
            loggerDebug(recData);
            console.log(recData);
          if(recData.jsonArray.length > 0){	  
        	
            replicateEvent(0);
            var len=recData.jsonArray.length;
      
            i=1;
             
              //Replication of Delay between two consecutive events
              function loopFunction () {
        	    if (i < len) {
        	    	if(recData.jsonArray[i]!=undefined){
        	    		diff=timeDiff(recData.jsonArray[i].timeStamp,recData.jsonArray[i-1].timeStamp);
        	    		replicateEvent(i);
        	    		timerLoop = setTimeout(loopFunction,diff);
        	    	}
        	    	 i++;
        	      }
        	    }
        	timerLoop = setTimeout(loopFunction,0);
          } 
     } 
          
	}
      else
    	  console.log("Invalid rec Id");
	};
	  //GET array of JSON Objects
	 if(recId)
        xmlhttp.open("GET",cobrowseUrl+"?id="+recId+"&user="+user,false);
	 else
		xmlhttp.open("GET",cobrowseUrl+"?id="+senderId+"&user="+user,false);
	 
	 xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	 xmlhttp.send(null);
	 timerGet=setTimeout(getJsonArray,0);	 
	}
}
catch(err){
		console.error(err.name+","+err.message);
}
};   

//Replicate each event on Receiver's side
function replicateEvent(i){	
try{
	var evObj = document.createEvent('MouseEvents');
	var x,y;
	if(resolution!=undefined){
		 x=recData.jsonArray[i].x - resolution[0];
		 y=recData.jsonArray[i].y - resolution[1];
    
//	 x=recData.jsonArray[i].x;
//	 y=recData.jsonArray[i].y;
    var xPath=recData.jsonArray[i].xPath;//X-path

    var result=document.evaluate(xPath,document,null,9,null).singleNodeValue;
    if(result==null){
    	var String="Xpath not found";
    	loggerWarn(String);
    }
    else{
    var pageX=recData.jsonArray[i].pageX;
    var pageY=recData.jsonArray[i].pageY;
    var textValue=recData.jsonArray[i].textValue;
    var event=recData.jsonArray[i].event;
    mousePtrDiv.style.left = x + 'px';
    mousePtrDiv.style.top = y + 'px';
    
    window.scrollTo(pageX, pageY);
  
    if(event=="keyup" || event=="keydown" || event=="keypress")
   	     result.value=textValue;
         
   if(event=="click")
      	 result.click();
    if(event=="mouseover"){
	    evObj.initEvent('mouseover', true, false );
    	result.dispatchEvent(evObj);
	 }
    if(event=="mouseout"){
    	evObj.initEvent('mouseout', true, false );
    	result.dispatchEvent(evObj);
     }
    }
} 
    else
      getResolutionFact();
}
catch(err){
		console.error(err.name+","+err.message);
}
};

//Calculating Time Difference
function timeDiff(timeF,timeS)
{
	var milliF=timeF.split(":");
	var milliS=timeS.split(":");
	return(Math.abs(milliF[3]-milliS[3]));
};

createMainDiv();
draggable('mainId');
//checkCookie();