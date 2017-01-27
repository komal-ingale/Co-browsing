//Global variables
var i=0,
    recData,
    mousePtrDiv,  
    timerLoop,timerGet, //setTimeout Handles
    jsonData,
    x=0,y=0,recId,senderId,
    flag=3;//Indicates Logging Level 0:ERROR, 1:WARN, 2:INFO, 3:DEBUG

var jsonObj={
		    };
 
 
var  idGenUrl="http://10.71.71.86:8080/CoBrowsing/IDGenServlet",
     hashMapUrl="http://10.71.71.86:8080/CoBrowsing/HashMapServlet",
     resolutionUrl="http://10.71.71.86:8080/CoBrowsing/ResolutionServlet",
     mousePtrImg="http://10.71.71.86:8080/CoBrowsing/mouse_pointer.png",
     exitImg="http://10.71.71.86:8080/CoBrowsing/exit_delete.png";
     
 
 //DIV 
 var mainDiv = document.createElement("div");
 mainDiv.id="mainId";
 mainDiv.style.position='fixed';
 mainDiv.style.width=400+'px';
 mainDiv.style.left=250+'px';
 mainDiv.style.top=0+'px';
 mainDiv.style.background='#6699FF';
 mainDiv.align='center';
 var cont="<span class='prego'><img src='"+exitImg+"'; style='float:right; width: 20px; top:0px;' onclick=caller(0,'mainId');></img><font face='arial' color='white'>Click here to starts Co-Browsing</font><br></font></span>";
 mainDiv.innerHTML=cont;
 mainDiv.addEventListener('click',function(){change();},false);
 document.body.appendChild(mainDiv);
 var isIE=document.all?true:false;

// console.log(document.getElementsByTagName("textArea"));
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

//CREATION OF MOUSE POINTER
function  makePointer(){
	try{
	 mousePtrDiv = document.createElement("div");
	 mousePtrDiv.setAttribute("id","movingDiv");
	 mousePtrDiv.style.position='absolute';
	 mousePtrDiv.style.width=20+'px';
	 mousePtrDiv.style.left=100+'px';
	 mousePtrDiv.style.top=0+'px';
	 mousePtrDiv.style.cssFloat="left";
	 var img = document.createElement("img");
	 img.src=mousePtrImg;
	 img.style.zIndex="10";
	 img.style.width=23+'px';
	 mousePtrDiv.appendChild(img);
	 document.body.appendChild(mousePtrDiv);
	}
	catch(err){
		//if (e instanceof EvalError)
		alert(err.name+","+err.message);
	}
};

//FUNCTION TI SLIDE
function slide(t, id){
     var mainId;
    mainId= document.getElementById("mainId");
	mainId.style.top = t + 'px'; 
	t= t-10;
	if(t!= -100)
	caller(t,id);
};

function caller(t,id){
setTimeout(function () {
    slide(t,id);}, 10);
};

function change(){
	mainDiv.innerHTML="";
	var content = "<span class='prego'><img src='"+exitImg+"'; style='float:right; width: 20px; top:0px;' onclick=caller(0,'mainId');></img><font face='arial' color='white'>Welcome to Co-Browsing</font><br></font><input type='button' value='Sender' onclick='getId()';></input><input type='button' value='Receiver' onclick='postId()';></input></span>";
	mainDiv.innerHTML=content;
};

//FUNCTION FOR RECEIVER BUTTON
function postId()
{
	
	try{
    var String;
	var xmlhttp = new XMLHttpRequest();
	mainDiv.style.top= -200 +'px';
	var recDiv=document.createElement("div");
	recDiv.id="d4";
	recDiv.style.position='fixed';
	recDiv.style.width=400+'px';
	recDiv.style.left=250+'px';
	recDiv.style.top=0+'px';
	recDiv.style.background='#6699FF';
	recDiv.align="center";
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
	btn.appendChild(txtDone);
	recDiv.appendChild(btn);
	document.body.appendChild(recDiv);
	
	btn.onclick = function() {
		recId=document.getElementById("client_id").value;
		//AJAX Call to POST ID
		xmlhttp.onreadystatechange = function() {		
	       if (xmlhttp.readyState == 4){ 
	           if( xmlhttp.status==200) {
	           	 var response = xmlhttp.responseText;
	           	    //console.log(n);
	           	    if(response){
	           	    	String="Receiver's session started";
	           	    	loggerInfo(String);
	           	    	makePointer();	
	           	    	getResolution();
	           	    	recDiv.style.top=-100+'px';          	     
	           	        timerGet=setTimeout(getJsonArray,0);
	           	     }
	           	    else{
	           	    	String="Invalid Id, enter Id generated on Sender's side";
	           	    	loggerWarn(String);
	           	    	//alert("Invalid ID");
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
    mainDiv.style.top= -200 +'px';
	var senDiv=document.createElement("div");
	senDiv.id="d5";
	senDiv.style.position='fixed';
	senDiv.style.width=400+'px';
	senDiv.style.left=250+'px';
	senDiv.style.top=0+'px';
	senDiv.style.background='#6699FF';
	senDiv.align="center";
	var img = document.createElement("img");
	img.src=exitImg;
	img.style.cssFloat="right";
	img.style.width=20+'px';
	img.style.left=0+'px';
	img.addEventListener('click',function(){caller(0,'d5');},false);
	senDiv.appendChild(img);
	var txt= document.createTextNode("Your ID is "+ senderId);
	txt.font= "Consolas";
	txt.font.color= "white";
    senDiv.appendChild(txt);
    var br=document.createElement("br");
	senDiv.appendChild(br);
	var btn=document.createElement("button");
	var textOk=document.createTextNode("OK");
	btn.id='ok_id';
	btn.appendChild(textOk);
	senDiv.appendChild(btn);
	
	document.body.appendChild(senDiv);
	  btn.onclick=function(){
		  senDiv.style.top=-100+'px';
	  };
	 document.onclick=init;
};


function sendResolution()
{
	var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST",resolutionUrl,true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");    
 	xmlhttp.send("id="+senderId+"&width="+screen.width+"&height="+screen.height);
 	var string="Resolution= "+screen.width+"(width)X"+screen.height+"(height)";
 	loggerInfo(string);
};



function getMousePosition(e) 
{ 
return e.pageX ? {'x':e.pageX, 'y':e.pageY} : {'x':e.clientX + document.documentElement.scrollLeft + document.body.scrollLeft, 'y':e.clientY + document.documentElement.scrollTop + document.body.scrollTop}; 
} ;

function createJson(e) 
{ 
	if (!e) e = event; 
	var mp = getMousePosition(e),xPath; 
	x=mp.x; 
	y=mp.y; 
	
       
	 if(!isIE)
	{
		 xPath = getElementXPath(e.target);
		 if(e.type=="click" || e.type=="keypress" || e.type=="dblclick"){
			 var string=e.type+" event occure";
			 loggerDebug(string);
		}
		 jsonCall(xPath,e.type,x,y,e.target.value);
	}            
	else
	{
		 xPath = getElementXPath(event.srcElement);
		 jsonCall(path,window.event.type,x,y,window.event.target.value);
		
	}	 
}; 

//Initialize Function for all Event types
function init(e) 
{ 
	if(isIE)
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
	else
	{	
		
		if(e.type=="click")
			document.onclick = createJson;
		if(e.type="mousemove")
			document.onmousemove=createJson; 
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
};

//Creating and POSTing JSON Object
function jsonCall(xPath,eventType,x,y,textValue)
{
	var xmlhttp = new XMLHttpRequest();
	   var timeStamp=getTimeStamp();
	   jsonObj={   
			   "event":eventType,
			   "x":x,
			   "y":y,
			   "timeStamp":timeStamp,
			   "xPath":xPath,
		       "pageX":pageXOffset,
		       "pageY":pageYOffset,
		       "textValue":textValue};
	   //console.log(xPath);
	   jsonData=JSON.stringify(jsonObj);
	   xmlhttp.open("POST",hashMapUrl,true);
	   xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	   xmlhttp.send("jsonData="+jsonData+"&id="+senderId);
};

//Get TimeStamp 
function getTimeStamp() {
    var str = "";
    var currentTime = new Date();
    var hours = currentTime.getUTCHours();
    var minutes = currentTime.getUTCMinutes();
    var seconds = currentTime.getUTCSeconds();
    var milliseconds=currentTime.getUTCMilliseconds();
    if (minutes < 10) {minutes = "0" + minutes;}
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
	
//GET Resolution on Receiver's side
function getResolution()
{
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {		
	       if (xmlhttp.readyState == 4){ 
	           if( xmlhttp.status==200) {
	           	 var response = xmlhttp.responseText;
	           	var resolution=response.split(",");
	           	string="Resolution Factor= "+resolution[0]+","+resolution[1];
	         	loggerDebug(string);
	           }
	       }
		};
    var url=resolutionUrl+"?id="+recId+"&width="+screen.width+"&height="+screen.height;
    xmlhttp.open("GET",url,true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send(null);
    var string="Resolution= "+screen.width+"(width)X"+screen.height+"(height)";
 	loggerInfo(string);
 	
};

function getJsonArray(){
	try{
	var xmlhttp = new XMLHttpRequest(),diff;
	xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4){ 
          if( xmlhttp.status==200){
          var response= xmlhttp.responseText;
          recData = JSON.parse(response);
            loggerDebug(recData);
          if(recData.jsonArray.length){	  
            replicateEvent(0);
            var len=recData.jsonArray.length;
            i=0;
             
              //Replication of Delay between two consecutive events
              function loopFunction () {
        	    if (i < len-1) {
        	        i++;
        	        diff=timeDiff(recData.jsonArray[i].timeStamp,recData.jsonArray[i-1].timeStamp);
        	        replicateEvent(i);
        	       timerLoop = setTimeout(loopFunction,diff);
        	      }
        	    }
        	timerLoop = setTimeout(loopFunction,0);
          } 
     }
      
	}
	
	};
	  //GET array of JSON Objects
        xmlhttp.open("GET",hashMapUrl+"?id="+recId,true);
	    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xmlhttp.send(null);
	
	timerGet=setTimeout(getJsonArray,0);	 
	}
	catch(err){
		console.error(err.name+","+err.message);
	}
};   

//Replicate each event on Receiver's side
function replicateEvent(i)
{	
	try{
	var x=recData.jsonArray[i].x;
    var y=recData.jsonArray[i].y;

    var xPath=recData.jsonArray[i].xPath;//X-path

    var result=document.evaluate(xPath,document,null,9,null).singleNodeValue;
    if(!result){
    	var String="Xpath not found";
    	loggerWarn(String);
    }
    var pageX=recData.jsonArray[i].pageX;
    var pageY=recData.jsonArray[i].pageY;
    var textValue=recData.jsonArray[i].textValue;
    var event=recData.jsonArray[i].event;
    mousePtrDiv.style.left=x + 'px';
    mousePtrDiv.style.top= y + 'px';
    
    window.scrollTo(pageX, pageY);
  
    if(event=="keyup" || event=="keydown" || event=="keypress")
   	     result.value=textValue;
         
   if(event=="click")
      	 result.click();
    if(event=="mouseover")
     {
    	var fun=result.getAttribute('onmouseover');
    	result.onmouseout=eval(fun);
	 }
	}
	catch(err){
		console.error(err.name+","+err.message);
	}
};

//Calculating Time Difference
function timeDiff(time1,time2)
{
	
	var milli1=time1.split(":");
	var milli2=time2.split(":");
	return(Math.abs(milli1[3]-milli2[3]));
};
